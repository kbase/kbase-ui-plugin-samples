import React from 'react';
import { AsyncProcess, AsyncProcessStatus } from '../../redux/store/processing';
import {
    SampleId, SampleVersion, Username, EpochTimeMS
} from '../../lib/comm/dynamicServices/SampleServiceClient';
import { AppError } from '@kbase/ui-components';
import Component from './view';
import { LoadingOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import { UPSTREAM_TIMEOUT } from '../../constants';
import { DynamicServiceConfig } from '@kbase/ui-components/lib/redux/integration/store';
import { User, SampleType, Metadata, UserMetadata } from '../Main/types';
import UserProfileClient from '../../lib/comm/coreServices/UserProfileClient';
import Model, { FieldDefinitionsMap } from '../../lib/Model';

export interface MiniSample {
    id: SampleId;
    name: string;
    savedAt: EpochTimeMS;
    savedBy: User;
    version: SampleVersion;
    source: string;
    sourceId: string;
    sourceParentId: string | null;
    type: SampleType;
    metadata: Metadata;
    userMetadata: UserMetadata;
}

export type History = Array<MiniSample>;

export interface DataProps {
    serviceWizardURL: string;
    userProfileURL: string;
    token: string;
    sampleId: SampleId;
    version: SampleVersion;
    baseURL: string;
    sampleServiceConfig: DynamicServiceConfig;
    setTitle: (title: string) => void;
}

interface DataState {
    loadingState: AsyncProcess<{ history: History, fieldDefinitions: FieldDefinitionsMap; }, AppError>;
}

export default class Data extends React.Component<DataProps, DataState> {
    constructor(props: DataProps) {
        super(props);
        this.state = {
            loadingState: {
                status: AsyncProcessStatus.NONE
            }
        };
    }

    async fetchUsers(usernames: Array<Username>) {
        const userProfileClient = new UserProfileClient({
            authorization: this.props.token,
            url: this.props.userProfileURL,
            timeout: UPSTREAM_TIMEOUT,
        });

        const profiles = await userProfileClient.get_user_profile(usernames);

        if (profiles.length !== 1) {
            throw new Error('User could not be found');
        }

        return profiles.map((profile) => {
            const {
                user: {
                    username, realname
                },
                profile: {
                    synced: {
                        gravatarHash
                    },
                    userdata: {
                        gravatarDefault, avatarOption
                    }
                }
            } = profile;
            return {
                username, realname, gravatarHash, gravatarDefault, avatarOption
            };
        });
    }

    async fetchFieldDefinitions(): Promise<FieldDefinitionsMap> {
        const client = new Model({
            token: this.props.token,
            url: this.props.serviceWizardURL,
            timeout: UPSTREAM_TIMEOUT
        });
        return (await client.getMetadataDefinitions({})).field_definitions;

    }

    async fetchSample(fieldDefinitions: FieldDefinitionsMap, sampleId: string, version?: number): Promise<MiniSample> {
        const client = new Model({
            token: this.props.token,
            url: this.props.serviceWizardURL,
            timeout: UPSTREAM_TIMEOUT
        });

        const sampleResult = await client.getSample({
            id: sampleId,
            version
        });

        const actualSample = sampleResult.sample;

        const fieldKeys = Object.keys(actualSample.metadata);

        const fieldMetadata = await client.getMetadataKeyStaticMetadata({
            keys: fieldKeys,
            prefix: 0
        });

        const metadata: Metadata = Object.entries(actualSample.metadata)
            .reduce((metadata, [key, field]) => {
                const fieldMeta = fieldMetadata.static_metadata[key];
                metadata[key] = {
                    label: fieldMeta.display_name,
                    description: fieldMeta.description,
                    value: field.value,
                    units: field.units,
                    isControlled: true,
                    definition: fieldDefinitions[key]
                };
                return metadata;
            }, {} as Metadata);

        const userMetadata: UserMetadata = Object.entries(actualSample.userMetadata)
            .reduce<UserMetadata>((metadata, [key, field]) => {
                if (metadata[key]) {
                    return metadata;
                }
                let value: string;
                if (typeof field.value !== 'string') {
                    value = String(field.value);
                } else {
                    value = field.value;
                }
                metadata[key] = {
                    value
                };
                return metadata;
            }, {} as UserMetadata);


        const users = await this.fetchUsers(Array.from(new Set([
            sampleResult.savedBy,
        ]).values()));
        const usersMap = users.reduce((usersMap, user) => {
            usersMap.set(user.username, user);
            return usersMap;
        }, new Map<Username, User>());

        const sample: MiniSample = {
            id: sampleResult.id,
            name: sampleResult.name,
            // TODO: get from sample...
            source: 'SESAR',
            sourceId: actualSample.id,
            sourceParentId: actualSample.parentId,
            savedAt: sampleResult.savedAt,
            savedBy: usersMap.get(sampleResult.savedBy)!,
            version: sampleResult.version,
            type: actualSample.type,
            metadata,
            userMetadata
        };

        return sample;
    }

    async componentDidMount() {
        try {
            let history: Array<MiniSample> = [];

            const fieldDefinitions = await this.fetchFieldDefinitions();

            // get the most recent sample
            const mostRecentSample = await this.fetchSample(fieldDefinitions, this.props.sampleId);
            history.push(mostRecentSample);

            // get all samples up to but not including the most recent sample.
            const lastVersion = mostRecentSample.version;
            if (lastVersion > 1) {
                const versions = new Array<number | undefined>(lastVersion - 1).fill(undefined);
                const allSamples = await Promise.all(versions.map((_, index) => {
                    return this.fetchSample(fieldDefinitions, this.props.sampleId, index + 1);
                }));
                history = history.concat(allSamples);
            }

            // ensure ordered by version.
            history.sort((a: MiniSample, b: MiniSample) => {
                return a.version - b.version;
            });

            // gather users

            // fetch all users

            // combine and return

            this.setState({
                loadingState: {
                    status: AsyncProcessStatus.SUCCESS,
                    state: {
                        history,
                        fieldDefinitions
                    }
                }
            });
        } catch (ex) {
            this.setState({
                loadingState: {
                    status: AsyncProcessStatus.ERROR,
                    error: {
                        code: 'data-load-error',
                        message: ex.message
                    }
                }
            });
        }
    }

    renderNone() {
        return <LoadingOutlined />;
    }

    renderProcessing() {
        return <LoadingOutlined />;
    }

    renderError(error: AppError) {
        return <Alert type="error" message={error.message} />;
    }

    renderSuccess({ history, fieldDefinitions }: { history: History, fieldDefinitions: FieldDefinitionsMap; }) {
        return <Component history={history} fieldDefinitions={fieldDefinitions} />;
    }

    render() {
        switch (this.state.loadingState.status) {
            case AsyncProcessStatus.NONE:
                return this.renderNone();
            case AsyncProcessStatus.PROCESSING:
                return this.renderProcessing();
            case AsyncProcessStatus.ERROR:
                return this.renderError(this.state.loadingState.error);
            case AsyncProcessStatus.SUCCESS:
                return this.renderSuccess(this.state.loadingState.state);
        }
    }
}
