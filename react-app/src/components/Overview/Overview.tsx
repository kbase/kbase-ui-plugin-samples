import React from 'react';
import { Row, Col, Modal, Button } from 'antd';
import { Sample } from '../Main/data';
import './Overview.css';
import { SelectValue } from 'antd/lib/select';
import Versions from '../Versions';
import UserCard from '../UserCard/view';

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

    // renderVersionButtonRangex(from: number, to: number) {
    //     const { id } = this.props.sample;
    //     const range = Array(to - from).fill(1).map((_, index) => {
    //         return from + index;
    //     });
    //     return range.map((version) => {
    //         return <Button
    //             href={`/#sampleview/${id}/${version}`}
    //             target="_parent"
    //             key={version}>
    //             {version}
    //         </Button>;
    //     });
    // }

    onChangeVersion(version: SelectValue) {
        const hash = `sampleview/${this.props.sample.id}/${version}`;
        if (window.parent) {
            window.parent.location.hash = hash;
        } else {
            window.location.hash = hash;
        }
    }



    render() {
        const {
            name, created, source, sourceId, sourceParentId
        } = this.props.sample;

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
                                {source}
                            </div>
                        </div>
                        <div>
                            <div>
                                IGSN
                        </div>
                            <div data-testid="version">
                                {sourceId}
                            </div>
                        </div>
                        <div>
                            <div>
                                Parent IGSN
                        </div>
                            <div data-testid="type">
                                {sourceParentId || "-"}
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
                            <div data-testid="save_date">
                                {this.props.sample.currentVersion.version}
                                {' of '}
                                {this.props.sample.latestVersion.version}
                                {' - '}
                                <Button type="link" onClick={() => {
                                    this.setState({
                                        showVersions: !this.state.showVersions
                                    });
                                }}>
                                    Show all versions
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
                            </div>
                        </div>
                    </div>

                </Col>

            </Row>
        </div>;
    }
}
