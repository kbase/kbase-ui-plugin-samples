import React from 'react';
import { MiniSample } from './data';
import { Radio, Table, Tooltip, Checkbox } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { Metadata } from '../sample/data';
import { PauseOutlined, LineOutlined } from '@ant-design/icons';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

import './Comparator.less';
import { FieldDefinitionsMap } from '../../lib/comm/dynamicServices/SampleServiceClient';

export interface ViewSelectorProps {
    view: View;
    changeView: (view: View) => void;
}

interface ViewSelectorState {
}

export class ViewSelector extends React.Component<ViewSelectorProps, ViewSelectorState> {
    onViewChange(e: RadioChangeEvent) {
        this.props.changeView(e.target.value);
    }
    render() {
        return <div className="ViewSelector">
            <Radio.Group
                value={this.props.view}
                onChange={this.onViewChange.bind(this)}>
                <Radio.Button value="sample">
                    sample info
                </Radio.Button>

                <Radio.Button value="metadata">
                    metadata
                </Radio.Button>

                <Radio.Button value="user_metadata">
                    user metadata
                </Radio.Button>
            </Radio.Group>
        </div>;
    }
}


export type DiffState = 'diff' | 'nodiff';
export interface DiffSelectorProps {
    diffStatus: Array<DiffState>;
    changeDiffStatus: (diffStatus: Array<DiffState>) => void;
}

interface DiffSelectorState {
}

export class DiffSelector extends React.Component<DiffSelectorProps, DiffSelectorState> {
    onDiffChange(values: Array<CheckboxValueType>) {
        this.props.changeDiffStatus(values as Array<DiffState>);
    }

    render() {
        return <div className="DiffSelector">

            <Checkbox.Group
                options={[{
                    label: 'different',
                    value: 'diff'
                }, {
                    label: 'same',
                    value: 'nodiff'
                }]}

                value={this.props.diffStatus}
                onChange={this.onDiffChange.bind(this)}>

            </Checkbox.Group>
        </div>;
    }
}

export interface ComparisonItem {
    [key: string]: any;
}
export interface Field {
    key: string;
    type: 'string' | 'float' | 'integer' | 'date';
    label: string;
    description?: string;
}
export interface Comparison {
    fields: Array<Field>;
    compare1: ComparisonItem | null;
    compare2: ComparisonItem | null;
}

function formattedDate(time: number): string {
    return Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: 'numeric',
        hour12: false
    }).format(time);
}

interface ComparisonDataSourceItem {
    isDiff: boolean;
    key: string;
    label: string;
    compare1: any | null;
    compare2: any | null;
}

export interface ComparatorProps {
    selectedSamples: Array<MiniSample>;
    view: View;
    diffStatus: Array<DiffState>;
    fieldDefinitions: FieldDefinitionsMap;
}

export type View = 'sample' | 'metadata' | 'user_metadata';
interface ComparatorState {
}

export default class Comparator extends React.Component<ComparatorProps, ComparatorState> {
    constructor(props: ComparatorProps) {
        super(props);
        this.state = {
            view: 'sample'
        };
    }

    getSampleComparison(): Comparison {
        let compare1 = null;
        function sampleToCompare(sample: MiniSample) {
            return {
                type: sample.type,
                name: sample.name,
                version: sample.version,
                savedAt: formattedDate(sample.savedAt),
                savedBy: sample.savedBy.username,
                source: sample.source,
                sourceId: sample.sourceId,
                sourceParentId: sample.sourceParentId
            };
        }
        if (this.props.selectedSamples[0]) {
            const sample1 = this.props.selectedSamples[0];
            compare1 = sampleToCompare(sample1);
        }

        let compare2 = null;
        if (this.props.selectedSamples[1]) {
            const sample2 = this.props.selectedSamples[1];
            compare2 = sampleToCompare(sample2);
        }

        return {
            fields: [
                {
                    key: 'type',
                    label: 'Type',
                    type: 'string'
                }, {
                    key: 'name',
                    label: 'Name',
                    type: 'string'
                }, {
                    key: 'version',
                    label: 'Version',
                    type: 'integer',
                }, {
                    key: 'savedAt',
                    label: 'Saved At',
                    type: 'string'
                }, {
                    key: 'savedBy',
                    label: 'Saved By',
                    type: 'string',
                }, {
                    key: 'source',
                    label: 'Source',
                    type: 'string'
                }, {
                    key: 'sourceId',
                    label: 'Source Id',
                    type: 'string'
                }, {
                    key: 'sourceParentId',
                    label: 'Source Parent Id',
                    type: 'string'
                }
            ],
            compare1, compare2
        };
    }

    getMetadataComparison(): Comparison {
        const keys = [
            // 'name',
            // 'igsn',
            // 'parent_igsn',
            'release_date',
            'material',
            'field_name',
            'location_description',
            'locality_description',
            'collection_method',
            'purpose',
            'latitude',
            'longitude',
            'coordinate_precision?',
            'elevation_start',
            'elevation_unit',
            'navigation_type',
            'primary_physiographic_feature',
            'name_of_physiographic_feature',
            'field_program_cruise',
            'collector_chief_scientist',
            'collection_date',
            'collection_date_precision',
            'current_archive',
            'current_archive_contact',
            'related_identifiers',
            'relation_type'
        ];

        function getMetadataValue(metadata: Metadata, key: string) {
            const field = metadata[key];
            if (typeof field === 'undefined') {
                return;
            }
            return field.value;
        }
        function sampleToCompare(sample: MiniSample) {
            return keys.reduce<ComparisonItem>((compare: ComparisonItem, key: string) => {
                compare[key] = getMetadataValue(sample.metadata, key);
                return compare;
            }, {});

        }
        let compare1 = null;
        if (this.props.selectedSamples[0]) {
            const sample1 = this.props.selectedSamples[0];
            compare1 = sampleToCompare(sample1);
        }

        let compare2 = null;
        if (this.props.selectedSamples[1]) {
            const sample2 = this.props.selectedSamples[1];
            compare2 = sampleToCompare(sample2);
        }

        const fields = keys.map((key) => {
            const def = this.props.fieldDefinitions[key];
            return {
                key,
                label: def.label,
                type: def.type

            };
        });

        return {
            fields, compare1, compare2
        };
    }

    /*
    getMetadataComparison(): Comparison {
        const keys = [
            // 'name',
            // 'igsn',
            // 'parent_igsn',
            'release_date',
            'material',
            'field_name',
            'location_description',
            'locality_description',
            'collection_method',
            'purpose',
            'latitude',
            'longitude',
            'coordinate_precision?',
            'elevation_start',
            'elevation_unit',
            'navigation_type',
            'primary_physiographic_feature',
            'name_of_physiographic_feature',
            'field_program_cruise',
            'collector_chief_scientist',
            'collection_date',
            'collection_date_precision',
            'current_archive',
            'current_archive_contact',
            'related_identifiers',
            'relation_type'
        ],
        let compare1 = null;
        function getMetadataValue(metadata: Metadata, key: string) {
            const field = metadata[key];
            if (typeof field === 'undefined') {
                return;
            }
            return field.value;
        }
        function sampleToCompare(sample: MiniSample) {
            return {
                name: sample.name,
                igsn: sample.sourceId,
                parent_igsn: sample.sourceParentId,
                release_date: '?',
                material: getMetadataValue(sample.metadata, 'material'),
                field_name: getMetadataValue(sample.metadata, 'field_name'),
                location_description: getMetadataValue(sample.metadata, 'location_description'),
                locality_description: getMetadataValue(sample.metadata, 'locality_description'),
                purpose: getMetadataValue(sample.metadata, 'purpose'),
                latitude: getMetadataValue(sample.metadata, 'latitude'),
                longitude: getMetadataValue(sample.metadata, 'longitude'),
                'coordinate_precision?': getMetadataValue(sample.metadata, 'coordinate_precision?'),
                elevation_start: getMetadataValue(sample.metadata, 'elevation_start'),
                elevation_unit: getMetadataValue(sample.metadata, 'elevation_unit'),
                navigation_type: getMetadataValue(sample.metadata, 'navigation_type'),
                primary_physiographic_feature: getMetadataValue(sample.metadata, 'primary_physiographic_feature'),
                name_of_physiographic_feature: getMetadataValue(sample.metadata, 'name_of_physiographic_feature'),
                field_program_cruise: getMetadataValue(sample.metadata, 'field_program_cruise'),
                collector_chief_scientist: getMetadataValue(sample.metadata, 'collector_chief_scientist'),
                collection_date: getMetadataValue(sample.metadata, 'collection_date'),
                current_archive: getMetadataValue(sample.metadata, 'current_archive'),
                current_archive_contact: getMetadataValue(sample.metadata, 'current_archive_contact'),
                related_identifiers: getMetadataValue(sample.metadata, 'related_identifiers'),
                relation_type: getMetadataValue(sample.metadata, 'relation_type'),
            };
        }
        if (this.props.selectedSamples[0]) {
            const sample1 = this.props.selectedSamples[0];
            compare1 = sampleToCompare(sample1);
        }

        let compare2 = null;
        if (this.props.selectedSamples[1]) {
            const sample2 = this.props.selectedSamples[1];
            compare2 = sampleToCompare(sample2);
        }

        return {
            keys: 
            compare1, compare2
        };
    }
    */

    getUserMetadataComparison(): Comparison {
        let compare1 = null;
        if (this.props.selectedSamples[0]) {
            // const sample1 = this.props.selectedSamples[0];
            compare1 = {

            };
        }

        let compare2 = null;
        if (this.props.selectedSamples[1]) {
            // const sample1 = this.props.selectedSamples[1];
            compare2 = {

            };
        }

        return {
            fields: [

            ],
            compare1, compare2
        };
    }

    getComparison(): Comparison {
        switch (this.props.view) {
            case 'sample':
                return this.getSampleComparison();
            case 'metadata':
                return this.getMetadataComparison();
            case 'user_metadata':
                return this.getUserMetadataComparison();
        }
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
        const comparison = this.getComparison();

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
                    // label: comparison
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


        return <Table<ComparisonDataSourceItem> dataSource={diff}
            className="AntTable-FullHeight"
            rowKey="key"
            size="small"
            scroll={{ y: '100%' }}
            pagination={false}>

            <Table.Column
                title="Field"
                dataIndex="label"
                width="15em"
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
                render={(isDiff: boolean) => {
                    return isDiff ? this.renderNotEqual() : this.renderEqual();
                }} />

            <Table.Column
                title={this.props.selectedSamples[0] ? `Version ${this.props.selectedSamples[0].version}` : <i>Not selected</i>}
                dataIndex="compare1"
                key="compare1" />

            <Table.Column
                title={this.props.selectedSamples[1] ? `Version ${this.props.selectedSamples[1].version}` : <i>Not selected</i>}
                dataIndex="compare2"
                key="compare2" />


        </Table>;

        // return <table className="NiceTable">
        //     <thead>
        //         <tr>
        //             <th>Key</th>
        //             <th style={{ width: '40%' }}>Sample 1</th>
        //             <th style={{ width: '40%' }}>Sample 2</th>
        //         </tr>
        //     </thead>
        //     <tbody>
        //         {diff}
        //     </tbody>
        // </table>;
    }
    onViewChange(view: View) {
        this.setState({
            view
        });
    }
    // renderViewSelector() {
    //     return <ViewSelector view={this.props.view} changeView={this.onViewChange.bind(this)} />;
    //     // return <div className="-viewSelector">
    //     //     <Radio.Group
    //     //         value={this.state.view}
    //     //         onChange={this.onViewChange.bind(this)}>
    //     //         <Radio.Button value="sample">
    //     //             sample info
    //     //         </Radio.Button>

    //     //         <Radio.Button value="metadata">
    //     //             metadata
    //     //         </Radio.Button>

    //     //         <Radio.Button value="user_metadata">
    //     //             user metadata
    //     //         </Radio.Button>
    //     //     </Radio.Group>
    //     // </div>;
    // }
    render() {
        return <div className="Comparator">
            {this.renderComparison()}
        </div>;
    }
}