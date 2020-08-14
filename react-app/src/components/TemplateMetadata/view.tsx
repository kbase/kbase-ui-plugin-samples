import React from 'react';
import { Table, Tooltip } from 'antd';

import { LinkOutlined } from '@ant-design/icons';

import { Sample } from '../Main/types';

import {
    Template, FieldDefinitionsMap, TemplateDefinition
} from '../../lib/Model';
import { TemplateDataSource2 } from './types';

export interface TemplateMetadataProps {
    sample: Sample;
    template: Template;
    definition: TemplateDefinition;
    fields: FieldDefinitionsMap;
}

interface TemplateMetadataState {
}

export default class TemplateMetadata extends React.Component<TemplateMetadataProps, TemplateMetadataState> {
    renderNoData() {
        return <div style={{
            fontStyle: 'italic',
            color: 'silver'
        }}>-</div>;
    }

    renderHeader() {
        return <div className="Row" style={{ marginBottom: '10px' }}>
            <div className="Col">
                <div className="InfoTable">
                    <div>
                        <div>
                            ID
                        </div>
                        <div>
                            {this.props.definition.id}
                        </div>
                    </div>
                    <div>
                        <div>
                            Name
                        </div>
                        <div>
                            {this.props.definition.name}
                        </div>
                    </div>
                </div>
            </div>
            <div className="Col -span1">
                <div className="InfoTable">
                    <div>
                        <div>
                            Description
                        </div>
                        <div>
                            {this.props.definition.description}
                        </div>
                    </div>
                    <div>
                        <div>
                            Link
                        </div>
                        <div>
                            <a href={this.props.definition.reference}
                                target="_blank"
                                rel="noopener noreferrer">
                                <LinkOutlined />{' '}
                                {this.props.definition.reference}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }

    renderTemplate() {
        const sample = this.props.sample;
        const dataSource: Array<TemplateDataSource2> = this.props.template.columns.map((column, index) => {
            const field = this.props.fields[column];
            const value = (() => {
                switch (field.kind) {
                    case 'registration':
                        switch (column) {
                            case 'name':
                                return sample.name;
                            case 'source_id':
                                return sample.sourceId.id;
                            case 'source_parent_id':
                                return sample.sourceParentId ? sample.sourceParentId.id : null;
                            default:
                                throw new Error(`Unrecognized sample key ${column}`);
                        }
                    case 'descriptive':
                        const metadataColumn = sample.metadata[column];
                        if (!metadataColumn) {
                            return null;
                        }
                        return metadataColumn.value;
                    default:
                        throw new Error(`Unrecognized metadata key ${column}`);
                }
            })();
            return {
                column,
                label: field.label,
                isMissing: false,
                order: index,
                type: null,
                value
            };
        });

        return <Table<TemplateDataSource2>
            dataSource={dataSource}
            rowKey="column"
            className="AntTable-FullHeight"
            size="small"
            scroll={{ y: '100%' }}
            pagination={false}
            showSorterTooltip={false}
        >
            <Table.Column dataIndex="order"
                key="order"
                title="Order"
                width="5em"
                sorter={(a: TemplateDataSource2, b: TemplateDataSource2) => {
                    return a.order - b.order;
                }}
            />
            <Table.Column dataIndex="label"
                key="label"
                title="Column"
                width="20em"
                sorter={(a: TemplateDataSource2, b: TemplateDataSource2) => {
                    return a.label.localeCompare(b.label);
                }}
                render={(label: string, row: TemplateDataSource2) => {
                    if (row.isMissing) {
                        return <Tooltip title="No mapping found for this key">
                            <span style={{ color: 'gray' }}>
                                {label}
                            </span>
                        </Tooltip>;
                    }
                    // TODO: add description to tooltip below
                    return <Tooltip title="Description here..."><span>
                        {label}
                    </span>
                    </Tooltip>;
                }}
            />

            <Table.Column
                dataIndex="value"
                key="value"
                title="Value"
                render={(value: string | number | null, row: TemplateDataSource2) => {
                    if (value === null) {
                        return this.renderNoData();
                    }
                    return value;
                }}
            />

        </Table>;
    }

    render() {
        return <div className="Col -stretch">
            <div className="Col -auto">
                {this.renderHeader()}
            </div>
            <div className="Col -stretch">
                {this.renderTemplate()}
            </div>
        </div>;
    }
}
