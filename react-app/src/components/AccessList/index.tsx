import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StoreState } from '../../redux/store';
import Loader from './loader';
import { AccessStoreState } from 'redux/store/access';
import { Sample } from 'lib/ViewModel/ViewModel';
import { ActionType, FetchAction } from 'redux/actions/access';

export interface OwnProps {
    sample: Sample
}

interface StateProps {
    accessState: AccessStoreState;
}

interface DispatchProps {
    load: () => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const {
        data: {
            access: accessState
        }
    } = state;

    return { accessState };
}

function mapDispatchToProps(dispatch: Dispatch<FetchAction>, ownProps: OwnProps): DispatchProps {
    return {
        load() {
            // dispatch(fetch(ownProps.sample.id) as any);
            dispatch({
                category: 'access',
                type: ActionType.FETCH,
                id: ownProps.sample.id
            });
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Loader);
