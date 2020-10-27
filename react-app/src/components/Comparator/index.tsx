import React from 'react';
import { PauseOutlined, LineOutlined } from '@ant-design/icons';

import { MiniSample } from '../History/data';
import { Metadata } from '../../lib/Model';
import ComparisonView from './view';

import './style.less';
import { Template, TemplateField } from '../Main/types';
import { Format, FormatFieldType } from '../../lib/comm/dynamicServices/SampleServiceClient';

export type DiffState = 'diff' | 'nodiff';

export interface ComparisonItem {
    [key: string]: any;
}
export interface Field {
    key: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'enum<string>' | 'controlled_list';
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
    // fieldDefinitions: FieldDefinitionsMap;
    template: Template;
    format: Format;
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
                // source: sample.source,
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
                    type: 'number',
                }, {
                    key: 'savedAt',
                    label: 'Saved At',
                    type: 'string'
                }, {
                    key: 'savedBy',
                    label: 'Saved By',
                    type: 'string',
                }, {
                    key: 'format',
                    label: 'Format',
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
        const getMetadataValue = (metadata: Metadata, key: string) => {
            const field = metadata[key];
            if (typeof field === 'undefined') {
                return;
            }
            return field.value;
        };
        const sampleToCompare = (sample: MiniSample) => {
            return this.props.template.fields.reduce<ComparisonItem>((compare: ComparisonItem, field: TemplateField) => {
                if (field.type === 'user') {
                    return compare;
                }
                compare[field.key] = getMetadataValue(sample.metadata, field.key);
                return compare;
            }, {});

        };
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

        const fields = this.props.template.fields
            .reduce<Array<Field>>((fields, templateField) => {
                if (templateField.type === 'user') {
                    return fields;
                }

                const field = this.props.format.field_definitions[templateField.key];

                fields.push({
                    key: templateField.key,
                    label: field.label,
                    type: field.type
                });
                return fields;
            }, []);

        return {
            fields, compare1, compare2
        };
    }

    getUserMetadataComparison(): Comparison {
        // gather all keys.

        const keys1 = this.props.selectedSamples[0] ? Object.keys(this.props.selectedSamples[0].userMetadata) : [];
        const keys2 = this.props.selectedSamples[1] ? Object.keys(this.props.selectedSamples[1].userMetadata) : [];
        const allKeys = keys1.concat(keys2).sort();

        const sampleToCompare = (sample: MiniSample) => {
            return this.props.template.fields.reduce<ComparisonItem>((compare: ComparisonItem, field: TemplateField) => {
                if (field.type !== 'user') {
                    return compare;
                }
                compare[field.label] = sample.userMetadata[field.label];
                return compare;
            }, {});

        };

        let compare1 = null;
        if (this.props.selectedSamples[0]) {
            compare1 = sampleToCompare(this.props.selectedSamples[0]);
        }

        let compare2 = null;
        if (this.props.selectedSamples[1]) {
            compare2 = sampleToCompare(this.props.selectedSamples[1]);
        }

        console.log('compare?', compare1, compare2);

        const fields = allKeys.map<{ key: string, label: string, type: FormatFieldType; }>((key) => {
            return {
                key,
                label: key,
                type: 'string'
            };
        });

        return {
            fields,
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