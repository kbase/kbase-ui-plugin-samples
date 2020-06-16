import { Dispatch } from 'react';
import { Action } from 'redux';
import { connect } from 'react-redux';
import { Dispatcher } from './Dispatcher';
import { RootState } from '@kbase/ui-components';
import { StoreState, SampleView } from '../redux/store';
import { SyncViewStatus } from '../redux/store/view';
// import { navigate } from '../redux/actions';

interface OwnProps { }

interface StateProps {
    token: string | null;
    rootState: RootState;
    // navigation: Navigation;
    sampleView: SampleView;
    trigger: number;
}

interface DispatchProps {
    // navigate: (id: string) => void;
    // view: (view: View) => void;
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
        },
        navigationView,
        // app: {
        //     runtime: {
        //         navigation
        //     }
        // }
        // navigation,
        // trigger

        // sampleview
    } = state;

    // console.log('nav???', userAuthorization, params);

    // Auth integration.
    let token;
    if (!userAuthorization) {
        token = null;
    } else {
        token = userAuthorization.token;
    }

    // let sampleVersion;
    // if (params['sampleVersion']) {
    //     sampleVersion = parseInt(params['sampleVersion']);
    // }

    const sampleView: SampleView = {
        status: SyncViewStatus.SUCCESS,
        state: {
            sampleId: params['sampleId'],
            sampleVersion: parseInt(params['sampleVersion'])
        }
    };

    // let sampleView: SampleView;
    // switch (navigationView.status) {
    //     case SyncViewStatus.NONE:
    //         sampleView = {
    //             status: SyncViewStatus.NONE
    //         };
    //         break;
    //     case SyncViewStatus.SUCCESS:
    //         if (navigationView.state.path.length === 1) {
    //             sampleView = {
    //                 status: SyncViewStatus.SUCCESS,
    //                 state: {
    //                     sampleId: navigationView.state.path[0]
    //                 }
    //             };
    //         } else if (navigationView.state.path.length === 2) {
    //             sampleView = {
    //                 status: SyncViewStatus.SUCCESS,
    //                 state: {
    //                     sampleId: navigationView.state.path[0],
    //                     sampleVersion: parseInt(navigationView.state.path[1])
    //                 }
    //             };
    //         } else {
    //             sampleView = {
    //                 status: SyncViewStatus.ERROR,
    //                 error: {
    //                     code: 'invalid-view',
    //                     message: 'Invalid view'
    //                 }
    //             };
    //         }

    //         break;
    //     case SyncViewStatus.ERROR:
    //         sampleView = {
    //             status: SyncViewStatus.ERROR,
    //             error: navigationView.error
    //         };
    // }

    // let navigation: Navigation;
    // switch (sampleview.status) {
    //     case SyncViewStatus.NONE:
    //         navigation = {
    //             type: ViewType.NONE
    //         };
    //         break;
    //     case SyncViewStatus.SUCCESS:
    //         switch (sampleview.state.nav.view) {
    //             case 'main':

    //         }
    //         navigation = {
    //             type: ViewType.
    //         }
    //     case SyncViewStatus.ERROR:
    //         throw new Error('Umm, error?');
    // }
    // const navigate = () => {
    //     return;
    // }
    // const navigation: Navigation = {
    //     type: ViewType.NONE
    // };
    const trigger: number = 1;
    return { token, rootState, sampleView, trigger };
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
        // navigate: (id: string) => {
        //     // dispatch(navigate() as any);
        // },
        // view: (view: View) => {
        //     dispatch(view(view) as any)
        // }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Dispatcher);
