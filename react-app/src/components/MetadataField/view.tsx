import { Tooltip } from 'antd';
import React from 'react';
import {
    FieldValueBoolean, FieldValueDate, FieldValueNumber,
    FieldValueOntologyTerm, FieldValueString, FieldValueStringEnum
} from '../../lib/comm/dynamicServices/samples/Samples';
import { MetadataField } from '../../lib/Model';
import { NoData } from '../NoData';

export interface MetadataFieldViewProps {
    field: MetadataField;
}

interface MetadataFieldViewState {
}

export default class MetadataFieldView extends React.Component<MetadataFieldViewProps, MetadataFieldViewState> {

    renderStringField(field: FieldValueString) {
        if (field.value === null) {
            return <NoData />;
        }
        return <span>{field.value}</span>
    }

    renderNumberField(field: FieldValueNumber) {
        if (field.value === null) {
            return <NoData />;
        }
        const content = new Intl.NumberFormat('en-US', {
            useGrouping: field.format?.useGrouping,
            minimumFractionDigits: field.format?.minimumFractionDigits,
            maximumFractionDigits: field.format?.maximumFractionDigits
        }).format(field.value);
        const title = <span>
        raw value: {String(field.value)}
        </span>
        return <Tooltip title={title}><span>{content}</span>
        </Tooltip>;
    }

    renderBooleanField(field: FieldValueBoolean) {
        if (field.value === null) {
            return <NoData />;
        }
        return <span>{field.value}</span>
    }
    renderDateField(field: FieldValueDate) {
        if (field.value === null) {
            return <NoData />;
        }
        return <span>{field.value}</span>
    }
    renderStringEnumField(field: FieldValueStringEnum) {
        if (field.value === null) {
            return <NoData />;
        }
        return <span>{field.value}</span>
    }
    renderOntologyTermField(field: FieldValueOntologyTerm) {
        if (field.value === null) {
            return <NoData />;
        }
        return <span>{field.value}</span>
    }
    renderField(metadataField: MetadataField) {
       
        const field = metadataField.field;
        
        switch (field.type) {
            case 'string':
                return this.renderStringField(field);
                case 'number':
                return this.renderNumberField(field);
                case 'boolean':
                return this.renderBooleanField(field);
                case 'date':
                return this.renderDateField(field);
                case 'Enum<string>':
                return this.renderStringEnumField(field);
                case 'OntologyTerm':
                    return this.renderOntologyTermField(field);
        }
        // return <span>
        //     {field.value}
        // </span>;
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