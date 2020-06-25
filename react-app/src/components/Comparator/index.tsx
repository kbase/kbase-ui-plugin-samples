import React from 'react';
import { PauseOutlined, LineOutlined } from '@ant-design/icons';

import { MiniSample } from '../History/data';
import { Metadata } from '../Main/data';
import { FieldDefinitionsMap } from '../../lib/comm/dynamicServices/SampleServiceClient';
import ComparisonView from './view';

import './style.less';

export type DiffState = 'diff' | 'nodiff';

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

export interface ComparisonDataSourceItem {
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
            console.log('get metadata comparison', key, def);
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

        return <ComparisonView comparison={comparison} diffStatus={this.props.diffStatus} />;
    }
    onViewChange(view: View) {
        this.setState({
            view
        });
    }

    render() {
        return <div className="Comparator" style={{ position: 'relative' }}>
            {this.renderComparison()}
        </div>;
    }
}