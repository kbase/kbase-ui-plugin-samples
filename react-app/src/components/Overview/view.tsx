import React from 'react';
import { Row, Col, Modal, Button, Tooltip } from 'antd';
import { SelectValue } from 'antd/lib/select';
import Versions from '../Versions';
import './styles.css';
import { Format } from 'lib/client/samples/Samples';
import Section from '../Section';
import SubSection from '../SubSection';
import { Sample } from 'lib/ViewModel/ViewModel';
import { NoData } from '@kbase/ui-components';

export interface OverviewProps {
    sample: Sample;
    format: Format;
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
            <img src={this.props.format.source.logo_url!} height={30} alt={`Logo for ${this.props.format.source.title}`} />
            <div><a href={this.props.format.source.url} target="_blank" rel="noopener noreferrer" className="Overview-sourceUrl">{this.props.format.source.title}</a></div>
        </div>;

        return <div className="Grouper Overview">
            <Row gutter={10}>
                <Col span={12}>
                    <Section title="Identity">
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
                    </Section>

                </Col>
                <Col span={12} >
                    <Section title="Import">
                        <div>
                            <div className="InfoTable">
                                <div>
                                    <div>
                                        Format
                                </div>
                                    <div data-testid="id">
                                        <Tooltip title={sourceTooltip}>
                                            <span>{this.props.format.source.name}</span>
                                        </Tooltip>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        In Narrative
                                </div>
                                    <div data-testid="id">
                                        Some Narrative
                                </div>
                                </div>
                                <div>
                                    <div>
                                        Owned by
                                </div>
                                    <div data-testid="save_date">
                                        {this.props.sample.created.by.username}
                                        {/* <UserCard user={this.props.sample.currentVersion.by} /> */}
                                    </div>
                                </div>
                            </div>
                            <SubSection title="First Imported">
                                <div className="InfoTable">
                                    <div>
                                        <div>
                                            By
                                </div>
                                        <div data-testid="save_date">
                                            {this.props.sample.created.by.username}
                                            {/* <UserCard user={this.props.sample.currentVersion.by} /> */}
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            At
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
                                            Version
                            </div>
                                        <div data-testid="version">
                                            {this.renderVersions()}
                                        </div>
                                    </div>
                                </div>

                            </SubSection>

                            <SubSection title="Last Updated">
                                <div className="InfoTable">
                                    <div>
                                        <div>
                                            By
                                </div>
                                        <div data-testid="save_date">
                                            {this.props.sample.created.by.username}
                                            {/* <UserCard user={this.props.sample.currentVersion.by} /> */}
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            At
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
                                            Version
                            </div>
                                        <div data-testid="version">
                                            {this.renderVersions()}
                                        </div>
                                    </div>
                                </div>

                            </SubSection>

                        </div>
                    </Section>

                </Col>

            </Row>
        </div>;
    }
}
