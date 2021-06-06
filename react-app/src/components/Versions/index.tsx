import React from 'react';
import {ArrowRightOutlined} from '@ant-design/icons/lib/icons';
import Select from 'antd/lib/select';
import {Button, Tooltip, Typography} from 'antd';
import UserCard from '../UserCard/view';
import {Sample, Version} from 'lib/ViewModel/ViewModel';


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
                style={{textAlign: 'center'}}
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

        return <div style={{textAlign: 'center'}}>
            <Select<string>
                style={{display: 'block'}}
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

        if (currentVersion.version === 3) {
            return <tr>
                <td/>
                <th>Previous</th>
                <td colSpan={2}/>
                <td>{this.renderVersionButton(2)}</td>
            </tr>;
        }

        return <tr>
            <td/>
            <th>Previous</th>
            <td colSpan={2}/>
            <td>{this.renderVersionButtonRange(2, currentVersion.version)}</td>
        </tr>;
    }

    renderVersionButton(version: number) {
        return <Button
            href={`/#samples/view/${this.props.sample.id}/${version}`}
            role="button"
            aria-label={`Click to select version ${version}`}
            style={{display: 'block'}}
            target="_parent">{version}</Button>
    }

    renderDate(date: Date) {
        const displayDate = Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
        }).format(date)
        // const options: { [key: string]: string } =
        // const now = new Date();
        // if (date.getFullYear() !== now.getFullYear()) {
        //     options['year'] = 'numeric';
        // }
        // const day = 1000 * 60 * 60 * 24;
        // if ((now.getTime() - date.getTime()) < day * 3) {
        //     options['hour'] = 'numeric';
        //     options['minute'] = 'numeric';
        // }
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

    renderVersionRow(version: Version, label: string, isCurrent: boolean) {
        const cellStyle: React.CSSProperties = (() => {
            if (isCurrent) {
                return {
                    backgroundColor: 'rgba(200, 200, 200, 0.5)'
                }
            } else {
                return {}
            }
        })();
        const currentRowIndicator = (() => {
            if (isCurrent) {
                return <ArrowRightOutlined/>
            }
        })();
        return <tr>
            <td style={cellStyle}>{currentRowIndicator}</td>
            <th style={cellStyle}>{label}</th>
            <td style={cellStyle}>
                <div data-testid="save_date">
                    {this.renderDate(new Date(version.at))}
                </div>
            </td>
            <td style={cellStyle}>
                <UserCard user={version.by}/>
            </td>
            <td style={cellStyle}>
                <Button
                    href={`/#samples/view/${this.props.sample.id}/${version.version}`}
                    role="button"
                    aria-label={`Click to select version ${version.version}`}
                    style={{display: 'block'}}
                    target="_parent">{version.version}</Button>
            </td>
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

        if (missingVersions === 1) {
            return <tr>
                <td/>
                <th>Next</th>
                <td colSpan={2}/>
                <td>{this.renderVersionButton(currentVersion.version + 1)}</td>
            </tr>;
        }

        return <tr>
            <td/>
            <th>Next</th>
            <td colSpan={2} style={{textAlign: 'center'}}>
                <Typography.Text type="secondary">Select a version <ArrowRightOutlined/></Typography.Text>
            </td>
            <td>{this.renderVersionButtonRange(currentVersion.version + 1, latestVersion.version)}</td>
        </tr>;
    }

    renderCurrentVersionRow() {
        const {
            currentVersion, latestVersion
        } = this.props.sample;

        // The first version is always displayed, and will display as the
        // current version.
        if (currentVersion.version === 1) {
            return;
        }

        // If the current version is also the latest.
        if (currentVersion.version === latestVersion.version) {
            return <tr>
                <td/>
                <th>Previous</th>
                <td colSpan={2} style={{textAlign: 'center'}}>
                    <Typography.Text type="secondary">Select a version <ArrowRightOutlined/></Typography.Text>
                </td>
                <td>{this.renderVersionButtonRange(2, latestVersion.version)}</td>
            </tr>;
        }

        return this.renderVersionRow(currentVersion, 'This Sample', true);
    }

    renderLatestVersionRow() {
        const {
            currentVersion, latestVersion
        } = this.props.sample;
        if (latestVersion.version === 1) {
            return;
        }
        const isCurrent = (currentVersion.version === latestVersion.version);
        const cellStyle: React.CSSProperties = {};
        if (isCurrent) {
            cellStyle.backgroundColor = 'rgba(200, 200, 200, 0.5)';
        }
        return this.renderVersionRow(latestVersion, 'Latest', isCurrent);
    }

    render() {
        const {
            firstVersion, currentVersion
        } = this.props.sample;
        const isCurrent = (currentVersion.version === 1);
        const cellStyle: React.CSSProperties = {};
        if (isCurrent) {
            cellStyle.backgroundColor = 'rgba(200, 200, 200, 0.5)';
        }
        return <table className="NiceTable -versions">
            <thead>
            <tr>
                <th style={{width: '3em'}}/>
                <th style={{width: '8em'}}/>
                <th style={{width: '5em'}}>At</th>
                <th>By</th>
                <th style={{width: '10em'}}>Version</th>
            </tr>
            </thead>
            <tbody>
            {this.renderVersionRow(firstVersion, 'First', currentVersion.version === 1)}
            {this.renderPreviousVersionsRow()}
            {this.renderCurrentVersionRow()}
            {this.renderNextVersionsRow()}
            {this.renderLatestVersionRow()}
            </tbody>
        </table>;
    }
}
