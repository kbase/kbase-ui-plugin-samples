import React from 'react';
import { AsyncProcess, AsyncProcessStatus } from '../../redux/store/processing';
import SampleServiceClient, {
    DataLink
} from '../../lib/comm/dynamicServices/SampleServiceClient';
import { AppError } from '@kbase/ui-components';
import Component from './view';
import { LoadingOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import { WorkspaceClient, ObjectInfo } from '../../lib/comm/coreServices/Workspace';
import { UPSTREAM_TIMEOUT } from '../../constants';
import { DynamicServiceConfig } from '@kbase/ui-components/lib/redux/integration/store';
import { SampleId, SampleVersion } from '../../lib/comm/dynamicServices/Sample';

export interface DataLink2 extends DataLink {
    key: string;
    objectType: string;
    objectName: string;
}

export interface DataProps {
    serviceWizardURL: string;
    workspaceURL: string;
    token: string;
    sampleId: SampleId;
    version: SampleVersion;
    baseURL: string;
    sampleServiceConfig: DynamicServiceConfig;
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
                url: this.props.serviceWizardURL,
                timeout: UPSTREAM_TIMEOUT,
                version: this.props.sampleServiceConfig.version
            });

            const dataLinks = await client.get_data_links_from_sample({
                id: this.props.sampleId,
                version: this.props.version
            });

            const objectRefs = dataLinks.links.map((dataLink) => {
                return dataLink.upa;
            });

            if (objectRefs.length === 0) {
                this.setState({
                    loadingState: {
                        status: AsyncProcessStatus.SUCCESS,
                        state: []
                    }
                });
                return;
            }

            const workspaceClient = new WorkspaceClient({
                authorization: this.props.token,
                url: this.props.workspaceURL,
                timeout: UPSTREAM_TIMEOUT
            });

            const objectInfos = await workspaceClient.get_object_info3({
                includeMetadata: 1,
                objects: objectRefs.map((ref) => {
                    return { ref };
                })
            });

            const objectMap = objectInfos.infos.reduce((objectMap, info) => {
                const [objectId, , , , version, , workspaceId, , , ,] = info;
                const ref = [workspaceId, objectId, version].join('/');
                objectMap.set(ref, info);
                return objectMap;
            }, new Map<string, ObjectInfo>());

            const dataLinksWithKey: Array<DataLink2> = dataLinks.links.map((dataLink) => {
                const objectInfo = objectMap.get(dataLink.upa);
                if (!objectInfo) {
                    throw new Error('Object not found: ' + dataLink.upa);
                }
                return {
                    ...dataLink,
                    key: dataLink.upa,
                    objectName: objectInfo[1],
                    objectType: objectInfo[2]
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
