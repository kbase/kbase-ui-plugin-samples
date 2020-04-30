import React from 'react';
import { AsyncProcess, AsyncProcessStatus } from '../../redux/store/processing';
import SampleServiceClient, { Sample, SampleId, SampleVersion, GetDataLinksFromSampleResult, DataLink } from '../../lib/comm/dynamicServices/SampleServiceClient';
import { AppError } from '@kbase/ui-components';
import Component from './view';
import { LoadingOutlined } from '@ant-design/icons';
import { Alert } from 'antd';

export interface DataLink2 extends DataLink {
    key: string;
}

export interface DataProps {
    serviceWizardURL: string;
    token: string;
    sampleId: SampleId;
    version: SampleVersion;
    baseURL: string;
    setTitle: (title: string) => void;
}

interface DataState {
    loadingState: AsyncProcess<Array<DataLink2>, AppError>;
}

export default class Data extends React.Component<DataProps, DataState> {
    constructor(props: DataProps) {
        super(props);
        this.state = {
            loadingState: {
                status: AsyncProcessStatus.NONE
            }
        };
    }

    async componentDidMount() {
        try {
            const client = new SampleServiceClient({
                token: this.props.token,
                url: this.props.serviceWizardURL
            });

            const dataLinks = await client.get_data_links_from_sample({
                id: this.props.sampleId,
                version: this.props.version
            });

            const dataLinksWithKey: Array<DataLink2> = dataLinks.links.map((dataLink) => {
                return {
                    ...dataLink,
                    key: dataLink.upa
                };
            });

            this.setState({
                loadingState: {
                    status: AsyncProcessStatus.SUCCESS,
                    state: dataLinksWithKey
                }
            });
        } catch (ex) {
            this.setState({
                loadingState: {
                    status: AsyncProcessStatus.ERROR,
                    error: {
                        code: 'data-load-error',
                        message: ex.message
                    }
                }
            });
        }
    }


    renderNone() {
        return <LoadingOutlined />;
    }

    renderProcessing() {
        return <LoadingOutlined />;
    }

    renderError(error: AppError) {
        return <Alert type="error" message={error.message} />;
    }

    renderSuccess(dataLinks: Array<DataLink2>) {
        return <Component dataLinks={dataLinks} baseURL={this.props.baseURL} />;
    }

    render() {
        switch (this.state.loadingState.status) {
            case AsyncProcessStatus.NONE:
                return this.renderNone();
            case AsyncProcessStatus.PROCESSING:
                return this.renderProcessing();
            case AsyncProcessStatus.ERROR:
                return this.renderError(this.state.loadingState.error);
            case AsyncProcessStatus.SUCCESS:
                return this.renderSuccess(this.state.loadingState.state);
        }
    }
}
