import React from 'react';
import { Button, Table, Tooltip } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { Sample, Template } from '../Main/types';
import { TemplateDataSource2 } from './types';
import { NoData } from '../NoData';

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
        </div>;
    }

    renderTemplate() {
        const dataSource: Array<TemplateDataSource2> = this.props.template.fields
            .filter((templateField) => {
                if (templateField.type === 'metadata') {
                    if (this.props.sample.metadata[templateField.key].value === null) {
                        if (this.state.omitEmpty) {
                            return false;
                        }
                    }
                }
                return true;
            })
            .map((templateField, index) => {
                const value = (() => {
                    if (templateField.type === 'metadata') {
                        return this.props.sample.metadata[templateField.key].value;
                    } else {
                        return this.props.sample.userMetadata[templateField.label];
                    }
                })();

                const label = (() => {
                    if (templateField.type === 'metadata') {
                        return this.props.sample.metadata[templateField.key].label;
                    } else {
                        return templateField.label;
                    }
                })();

                const type = (() => {
                    if (templateField.type === 'metadata') {
                        return this.props.sample.metadata[templateField.key].definition.type;
                    } else {
                        return 'string';
                    }
                })();

                const key = (() => {
                    if (templateField.type === 'metadata') {
                        return this.props.sample.metadata[templateField.key].key;
                    } else {
                        return templateField.label;
                    }
                })();

                return {
                    column: key,
                    label,
                    isMissing: value === null,
                    order: index,
                    type,
                    value,
                    fieldType: templateField.type
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
            <Button onClick={this.onToggleHideEmpty.bind(this)}>{label}</Button>
        </div>;
    }


    render() {
        /*
         <div className="Col -auto">
                {this.renderHeader()}
            </div>
        */
        return <div className="Col -stretch">
            <div className="Col" style={{ flex: '0 0 auto' }}>
                {this.renderToolbar()}
            </div>
            <div className="Col -stretch">
                {this.renderTemplate()}
            </div>
        </div>;
    }
}
