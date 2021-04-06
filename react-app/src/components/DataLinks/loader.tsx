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


import { Loading } from '@kbase/ui-components';
import React from 'react';
import { UIError } from 'redux/store/error';
import { AsyncProcessStatus } from 'redux/store/processing';
import { LinkedData, LinkedDataStoreState } from 'redux/store/linkedData';
import View from './view';

export interface LoaderProps {
    linkedDataState: LinkedDataStoreState;
    baseURL: string;
    load: () => void;
}

interface LoaderState {

}

export default class LoaderView extends React.Component<LoaderProps, LoaderState> {
    componentDidMount() {
        if (this.props.linkedDataState.status === AsyncProcessStatus.NONE) {
            this.props.load();
        }
    }
    renderLoading() {
        return <div className="FullyCenteredFLex">
            <Loading message="Loading Linked Data..." />
        </div>
    }
    renderError(error: UIError) {
        return <div>
            Error! {error.message}
        </div>
    }
    renderSuccess(linkedData: LinkedData) {
        return <View linkedData={linkedData} baseURL={this.props.baseURL} />
    }
    render() {
        switch (this.props.linkedDataState.status) {
            case AsyncProcessStatus.NONE:
            case AsyncProcessStatus.PROCESSING:
                return this.renderLoading();
            case AsyncProcessStatus.ERROR:
                return this.renderError(this.props.linkedDataState.error);
            case AsyncProcessStatus.SUCCESS:
                return this.renderSuccess(this.props.linkedDataState.state.linkedData);
        }
    }
}
