import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { StoreState } from '../../redux/store';
import Loader from './loader';
import { fetch } from 'redux/actions/linkedData';
import { LinkedDataStoreState } from 'redux/store/linkedData';

export interface OwnProps {
    sampleId: string;
    version: number;
}

interface StateProps {
    linkedDataState: LinkedDataStoreState,
    baseURL: string
}

interface DispatchProps {
    load: () => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const {
        app: {
            config: {
                baseUrl
            }
        },
        data: {
            linkedData: linkedDataState
        }
    } = state;

    return { linkedDataState, baseURL: baseUrl };
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
        load() {
            dispatch(fetch(ownProps.sampleId, ownProps.version) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Loader);
