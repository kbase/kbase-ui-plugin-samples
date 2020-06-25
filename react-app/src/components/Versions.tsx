import React from 'react';
import { ArrowRightOutlined } from '@ant-design/icons/lib/icons';
import { Sample } from './Main/data';
import Select from 'antd/lib/select';
import { Button } from 'antd';
import UserCard from './UserCard/view';

export interface VersionsProps {
    sample: Sample;
    onChangeVersion: (version: string) => void;
}

interface VersionsState {

}

export default class Versions extends React.Component<VersionsProps, VersionsState> {
    renderVersionButtonRange(from: number, to: number) {
        const range = Array(to - from).fill(1).map((_, index) => {
            return from + index;
        });
        const options = range.map((version) => {
            return <Select.Option
                value={String(version)}
                style={{ textAlign: 'center' }}
                key={version}>
                {version}
            </Select.Option>;
        });

        let placeholder: string;
        if (range.length === 1) {
            placeholder = `${range[0]}`;
        } else {
            placeholder = `${range[0]} - ${range[range.length - 1]}`;
        }

        return <div style={{ textAlign: 'center' }}>
            <Select<string>
                style={{ display: 'block' }}
                onChange={this.props.onChangeVersion}
                placeholder={placeholder}
            >
                {options}
            </Select>
        </div>;
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
            <th>Previous</th>
            <td colSpan={2}></td>
            <td >{this.renderVersionButtonRange(2, currentVersion.version)}</td>
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
            <th>Next</th>
            <td colSpan={2}></td>
            <td >{this.renderVersionButtonRange(currentVersion.version + 1, latestVersion.version)}</td>
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
                <td colSpan={2}></td>
                <td >{this.renderVersionButtonRange(2, latestVersion.version)}</td>
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
                <UserCard user={currentVersion.by} />
            </td>
            <td>
                <Button
                    href={`/#sampleview/${id}/${currentVersion.version}`}
                    style={{ display: 'block' }}
                    target="_parent">{currentVersion.version}</Button>
            </td>
        </tr>;
    }

    render() {
        const {
            id, created, currentVersion, latestVersion
        } = this.props.sample;
        return <table className="NiceTable -versions">
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
                        <div data-testid="crated_date" style={{ whiteSpace: 'nowrap' }}>
                            {Intl.DateTimeFormat('en-US', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                // second: 'numeric',
                                timeZoneName: 'short'
                            }).format(created.at)}
                        </div>
                    </td>
                    <td>
                        <UserCard user={created.by} />
                    </td>
                    <td>
                        <Button
                            href={`/#sampleview/${id}/1`}
                            style={{ display: 'block' }}
                            target="_parent">1</Button>
                    </td>

                </tr>

                {this.renderPreviousVersionsRow()}

                {this.renderCurrentVersionRow()}

                {this.renderNextVersionsRow()}

                <tr>
                    <td>{currentVersion.version === latestVersion.version ? <ArrowRightOutlined /> : ''}</td>
                    <th>Latest</th>
                    <td>
                        <div data-testid="latest_date" style={{ whiteSpace: 'nowrap' }}>
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
                        <UserCard user={latestVersion.by} />
                    </td>
                    <td>
                        <Button
                            href={`/#sampleview/${id}/${latestVersion.version}`}
                            style={{ display: 'block' }}
                            target="_parent">{latestVersion.version}</Button>
                    </td>
                </tr>
            </tbody>
        </table>;
    }
}