import React from 'react';
import {
    Alert, Button, Tooltip
} from 'antd';


// import { Format } from 'lib/client/SampleServiceClient';

import './style.less';
import {FieldGroup, FieldGroups} from 'lib/client/samples/Samples';
import {MetadataField, Sample} from "../../lib/ViewModel/ViewModel";
import MetadataFieldView from '../MetadataField/view';

export interface GroupedMetadataProps {
    sample: Sample;
    fieldGroups: FieldGroups;
    // format: Format;
    // template: Template;
    // layout: GroupingLayout;
    // fields: FieldDefinitionsMap;
}

interface GroupedMetadataState {
    // omitEmpty: boolean;
}

export default class GroupedMetadata extends React.Component<GroupedMetadataProps, GroupedMetadataProps> {
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

    renderGrouped() {
        const sample = this.props.sample;
        const metadata = sample.metadata;
        return this.props.fieldGroups.map((group) => {
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

            let content;
            if (fields.length) {
                content = <div className="InfoTable -bordered ControlledMetadata">
                    {fields}
                </div>;
            } else {
                content = <div style={{fontStyle: 'italic'}}>No data</div>;
            }
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

    // onChangeHideEmpty(ev: CheckboxChangeEvent) {
    //     const omitEmpty = ev.target.checked;
    //     this.setState({
    //         omitEmpty
    //     });
    // }
    // renderToolbar2() {
    //     return <div className="Metadata-toolbar">
    //         <Checkbox onChange={this.onChangeHideEmpty.bind(this)} checked={this.state.omitEmpty}>Hide Empty Fields</Checkbox>
    //     </div>;
    // }

    // onToggleHideEmpty() {
    //     this.setState({
    //         omitEmpty: !this.state.omitEmpty
    //     });
    // }

    renderToolbar() {
        // const label = (() => {
        //     if (this.state.omitEmpty) {
        //         return 'Show Empty Fields';
        //     } else {
        //         return 'Hide Empty Fields';
        //     }
        // })();
        // return <div className="Metadata-toolbar">
        //     <Button onClick={this.onToggleHideEmpty.bind(this)}>{label}</Button>
        // </div>;
        return;
    }


    render() {
        return <div className="Metadata" data-testid="metadataviewer">
            {this.renderToolbar()}
            <div className="Metadata-body">
                <div className="Metadata-content-wrapper">
                    {this.renderGrouped()}
                </div>
            </div>
        </div>;
    }
}
