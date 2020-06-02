import React from 'react';
import { Sample } from '../../lib/comm/dynamicServices/SampleServiceClient';
import { Row, Col } from 'antd';

export interface OverviewProps {
    sample: Sample;
}

interface OverviewState {
}

export default class Overview extends React.Component<OverviewProps, OverviewState> {
    render() {
        const { id, user, name, save_date, version } = this.props.sample;

        return <div className="Grouper">
            <Row>
                <Col span={12}>
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
                                }).format(save_date)}
                            </div>
                        </div>
                    </div>
                </Col>
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
                                Owner
                            </div>
                            <div data-testid="user">
                                {user}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>;
    }
}
