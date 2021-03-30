import { Dispatch } from 'react';
import { Action } from 'redux';
import { connect } from 'react-redux';
import { Dispatcher } from './Dispatcher';
import { RootState } from '@kbase/ui-components';
import { StoreState, SampleView } from '../redux/store';
import { SyncViewStatus } from '../redux/store/view/SyncView';

interface OwnProps { }

interface StateProps {
    token: string | null;
    rootState: RootState;
    // navigation: Navigation;
    sampleView: SampleView;
    trigger: number;
}

interface DispatchProps {
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const {
        auth: { userAuthorization },
        root: { state: rootState },
        app: {
            runtime: {
                navigation: {
                    view, params
                }
            }
        }
    } = state;

    // Auth integration.
    let token;
    if (!userAuthorization) {
        token = null;
    } else {
        token = userAuthorization.token;
    }

    let sampleVersion: number | undefined;
    if (params.hasOwnProperty('sampleVersion')) {
        sampleVersion = parseInt(params['sampleVersion']);
        if (isNaN(sampleVersion)) {
            sampleVersion = undefined;
        }
    }

    const sampleView: SampleView = {
        status: SyncViewStatus.SUCCESS,
        state: {
            sampleId: params['sampleId'],
            sampleVersion
        }
    };

    const trigger: number = 1;
    return { token, rootState, sampleView, trigger };
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {

    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Dispatcher);
