import React from 'react';
import {
    Tabs, Alert
} from 'antd';

import DataLinks from '../DataLinks';

import Overview from '../Overview/Overview';
import TemplateMetadata from '../TemplateMetadata/TemplateMetadata';
import { Sample } from './data';
import AccessList from '../AccessList';
import HistoryTool from '../History';

import './style.less';
import MetadataViewer from '../Metadata/view';

export interface SampleViewerProps {
    sample: Sample;
    setTitle: (title: string) => void;
}

interface SampleViewerState {
}

export default class SampleViewer extends React.Component<SampleViewerProps, SampleViewerState> {
    componentDidMount() {
        const title = `Sample View for "${this.props.sample.name}"`;
        this.props.setTitle(title);
    }

    render() {
        return <div className='Sample'>
            <Overview sample={this.props.sample} />
            <Tabs type="card" className="FullHeight-tabs" >
                <Tabs.TabPane tab="Metadata" key="metadata">
                    <MetadataViewer sample={this.props.sample} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="User Metadata" key="usermetadata">
                    <Alert
                        type="warning"
                        message="Sorry, User Metadata not yet supported."
                        style={{
                            alignSelf: 'center'
                        }}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Template" key="template">
                    <TemplateMetadata sample={this.props.sample} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Linked Data" key="linkeddata">
                    <DataLinks sampleId={this.props.sample.id} version={this.props.sample.currentVersion.version} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Access" key="accesslist">
                    <AccessList sampleId={this.props.sample.id} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="History" key="history">
                    <HistoryTool sampleId={this.props.sample.id} version={this.props.sample.currentVersion.version} />
                </Tabs.TabPane>
            </Tabs>
        </div>;
    }
}
