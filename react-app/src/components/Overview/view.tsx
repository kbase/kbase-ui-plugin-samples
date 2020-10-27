import React from 'react';
import { Row, Col, Modal, Button, Tooltip } from 'antd';
import { Sample } from '../Main/types';
import { SelectValue } from 'antd/lib/select';
import Versions from '../Versions';
import UserCard from '../UserCard/view';
// import { SampleSource } from '../../lib/Model';
import { NoData } from '../NoData';
import './styles.css';

export interface OverviewProps {
    sample: Sample;
}

interface OverviewState {
    showVersions: boolean;
}

export default class Overview extends React.Component<OverviewProps, OverviewState> {
    constructor(props: OverviewProps) {
        super(props);
        this.state = {
            showVersions: false
        };
    }

    onChangeVersion(version: SelectValue) {
        const hash = `samples/view/${this.props.sample.id}/${version}`;
        if (window.parent) {
            window.parent.location.hash = hash;
        } else {
            window.location.hash = hash;
        }
    }

    renderShowVersions() {
        if (this.props.sample.latestVersion.version === 1) {
            return;
        }
        return <>
            <Button type="dashed" size="small" style={{ marginLeft: '4px' }} onClick={() => {
                this.setState({
                    showVersions: !this.state.showVersions
                });
            }}>
                Show All Versions…
            </Button>
            <Modal title="All Versions"
                visible={this.state.showVersions}
                width={"45em"}
                onCancel={() => {
                    this.setState({
                        showVersions: false
                    });
                }}
                footer={null}
            >
                <Versions sample={this.props.sample} onChangeVersion={this.onChangeVersion.bind(this)} />
            </Modal>
        </>;
    }

    renderVersions() {
        const label = (() => {
            if (this.props.sample.latestVersion.version === 1) {
                return <span>
                    {this.props.sample.latestVersion.version}
                </span>;
            }
            return <span>
                {this.props.sample.currentVersion.version}
                {' of '}
                {this.props.sample.latestVersion.version}
            </span>;
        })();

        return <>
            {label}
            {this.renderShowVersions()}
        </>;
    }

    render() {
        const {
            name, created
        } = this.props.sample;

        const sourceTooltip = <div>
            <img src={this.props.sample.format.source.logo_url!} height={30} alt={`Logo for ${this.props.sample.format.source.title}`} />
            <div><a href={this.props.sample.format.source.url} target="_blank" rel="noopener noreferrer" className="Overview-sourceUrl">{this.props.sample.format.source.title}</a></div>
        </div>;
        
        return <div className="Grouper Overview">
            <Row>
                <Col span={12}>
                    <div className="InfoTable">
                        <div>
                            <div>
                                Name
                            </div>
                            <div data-testid="name">
                                {name}
                            </div>
                        </div>
                        <div>
                            <div>
                                Format
                        </div>
                            <div data-testid="id">
                                <Tooltip title={sourceTooltip}>
                                    <span>{this.props.sample.format.source.name}</span>
                                </Tooltip>
                            </div>
                        </div>
                        <div>
                            <div>
                                ID
                            </div>
                            <div data-testid="version">
                                {this.props.sample.sampleId}
                            </div>
                        </div>
                        <div>
                            <div>
                                Parent
                            </div>
                            <div data-testid="type">
                                {this.props.sample.parentSampleId || <NoData />}
                            </div>
                        </div>

                    </div>
                </Col>
                <Col span={12} >
                    <div className="InfoTable">
                        <div>
                            <div>
                                Saved
                            </div>
                            <div data-testid="save_date">
                                {Intl.DateTimeFormat('en-US', {
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    second: 'numeric',
                                    timeZoneName: 'short'
                                }).format(created.at)}
                            </div>
                        </div>
                        <div>
                            <div>
                                By
                            </div>
                            <div data-testid="save_date">
                                <UserCard user={this.props.sample.currentVersion.by} />
                            </div>
                        </div>
                        <div>
                            <div>
                                Version
                            </div>
                            <div data-testid="version">
                                {this.renderVersions()}
                            </div>
                        </div>
                    </div>

                </Col>

            </Row>
        </div>;
    }
}
