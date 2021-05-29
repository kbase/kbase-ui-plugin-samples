import {Sample} from "lib/ViewModel/ViewModel";
import {MetadataControlledField, MetadataField, MetadataUserField} from "../../lib/ViewModel/ViewModel";
import {FieldValue} from "../../lib/ViewModel/Field";

export interface WrappedMetadataValue {
    type: string;
    label: string;
    value: string;
}

export interface TemplateDataSource {
    order: number;
    key: string;
    type: string | null;
    value: string | null;
    isMissing: boolean;
}

interface TemplateFieldBase {
    type: string;
    field: any;
}

export interface TemplateFieldMetadata extends TemplateFieldBase {
    type: 'metadata',
    field: FieldValue
}

export interface TemplateFieldUser extends TemplateFieldBase {
    type: 'user',
    field: string;
}

export type TemplateField =
    TemplateFieldMetadata |
    TemplateFieldUser;

export interface TemplateDataSource2Base {
    order: number;
    key: string;
    label: string;
    type: string;
    isMissing: boolean;
    fieldType: "controlled" | "user";
    field: MetadataField
}

export interface TemplateDataSourceMetadata extends TemplateDataSource2Base {
    fieldType: 'controlled',
    field: MetadataControlledField
}

export interface TemplateDataSourceUser extends TemplateDataSource2Base {
    fieldType: 'user',
    field: MetadataUserField;
}

export type TemplateDataSource2 =
    TemplateDataSourceMetadata |
    TemplateDataSourceUser;

export interface SpreadsheetFieldDefinition {
    order: number;
    column: string;
    label: string;
    key?: string;
    metadataKey?: string;
    userMetadataColumn?: string;
}

export interface SpreadsheetFieldParams {
    order: number;
    column: string;
    // sample: Sample;
}

abstract class SpreadsheetField {
    order: number;
    column: string;

    constructor({order, column}: SpreadsheetFieldParams) {
        this.order = order;
        this.column = column;
    }

    abstract extractValue(sample: Sample): string | null;
}

export class NameField extends SpreadsheetField {
    // static column = 'Name';
    extractValue(sample: Sample) {
        return sample.name;
    }
}
