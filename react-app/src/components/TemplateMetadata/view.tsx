import React from 'react';
import { Button, Table, Tooltip } from 'antd';
import { Sample, Template } from '../Main/types';
import { TemplateDataSource2 } from './types';
import { NoData } from '../NoData';
// import { FieldStringValue, FieldValue } from 'lib/client/samples/Samples';
import { MetadataField } from '../../lib/Model';
import MetadataFieldView from '../MetadataField';
import { Section } from '../Section';

export interface TemplateMetadataProps {
    sample: Sample;
    // format: Format;
    template: Template;
    // template: Template;
    // definition: TemplateDefinition;
    // fields: FieldDefinitionsMap;
}

interface TemplateMetadataState {
    omitEmpty: boolean;
}

export default class TemplateMetadata extends React.Component<TemplateMetadataProps, TemplateMetadataState> {
    constructor(props: TemplateMetadataProps) {
        super(props);
        this.state = {
            omitEmpty: false
        };
    }
    renderNoData() {
        return <div style={{
            fontStyle: 'italic',
            color: 'silver'
        }}><NoData /></div>;
    }

    /*
    <div className="Col -span1">
                <div className="InfoTable">
                    <div>
                        <div>
                            Description
                        </div>
                        <div>
                            {this.props.sample.format.source.title}
                        </div>
                    </div>
                    <div>
                        <div>
                            Link
                        </div>
                        <div>
                            <a href={this.props.sample.format.source.url}
                                target="_blank"
                                rel="noopener noreferrer">
                                <LinkOutlined />{' '}
                                {this.props.sample.format.source.url}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
    */

    renderHeader() {
        return <div className="Row" style={{ marginBottom: '10px' }}>
            <div className="Col">
                <div className="InfoTable">
                    <div>
                        <div>
                            ID
                        </div>
                        <div>
                            {this.props.sample.sampleId}
                        </div>
                    </div>
                    <div>
                        <div>
                            Name
                        </div>
                        <div>
                            {this.props.sample.name}
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }

    renderMetadata() {
        const dataSource: Array<TemplateDataSource2> = this.props.sample.metadata
            .filter((metadataField) => {
                if (metadataField.type === 'controlled') {
                    if (metadataField.field.isEmpty) {
                        if (this.state.omitEmpty) {
                            return false;
                        }
                    }
                }
                return true;
            })
            .map((metadataField, index) => {
                // const value = (() => {
                //     if (templateField.type === 'metadata') {
                //         return this.props.sample.metadata[templateField.key].field.value;
                //     } else {
                //         return this.props.sample.userMetadata[templateField.label];
                //     }
                // })();

                const label = metadataField.label;

                // const label = (() => {
                //     if (metadataField.type === 'metadata') {
                //         return metadataField.label;
                //     } else {
                //         return templateField.label;
                //     }
                // })();

                // TOODO: not sure worth showing?
                const type = (() => {
                    if (metadataField.type === 'controlled') {
                        return metadataField.field.type;
                    } else {
                        return 'string';
                    }
                })();

                const key = metadataField.key;

                // const key = (() => {
                //     if (metadataField.type === 'controlled') {
                //         return this.props.sample.metadata[templateField.key].key;
                //     } else {
                //         return templateField.label;
                //     }
                // })();

                const isMissing = (() => {
                    if (metadataField.type === 'controlled') {
                        return metadataField.field.isEmpty;
                    } else {
                        return metadataField.field === "" ? true :  false
                    }
                })();

                /**
                 * leaving off here:
                 * need to wrap the metadata (controlled) or user field into
                 * a generic MetadataField which can be used in a combined view
                 * of controlled and user metadata.
                 */
                // const field: MetadataField = (() => {
                //     if (templateField.type === 'metadata') {
                //         return this.props.sample.metadata[templateField.key];
                //     } else {
                //         return {
                //             key: templateField.label,
                //             label: templateField.label,
                //             field: {
                //                 constraints: {},
                //                 storageType: 'string',
                //                 type: 'string',
                //                 value: this.props.sample.userMetadata[templateField.label]
                //             } as FieldValueString
                //         } as MetadataField;
                //     }
                // })();

                // const field: TemplateField = (() => {
                //     if (templateField.type === 'metadata') {
                //         return {
                //             type: 'metadata',
                //             field: this.props.sample.metadata[templateField.key].field
                //         }
                //     } else {
                //         return {
                //             type: 'user',
                //             field: this.props.sample.userMetadata[templateField.label]
                //         }
                //     }
                // })();

                if (metadataField.type === 'controlled') {
                    return {
                        key,
                        label,
                        isMissing,
                        order: index,
                        type,
                        // value,
                        fieldType: 'controlled',
                        field: metadataField
                    };
                } else {
                    return {
                        key,
                        label,
                        isMissing,
                        order: index,
                        type,
                        // value,
                        fieldType: 'user',
                        field: metadataField
                    };
                }

                // return {
                //     key,
                //     label,
                //     isMissing,
                //     order: index,
                //     type,
                //     // value,
                //     fieldType: templateField.type,
                //     field
                // };
            });

        return <Table<TemplateDataSource2>
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
                sorter={(a: TemplateDataSource2, b: TemplateDataSource2) => {
                    return a.order - b.order;
                }}
            />

            <Table.Column dataIndex="fieldType"
                key="fieldType"
                title="Field Type"
                width="8em"
                sorter={(a: TemplateDataSource2, b: TemplateDataSource2) => {
                    return a.fieldType.localeCompare(b.fieldType);
                }}
                render={(fieldType: string, row: TemplateDataSource2) => {
                    if (row.isMissing) {
                        return <Tooltip title="No mapping found for this key">
                            <span style={{ color: 'gray' }}>
                                {fieldType}
                            </span>
                        </Tooltip>;
                    } else {
                        return <span>
                            {fieldType}
                        </span>;
                    }
                }}
            />

            <Table.Column dataIndex="type"
                key="type"
                title="Data Type"
                width="8em"
                sorter={(a: TemplateDataSource2, b: TemplateDataSource2) => {
                    return a.type.localeCompare(b.type);
                }}
                render={(type: string, row: TemplateDataSource2) => {
                    if (row.isMissing) {
                        return <Tooltip title="No mapping found for this key">
                            <span style={{ color: 'gray' }}>
                                {type}
                            </span>
                        </Tooltip>;
                    } else {
                        return <span>
                            {type}
                        </span>;
                    }
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
                dataIndex="field"
                key="field"
                title="Value"
                render={(field: MetadataField, row: TemplateDataSource2) => {
                    return <MetadataFieldView field={field} sample={this.props.sample} />;
                }}
            />
        </Table>;
    }

    // onChangeHideEmpty(ev: CheckboxChangeEvent) {
    //     const omitEmpty = ev.target.checked;
    //     this.setState({
    //         omitEmpty
    //     });
    // }

    // renderToolbar() {
    //     return <div className="Metadata-toolbar">
    //         <Checkbox onChange={this.onChangeHideEmpty.bind(this)} checked={this.state.omitEmpty}>Hide Empty Fields</Checkbox>
    //     </div>;
    // }

    onToggleHideEmpty() {
        this.setState({
            omitEmpty: !this.state.omitEmpty
        });
    }

    renderToolbar() {
        const label = (() => {
            if (this.state.omitEmpty) {
                return 'Show Empty Fields';
            } else {
                return 'Hide Empty Fields';
            }
        })();
        return <div className="Metadata-toolbar">
            <Button onClick={this.onToggleHideEmpty.bind(this)} type="text" size="small">{label}</Button>
        </div>;
    }

    render() {
        /*
         <div className="Col -auto">
                {this.renderHeader()}
            </div>
        */
        return <div className="Col -stretch">
            <Section title="Sample" renderToolbar={this.renderToolbar.bind(this)}>
                {this.renderMetadata()}
            </Section>
        </div>;
    }
}
