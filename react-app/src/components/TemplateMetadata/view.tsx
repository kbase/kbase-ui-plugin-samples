import React from 'react';
import {Button, Switch, Table, Tooltip} from 'antd';
import {TemplateDataSource2} from './types';
import {MetadataField} from '../../lib/ViewModel/ViewModel';
import MetadataFieldView from '../MetadataField/view';
import {Sample, Template} from 'lib/ViewModel/ViewModel';
import {NoData, Section} from '@kbase/ui-components';

export interface TemplateMetadataProps {
    sample: Sample;
    template: Template;
}

interface TemplateMetadataState {
    omitEmpty: boolean;
    hasEmpty: boolean;
    emptyFieldCount: number;
    dataSource: Array<TemplateDataSource2>;
}

export default class TemplateMetadata extends React.Component<TemplateMetadataProps, TemplateMetadataState> {
    constructor(props: TemplateMetadataProps) {
        super(props);
        this.state = {
            omitEmpty: true,
            hasEmpty: this.hasEmptyFields(),
            dataSource: [],
            emptyFieldCount: this.emptyFieldCount()
        };
    }

    componentDidMount() {
        this.updateDataSource();
    }

    componentDidUpdate(prevProps: TemplateMetadataProps, prevState: TemplateMetadataState) {
        if (prevState.omitEmpty === this.state.omitEmpty) {
            return;
        }
        this.updateDataSource();
    }

    renderNoData() {
        return <div style={{
            fontStyle: 'italic',
            color: 'silver'
        }}><NoData/></div>;
    }

    renderHeader() {
        return <div className="Row" style={{marginBottom: '10px'}}>
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

    updateDataSource() {
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
                const label = metadataField.label;

                // TODO: not sure worth showing?
                const type = (() => {
                    if (metadataField.type === 'controlled') {
                        return metadataField.field.type;
                    } else {
                        return 'string';
                    }
                })();

                const key = metadataField.key;

                const isMissing = (() => {
                    if (metadataField.type === 'controlled') {
                        return metadataField.field.isEmpty;
                    } else {
                        return metadataField.field === ""
                    }
                })();

                /**
                 * leaving off here:
                 * need to wrap the metadata (controlled) or user field into
                 * a generic MetadataField which can be used in a combined view
                 * of controlled and user metadata.
                 */

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
            });
        this.setState({
            dataSource
        });
    }

    renderMetadata() {
        return <Table<TemplateDataSource2>
            dataSource={this.state.dataSource}
            rowKey="key"
            className="AntTable-FullHeight"
            size="small"
            scroll={{y: '100%'}}
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
                            <span style={{color: 'gray'}}>
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
                            <span style={{color: 'gray'}}>
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
                            <span style={{color: 'gray'}}>
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
                    return <MetadataFieldView field={field} sample={this.props.sample}/>;
                }}
            />
        </Table>;
    }

    onToggleHideEmpty() {
        this.setState({
            omitEmpty: !this.state.omitEmpty
        });
    }

    hasEmptyFields() {
        return Object.values(this.props.sample.metadata)
            .some((field) => {
                return field.isEmpty && field.type === 'controlled';
            });
    }

    emptyFieldCount() {
        return Object.values(this.props.sample.metadata)
            .filter((field) => {
                return field.isEmpty && field.type === 'controlled';
            }).length;
    }

    renderShowEmptyButton() {
        if (!this.state.hasEmpty) {
            return;
        }
        const label = (() => {
            if (this.state.omitEmpty) {
                return 'Show Empty Fields';
            } else {
                return 'Hide Empty Fields';
            }
        })();
        return <Button onClick={this.onToggleHideEmpty.bind(this)} type="default" size="small">
            {label}
        </Button>;
    }

    renderToggleEmptySwitch() {
        if (!this.state.hasEmpty) {
            return;
        }
        return <div style={{display: 'flex', flexDirection: 'row', alignContent: 'center'}}>
            <span style={{marginRight: '1ex'}}>{this.state.emptyFieldCount} empty fields</span>
            <Switch
                onChange={this.onChangeEmptySwitch.bind(this)}
                checkedChildren={'showing'}
                unCheckedChildren={'hidden'}
                defaultChecked={false}
            />
        </div>
    }

    onChangeEmptySwitch(checked: boolean | undefined) {
        this.setState({
            omitEmpty: !checked
        })
    }

    renderToolbar() {
        return <div className="Metadata-toolbar">
            {this.renderToggleEmptySwitch()}
        </div>;
    }

    render() {
        return <div className="Col -stretch">
            <Section title="Sample" renderToolbar={this.renderToolbar.bind(this)}>
                {this.renderMetadata()}
            </Section>
        </div>;
    }
}
