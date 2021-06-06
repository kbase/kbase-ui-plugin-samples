import React from 'react';
import {Row, Col, Modal, Button, Tooltip} from 'antd';
import {SelectValue} from 'antd/lib/select';
import Versions from '../Versions';
import UserCard from '../UserCard/view';
import './styles.css';
import {Sample} from "../../lib/ViewModel/ViewModel";
import {InfoTable} from "@kbase/ui-components";
import {Format} from "../../lib/client/Format";

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

    renderDate(date: Date) {
        const displayDate = Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
        }).format(date)
        const fullResolutionDate = Intl.DateTimeFormat('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short'
        }).format(date);
        return <Tooltip title={fullResolutionDate}>
            <span>{displayDate}</span>
        </Tooltip>
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
                <Versions sample={this.props.sample} onChangeVersion={this.onChangeVersion.bind(this)}/>
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
                    }]}/>
                </Col>
                <Col span={8}>
                    <InfoTable table={[{
                        label: 'Format',
                        render: () => {
                            return <Tooltip
                                title={this.props.format.info.title}>
                                <a href={this.props.format.info.homePage}
                                   target="_blank" rel="noreferrer">{this.props.format.info.shortTitle}</a>
                            </Tooltip>
                        }
                    }]}/>
                </Col>
                <Col span={8}>
                    <InfoTable table={[{
                        label: 'Owner',
                        render: () => {
                            return <UserCard user={this.props.sample.currentVersion.by}/>;
                        }
                    }, {
                        label: 'Last Saved',
                        render: () => {
                            return this.renderDate(new Date(this.props.sample.firstVersion.at))
                        }
                    }, {
                        label: 'Versions',
                        render: () => {
                            return this.renderVersions();
                        }
                    }]}/>
                </Col>
            </Row>
        </div>;
    }
}
