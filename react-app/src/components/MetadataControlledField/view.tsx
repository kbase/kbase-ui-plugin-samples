import React from 'react';
import { Tooltip } from 'antd';
import { NoData } from '@kbase/ui-components';
import { MetadataControlledField as _MetadataControlledField } from '../../lib/Model';
import { FieldNumberValue, FieldOntologyTermValue, FieldStringValue } from 'lib/client/samples/Samples';
import { Sample } from 'lib/ViewModel';


export interface MetadataControlledFieldProps {
    field: _MetadataControlledField;
    sample: Sample;
}

interface MetadataControlledFieldState {
}

export default class MetadataControlledField extends React.Component<MetadataControlledFieldProps, MetadataControlledFieldState> {
    renderStringField(field: FieldStringValue) {
        if (field.stringValue === null) {
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
    renderField(metadataField: _MetadataControlledField) {
        const field = metadataField.field;
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
            return;
        }
        return <span>{' '}<i>{field.field.unit}</i></span>;
    }

    render() {
        const { field } = this.props;
        return <span>
            {this.renderField(field)}{this.renderUnit(field)}
        </span>;
    }
}
