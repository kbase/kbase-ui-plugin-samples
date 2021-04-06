import React from 'react';
import { MetadataField } from '../../lib/ViewModel/ViewModel';
import MetadataUserField from "../MetadataUserField/view";
import MetadataControlledField from "../MetadataControlledField/view";
import { Sample } from 'lib/ViewModel/ViewModel';

export interface MetadataFieldViewProps {
    field: MetadataField;
    sample: Sample;
}

interface MetadataFieldViewState {
}

export default class MetadataFieldView extends React.Component<MetadataFieldViewProps, MetadataFieldViewState> {
    render() {
        switch (this.props.field.type) {
            case 'user': return <MetadataUserField field={this.props.field} sample={this.props.sample} />;
            case 'controlled': return <MetadataControlledField field={this.props.field} sample={this.props.sample} />;
        }
    }
}
