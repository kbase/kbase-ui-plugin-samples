import {Dispatch, Action} from 'redux';
import {connect} from 'react-redux';
import {sendTitle} from '@kbase/ui-components';

import {StoreState} from '../../redux/store';
import Component from './loader';
import {fetch} from 'redux/actions/sample';
import {SampleStoreState} from 'redux/store/sample';

export interface OwnProps {
    id: string;
    version?: number;
}

interface StateProps {
    sampleState: SampleStoreState
}

interface DispatchProps {
    setTitle: (title: string) => void;
    load: (id: string, version?: number) => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const {
        data: {
            sample: sampleState
        }
    } = state;
    return {sampleState};
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
        setTitle(title: string) {
            dispatch(sendTitle(title) as any);
        },
        load(id: string, version?: number) {
            dispatch(fetch(id, version) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Component);
