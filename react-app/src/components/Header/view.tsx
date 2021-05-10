import React from 'react';
import { Row, Col, Modal, Button, Tooltip } from 'antd';
import { SelectValue } from 'antd/lib/select';
import Versions from '../Versions';
import UserCard from '../UserCard/view';
import './styles.css';
import { Format } from 'lib/client/samples/Samples';
import { Sample } from "../../lib/ViewModel/ViewModel";
import { InfoTable } from "@kbase/ui-components";

export interface HeaderProps {
    sample: Sample;
    format: Format;
}

interface HeaderState {
    showVersions: boolean;
}

export default class Header extends React.Component<HeaderProps, HeaderState> {
    constructor(props: HeaderProps) {
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
                Select a Version…
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
            <img src={this.props.format.source.logo_url!} height={30}
                alt={`Logo for ${this.props.format.source.title}`} />
            <div><a href={this.props.format.source.url} target="_blank" rel="noopener noreferrer"
                className="Header-sourceUrl">{this.props.format.source.title}</a></div>
        </div>;

        return <div className="Grouper Header">
            <Row>
                <Col span={8}>
                    <InfoTable table={[{
                        label: 'Name',
                        render: () => {
                            return <span data-testid="name">{this.props.sample.name}</span>;
                        }
                    }, {
                        label: 'ID',
                        value: this.props.sample.sampleId
                    }]}></InfoTable>
                </Col>
                <Col span={8}>
                    <InfoTable table={[{
                        label: 'Format',
                        render: () => {
                            return <Tooltip title={sourceTooltip}>
                                <span>{this.props.format.source.name}</span>
                            </Tooltip>;
                        }
                    }]}></InfoTable>
                </Col>
                <Col span={8}>
                    <InfoTable table={[{
                        label: 'Owner',
                        render: () => {
                            return <UserCard user={this.props.sample.currentVersion.by} />;
                        }
                    }, {
                        label: 'Last Saved',
                        value: Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
                            timeZoneName: 'short'
                        }).format(created.at)
                    }, {
                        label: 'Versions',
                        render: () => {
                            return this.renderVersions();
                        }
                    }]}>
                    </InfoTable>
                </Col>
            </Row>
        </div>;
    }
}
