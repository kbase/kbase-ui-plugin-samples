import React from 'react';
import {
    Tabs
} from 'antd';

import DataLinks from '../DataLinks';
import Overview from '../Overview/view';
import TemplateMetadata from '../TemplateMetadata/view';
import AccessList from '../AccessList';
import GeolocationViewer from '../Geolocation/view';
import Header from '../Header/view';

import './style.less';
import {Sample} from "../../lib/ViewModel/ViewModel";
import {Loading} from '@kbase/ui-components';

export interface MainProps {
    sample: Sample;
    setTitle: (title: string) => void;
    loading?: boolean;
}

interface MainState {
}

export default class Main extends React.Component<MainProps, MainState> {
    componentDidMount() {
        const title = `Sample View for "${this.props.sample.name}"`;
        this.props.setTitle(title);
    }

    renderLoadingCover() {
        if (!this.props.loading) {
            return;
        }
        return <div className="LoadingCover">
            {<Loading message="Loading Sample..."/>}
        </div>
    }

    render() {
        // <Tabs.TabPane tab="History" key="history">
        //             <HistoryTool sampleId={this.props.sample.id} version={this.props.sample.currentVersion.version} />
        //         </Tabs.TabPane>
        return <div className='Main'>
            {this.renderLoadingCover()}
            <Header sample={this.props.sample} format={this.props.sample.format}/>
            <Tabs type="card" className="FullHeight-tabs">

                <Tabs.TabPane tab="Sample" key="sample">
                    <TemplateMetadata sample={this.props.sample} template={this.props.sample.template}/>
                </Tabs.TabPane>
                {/* <Tabs.TabPane tab="Metadata" key="metadata">
                    <MetadataViewer sample={this.props.sample} fieldGroups={this.props.fieldGroups} />
                </Tabs.TabPane> */}
                <Tabs.TabPane tab="Geolocation" key="geolocation">
                    <GeolocationViewer sample={this.props.sample}/>
                </Tabs.TabPane>
                {/* <Tabs.TabPane tab="User Metadata" key="usermetadata">
                    <UserMetadataViewer sample={this.props.sample} />
                </Tabs.TabPane> */}

                <Tabs.TabPane tab="Linked Data" key="linkeddata">
                    <DataLinks sampleId={this.props.sample.id} version={this.props.sample.currentVersion.version}/>
                </Tabs.TabPane>
                {/*<Tabs.TabPane tab="Overview" key="overview">*/}
                {/*    <Overview sample={this.props.sample} format={this.props.sample.format} />*/}
                {/*</Tabs.TabPane>*/}
                <Tabs.TabPane tab="Access" key="accesslist">
                    <AccessList sample={this.props.sample}/>
                </Tabs.TabPane>

            </Tabs>
        </div>;
    }
}
