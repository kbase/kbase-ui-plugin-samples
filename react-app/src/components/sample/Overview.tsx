import React from 'react';
import { Row, Col } from 'antd';
import { Sample } from './data';
import './Overview.css';

export interface OverviewProps {
    sample: Sample;
}

interface OverviewState {
}

export default class Overview extends React.Component<OverviewProps, OverviewState> {
    render() {
        const { type, id, owner, name, savedAt, version, source, sourceId, sourceParentId } = this.props.sample;

        return <div className="Grouper Overview">
            <Row>
                <Col span={8}>
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
                                Owner
                            </div>
                            <div data-testid="user">
                                {owner}
                            </div>
                        </div>
                        <div>
                            <div>
                                Created
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
                                }).format(savedAt)}
                            </div>
                        </div>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="InfoTable">
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
                <Col span={8}>
                    <div className="InfoTable">
                        <div>
                            <div>
                                ID
                        </div>
                            <div data-testid="id">
                                {id}
                            </div>
                        </div>
                        <div>
                            <div>
                                Version
                        </div>
                            <div data-testid="version">
                                {version}
                            </div>
                        </div>
                        <div>
                            <div>
                                Type
                        </div>
                            <div data-testid="type">
                                {type}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>;
    }
}
