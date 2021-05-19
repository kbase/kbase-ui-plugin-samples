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
import {AppError, Loading} from '@kbase/ui-components';
import ErrorView from 'components/ErrorView';
import {Sample} from 'lib/ViewModel/ViewModel';
import React from 'react';

// Internal imports
import {AsyncProcessStatus} from 'redux/store/processing';
import {GeolocationStoreState} from "../../redux/store/geolocation";

// Local imports
import View from './view';
import {FieldGroups} from "../../lib/client/samples/Samples";

export interface LoaderProps {
    geolocationState: GeolocationStoreState;
    sample: Sample;
    load: () => void;
}

interface LoaderState {
}

export default class LoaderView extends React.Component<LoaderProps, LoaderState> {
    constructor(props: LoaderProps) {
        super(props);
    }

    componentDidMount() {
        if (this.props.geolocationState.status === AsyncProcessStatus.NONE) {
            this.props.load();
        }
    }

    renderLoading() {
        return <div className="FullyCenteredFLex">
            <Loading message="Loading Geolocation Data..."/>
        </div>;
    }

    renderError(error: AppError) {
        return <ErrorView error={error}/>;
    }

    renderSuccess(fieldGroups: FieldGroups) {
        console.log('groups?', fieldGroups);
        const group = fieldGroups.filter((fieldGroup) => {
            return fieldGroup.name === 'geolocation'
        });
        return <View {...this.props} group={group[0]}/>;
    }

    renderReprocessing(fieldGroups: FieldGroups) {
        const group = fieldGroups.filter((fieldGroup) => {
            return fieldGroup.name === 'geolocation'
        });
        return <View sample={this.props.sample} group={group[0]}/>;
    }

    render() {
        switch (this.props.geolocationState.status) {
            case AsyncProcessStatus.NONE:
            case AsyncProcessStatus.PROCESSING:
                return this.renderLoading();
            case AsyncProcessStatus.ERROR:
                return this.renderError(this.props.geolocationState.error);
            case AsyncProcessStatus.SUCCESS:
                return this.renderSuccess(this.props.geolocationState.state.fieldGroups)
            case AsyncProcessStatus.REPROCESSING:
                return this.renderReprocessing(this.props.geolocationState.state.fieldGroups);
        }
    }
}
