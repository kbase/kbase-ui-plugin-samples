import React from 'react';
import { Row, Col, Select } from 'antd';
import { Sample } from './data';
import './Overview.css';
import { ArrowRightOutlined } from '@ant-design/icons';
import { SelectValue } from 'antd/lib/select';

export interface OverviewProps {
    sample: Sample;
}

interface OverviewState {
}

export default class Overview extends React.Component<OverviewProps, OverviewState> {

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
        window.location.hash = hash;
    }


    renderVersionButtonRange(from: number, to: number) {
        const range = Array(to - from).fill(1).map((_, index) => {
            return from + index;
        });
        const options = range.map((version) => {
            return <Select.Option value={String(version)} style={{ textAlign: 'right' }}>
                {version}
            </Select.Option>;
        });

        let placeholder: string;
        if (range.length === 1) {
            placeholder = `${range[0]}`;
        } else {
            placeholder = `${range[0]} - ${range[range.length - 1]}`;
        }

        return <Select<string>
            style={{ display: 'block' }}
            onChange={this.onChangeVersion.bind(this)}
            placeholder={placeholder}
        >
            {options}
        </Select>;
    }

    renderPreviousVersionsRow() {
        const {
            currentVersion, latestVersion
        } = this.props.sample;

        if (currentVersion.version <= 2) {
            return;
        }

        if (currentVersion.version === latestVersion.version) {
            return;
        }

        return <tr>
            <td></td>
            <th>Previous Versions</th>
            <td colSpan={3}>{this.renderVersionButtonRange(2, currentVersion.version)}</td>
        </tr>;
    }

    renderNextVersionsRow() {
        const {
            currentVersion, latestVersion
        } = this.props.sample;

        if (currentVersion.version === latestVersion.version) {
            return;
        }

        const missingVersions = latestVersion.version - currentVersion.version - 1;

        if (missingVersions === 0) {
            return;
        }

        return <tr>
            <td></td>
            <th>Next Versions</th>
            <td colSpan={3}>{this.renderVersionButtonRange(currentVersion.version + 1, latestVersion.version)}</td>
        </tr>;
    }

    renderCurrentVersionRow() {
        const {
            id, currentVersion, latestVersion
        } = this.props.sample;

        if (currentVersion.version === 1) {
            return;
        }

        if (currentVersion.version === latestVersion.version) {
            return <tr>
                <td></td>
                <th>Other Versions</th>
                <td colSpan={3}>{this.renderVersionButtonRange(2, latestVersion.version)}</td>
            </tr>;
        }

        return <tr>
            <td><ArrowRightOutlined /></td>
            <th>This Sample</th>
            <td>
                <div data-testid="save_date">
                    {Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                        timeZoneName: 'short'
                    }).format(currentVersion.at)}
                </div>
            </td>
            <td>
                <a href={`/#people/${currentVersion.by}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >{currentVersion.by}</a>
            </td>
            <td>
                <a href={`/#sampleview/${id}/${currentVersion.version}`} target="_parent">{currentVersion.version}</a>
            </td>
        </tr>;

    }
    render() {
        const {
            id, name, created, currentVersion, latestVersion, source, sourceId, sourceParentId
        } = this.props.sample;

        /*
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
        */
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
                <Col span={16} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <table className="NiceTable -versions">
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th>At</th>
                                <th>By</th>
                                <th>Version</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{currentVersion.version === 1 ? <ArrowRightOutlined /> : ''}</td>
                                <th>Created</th>
                                <td>
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
                                </td>
                                <td>
                                    <a href={`/#people/${created.by}`}
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        {created.by}
                                    </a>
                                </td>
                                <td>
                                    <a href={`/#sampleview/${id}/1`} target="_parent">1</a>
                                </td>

                            </tr>

                            {this.renderPreviousVersionsRow()}

                            {this.renderCurrentVersionRow()}

                            {this.renderNextVersionsRow()}

                            <tr>
                                <td>{currentVersion.version === latestVersion.version ? <ArrowRightOutlined /> : ''}</td>
                                <th>Latest</th>
                                <td>
                                    <div data-testid="save_date">
                                        {Intl.DateTimeFormat('en-US', {
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            second: 'numeric',
                                            timeZoneName: 'short'
                                        }).format(latestVersion.at)}
                                    </div>
                                </td>
                                <td>
                                    <a href={`/#people/${latestVersion.by}`}
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        {latestVersion.by}
                                    </a>
                                </td>
                                <td>
                                    <a href={`/#sampleview/${id}/${latestVersion.version}`} target="_parent">{latestVersion.version}</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Col>

            </Row>
        </div>;
    }
}
