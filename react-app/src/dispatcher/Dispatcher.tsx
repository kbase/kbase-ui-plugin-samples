import React from 'react';
import { RootState, AppError } from '@kbase/ui-components';
import { Alert } from 'antd';
import { SampleView, SampleViewState } from '../redux/store';
import { SyncViewStatus } from '../redux/store/view/SyncView';
import Main from '../components/Main';

export interface DispatcherProps {
    token: string | null;
    rootState: RootState;
    sampleView: SampleView;
    trigger: number;
}

interface DispatcherState { }

export class Dispatcher extends React.Component<DispatcherProps, DispatcherState> {
    renderUnauthorized() {
        return <div>Sorry, not authorized. Please log in first.</div>;
    }

    renderRootState() {
        switch (this.props.rootState) {
            case RootState.NONE:
                return '';
            case RootState.HOSTED:
                return '';
            case RootState.DEVELOP:
                return '';
            case RootState.ERROR:
                return 'error';
        }
    }

    renderError(error: AppError) {
        return <Alert type="error" message={error.message} />;
    }

    renderSuccess(state: SampleViewState) {
        if (!state.sampleId) {
            return <Alert type="error" message="Sample ID is missing" />;
        }
        return <Main id={state.sampleId} version={state.sampleVersion} />;
    }

    renderView() {
        switch (this.props.sampleView.status) {
            case (SyncViewStatus.NONE):
                return 'NONE';
            case SyncViewStatus.ERROR:
                return this.renderError(this.props.sampleView.error);
            case SyncViewStatus.SUCCESS:
                return this.renderSuccess(this.props.sampleView.state);
        }
    }

    render() {
        if (!this.props.token) {
            return this.renderUnauthorized();
        }
        return this.renderView();
    }
}
