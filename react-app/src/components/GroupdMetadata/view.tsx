import React from 'react';
import {
    Tooltip
} from 'antd';
import {MetadataField, Sample} from "../../lib/ViewModel/ViewModel";
import MetadataFieldView from '../MetadataField/view';
import {FieldGroups} from "../../lib/client/SampleServiceClient";
import './style.less';
import 'InfoTable.css';

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
                    return null;
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
            })
            .filter((group) => {
                return (group !== null);
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
