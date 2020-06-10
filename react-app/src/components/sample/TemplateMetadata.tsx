import React from 'react';
import { TemplateDataSource } from './view';
import { Table, Tooltip } from 'antd';
import { Sample, MetadataValue } from './data';

export interface TemplateMetadataProps {
    sample: Sample;
}

interface TemplateMetadataState {

}

export interface WrappedMetadataValue {
    type: string,
    field: MetadataValue;
}

const spreadsheetView = [
    'sample_name',
    'IGSN',
    'Parent IGSN',
    'Release date',
    'material',
    'Field name(informal classification)',
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
    'Related Identifiers',
    'Relation Type'
];

// const spreadsheetView = [
//     'Sample Name',
//     'IGSN',
//     'Parent IGSN',
//     'Release date',
//     'Material',
//     'Field name(informal classification)',
//     'Location Description',
//     'Locality Description',
//     'Collection method',
//     'Purpose',
//     'Latitude',
//     'Longitude',
//     'Coordinate Precision?',
//     'Elevation start',
//     'Elevation unit',
//     'Navigation type',
//     'Primary physiographic feature',
//     'Name of physiographic feature',
//     'Field program/cruise',
//     'Collector/Chief Scientist',
//     'Collection date',
//     'Collection date precision',
//     'Current archive',
//     'Current archive contact',
//     'Related Identifiers',
//     'Relation Type'
// ];

export default class TemplateMetadata extends React.Component<TemplateMetadataProps, TemplateMetadataState> {
    renderNoData() {
        return <div style={{
            fontStyle: 'italic',
            color: 'silver'
        }}>-</div>;
    }

    render() {
        const sample = this.props.sample;
        const controlledMetadata = Object.entries(sample.controlledMetadata).map(([k, v]) => {
            const x: [string, WrappedMetadataValue] = [k, {
                type: 'Controlled',
                field: v
            }];
            return x;
        });

        const userMetadata = Object.entries(sample.userMetadata).map(([k, v]) => {
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
                    units: null,
                    isMissing: true
                });
                return;
            }

            dataSource.push({
                order,
                key: field.field.label,
                type: field.type,
                value: field.field.value,
                units: field.field.units || 'n/a',
                isMissing: false
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
                render={(key: string, row: TemplateDataSource) => {
                    if (row.isMissing) {
                        return <Tooltip title="No mapping found for this key">
                            <label style={{ color: 'gray' }}>
                                {key}
                            </label>
                        </Tooltip>;
                    }
                    return <label>
                        {key}
                    </label>;
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