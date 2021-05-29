import React from 'react';
import {
    Tabs
} from 'antd';

import DataLinks from '../DataLinks';
import TemplateMetadata from '../TemplateMetadata/view';
import AccessList from '../AccessList';
import GeolocationViewer from '../Geolocation';
import Header from '../Header/view';

import './style.less';
import {Sample} from "../../lib/ViewModel/ViewModel";
import {Loading} from '@kbase/ui-components';
import GroupedMetadata from "../GroupdMetadata/view";
import {FieldGroups} from "../../lib/client/SampleServiceClient";

export interface MainProps {
    sample: Sample;
    fieldGroups: FieldGroups;
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
        </div>;
    }

    render() {

        return <div className='Main'>
            {this.renderLoadingCover()}
            <Header sample={this.props.sample} format={this.props.sample.format}/>
            <Tabs type="card" className="FullHeight-tabs" destroyInactiveTabPane={true}>
                {/*<Tabs.TabPane tab="Sample" key="sample">*/}
                {/*    <TemplateMetadata sample={this.props.sample}/>*/}
                {/*</Tabs.TabPane>*/}

                <Tabs.TabPane tab="Sample" key="metadata">
                    <GroupedMetadata sample={this.props.sample} fieldGroups={this.props.fieldGroups}/>
                </Tabs.TabPane>

                <Tabs.TabPane tab="Geolocation" key="geolocation">
                    <GeolocationViewer sample={this.props.sample}/>
                </Tabs.TabPane>

                <Tabs.TabPane tab="Linked Data" key="linkeddata">
                    <DataLinks sampleId={this.props.sample.id} version={this.props.sample.currentVersion.version}/>
                </Tabs.TabPane>

                <Tabs.TabPane tab="Access" key="accesslist">
                    <AccessList sample={this.props.sample}/>
                </Tabs.TabPane>

            </Tabs>
        </div>;
    }
}
