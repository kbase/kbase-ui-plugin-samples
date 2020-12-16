import React from 'react';
import { AsyncProcess, AsyncProcessStatus } from '../../redux/store/processing';
import SampleServiceClient, {
} from '../../lib/comm/dynamicServices/SampleServiceClient';
import { AppError } from '@kbase/ui-components';
import Component from './view';
import { LoadingOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import { UPSTREAM_TIMEOUT } from '../../constants';
import { DynamicServiceConfig } from '@kbase/ui-components/lib/redux/integration/store';
import UserProfileClient, { UserProfile } from '../../lib/comm/coreServices/UserProfileClient';
import { ACL, Sample } from '../Main/types';
import { Username } from '../../lib/comm/dynamicServices/Sample';

export interface DataProps {
    serviceWizardURL: string;
    userProfileURL: string;
    token: string;
    sample: Sample;
    baseURL: string;
    sampleServiceConfig: DynamicServiceConfig;
}

interface DataState {
    loadingState: AsyncProcess<ACL, AppError>;
}

export interface UserProfileMap {
    [username: string]: UserProfile;
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

    async componentDidMount() {
        try {
            const client = new SampleServiceClient({
                token: this.props.token,
                url: this.props.serviceWizardURL,
                timeout: UPSTREAM_TIMEOUT,
                version: this.props.sampleServiceConfig.version
            });

            const aclResult = await client.get_sample_acls({
                id: this.props.sample.id,
                as_admin: 0
            });

            const usersToFetch: Array<Username> = aclResult.admin.concat(aclResult.read).concat(aclResult.write);

            const userProfileClient = new UserProfileClient({
                authorization: this.props.token,
                url: this.props.userProfileURL,
                timeout: UPSTREAM_TIMEOUT,
            });

            const profiles = await userProfileClient.get_user_profile(usersToFetch);
            const profileMap: UserProfileMap = profiles.reduce<UserProfileMap>((profileMap, profile) => {
                profileMap[profile.user.username] = profile;
                return profileMap;
            }, {});

            const acl: ACL = {

                admin: aclResult.admin.map((username) => {
                    const profile = profileMap[username];
                    return {
                        username,
                        realname: profile.user.realname,
                        gravatarHash: profile.profile.synced.gravatarHash,
                        gravatarDefault: profile.profile.userdata.gravatarDefault,
                        avatarOption: profile.profile.userdata.avatarOption
                    };
                }),
                write: aclResult.write.map((username) => {
                    const profile = profileMap[username];
                    return {
                        username,
                        realname: profile.user.realname,
                        gravatarHash: profile.profile.synced.gravatarHash,
                        gravatarDefault: profile.profile.userdata.gravatarDefault,
                        avatarOption: profile.profile.userdata.avatarOption
                    };
                }),
                read: aclResult.read.map((username) => {
                    const profile = profileMap[username];
                    return {
                        username,
                        realname: profile.user.realname,
                        gravatarHash: profile.profile.synced.gravatarHash,
                        gravatarDefault: profile.profile.userdata.gravatarDefault,
                        avatarOption: profile.profile.userdata.avatarOption
                    };
                })
            };

            this.setState({
                loadingState: {
                    status: AsyncProcessStatus.SUCCESS,
                    state: acl
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

    renderSuccess(acl: ACL) {
        return <Component acl={acl} owner={this.props.sample.created.by} />;
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
