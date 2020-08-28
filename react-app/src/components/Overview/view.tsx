import React from 'react';
import { Row, Col, Modal, Button, Tooltip } from 'antd';
import { Sample } from '../Main/types';
import { SelectValue } from 'antd/lib/select';
import Versions from '../Versions';
import UserCard from '../UserCard/view';
import './styles.css';
import { SampleSource } from '../../lib/Model';
import { NoData } from '../NoData';

export interface OverviewProps {
    sample: Sample;
    sampleSource: SampleSource;
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
            <Button type="dashed" size="small" style={{marginLeft: '4px'}} onClick={() => {
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
        </>
    }

    renderVersions() {
        const label = (() => {
            if (this.props.sample.latestVersion.version === 1) {
                return <span>
                    {this.props.sample.latestVersion.version}
                </span>
            }
            return <span>
            {this.props.sample.currentVersion.version}
            {' of '}
            {this.props.sample.latestVersion.version}
            </span>
        })();

        return <>
            {label}
            {this.renderShowVersions()}
        </>
    }

    render() {
        const {
            name, created, source, sourceId, sourceParentId
        } = this.props.sample;

        const idLabel = this.props.sampleSource.fields.id.label;
        const parentIdLabel = this.props.sampleSource.fields.parent_id.label;

        const sourceTooltip = <div>
            <img src={this.props.sampleSource.logoURL} height={30} alt={`Logo for ${this.props.sampleSource.name}`}/>
            <div><a href={this.props.sampleSource.url} target="_blank" rel="noopener noreferrer" className="Overview-sourceUrl">{this.props.sampleSource.title}</a></div>
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
                                Source
                        </div>
                            <div data-testid="id">
                                <Tooltip title={sourceTooltip}>
                                    <span>{this.props.sampleSource.name}</span>
                                </Tooltip>
                            </div>
                        </div>
                        <div>
                            <div>
                                {idLabel}
                            </div>
                            <div data-testid="version">
                                {sourceId.id}
                            </div>
                        </div>
                        <div>
                            <div>
                                {parentIdLabel}
                            </div>
                            <div data-testid="type">
                                {sourceParentId?.id || <NoData />}
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
