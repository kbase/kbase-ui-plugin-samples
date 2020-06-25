import React from 'react';
import { AsyncProcess, AsyncProcessStatus } from '../../redux/store/processing';
import SampleServiceClient, {
    GroupingLayout, FieldDefinitionsMap, Template, TemplateDefinition
} from '../../lib/comm/dynamicServices/SampleServiceClient';
import { AppError } from '@kbase/ui-components';
import Component from './view';
import { LoadingOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import { UPSTREAM_TIMEOUT } from '../../constants';
import { Sample } from '../Main/data';

export interface DataProps {
    serviceWizardURL: string;
    token: string;
    sample: Sample;
    // sampleId: SampleId;
    // sampleVersion?: SampleVersion;
    // setTitle: (title: string) => void;
}

interface Payload {
    layout: GroupingLayout;
    template: Template;
    definition: TemplateDefinition;
    metadataFields: FieldDefinitionsMap;
}

interface DataState {
    loadingState: AsyncProcess<Payload, AppError>;
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

    async fetchTemplate(props: DataProps) {
        try {
            if (this.state.loadingState.status === AsyncProcessStatus.SUCCESS) {
                this.setState({
                    loadingState: {
                        status: AsyncProcessStatus.REPROCESSING,
                        state: this.state.loadingState.state
                    }
                });
            } else {
                this.setState({
                    loadingState: {
                        status: AsyncProcessStatus.PROCESSING
                    }
                });
            }
            const client = new SampleServiceClient({
                token: props.token,
                url: props.serviceWizardURL,
                timeout: UPSTREAM_TIMEOUT
            });

            // Get the template
            const { template, metadataFields, definition } = await client.get_template({ id: "sesar" });

            const fieldMapping: FieldDefinitionsMap = metadataFields.reduce((fieldMapping, field) => {
                fieldMapping[field.key] = field;
                return fieldMapping;
            }, {} as FieldDefinitionsMap);

            // Get the grouping layout
            const { grouping } = await client.get_grouping({ id: "sesar" });

            // Get the field definitions


            return this.setState({
                loadingState: {
                    status: AsyncProcessStatus.SUCCESS,
                    state: {
                        layout: grouping,
                        template, definition,
                        metadataFields: fieldMapping
                    }
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

    async componentDidMount() {
        this.fetchTemplate(this.props);
    }

    // async componentDidUpdate(prevProps: DataProps, prevState: DataState) {
    //     // console.log('[componentDidUpdate]', prevProps.sampleId, this.props.sampleId,
    //     // prevProps.sampleVersion, this.props.sampleVersion);
    //     if (prevProps.sampleId !== this.props.sampleId ||
    //         prevProps.sampleVersion !== this.props.sampleVersion) {
    //         // console.log('fetching...', prevProps.sampleVersion !== this.props.sampleVersion, prevProps.sampleVersion, this.props.sampleVersion);
    //         this.fetchSample(this.props);
    //     }
    // }

    // static async getDerivedStateFromProps(nextProps: DataProps, prevState: DataState) {
    //     this.fetchSample();
    // }

    // async componentDidUpdate() {
    //     try {
    //         const client = new SampleServiceClient({
    //             token: this.props.token,
    //             url: this.props.serviceWizardURL
    //         });
    //         console.log('get sample', this.props.sampleId);
    //         const sample = await client.get_sample({
    //             id: this.props.sampleId
    //         });
    //         console.log('Sample!', sample);
    //         this.setState({
    //             loadingState: {
    //                 status: AsyncProcessStatus.SUCCESS,
    //                 state: sample
    //             }
    //         });
    //     } catch (ex) {
    //         console.log('Error!', ex);
    //         this.setState({
    //             loadingState: {
    //                 status: AsyncProcessStatus.ERROR,
    //                 error: {
    //                     code: 'data-load-error',
    //                     message: ex.message
    //                 }
    //             }
    //         });
    //     }
    // }

    renderNone() {
        return <LoadingOutlined />;
    }

    renderProcessing() {
        return <LoadingOutlined />;
    }

    renderError(error: AppError) {
        return <Alert type="error" message={error.message} />;
    }

    renderSuccess({ definition, template, metadataFields }: Payload) {
        return <Component sample={this.props.sample} definition={definition} template={template} fields={metadataFields} />;
    }

    render() {
        // console.log('[Sample.render]', this.state);
        switch (this.state.loadingState.status) {
            case AsyncProcessStatus.NONE:
                return this.renderNone();
            case AsyncProcessStatus.PROCESSING:
                return this.renderProcessing();
            case AsyncProcessStatus.REPROCESSING:
                return this.renderProcessing();
            case AsyncProcessStatus.ERROR:
                return this.renderError(this.state.loadingState.error);
            case AsyncProcessStatus.SUCCESS:
                return this.renderSuccess(this.state.loadingState.state);
        }
    }
}
