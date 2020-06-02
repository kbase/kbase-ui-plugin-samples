import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { StoreState } from '../../redux/store';
import Component from './data';
import { sendTitle } from '@kbase/ui-components';
import { DynamicServiceConfig } from '@kbase/ui-components/lib/redux/integration/store';

export interface OwnProps {
}

interface StateProps {
    token: string;
    serviceWizardURL: string;
    workspaceURL: string;
    baseURL: string;
    sampleServiceConfig: DynamicServiceConfig;
}

interface DispatchProps {
    setTitle: (title: string) => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const {
        auth: { userAuthorization },
        app: {
            config: {
                services: {
                    ServiceWizard: { url: serviceWizardURL },
                    Workspace: { url: workspaceURL }
                },
                baseUrl: baseURL,
                dynamicServices: {
                    SampleService: sampleServiceConfig
                }
            }
        }
    } = state;

    let token;
    if (!userAuthorization) {
        throw new Error('Invalid state: token required');
    } else {
        token = userAuthorization.token;
    }
    return { token, serviceWizardURL, workspaceURL, baseURL, sampleServiceConfig };
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
        setTitle(title: string) {
            dispatch(sendTitle(title) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Component);
