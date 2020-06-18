import React from 'react';
import { MiniSample } from './data';
import './Comparator.css';
import { Radio, Table, Tooltip } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { Metadata } from '../sample/data';
import { PauseOutlined, LineOutlined } from '@ant-design/icons';

export interface ComparisonItem {
    [key: string]: any;
}
export interface Comparison {
    keys: Array<string>;
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

export interface ComparatorProps {
    selectedSamples: Array<MiniSample>;
}

type View = 'sample' | 'metadata' | 'user_metadata';
interface ComparatorState {
    view: View;
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
            keys: [
                'type', 'name', 'version', 'savedAt', 'savedBy', 'source', 'sourceId', 'sourceParentId'
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

        return {
            keys, compare1, compare2
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
            keys: [

            ],
            compare1, compare2
        };
    }

    getComparison(): Comparison {
        switch (this.state.view) {
            case 'sample':
                return this.getSampleComparison();
            case 'metadata':
                return this.getMetadataComparison();
            case 'user_metadata':
                return this.getUserMetadataComparison();
        }
    }

    renderNotEqual() {
        return <div style={{ position: 'relative', color: 'red' }}>
            <div style={{ position: 'absolute', top: '0', right: '0', bottom: '0', left: '0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <PauseOutlined rotate={90} />
            </div>
            <div style={{ position: 'absolute', top: '0', right: '0', bottom: '0', left: '0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '150%' }}>
                <LineOutlined rotate={315} />
            </div>
        </div>;
    }

    renderEqual() {
        return <div style={{ position: 'relative', color: 'gray' }}>
            <div style={{ position: 'absolute', top: '0', right: '0', bottom: '0', left: '0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <PauseOutlined rotate={90} />
            </div>
        </div>;
    }

    renderComparison() {
        const comparison = this.getComparison();

        const diff = comparison.keys.map((key) => {
            const isDiff = (() => {
                if (comparison.compare1) {
                    if (comparison.compare2) {
                        return (comparison.compare1[key] !== comparison.compare2[key]);
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
                key,
                isDiff,
                compare1: comparison.compare1 ? comparison.compare1[key] : null,
                compare2: comparison.compare2 ? comparison.compare2[key] : null
            };
        });

        return <Table dataSource={diff}
            className="AntTable-FullHeight"
            rowKey="key"
            size="small"
            scroll={{ y: '100%' }}
            pagination={false}>

            <Table.Column
                title="Key"
                dataIndex="key"
                width="15em"
                ellipsis
                key="key"
                render={(key: string) => {
                    return <Tooltip title={key}>
                        <span>{key}</span>
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
    onViewChange(e: RadioChangeEvent) {
        this.setState({
            view: e.target.value
        });
    }
    renderViewSelector() {
        return <div className="-viewSelector">
            <Radio.Group
                value={this.state.view}
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
    render() {
        return <div className="Comparator">
            {this.renderViewSelector()}
            {this.renderComparison()}
        </div>;
    }
}