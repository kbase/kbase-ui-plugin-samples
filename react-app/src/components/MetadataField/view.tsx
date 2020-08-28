import React from 'react';
import { FieldDefinitionsMap } from '../../lib/Model';

export interface MetadataFieldProps {
    value: string | number | boolean;
    fieldKey: string; 
    units?: string;
    fields: FieldDefinitionsMap
}

interface MetadataFieldState {

}

export default class MetadataField extends React.Component<MetadataFieldProps, MetadataFieldState> {
    constructor(props: MetadataFieldProps) {
        super(props);
    }

    render() {
        const fieldDef = this.props.fields[this.props.fieldKey];

        // console.log('field def?', fieldDef);

        if (this.props.units) {
        return <span>
          {this.props.value} <i>{this.props.units}</i>
        </span>
        }
        return <span>
         {this.props.value}
        </span>
    }
}