import React from 'react';
import {
    Tabs
} from 'antd';

import DataLinks from '../DataLinks';
import Overview from '../Overview/view';
import TemplateMetadata from '../TemplateMetadata/view';
import { Sample, Template } from './types';
import AccessList from '../AccessList';
import HistoryTool from '../History';
import MetadataViewer from '../Metadata/view';

import './style.less';
import UserMetadataViewer from '../UserMetadata/view';
import { Format } from '../../lib/comm/dynamicServices/SampleServiceClient';
// import { SampleSource } from '../../lib/Model';

export interface MainProps {
    sample: Sample;
    format: Format;
    template: Template;
    // sampleSource: SampleSource;
    setTitle: (title: string) => void;
}

interface MainState {
}

export default class Main extends React.Component<MainProps, MainState> {
    componentDidMount() {
        const title = `Sample View for "${this.props.sample.name}"`;
        this.props.setTitle(title);
    }

    render() {
        // console.log('main props', JSON.stringify(this.props));
        return <div className='Sample'>
            <Overview sample={this.props.sample} />
            <Tabs type="card" className="FullHeight-tabs" >
                <Tabs.TabPane tab="Metadata" key="metadata">
                    <MetadataViewer sample={this.props.sample} format={this.props.format} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="User Metadata" key="usermetadata">
                    <UserMetadataViewer sample={this.props.sample} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Template" key="template">
                    <TemplateMetadata sample={this.props.sample} template={this.props.template} />
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
