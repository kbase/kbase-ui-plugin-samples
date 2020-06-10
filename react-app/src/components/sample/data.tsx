import React from 'react';
import { AsyncProcess, AsyncProcessStatus } from '../../redux/store/processing';
import SampleServiceClient, { SampleId, EpochTimeMS, SampleVersion, Username } from '../../lib/comm/dynamicServices/SampleServiceClient';
import { AppError } from '@kbase/ui-components';
import Component, { IntegerField } from './view';
import { LoadingOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import { UPSTREAM_TIMEOUT } from '../../constants';


export interface MetadataValue {
    value: string | number | boolean;
    units?: string;
    label: string;
    description?: string;
}

export interface Metadata {
    [key: string]: MetadataValue;
}

export type SampleType = 'BioReplicate' | 'TechReplicate' | 'SubSample';


export interface Sample {
    id: SampleId;
    owner: Username;
    name: string;
    savedAt: EpochTimeMS;
    type: SampleType;
    version: SampleVersion;
    controlledMetadata: Metadata;
    userMetadata: Metadata;
}


export interface DataProps {
    serviceWizardURL: string;
    token: string;
    sampleId: SampleId;
    setTitle: (title: string) => void;
}

interface DataState {
    loadingState: AsyncProcess<Sample, AppError>;
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
                url: this.props.serviceWizardURL,
                timeout: UPSTREAM_TIMEOUT
            });

            const sampleResult = await client.get_sample({
                id: this.props.sampleId
            });

            console.log('sample!', sampleResult);

            const actualSample = sampleResult.node_tree[0];

            const fieldKeys = Object.keys(actualSample.meta_user).concat(Object.keys(actualSample.meta_controlled));

            const fieldMetadata = await client.get_metadata_key_static_metadata({
                keys: fieldKeys,
                prefix: 0
            });

            const controlledMetadata: Metadata = Object.entries(actualSample.meta_controlled)
                .reduce((metadata, [key, field]) => {
                    const fieldMeta = fieldMetadata.static_metadata[key];
                    metadata[key] = {
                        label: fieldMeta.display_name,
                        description: fieldMeta.description,
                        value: field.value,
                        units: field.units
                    };
                    return metadata;
                }, {} as Metadata);

            const userMetadata: Metadata = Object.entries(actualSample.meta_user)
                .reduce((metadata, [key, field]) => {
                    const fieldMeta = fieldMetadata.static_metadata[key];
                    metadata[key] = {
                        label: fieldMeta.display_name,
                        description: fieldMeta.description,
                        value: field.value,
                        units: field.units
                    };
                    return metadata;
                }, {} as Metadata);

            const sample: Sample = {
                id: sampleResult.id,
                name: sampleResult.name,
                owner: sampleResult.user,
                savedAt: sampleResult.save_date,
                version: sampleResult.version,
                type: actualSample.type,
                controlledMetadata,
                userMetadata
            };

            console.log('field metadata?', fieldMetadata);

            this.setState({
                loadingState: {
                    status: AsyncProcessStatus.SUCCESS,
                    state: sample
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

    renderSuccess(sample: Sample) {
        return <Component sample={sample} setTitle={this.props.setTitle} />;
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
