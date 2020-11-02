import React from 'react';
import { Table, Tooltip, Alert, message } from 'antd';
import { History, MiniSample } from './data';
import './style.css';
import UserCard from '../UserCard/view';
import { Template, User } from '../Main/types';
import Comparator from '../Comparator';
import { partitionArray } from '../../lib/utils';
import { View } from '../Comparator';
import DiffSelector, { DiffState } from '../Comparator/DiffSelector';
import ViewSelector from '../Comparator/ViewSelector';
import { Format } from '../../lib/comm/dynamicServices/SampleServiceClient';

export interface HistoryToolProps {
    history: History;
    template: Template;
    format: Format;
}

interface HistoryToolState {
    selectedSamples: Array<MiniSample>;
    diffView: View;
    diffStatus: Array<DiffState>;
}

export default class HistoryTool extends React.Component<HistoryToolProps, HistoryToolState> {
    constructor(props: HistoryToolProps) {
        super(props);
        this.state = {
            selectedSamples: [],
            diffView: 'sample',
            diffStatus: ['diff', 'nodiff']
        };
    }

    onSelectSample(selectedSample: MiniSample) {
        if (this.state.selectedSamples.length > 0) {
            const [selectedSamples, removedSamples] = partitionArray<MiniSample>(this.state.selectedSamples, (sample: MiniSample) => {
                return sample.version === selectedSample.version;
            });
            if (removedSamples.length > 0) {
                this.setState({
                    selectedSamples
                });
                return;
            }
            if (this.state.selectedSamples.length === 2) {
                message.warning('Unselect a version first');
                return;
            }
        }
        const newSamples = [...this.state.selectedSamples, selectedSample].sort((a: MiniSample, b: MiniSample) => {
            return a.version - b.version;
        });
        this.setState({
            selectedSamples: newSamples
        });
    }

    renderHistoryTable() {
        if (this.props.history.length === 0) {
            return <Alert type="error" message="No History!" />;
        }
        const table = <Table<MiniSample>
            dataSource={this.props.history}
            className="AntTable-FullHeight"
            rowKey="version"
            size="small"
            scroll={{ y: '100%' }}
            // scroll={{ y: '100%' }}
            pagination={false}
            rowSelection={{
                type: 'checkbox',
                hideSelectAll: true,
                selectedRowKeys: this.state.selectedSamples.map((sample) => {
                    return sample.version;
                }),
                onSelect: this.onSelectSample.bind(this)
            }}
        >

            <Table.Column
                title="Version"
                dataIndex="version"
                width="6em"
                ellipsis={true}
            />

            <Table.Column
                title="Saved"
                dataIndex="savedAt"
                width="12em"
                ellipsis
                render={(savedAt: number) => {
                    const timestamp = Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    }).format(savedAt);
                    // const date = Intl.DateTimeFormat('en-US', {
                    //     year: 'numeric',
                    //     month: 'numeric',
                    //     day: 'numeric'
                    // }).format(savedAt);
                    return <Tooltip title={timestamp}>
                        <span>{timestamp}</span>
                    </Tooltip>;
                }}
            />

            <Table.Column
                title="By"
                dataIndex="savedBy"
                // style={{
                //     maxWidth: '10em'
                // }}
                // onCell={() => {
                //     return {
                //         style: {
                //             maxWidth: '10em'
                //         }
                //     };
                // }}
                // width="10em"
                ellipsis
                render={(savedBy: User) => {
                    return <Tooltip title={<UserCard user={savedBy} />}>
                        <span>{savedBy.username}</span>
                    </Tooltip>;
                }}
            />
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

    renderComparison() {
        if (this.props.history.length === 0) {
            return <Alert type="error" message="No History!" />;
        }
        return <Comparator
            selectedSamples={this.state.selectedSamples}
            view={this.state.diffView}
            diffStatus={this.state.diffStatus}
            template={this.props.template}
            format={this.props.format}
        // fieldDefinitions={this.props.fieldDefinitions}
        />;
    }

    renderHistory() {
        return <div className="Col -stretch">
            <div className="Row">
                <div className="Col -span1" style={{ marginRight: '10px' }}>
                    <div className="-title" role="heading" aria-level={3}>History</div>
                </div>
                <div className="Col -span2">
                    <div className="-title" role="heading" aria-level={3}>Diff</div>
                </div>
            </div>
            <div className="Row">
                <div className="Col -span1" style={{ marginRight: '10px' }}>

                </div>
                <div className="Col -span2" style={{ margin: '10px 0' }}>
                    <div className="Row">
                        <div className="Col" style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ fontStyle: 'italic' }}>
                                Show:
                            </div>

                            <ViewSelector
                                view={this.state.diffView}
                                changeView={(view: View) => {
                                    this.setState({
                                        diffView: view
                                    });
                                }}
                            />
                        </div>
                        <div className="Col" style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ fontStyle: 'italic' }}>
                                Show properties that are:
                            </div>
                            <DiffSelector
                                diffStatus={this.state.diffStatus}
                                changeDiffStatus={(diffStatus: Array<DiffState>) => {
                                    this.setState({
                                        diffStatus
                                    });
                                }}
                            />
                        </div>
                    </div>
                </div>

            </div>
            <div className="Row -stretch">
                <div className="Col -span1" style={{ marginRight: '10px', position: 'relative' }}>
                    {this.renderHistoryTable()}
                </div>
                <div className="Col -span2">
                    {this.renderComparison()}
                </div>
            </div>
        </div>;
    }

    render() {
        return <div className="History" data-testid="history">
            {this.renderHistory()}
        </div>;
    }
}
