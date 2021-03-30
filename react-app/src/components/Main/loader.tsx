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

// External imports
import { Loading } from '@kbase/ui-components';
import { Sample } from 'lib/ViewModel';
import React from 'react';

// Internal imports
import { UIError } from 'redux/store/error';
import { AsyncProcessStatus } from 'redux/store/processing';
import { SampleStoreState } from 'redux/store/sample';

// Local imports
import Main from './view';

export interface LoaderProps {
    sampleState: SampleStoreState;
    load: () => void;
    setTitle: (title: string) => void;
}

interface LoaderState {
    dataVersion: number;
}

export default class LoaderView extends React.Component<LoaderProps, LoaderState> {
    constructor(props: LoaderProps) {
        super(props);
        this.state = {
            dataVersion: 1
        }
    }

    componentDidMount() {
        if (this.props.sampleState.status === AsyncProcessStatus.NONE) {
            this.props.load();
        }
    }

    // componentDidUpdate(prevProps: LoaderProps, prevState: LoaderState) {
    //     if (this.props.sampleState.status === AsyncProcessStatus.SUCCESS) {
    //         if (prevProps.sampleState.status === AsyncProcessStatus.SUCCESS) {
    //         if (this.props.sampleState.state.sample.id !== prevProps.sampleState.state.sample.id ||
    //             this.props.sampleState.state.sample.) {
    //             this.props.load();
    //         }
    //     }
    // }

    renderLoading() {
        return <div className="FullyCenteredFLex">
            <Loading message="Loading Sample..." />
        </div>;
    }
    renderError(error: UIError) {
        return <div>
            Error! {error.message}
        </div>
    }
    renderSuccess(sample: Sample) {
        return <Main sample={sample} setTitle={this.props.setTitle} />
    }
    renderReprocessing(sample: Sample) {
        return <Main sample={sample} setTitle={this.props.setTitle} loading={true} />
    }
    render() {
        switch (this.props.sampleState.status) {
            case AsyncProcessStatus.NONE:
            case AsyncProcessStatus.PROCESSING:
                return this.renderLoading();
            case AsyncProcessStatus.ERROR:
                return this.renderError(this.props.sampleState.error);
            case AsyncProcessStatus.SUCCESS:
                return this.renderSuccess(this.props.sampleState.state.sample);
            case AsyncProcessStatus.REPROCESSING:
                return this.renderReprocessing(this.props.sampleState.state.sample);
        }
    }
}
