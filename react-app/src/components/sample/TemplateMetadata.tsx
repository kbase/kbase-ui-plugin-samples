import React from 'react';
import { SampleNode, MetadataValue } from '../../lib/comm/dynamicServices/SampleServiceClient';
import { TemplateDataSource } from './view';
import { Table } from 'antd';

export interface TemplateMetadataProps {
    sampleNode: SampleNode;
}

interface TemplateMetadataState {

}

export interface WrappedMetadataValue {
    type: string,
    field: MetadataValue;
}

const spreadsheetView = [
    'Sample Name',
    'IGSN',
    'Parent IGSN',
    'Release date',
    'Material',
    'Field name(informal classification)',
    'Location Description',
    'Locality Description',
    'Collection method',
    'Purpose',
    'Latitude',
    'Longitude',
    'Coordinate Precision?',
    'Elevation start',
    'Elevation unit',
    'Navigation type',
    'Primary physiographic feature',
    'Name of physiographic feature',
    'Field program/cruise',
    'Collector/Chief Scientist',
    'Collection date',
    'Collection date precision',
    'Current archive',
    'Current archive contact',
    'Related Identifiers',
    'Relation Type'
];

export default class TemplateMetadata extends React.Component<TemplateMetadataProps, TemplateMetadataState> {
    renderNoData() {
        return <div style={{
            fontStyle: 'italic',
            color: 'silver'
        }}>-</div>;
    }

    render() {
        const sample = this.props.sampleNode;
        const controlledMetadata = Object.entries(sample.meta_controlled).map(([k, v]) => {
            const x: [string, WrappedMetadataValue] = [k, {
                type: 'Controlled',
                field: v
            }];
            return x;
        });

        const userMetadata = Object.entries(sample.meta_user).map(([k, v]) => {
            const x: [string, WrappedMetadataValue] = [k, {
                type: 'User',
                field: v
            }];
            return x;
        });

        const metadata = controlledMetadata.concat(userMetadata);
        const metaDb = new Map<string, WrappedMetadataValue>(metadata);

        const dataSource: Array<TemplateDataSource> = [];
        spreadsheetView.forEach((key, order) => {
            const field = metaDb.get(key);
            if (!field) {
                dataSource.push({
                    order,
                    key,
                    type: null,
                    value: null,
                    units: null
                });
                return;
            }

            dataSource.push({
                order,
                key,
                type: field.type,
                value: field.field.value,
                units: field.field.units
            });
        });

        return <Table<TemplateDataSource>
            dataSource={dataSource}
            rowKey="key"
            className="AntTable-FullHeight"
            size="small"
            scroll={{ y: '100%' }}
            pagination={false}
        >
            <Table.Column dataIndex="order"
                key="order"
                title="Order"
                width="5em"
                sorter={(a: TemplateDataSource, b: TemplateDataSource) => {
                    return a.order - b.order;
                }}
            />
            <Table.Column dataIndex="key"
                key="key"
                title="Field"
                width="20em"
                sorter={(a: TemplateDataSource, b: TemplateDataSource) => {
                    return a.key.localeCompare(b.key);
                }}
            />
            <Table.Column
                dataIndex="type"
                key="type"
                title="Type"
                width="5em"
                sorter={(a: TemplateDataSource, b: TemplateDataSource) => {
                    if (a.type === null) {
                        return -1;
                    }
                    if (b.type === null) {
                        return 1;
                    }
                    return a.type.localeCompare(b.type);
                }}
                render={(type: string | null, row: TemplateDataSource) => {
                    if (type === null) {
                        return this.renderNoData();
                    }
                    return type;
                }}
            />
            <Table.Column
                dataIndex="value"
                key="value"
                title="Value"
                render={(value: string | number | null, row: TemplateDataSource) => {
                    if (value === null) {
                        return this.renderNoData();
                    }
                    return value;
                }}
            />
            <Table.Column
                dataIndex="units"
                key="units"
                title="Units"
                width="5em"
                render={(units: string | null, row: TemplateDataSource) => {
                    if (!units) {
                        return this.renderNoData();
                    }
                    return units;
                }}
            />
        </Table>;
    }
}