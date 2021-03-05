import React from 'react';
import {MetadataUserField as _MetadataUserField} from '../../lib/Model';
import { Sample } from '../Main/types';

export interface MetadataUserFieldProps {
    field: _MetadataUserField;
    sample: Sample;
}

interface MetadataUserFieldState {
}

export default class MetadataUserField extends React.Component<MetadataUserFieldProps, MetadataUserFieldState> {
    render() {
        return <div>
            {this.props.field.field}
        </div>
    }
}
