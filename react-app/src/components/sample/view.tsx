import React from 'react';
import { Sample, SampleNode } from '../../lib/comm/dynamicServices/SampleServiceClient';
import { Row, Col, Tabs, Collapse } from 'antd';
import './style.css';

export interface SampleViewerProps {
    sample: Sample;
}

interface SampleViewerState {
    selectedSampleNode: SampleNode | null;
}

export default class SampleViewer extends React.Component<SampleViewerProps, SampleViewerState> {
    constructor(props: SampleViewerProps) {
        super(props);
        this.state = {
            selectedSampleNode: props.sample.node_tree[0]
        };
    }

    renderOverview() {
        const { id, user, name, save_date, version } = this.props.sample;

        return <div className="Grouper">
            <Row>
                <Col span={12}>
                    <div className="InfoTable">
                        <div>
                            <div>
                                ID
                        </div>
                            <div>
                                {id} (v{version})
                            </div>
                        </div>
                        <div>
                            <div>
                                Name
                            </div>
                            <div>
                                {name}
                            </div>
                        </div>
                        <div>
                            <div>
                                Saved
                            </div>
                            <div>
                                {Intl.DateTimeFormat('en-US', {
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    second: 'numeric',
                                    timeZoneName: 'short'
                                }).format(save_date)}
                            </div>
                        </div>
                    </div>
                </Col>
                <Col span={12}>
                    <div className="InfoTable">

                        <div>
                            <div>
                                User
                            </div>
                            <div>
                                {user}
                            </div>
                        </div>

                    </div>
                </Col>
            </Row>
        </div>;

    }

    renderParent() {

    }

    renderControlledMetadata() {
        if (!this.state.selectedSampleNode) {
            return;
        }
        const metadata = Object.entries(this.state.selectedSampleNode.meta_controlled);
        if (metadata.length === 0) {
            return <div style={{ fontStyle: 'italic' }}>Sorry, no controlled metadata</div>;
        }
        const rows = Array.from(metadata)
            .sort(([akey,], [bkey,]) => {
                return akey.localeCompare(bkey);
            })
            .map(([key, value]) => {
                return <div key={key}>
                    <div>{key}</div>
                    <div>{value.value} <i>{value.units}</i></div>
                </div>;
            });
        return <div className="InfoTable -bordered ControlledMetadata">
            {rows}
        </div>;
    }

    renderUserMetadata() {
        if (!this.state.selectedSampleNode) {
            return;
        }
        const metadata = Object.entries(this.state.selectedSampleNode.meta_user);
        if (metadata.length === 0) {
            return <div style={{ fontStyle: 'italic' }}>Sorry, no user metadata</div>;
        }
        const rows = Array.from(metadata)
            .sort(([akey,], [bkey,]) => {
                return akey.localeCompare(bkey);
            })
            .map(([key, value]) => {
                return <div key={key}>
                    <div>{key}</div>
                    <div>{value.value} <i>{value.units}</i></div>
                </div>;
            });
        return <div className="InfoTable -bordered UserMetadata">
            {rows}
        </div>;
    }

    renderSampleNode(sampleNode: SampleNode) {
        return <div>
            <div className="InfoTable">
                <div>
                    <div>
                        ID
                </div>
                    <div>
                        {sampleNode.id}
                    </div>
                </div>
                <div>
                    <div>
                        Type
                </div>
                    <div>
                        {sampleNode.type}
                    </div>
                </div>
            </div>
            <Collapse defaultActiveKey={['1', '2']} bordered={false} style={{ backgroundColor: "transparent" }}>
                <Collapse.Panel header="Controlled Metadata" key='1'>
                    {this.renderControlledMetadata()}
                </Collapse.Panel>
                <Collapse.Panel header="User Metadata" key='2'>
                    {this.renderUserMetadata()}
                </Collapse.Panel>
            </Collapse>

        </div>;
    }

    renderCurrentSampleNode() {
        if (!this.state.selectedSampleNode) {
            return;
        }
        return this.renderSampleNode(this.state.selectedSampleNode);
    }

    clickNavItem(sampleNode: SampleNode) {
        this.setState({
            selectedSampleNode: sampleNode
        });
    }

    renderSampleNodeNav(sampleNode: SampleNode) {
        return <div className="Nav-item" onClick={() => { this.clickNavItem(sampleNode); }}>
            {sampleNode.id}
        </div>;
    }

    renderSampleNodes() {
        return this.props.sample.node_tree.map((sampleNode) => {
            return this.renderSampleNode(sampleNode);
        });
    }


    renderBody() {
        return <div>
            {this.renderCurrentSampleNode()}
        </div>;
    }

    render() {
        return <div className='Sample'>
            <div className="SectionLabel">
                KBase Sample Object
            </div>
            {this.renderOverview()}
            <Row>
                <Col span={24}>
                    <Tabs type="line">
                        <Tabs.TabPane tab="Sample" key="sample" >
                            {this.renderBody()}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Linked Data" key="linkeddata">
                            coming soon...
                        </Tabs.TabPane>
                    </Tabs>

                </Col>
            </Row>
        </div>;
    }

    // async componentDidMount() {
    //     // this is just a cheap cheat for today.
    //     const client = new SampleServiceClient({
    //         token: 'YBME7NQWH4IVFJDDAEIACUHJUHZDRTDD',
    //         url: 'https://ci.kbase.us/services/service_wizard/rpc'
    //     });
    //     try {
    //         const result = await client.get_sample({
    //             id: '81563a88-0abe-4b8f-b2fc-dd2d400e41a9'
    //         });
    //         console.log('result', result);
    //     } catch (ex) {
    //         console.error('ERROR', ex);
    //     }
    // }
}

