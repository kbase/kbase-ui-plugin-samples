import React from 'react';
import { Table, Tooltip } from 'antd';
import { Sample } from './data';

export interface TemplateMetadataProps {
    sample: Sample;
}

interface TemplateMetadataState {

}

export interface WrappedMetadataValue {
    type: string,
    label: string,
    value: string;
}


export interface TemplateDataSource {
    order: number;
    key: string;
    type: string | null;
    value: string | null;
    // value: string | number | boolean | null;
    // units: string | null;
    isMissing: boolean;
}

export interface TemplateDataSource2 {
    order: number;
    column: string;
    type: string | null;
    value: string | null;
    // value: string | number | boolean | null;
    // units: string | null;
    isMissing: boolean;
}

export interface SpreadsheetFieldDefinition {
    order: number;
    column: string;
    label: string;
    key?: string;
    metadataKey?: string;
    userMetadataColumn?: string;
}

export interface SpreadsheetFieldParams {
    order: number;
    column: string;
    // sample: Sample;
}
abstract class SpreadsheetField {
    order: number;
    column: string;
    // sample: Sample;
    // value: string | null;
    // static column: string;
    constructor({ order, column }: SpreadsheetFieldParams) {
        this.order = order;
        this.column = column;
        // this.sample = sample;
        // this.value = this.extractValueFromSample();
    }
    abstract extractValue(sample: Sample): string | null;
}

export class NameField extends SpreadsheetField {
    // static column = 'Name';
    extractValue(sample: Sample) {
        return sample.name;
    }
}

export class IGSNField extends SpreadsheetField {
    // static column = 'IGSN';
    extractValue(sample: Sample) {
        return sample.sourceId;
    }
}

export class ParentIGSNField extends SpreadsheetField {
    // static column = 'Parent IGSN';
    extractValue(sample: Sample) {
        return sample.sourceParentId;
    }
}

export class ReleaseDateField extends SpreadsheetField {
    // column = 'Release date';
    extractValue(sample: Sample) {
        const metadataField = sample.metadata['release_date'];
        if (!metadataField) {
            return null;
        }
        return String(metadataField.value);
    }
}

export class MaterialField extends SpreadsheetField {
    // column = 'Release date';
    extractValue(sample: Sample) {
        const metadataField = sample.metadata['material'];
        if (!metadataField) {
            return null;
        }
        return String(metadataField.value);
    }
}

export class FieldNameField extends SpreadsheetField {
    // column = 'Release date';
    extractValue(sample: Sample) {
        const metadataField = sample.metadata['field_name'];
        if (!metadataField) {
            return null;
        }
        return String(metadataField.value);
    }
}

export class LocationDescriptionField extends SpreadsheetField {
    extractValue(sample: Sample) {
        const metadataField = sample.metadata['location_description'];
        if (!metadataField) {
            return null;
        }
        return String(metadataField.value);
    }
}

export class MetadataField extends SpreadsheetField {
    key: string;
    constructor({ order, column, key }: { order: number, column: string, key: string; }) {
        super({ order, column });
        this.key = key;
    }
    extractValue(sample: Sample) {
        const metadataField = sample.metadata[this.key];
        if (!metadataField) {
            return null;
        }
        return String(metadataField.value);
    }
}

const spreadsheetDefinition: Array<SpreadsheetField> = [
    new NameField({
        column: 'Name',
        order: 1
    }),
    new IGSNField({
        column: 'IGSN',
        order: 2
    }),
    new ParentIGSNField({
        column: 'Parent IGSN',
        order: 3
    }),
    new ReleaseDateField({
        column: 'Release date',
        order: 4
    }),
    new MaterialField({
        column: 'Material',
        order: 5
    }),
    new FieldNameField({
        column: 'Field name (informal classification)',
        order: 6
    }),
    new LocationDescriptionField({
        column: 'Location Description',
        order: 7
    }),
    new MetadataField({
        column: 'Locality Description',
        order: 8,
        key: 'locality_description'
    }),
    new MetadataField({
        column: 'Collection method',
        order: 9,
        key: 'collection_method'
    }),
    new MetadataField({
        column: 'Purpose',
        order: 10,
        key: 'purpose'
    }),
    new MetadataField({
        column: 'Latitude',
        order: 11,
        key: 'latitude'
    }),
    new MetadataField({
        column: 'Longitude',
        order: 12,
        key: 'longitude'
    }),
    new MetadataField({
        column: 'Coordinate Precision?',
        order: 13,
        key: 'coordinate_precision?'
    }),
    new MetadataField({
        column: 'Elevation start',
        order: 14,
        key: 'elevation_start'
    }),
    new MetadataField({
        column: 'Elevation unit',
        order: 15,
        key: 'elevation_unit'
    }),
    new MetadataField({
        column: 'Navigation type',
        order: 16,
        key: 'navigation_type'
    }),
    new MetadataField({
        column: 'Primary physiographic feature',
        order: 17,
        key: 'primary_physiographic_feature'
    }),
    new MetadataField({
        column: 'Name of physiographic feature',
        order: 18,
        key: 'name_of_physiographic_feature'
    }),
    new MetadataField({
        column: 'Field program/cruise',
        order: 19,
        key: 'field_program_cruise'
    }),
    new MetadataField({
        column: 'Collector/Chief Scientist',
        order: 20,
        key: 'collector_chief_scientist'
    }),
    new MetadataField({
        column: 'Collection date',
        order: 21,
        key: 'collection_date'
    }),
    new MetadataField({
        column: 'Collection date precision',
        order: 22,
        key: 'collection_date_precision'
    }),
    new MetadataField({
        column: 'Current archive',
        order: 23,
        key: 'current_archive'
    }),
    new MetadataField({
        column: 'Current archive contact',
        order: 24,
        key: 'current_archive_contact'
    }),
    new MetadataField({
        column: 'Related Identifiers',
        order: 25,
        key: 'related_identifiers'
    }),
    new MetadataField({
        column: 'Relation Type',
        order: 26,
        key: 'relation_type'
    })
];

const spreadsheetView = [
    'name',
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
        const dataSource: Array<TemplateDataSource2> = [];

        // spreadsheetDefinition.forEach(({ order, column, label, key, metadataKey, userMetadataColumn }) => {
        //     let value;
        //     if (key) {
        //         value = sample[key];
        //     } else if {

        //     }
        //     dataSource.push({
        //         order,
        //         column,

        //     })
        // });

        spreadsheetDefinition.forEach((field) => {
            dataSource.push({
                column: field.column,
                isMissing: false,
                order: field.order,
                type: null,
                value: field.extractValue(sample)
            });
        });

        // const controlledMetadata = Object.entries(sample.metadata).map(([k, v]) => {
        //     const x: [string, WrappedMetadataValue] = [k, {
        //         type: 'Controlled',
        //         label: v.label,
        //         value: String(v.value)
        //     }];
        //     return x;
        // });

        // const userMetadata = Object.entries(sample.userMetadata).map(([k, v]) => {
        //     const x: [string, WrappedMetadataValue] = [k, {
        //         type: 'User',
        //         label: k,
        //         value: v.value
        //     }];
        //     return x;
        // });

        // const metadata = controlledMetadata.concat(userMetadata);
        // const metaDb = new Map<string, WrappedMetadataValue>(metadata);


        // spreadsheetView.forEach((key, order) => {
        //     const field = metaDb.get(key);
        //     if (!field) {
        //         dataSource.push({
        //             order,
        //             key,
        //             type: null,
        //             value: null,
        //             isMissing: true
        //         });
        //         return;
        //     }

        //     dataSource.push({
        //         order,
        //         key: field.label,
        //         type: field.type,
        //         value: field.value,
        //         isMissing: false
        //     });
        // });
        /*
         <Table.Column
                dataIndex="type"
                key="type"
                title="Type"
                width="10em"
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
            */

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
            <Table.Column dataIndex="column"
                key="column"
                title="Column"
                width="20em"
                sorter={(a: TemplateDataSource2, b: TemplateDataSource2) => {
                    return a.column.localeCompare(b.column);
                }}
                render={(column: string, row: TemplateDataSource2) => {
                    if (row.isMissing) {
                        return <Tooltip title="No mapping found for this key">
                            <span style={{ color: 'gray' }}>
                                {column}
                            </span>
                        </Tooltip>;
                    }
                    // TODO: add description to tooltip below
                    return <Tooltip title="Description here..."><span>
                        {column}
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

    renderx() {
        const sample = this.props.sample;
        const controlledMetadata = Object.entries(sample.metadata).map(([k, v]) => {
            const x: [string, WrappedMetadataValue] = [k, {
                type: 'Controlled',
                label: v.label,
                value: String(v.value)
            }];
            return x;
        });

        const userMetadata = Object.entries(sample.userMetadata).map(([k, v]) => {
            const x: [string, WrappedMetadataValue] = [k, {
                type: 'User',
                label: k,
                value: v.value
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
                    isMissing: true
                });
                return;
            }

            dataSource.push({
                order,
                key: field.label,
                type: field.type,
                value: field.value,
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
            showSorterTooltip={false}
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
                width="10em"
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

        </Table>;
    }
}