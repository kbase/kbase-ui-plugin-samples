import React from 'react';
import { MetadataField } from '../../lib/Model';
import { NoData } from '../NoData';

export interface MetadataFieldViewProps {
    // value: string | number | boolean | null;
    // fieldKey: string;
    // unit?: string;
    // fields: Metadata;
    field: MetadataField;
}

interface MetadataFieldViewState {
}

export default class MetadataFieldView extends React.Component<MetadataFieldViewProps, MetadataFieldViewState> {

    renderField(field: MetadataField) {
        if (field.value === null) {
            return <NoData />;
        }
        return <span>
            {field.value}
        </span>;
    }

    renderUnit(field: MetadataField) {
        if (field.units === 'unit') {
            return '';
        }
        return field.units;
    }

    render() {
        const field = this.props.field;
        if (field.units) {
            return <span>
                {this.renderField(field)} <i>{this.renderUnit(field)}</i>
            </span>;
        }
        return <span>
            {this.renderField(field)}
        </span>;
    }
}