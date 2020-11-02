import React from 'react';
import { Table, Tooltip } from 'antd';
import { PauseOutlined, LineOutlined } from '@ant-design/icons';

import { Comparison, ComparisonDataSourceItem } from './index';

import './style.less';
import { DiffState } from './DiffSelector';

export interface ComparatorProps {
    diffStatus: Array<DiffState>;
    comparison: Comparison;
}

interface ComparatorState {
}

export default class Comparator extends React.Component<ComparatorProps, ComparatorState> {
    constructor(props: ComparatorProps) {
        super(props);
        this.state = {
            view: 'sample'
        };
    }

    renderNotEqual() {
        return <div className="IconStack">
            <div className="-icon -danger">
                <PauseOutlined rotate={90} />
            </div>
            <div className="-icon -danger" style={{ fontSize: '150%' }}>
                <LineOutlined rotate={315} />
            </div>
        </div>;
    }

    renderEqual() {
        return <div className="IconStack">
            <div className="-icon -subdued">
                <PauseOutlined rotate={90} />
            </div>
        </div>;
    }

    renderComparison() {
        const comparison = this.props.comparison;

        const diff = comparison.fields
            .map((field) => {
                const isDiff = (() => {
                    if (comparison.compare1) {
                        if (comparison.compare2) {
                            return (comparison.compare1[field.key] !== comparison.compare2[field.key]);
                        } else {
                            return true;
                        }
                    } else {
                        if (comparison.compare2) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                })();

                return {
                    key: field.key,
                    label: field.label,
                    isDiff,
                    compare1: comparison.compare1 ? comparison.compare1[field.key] : null,
                    compare2: comparison.compare2 ? comparison.compare2[field.key] : null
                };
            })
            .filter((compare: ComparisonDataSourceItem) => {
                if (compare.isDiff) {
                    if (this.props.diffStatus.indexOf('diff') >= 0) {
                        return true;
                    }
                } else {
                    if (this.props.diffStatus.indexOf('nodiff') >= 0) {
                        return true;
                    }
                }
                return false;
            });


        const table = <Table<ComparisonDataSourceItem> dataSource={diff}
            className="AntTable-FullHeight"
            rowKey="key"
            size="small"
            scroll={{ y: '100%' }}
            pagination={false}>

            <Table.Column
                title="Field"
                dataIndex="label"
                // width="15em"
                width="20%"
                ellipsis
                key="key"
                render={(label: string) => {
                    return <Tooltip title={label}>
                        <span>{label}</span>
                    </Tooltip>;
                }}
            />

            <Table.Column
                title="Diff"
                dataIndex="isDiff"
                key="isDiff"
                width="3em"
                ellipsis
                render={(isDiff: boolean) => {
                    return isDiff ? this.renderNotEqual() : this.renderEqual();
                }} />

            <Table.Column
                // title={this.props.selectedSamples[0] ? `Version ${this.props.selectedSamples[0].version}` : <i>Not selected</i>}
                title="First Sample"
                dataIndex="compare1"
                width="40%"
                ellipsis
                key="compare1" />

            <Table.Column
                // title={this.props.selectedSamples[1] ? `Version ${this.props.selectedSamples[1].version}` : <i>Not selected</i>}
                title="Second Sample"
                dataIndex="compare2"
                width="40%"
                ellipsis
                key="compare2" />
        </Table>;

        return <div style={{
            position: 'absolute',
            left: '0',
            right: '0',
            top: '0',
            bottom: '0',
            flex: '1 1 0px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {table}
        </div>;

    }

    render() {
        return <div className="Comparator" style={{ position: 'relative' }}>
            {this.renderComparison()}
        </div>;
    }
}