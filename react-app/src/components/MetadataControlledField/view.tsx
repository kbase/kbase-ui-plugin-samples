import { Tooltip } from 'antd';
import React from 'react';
// import {
//     FieldValueBoolean, FieldValueDate, FieldValueNumber,
//     FieldValueOntologyTerm, FieldValueString, FieldValueStringEnum
// } from 'lib/client/samples/Samples';
import {MetadataField, MetadataControlledField as _MetadataControlledField} from '../../lib/Model';
import { NoData } from '../NoData';
import { Sample } from '../Main/types';
import { FieldNumberValue, FieldOntologyTermValue, FieldStringValue } from 'lib/client/samples/Samples';


export interface MetadataControlledFieldProps {
    field: _MetadataControlledField;
    sample: Sample;
}

interface MetadataControlledFieldState {
}

export default class MetadataControlledField extends React.Component<MetadataControlledFieldProps, MetadataControlledFieldState> {

    constructor(props: MetadataControlledFieldProps) {
        super(props);
    }

    renderStringField(field: FieldStringValue) {
        if (field.isEmpty === null) {
            return <NoData />;
        }
        return <span>{field.stringValue}</span>;
    }

    renderNumberField(field: FieldNumberValue) {
        if (field.numberValue === null) {
            return <NoData />;
        }
        const content = new Intl.NumberFormat('en-US', {
            useGrouping: field.schema.kbase.format?.useGrouping,
            minimumFractionDigits: field.schema.kbase.format?.minimumFractionDigits,
            maximumFractionDigits: field.schema.kbase.format?.maximumFractionDigits
        }).format(field.numberValue);
        const title = <span>
            raw value: {String(field.numberValue)}
        </span>;
        return <Tooltip title={title}><span>{content}</span>
        </Tooltip>;
    }

    // renderBooleanField(field: FieldValueBoolean) {
    //     if (field.value === null) {
    //         return <NoData />;
    //     }
    //     return <span>{field.value}</span>;
    // }
    // renderDateField(field: FieldValueDate) {
    //     if (field.value === null) {
    //         return <NoData />;
    //     }
    //     return <span>{field.value}</span>;
    // }
    // renderStringEnumField(field: FieldValueStringEnum) {
    //     if (field.value === null) {
    //         return <NoData />;
    //     }
    //     return <span>{field.value}</span>;
    // }
    renderOntologyTermField(field: FieldOntologyTermValue) {
        if (field.stringValue === null) {
            return <NoData />;
        }
        // TODO: add timestamp to url
        const url = `/#ontology/term/${field.schema.ontologyNamespace}/${field.stringValue}/${this.props.sample.created.at}`;
        return <a href={url} target="_blank" rel="noreferrer">{field.stringValue}</a>;
    }
    renderField(metadataField: MetadataField) {
        if (metadataField.type === 'user') {
            return metadataField.field;
        }

        const field = metadataField.field;

        console.log('HMM, field', field);

        switch (field.type) {
            case 'string':

                // if ('ancestorTerm' in  field.schema && 'ontologyNamespace' in field.schema) {
                if (field.format === 'ontologyTerm') {
                    // TODO: why doesn't this serve as a type test?
                    return this.renderOntologyTermField(field as FieldOntologyTermValue);
                } else {
                    return this.renderStringField(field);
                }
                // switch (field.format) {
                //     case 'ontologyTerm':
                //         return this.renderOntologyTermField(field);
                //     default:
                //         return this.renderStringField(field);
                // }

            case 'number':
                return this.renderNumberField(field);
            // case 'boolean':
            //     return this.renderBooleanField(field);
            // case 'date':
            //     return this.renderDateField(field);
            // case 'Enum<string>':
            //     return this.renderStringEnumField(field);
            // case 'OntologyTerm':
            //     return this.renderOntologyTermField(field);
        }
        // return <span>
        //     {field.value}
        // </span>;
    }

    renderUnit(field: _MetadataControlledField) {
        if (!(field.field.unit)) {
            return '';
        }
        return field.field.unit;
    }

    render() {
        const {field} = this.props;

        console.log('field', field);

        if (field.field.unit) {
            return <span>
                {this.renderField(field)} <i>{this.renderUnit(field)}</i>
            </span>;
        }
        return <span>
            {this.renderField(field)}
        </span>;
    }
}