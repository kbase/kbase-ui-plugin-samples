import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { StoreState } from '../../redux/store';
import Loader from './loader';
import { DynamicServiceConfig } from '@kbase/ui-components/lib/redux/integration/store';
import { AccessStoreState } from 'redux/store/access';
import { Sample } from 'lib/ViewModel';
import { get } from 'redux/actions/access';

export interface OwnProps {
    sample: Sample
}

interface StateProps {
    token: string;
    serviceWizardURL: string;
    userProfileURL: string;
    baseURL: string;
    sampleServiceConfig: DynamicServiceConfig;
    accessState: AccessStoreState;
}

interface DispatchProps {
    load: () => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const {
        auth: { userAuthorization },
        app: {
            config: {
                services: {
                    ServiceWizard: { url: serviceWizardURL },
                    UserProfile: { url: userProfileURL }
                },
                baseUrl: baseURL,
                dynamicServices: {
                    SampleService: sampleServiceConfig
                }
            }
        },
        data: {
            access: accessState
        }
    } = state;

    let token;
    if (!userAuthorization) {
        throw new Error('Invalid state: token required');
    } else {
        token = userAuthorization.token;
    }
    return { token, serviceWizardURL, userProfileURL, baseURL, sampleServiceConfig, accessState };
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
        load() {
            dispatch(get(ownProps.sample.id) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Loader);
