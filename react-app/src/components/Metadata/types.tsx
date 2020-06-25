// TODO: unused, preserved for now

import { MetadataField } from "../Main/data";

export interface FieldFormatBase {
}

export interface FloatFieldFormat extends FieldFormatBase {
    precision?: number;
    showThousandsSeparator?: boolean;
}

export interface IntegerFieldFormat extends FieldFormatBase {
    showThousandsSeparator?: boolean;
}

export interface StringFieldFormat extends FieldFormatBase {
}

export interface DateFieldFormat extends FieldFormatBase {
}

export type FieldFormat = FloatFieldFormat | IntegerFieldFormat | StringFieldFormat | DateFieldFormat;

export type FieldType = 'integer' | 'float' | 'string' | 'date';

export interface LayoutFieldBase {
    type: FieldType;
    key: string;
    description?: string;
    units?: Array<string>;
}

export interface FloatField extends LayoutFieldBase {
    type: 'float';
    format?: FloatFieldFormat;
}

export interface IntegerField extends LayoutFieldBase {
    type: 'integer';
    format?: IntegerFieldFormat;
}

export interface StringField extends LayoutFieldBase {
    type: 'string';
    format?: StringFieldFormat;
}

export interface DateField extends LayoutFieldBase {
    type: 'date';
    format?: DateFieldFormat;
}

export type LayoutField = IntegerField | FloatField | StringField | DateField;

export interface LayoutGroup {
    key: string;
    label: string;
    description?: string;
    fields: { [key in string]: LayoutField };
    layout: Array<string>;

}

export type GroupLayout = Array<LayoutGroup>;

export interface GroupSchema {
    title: string;
    layout: Array<string>;
}

export interface GroupsSchema {
    description: GroupSchema;
    collection: GroupSchema;
    curation: GroupSchema;
    geolocation: GroupSchema;
}

// TODO: 
export type Unit = string;

export interface FieldSchema {
    key: string;
    type: string;
    group: string;
    description?: string;
    units?: Array<Unit>;
    format?: any;
}

export interface FieldsSchema {
    [k: string]: FieldSchema;
}

export interface Schema {
    groups: GroupsSchema,
    fields: FieldsSchema;
}

export interface WrappedMetadataValue {
    type: string,
    field: MetadataField;
}