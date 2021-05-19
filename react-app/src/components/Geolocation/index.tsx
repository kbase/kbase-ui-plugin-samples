import {Dispatch, Action} from 'redux';
import {connect} from 'react-redux';
import {sendTitle} from '@kbase/ui-components';

import {StoreState} from '../../redux/store';
import Component from './loader';
import {fetch} from 'redux/actions/geolocation';
import {GeolocationStoreState} from 'redux/store/geolocation';

export interface OwnProps {
}

interface StateProps {
    geolocationState: GeolocationStoreState
}

interface DispatchProps {
    load: () => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const {
        data: {
            geolocation: geolocationState
        }
    } = state;
    return {geolocationState};
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
        load() {
            dispatch(fetch() as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Component);
