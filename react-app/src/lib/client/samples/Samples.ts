// export type FieldStorageTypes = "string" | "number" | "boolean";

// export type FieldTypeType =
//     | "string"
//     | "text"
//     | "number"
//     | "boolean"
//     | "date"
//     | "Enum<string>"
//     | "OntologyTerm";

// export interface FieldTypeBase {
//     type: FieldTypeType;
//     storageType: FieldStorageTypes;
//     constraints: {};
//     format?: {};
// }

// export interface FieldTypeString extends FieldTypeBase {
//     type: "string";
//     storageType: "string";
//     constraints: {
//         minLength?: number;
//         maxLength?: number;
//     };
// }

// export interface FieldTypeText extends FieldTypeBase {
//     type: "text";
//     storageType: "string";
//     constraints: {
//         minLength?: number;
//         maxLength?: number;
//     };
// }

// export interface FieldTypeNumber extends FieldTypeBase {
//     type: "number";
//     storageType: "number";
//     constraints: {
//         gte?: number;
//         gt?: number;
//         lte?: number;
//         lt?: number;
//     };
//     format?: {
//         useGrouping?: boolean;
//         minimumFractionDigits?: number;
//         maximumFractionDigits?: number;
//         minimumSignificantDigits?: number;
//         maximumSignificantDigits?: number;
//         style?: "decimal" | "currency" | "percent" | "unit";
//         notation?: "standard" | "scientific" | "engineering" | "compact";
//     };
// }

// export interface FieldTypeDate extends FieldTypeBase {
//     type: "date";
//     storageType: "string";
//     constraints: {
//         gte?: string;
//         gt?: string;
//         lte?: string;
//         lt?: string;
//     };
//     format: {
//         template: string;
//     };
// }

// export interface FieldTypeBoolean extends FieldTypeBase {
//     type: "boolean";
//     storageType: "boolean";
//     constraints: {
//         trueValues: Array<string>;
//         falseValues: Array<string>;
//     };
// }

// export interface FieldTypeStringEnum extends FieldTypeBase {
//     type: "Enum<string>";
//     storageType: "string";
//     constraints: {
//         values: Array<string>;
//     };
// }

// export interface FieldTypeOntologyTerm extends FieldTypeBase {
//     type: "OntologyTerm";
//     storageType: "string";
//     constraints: {
//         ancestorTerm: string;
//         ontologyNamespace: string;
//     };
// }

// export type FieldType =
//     | FieldTypeString
//     | FieldTypeText
//     | FieldTypeNumber
//     | FieldTypeStringEnum
//     | FieldTypeOntologyTerm
//     | FieldTypeDate
//     | FieldTypeBoolean;

// export interface FieldValueString extends FieldTypeString {
//     value: string | null;
// }

// export interface FieldValueText extends FieldTypeText {
//     value: string | null;
// }

// export interface FieldValueNumber extends FieldTypeNumber {
//     value: number | null;
// }

// export interface FieldValueDate extends FieldTypeDate {
//     value: number | null;
// }

// export interface FieldValueBoolean extends FieldTypeBoolean {
//     value: boolean | null;
// }

// export interface FieldValueStringEnum extends FieldTypeStringEnum {
//     value: string | null;
// }

// export interface FieldValueOntologyTerm extends FieldTypeOntologyTerm {
//     value: string | null;
// }

// export type FieldValue =
//     | FieldValueString
//     | FieldValueText
//     | FieldValueNumber
//     | FieldValueBoolean
//     | FieldValueDate
//     | FieldValueStringEnum
//     | FieldValueOntologyTerm;

// interface FieldType {
//   name: "string" | "number" | "Enum<string>" | "OntologyTerm";
//   storageType: "string" | "number";
//   constraints: { [key: string]: string | number | boolean | undefined };
// }

// export interface FieldUnitsAvailable {
//   available: Array<string>;
//   canonical: string;
// }

// export interface FieldUnitsOnly {
//   only: string;
// }

// export type FieldUnits = FieldUnitsAvailable | FieldUnitsOnly;

// export interface FieldUnits {
//     available: Array<string>;
//     canonical: string;
//     takeFromField?: string;
// }

import {JSONValue} from "@kbase/ui-lib/lib/json";

export interface FieldCategory {
    id: string;
    description: string;
}

// export interface FieldDefinition {
//     id: string;
//     label: string;
//     description?: string;
//     examples?: Array<string>;
//     importLabels?: Array<string>;
//     required: boolean;
//     type: FieldType;
//     units?: FieldUnits;
//     categories?: Array<string>;
// }

// export type FieldDefinitions = Map<string, FieldDefinition>;

// export type FieldDefinitionsMap = { [key: string]: FieldDefinition };

export interface FieldGroup {
    name: string;
    title: string;
    fields: Array<string>;
}

export type FieldGroups = Array<FieldGroup>;

export interface LayoutGroup {
    name: string;
    label: string;
    description: string;
    fields: Array<string>;
}

export interface Format {
    id: string;

    // description
    name: string;
    title: string;
    description: string;
    source: {
        name: string;
        title: string;
        logo_url?: string;
        url: string;
    };

    // version
    //   version: number;
    mappings: {
        header?: Array<string>;
        // sample: {
        //     id: string;
        //     parent_id: string;
        // };
        record: {
            name: string;
        };
        sample: {
            id: string;
            parent_id: string;
        };
        // corrections?: { [key: string]: string };
    };
    //   field_definitions: { [key: string]: FormatField };
    fields: Array<string>;
    layouts: {
        grouped: Array<LayoutGroup>;
    };
}

// Hmm, schema fields.

export type SchemaFieldType =
    'string' |
    'number' |
    'boolean';

// export interface SchemaFieldBase {
//     $schema: string;
//     $id: string;
//     type: SchemaFieldType
//     format?: string
//     title: string
//     description?: string
//     kbase: {
//         display: {
//             label: string
//             tooltip?: string
//         };
//         format: {};
//         examples: Array<string>
//         units: {
//             available: Array<string>
//             canonical: string
//         }
//         sample: {
//             key: string
//             columnTitle: string
//         }
//         categories: Array<string>
//     }
// }

export interface SchemaFieldBase {
    $schema: string;
    $id?: string;
    type: SchemaFieldType
    format?: string
    title: string
    description?: string
    examples: Array<JSONValue>
    kbase: {
        format: {};
        units: {
            canonical: string
        }
        sample: {
            key: string
        }
    }
}

export interface SchemaFieldString extends SchemaFieldBase {
    type: 'string'
    minLength?: number
    maxLength?: number
    enum?: Array<string>;
    pattern?: string;
}

export interface SchemaFieldOntologyTerm extends SchemaFieldBase {
    type: 'string'
    ancestorTerm: string
    namespace: string
}

// export interface SchemaFieldOntologyTerm extends SchemaFieldBase {
//     type: 'string'
//     format: 'ontologyTerm'
//     OntologyTerm: {
//         ancestorTerm: string
//         ontologyNamespace: string
//     }
// }

export interface SchemaFieldNumber extends SchemaFieldBase {
    type: 'number'
    minimum?: number
    maximum?: number
    kbase: SchemaFieldBase['kbase'] & {
        format: {
            useGrouping?: boolean;
            minimumFractionDigits?: number;
            maximumFractionDigits?: number;
            minimumSignificantDigits?: number;
            maximumSignificantDigits?: number;
            style?: "decimal" | "currency" | "percent" | "unit";
            notation?: "standard" | "scientific" | "engineering" | "compact";
        }
    };
}

export type SchemaField =
    SchemaFieldString |
    SchemaFieldOntologyTerm |
    SchemaFieldNumber;


export interface FieldValueBase {
    type: string;
    format?: string;
    isEmpty: boolean;
    schema: SchemaField;
    unit?: string;
}

type Disallowed = "ontologyTerm";
type Input<T> = T & (T extends Disallowed ? never : T);


export interface FieldStringValue extends FieldValueBase {
    type: 'string',
    format?: Input<string>;
    stringValue: string | null;
    schema: SchemaFieldString;
}

// export const x: FieldStringValue = {
//     type: 'string',
//     format: 'ontologyTerm',
//     stringValue: 'bar',
//     isEmpty:  false
// }

export interface FieldOntologyTermValue extends FieldValueBase {
    type: 'string',
    format: 'ontologyTerm',
    stringValue: string | null;
    schema: SchemaFieldOntologyTerm;
}

// export interface FieldOntologyTermValue extends FieldValueBase {
//     type: 'string'
//     format: 'ontologyTerm',
//     value: string | null;
//     schema: SchemaFieldOntologyTerm;
// }

export interface FieldNumberValue extends FieldValueBase {
    type: 'number',
    numberValue: number | null;
    schema: SchemaFieldNumber;
}

export type FieldValue =
    FieldStringValue |
    FieldOntologyTermValue |
    FieldNumberValue;

export type UserFieldValue = string;