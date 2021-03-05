import React from 'react';
import {Alert} from 'antd';

import {MetadataField} from '../../lib/Model';
import {Sample} from '../Main/types';
import MetadataUserField from "../MetadataUserField/view";
import MetadataControlledField from "../MetadataControlledField/view";

export interface MetadataFieldViewProps {
    field: MetadataField;
    sample: Sample;
}

interface MetadataFieldViewState {
}

export default class MetadataFieldView extends React.Component<MetadataFieldViewProps, MetadataFieldViewState> {
    render() {
        if (this.props.field.type === 'user') {
            return <MetadataUserField field={this.props.field} sample={this.props.sample}/>;
        } else if (this.props.field.type === 'controlled') {
            return <MetadataControlledField field={this.props.field} sample={this.props.sample}/>;
        } else {
            console.log('impossible?', this.props);
            return <Alert type="error" message="Impossible!"/>
        }
    }
}