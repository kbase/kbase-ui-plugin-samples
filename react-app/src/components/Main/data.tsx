import React from 'react';
import { AsyncProcess, AsyncProcessStatus } from '../../redux/store/processing';
import {
    SampleId, SampleVersion, Username
} from '../../lib/comm/dynamicServices/SampleServiceClient';
import { AppError } from '@kbase/ui-components';
import Component from './view';
import { LoadingOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import { UPSTREAM_TIMEOUT } from '../../constants';
import UserProfileClient from '../../lib/comm/coreServices/UserProfileClient';
import { Sample, Metadata, User, UserMetadata } from './types';
import Model from '../../lib/Model';

export interface DataProps {
    serviceWizardURL: string;
    userProfileURL: string;
    token: string;
    sampleId: SampleId;
    sampleVersion?: SampleVersion;
    setTitle: (title: string) => void;
}

interface DataState {
    loadingState: AsyncProcess<Sample, AppError>;
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

    async fetchSample(props: DataProps) {
        try {
            if (this.state.loadingState.status === AsyncProcessStatus.SUCCESS) {
                this.setState({
                    loadingState: {
                        status: AsyncProcessStatus.REPROCESSING,
                        state: this.state.loadingState.state
                    }
                });
            } else {
                this.setState({
                    loadingState: {
                        status: AsyncProcessStatus.PROCESSING
                    }
                });
            }
            const client = new Model({
                token: props.token,
                url: props.serviceWizardURL,
                timeout: UPSTREAM_TIMEOUT
            });

            const sampleResult = await client.getSample({
                id: props.sampleId,
                version: props.sampleVersion
            });

            const latestSample = await client.getSample({
                id: props.sampleId
            });

            let firstSample;

            if (sampleResult.version === 1) {
                firstSample = sampleResult;
            } else {
                firstSample = await client.getSample({
                    id: props.sampleId,
                    version: 1
                });
                if (sampleResult.version < latestSample.version) {
                } else {
                }
            }

            const actualSample = sampleResult.sample;

            const fieldKeys = Object.keys(actualSample.metadata);

            const fieldMetadata = await client.getMetadataKeyStaticMetadata({
                keys: fieldKeys,
                prefix: 0
            });

            const fieldDefinitions = (await client.getMetadataDefinitions({})).field_definitions;

            const controlledMetadata: Metadata = Object.entries(actualSample.metadata)
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
                    if (controlledMetadata[key]) {
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
                firstSample.savedBy,
                sampleResult.savedBy,
                latestSample.savedBy
            ]).values()));
            const usersMap = users.reduce((usersMap, user) => {
                usersMap.set(user.username, user);
                return usersMap;
            }, new Map<Username, User>());

            const sample: Sample = {
                id: sampleResult.id,
                name: sampleResult.name,
                template: {
                    id: sampleResult.sample.templateId,
                    label: sampleResult.sample.templateId
                },
                source: sampleResult.sample.source,
                sourceId: {
                    id: actualSample.id,
                    label: 'IGSN'
                },
                sourceParentId: {
                    id: actualSample.parentId,
                    label: 'Parent IGSN'
                },
                created: {
                    at: firstSample.savedAt,
                    by: usersMap.get(firstSample.savedBy)!,
                },
                currentVersion: {
                    at: sampleResult.savedAt,
                    by: usersMap.get(sampleResult.savedBy)!,
                    version: sampleResult.version
                },
                latestVersion: {
                    at: latestSample.savedAt,
                    by: usersMap.get(latestSample.savedBy)!,
                    version: latestSample.version
                },
                type: actualSample.type,
                metadata: controlledMetadata,
                userMetadata
            };

            return this.setState({
                loadingState: {
                    status: AsyncProcessStatus.SUCCESS,
                    state: sample
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

    async componentDidMount() {
        this.fetchSample(this.props);
    }

    async componentDidUpdate(prevProps: DataProps, prevState: DataState) {
        if (prevProps.sampleId !== this.props.sampleId ||
            prevProps.sampleVersion !== this.props.sampleVersion) {
            this.fetchSample(this.props);
        }
    }

    // static async getDerivedStateFromProps(nextProps: DataProps, prevState: DataState) {
    //     this.fetchSample();
    // }

    // async componentDidUpdate() {
    //     try {
    //         const client = new SampleServiceClient({
    //             token: this.props.token,
    //             url: this.props.serviceWizardURL
    //         });
    //         console.log('get sample', this.props.sampleId);
    //         const sample = await client.get_sample({
    //             id: this.props.sampleId
    //         });
    //         console.log('Sample!', sample);
    //         this.setState({
    //             loadingState: {
    //                 status: AsyncProcessStatus.SUCCESS,
    //                 state: sample
    //             }
    //         });
    //     } catch (ex) {
    //         console.log('Error!', ex);
    //         this.setState({
    //             loadingState: {
    //                 status: AsyncProcessStatus.ERROR,
    //                 error: {
    //                     code: 'data-load-error',
    //                     message: ex.message
    //                 }
    //             }
    //         });
    //     }
    // }

    renderNone() {
        return <LoadingOutlined />;
    }

    renderProcessing() {
        return <LoadingOutlined />;
    }

    renderError(error: AppError) {
        return <Alert type="error" message={error.message} />;
    }

    renderSuccess(sample: Sample) {
        return <Component sample={sample} setTitle={this.props.setTitle} />;
    }

    render() {
        // console.log('[Sample.render]', this.state);
        switch (this.state.loadingState.status) {
            case AsyncProcessStatus.NONE:
                return this.renderNone();
            case AsyncProcessStatus.PROCESSING:
                return this.renderProcessing();
            case AsyncProcessStatus.REPROCESSING:
                return this.renderProcessing();
            case AsyncProcessStatus.ERROR:
                return this.renderError(this.state.loadingState.error);
            case AsyncProcessStatus.SUCCESS:
                return this.renderSuccess(this.state.loadingState.state);
        }
    }
}
