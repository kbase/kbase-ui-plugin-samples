import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { sendTitle } from '@kbase/ui-components';

import { StoreState } from '../../redux/store';
import Component from './loader';
import { get } from 'redux/actions/sample';
import { SampleStoreState } from 'redux/store/sample';

export interface OwnProps {
    id: string;
    version?: number;
}

interface StateProps {
    token: string;
    serviceWizardURL: string;
    userProfileURL: string;
    sampleState: SampleStoreState
}

interface DispatchProps {
    setTitle: (title: string) => void;
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
                }
            }
        },
        data: {
            sample: sampleState
        }
    } = state;

    let token;
    if (!userAuthorization) {
        throw new Error('Invalid state: token required');
    } else {
        token = userAuthorization.token;
    }

    return { token, serviceWizardURL, userProfileURL, sampleState };
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
        setTitle(title: string) {
            dispatch(sendTitle(title) as any);
        },
        load() {
            dispatch(get(ownProps.id, ownProps.version) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Component);
