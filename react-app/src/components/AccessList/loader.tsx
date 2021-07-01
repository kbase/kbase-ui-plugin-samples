/**
 * The Loader is a component pattern which allows for managing the loading of a
 * resource from redux, and supplying the resource to a component.
 *
 * It helps insulate a component from actual data operations; in fact, the view component
 * it invokes as a child need not have any clue that it is being fed by the loader.
 *
 * The typical flow is:
 * - request a resource from the store
 * - show a loading spinner while the store is fulfilling this request
 * - show an error display if an error occurs
 * - render the child view component with the resolved values
 *
 * It should ideally be partnered with a component which connects to redux. The redux component
 * provides a plain "AsyncProcessingState" object. This object has a status field which indicates
 * the current state of the data fetch: none, fetching, fetched, or error.
 *
 * The loader handles all of this through normal React lifecycle events.
 */


import {AppError, Loading} from '@kbase/ui-components';
import {ACL, Sample} from 'lib/ViewModel/ViewModel';
import React from 'react';
import {AsyncProcessStatus} from 'redux/store/processing';
import {AccessStoreState} from 'redux/store/access';
import View from './view';
import {Alert} from 'antd';

export interface LoaderProps {
    accessState: AccessStoreState;
    sample: Sample;
    load: () => void;
}

interface LoaderState {

}

export default class LoaderView extends React.Component<LoaderProps, LoaderState> {
    componentDidMount() {
        if (this.props.accessState.status === AsyncProcessStatus.NONE) {
            this.props.load();
        }
    }

    renderLoading() {
        return <div className="FullyCenteredFLex">
            <Loading message="Loading Access List..."/>
        </div>
    }

    renderError(error: AppError) {
        return <Alert message="Error" description={error.message} type="error"/>
    }

    renderSuccess(accessList: ACL) {
        // console.log('access list', JSON.stringify(accessList));
        return <View acl={accessList} owner={this.props.sample.firstVersion.by}/>
    }

    render() {
        switch (this.props.accessState.status) {
            case AsyncProcessStatus.NONE:
                return this.renderLoading();
            case AsyncProcessStatus.PROCESSING:
                return this.renderLoading();
            case AsyncProcessStatus.ERROR:
                return this.renderError(this.props.accessState.error);
            case AsyncProcessStatus.SUCCESS:
                return this.renderSuccess(this.props.accessState.state.accessList);
        }
    }
}
