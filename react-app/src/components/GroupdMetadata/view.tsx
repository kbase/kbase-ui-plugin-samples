import React from 'react';
import {
    Alert, Button, Tooltip
} from 'antd';
import {MetadataField, Sample} from "../../lib/ViewModel/ViewModel";
import MetadataFieldView from '../MetadataField/view';
import './style.less';
import {FieldGroups} from "../../lib/client/SampleServiceClient";

export interface GroupedMetadataProps {
    sample: Sample;
    fieldGroups: FieldGroups;
}

interface GroupedMetadataState {
}

export default class GroupedMetadata extends React.Component<GroupedMetadataProps, GroupedMetadataState> {
    metadataMap: Map<string, MetadataField>

    constructor(props: GroupedMetadataProps) {
        super(props);
        this.metadataMap = this.props.sample.metadata.reduce((metadataMap, field) => {
            metadataMap.set(field.key, field);
            return metadataMap;
        }, new Map<string, MetadataField>());
    }

    renderControlledMetadataGrouped() {
        const sample = this.props.sample;

        const rows = Array.from(this.props.fieldGroups).map((fieldGroup) => {
            const fields = fieldGroup.fields.map((fieldName) => {
                const field = this.metadataMap.get(fieldName);
                if (!field) {
                    console.warn('Field not found in grouped: ' + fieldName, fieldGroup);
                    return null;
                }
                // <div><MetadataField value={field.value} fieldKey={field.key} unit={field.units} fields={this.props.sample.metadata} /></div>
                return <div key={field.key}>
                    <div><Tooltip title={`key: ${field.key}`}><span>{field.label}</span></Tooltip></div>
                    <div><MetadataFieldView field={field} sample={this.props.sample}/></div>
                </div>;

            })
                .filter((row) => {
                    return row ? true : false;
                });

            let content;
            if (fields.length) {
                content = <div className="InfoTable -bordered ControlledMetadata">
                    {fields}
                </div>;
            } else {
                content = <div style={{fontStyle: 'italic'}}>No data</div>;
            }
            return <div className="DataGroup">
                <div className="-title">
                    {fieldGroup.title}
                </div>
                <div className="-body">
                    {content}
                </div>
            </div>;
        });

        return <div>
            {rows}
        </div>;
    }

    renderUserFields() {
        const sample = this.props.sample;
        const metadata = sample.metadata;
        const fields = metadata
            .filter((field) => {
                return field.type === 'user';
            })
            .map((field) => {
                return <div key={field.key}>
                    <div><Tooltip title={`key: ${field.key}`}><span>{field.label}</span></Tooltip></div>
                    <div><MetadataFieldView field={field} sample={sample}/></div>
                </div>;
            });

        if (fields.length === 0) {
            return;
        }

        const content = <div className="InfoTable -bordered ControlledMetadata">
            {fields}
        </div>;

        return <div className="DataGroup" key="user_fields">
            <div className="-title">
                User Fields
            </div>
            <div className="-body">
                {content}
            </div>
        </div>;
    }

    renderGrouped() {
        const sample = this.props.sample;
        const metadata = sample.metadata;
        return this.props.fieldGroups
            .map((group) => {
                const fields = group.fields
                    .map((fieldName) => {
                        return this.metadataMap.get(fieldName);
                    })
                    .map((field) => {
                        if (typeof field === 'undefined') {
                            return false;
                        }
                        return <div key={field.key}>
                            <div><Tooltip title={`key: ${field.key}`}><span>{field.label}</span></Tooltip></div>
                            <div><MetadataFieldView field={field} sample={sample}/></div>
                        </div>;
                    })
                    .filter(field => !!field);

                if (fields.length === 0) {
                    return;
                }

                const content = <div className="InfoTable -bordered ControlledMetadata">
                    {fields}
                </div>;

                return <div className="DataGroup" key={group.name}>
                    <div className="-title">
                        {group.title}
                    </div>
                    <div className="-body">
                        {content}
                    </div>
                </div>;
            });
    }

    render() {
        return <div className="Metadata" data-testid="metadataviewer">
            <div className="Metadata-body">
                <div className="Metadata-content-wrapper">
                    {this.renderGrouped()}
                    {this.renderUserFields()}
                </div>
            </div>
        </div>;
    }
}
