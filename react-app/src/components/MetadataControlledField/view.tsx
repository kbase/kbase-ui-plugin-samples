import React from 'react';
import {Tooltip} from 'antd';
import {NoData} from '@kbase/ui-components';
import {MetadataControlledField as _MetadataControlledField} from '../../lib/ViewModel/ViewModel';
import {Sample} from 'lib/ViewModel/ViewModel';
import {FieldNumberValue, FieldOntologyTermValue, FieldStringValue} from "../../lib/ViewModel/Field";


export interface MetadataControlledFieldProps {
    field: _MetadataControlledField;
    sample: Sample;
}

interface MetadataControlledFieldState {
}

export default class MetadataControlledField extends React.Component<MetadataControlledFieldProps, MetadataControlledFieldState> {
    renderStringField(field: FieldStringValue) {
        if (field.stringValue === null) {
            return <NoData/>;
        }
        return <span>{field.stringValue}</span>;
    }

    renderURLField(field: FieldStringValue) {
        if (field.stringValue === null) {
            return <NoData/>;
        }
        return <a href={field.stringValue} target={"_blank"} rel="noreferrer">{field.stringValue}</a>;
    }

    renderNumberField(field: FieldNumberValue) {
        if (field.numberValue === null) {
            return <NoData/>;
        }
        const options: { [k: string]: any } = {};
        // if ('format' in field.schema) {
        //     options.format = field.schema.format;
        // }
        if (typeof field.schema.kbase.format !== 'undefined') {
            if ('minimumFractionDigits' in field.schema.kbase.format) {
                options.minimumFractionDigits = field.schema.kbase.format.minimumFractionDigits;
            }
            if ('maximumFractionDigits' in field.schema.kbase.format) {
                options.maximumFractionDigits = field.schema.kbase.format.maximumFractionDigits;
            }
        }

        const content = new Intl.NumberFormat('en-US', options).format(field.numberValue);
        const title = <span>
            raw value: {String(field.numberValue)}
        </span>;
        return <Tooltip title={title}><span>{content}</span>
        </Tooltip>;
    }

    renderOntologyTermField(field: FieldOntologyTermValue) {
        if (field.stringValue === null) {
            return <NoData/>;
        }
        // TODO: add timestamp to url
        const url = `/#ontology/term/${field.schema.namespace}/${field.stringValue}/${this.props.sample.firstVersion.at}`;
        return <a href={url} target="_blank" rel="noreferrer">{field.stringValue}</a>;
    }

    renderField(metadataField: _MetadataControlledField) {
        const field = metadataField.field;
        switch (field.type) {
            case 'string':
                if (field.format === 'ontology-term') {
                    // TODO: why doesn't this serve as a type test?
                    return this.renderOntologyTermField(field as FieldOntologyTermValue);
                } else if (field.format === 'url') {
                    return this.renderURLField(field);
                } else {
                    return this.renderStringField(field);
                }
            case 'number':
                return this.renderNumberField(field);
        }
    }

    renderUnit(field: _MetadataControlledField) {
        if (!(field.field.unit)) {
            return;
        }
        return <span>{' '}<i>{field.field.unit}</i></span>;
    }

    render() {
        const {field} = this.props;
        return <span>
            {this.renderField(field)}{this.renderUnit(field)}
        </span>;
    }
}
