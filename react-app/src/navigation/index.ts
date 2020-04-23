import { Nav } from '../redux/store/navigation';
import { Dispatch } from 'react';
import { Action } from 'redux';
import { connect } from 'react-redux';
import NavigationComponent from './Navigation';
import { RootState } from '@kbase/ui-components';
import { StoreState, NavigationView } from '../redux/store';
import { navigate } from '../redux/actions';
import { Navigation } from '@kbase/ui-components/lib/redux/integration/store';
// import { navigate } from '../redux/actions';

interface OwnProps { }

interface StateProps {
    rootState: RootState;
    navigationView: NavigationView;
    trigger: number;
    navigation: Navigation;
}

interface DispatchProps {
    navigate: (nav: Nav) => void;
    // view: (view: View) => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const {
        root: { state: rootState },
        app: {
            runtime: {
                navigation
            }
        },
        // navigation,
        // trigger
        navigationView
    } = state;

    // const navigate = () => {
    //     return;
    // }
    // const navigation: Navigation = {
    //     type: ViewType.NONE
    // };
    // const trigger: number = 1;
    // return { rootState, navigation, trigger };
    const trigger: number = 1;
    return { rootState, navigationView, trigger, navigation };
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
        navigate: (nav: Nav) => {
            dispatch(navigate(nav));
        },
        // view: (view: View) => {
        //     dispatch(view(view) as any)
        // }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(NavigationComponent);
