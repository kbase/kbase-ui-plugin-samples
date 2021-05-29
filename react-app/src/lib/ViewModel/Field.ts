import {
    ControlledField,
    ControlledFieldNumber,
    ControlledFieldOntologyTerm,
    ControlledFieldString
} from "../client/ControlledField";

export interface FieldValueBase {
    type: string;
    format?: string;
    isEmpty: boolean;
    schema: ControlledField;
    unit?: string;
}

type Disallowed = "ontologyTerm";
type Input<T> = T & (T extends Disallowed ? never : T);


export interface FieldStringValue extends FieldValueBase {
    type: 'string',
    format?: Input<string>;
    stringValue: string | null;
    schema: ControlledFieldString;
}

export interface FieldOntologyTermValue extends FieldValueBase {
    type: 'string',
    format: 'ontologyTerm',
    stringValue: string | null;
    schema: ControlledFieldOntologyTerm;
}

export interface FieldNumberValue extends FieldValueBase {
    type: 'number',
    numberValue: number | null;
    schema: ControlledFieldNumber;
}

export type FieldValue =
    FieldStringValue |
    FieldOntologyTermValue |
    FieldNumberValue;

export type UserFieldValue = string;