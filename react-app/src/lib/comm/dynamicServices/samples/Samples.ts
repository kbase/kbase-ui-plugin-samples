export type FieldStorageTypes = "string" | "number" | "boolean";

export type FieldTypeType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "Enum<string>"
  | "OntologyTerm";

export interface FieldTypeBase {
  type: FieldTypeType;
  storageType: FieldStorageTypes;
  constraints: {};
  format?: {};
}

export interface FieldTypeString extends FieldTypeBase {
  type: "string";
  storageType: "string";
  constraints: {
    maxLength?: number;
  };
}

export interface FieldTypeNumber extends FieldTypeBase {
  type: "number";
  storageType: "number";
  constraints: {
    gte?: number;
    gt?: number;
    lte?: number;
    lt?: number;
  };
  format?: {
    useGrouping?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    minimumSignificantDigits?: number;
    maximumSignificantDigits?: number;
    style?: "decimal" | "currency" | "percent" | "unit";
    notation?: "standard" | "scientific" | "engineering" | "compact";
  };
}

export interface FieldTypeDate extends FieldTypeBase {
  type: "date";
  storageType: "string";
  constraints: {
    gte?: string;
    gt?: string;
    lte?: string;
    lt?: string;
  };
  format: {
    template: string;
  };
}

export interface FieldTypeBoolean extends FieldTypeBase {
  type: "boolean";
  storageType: "boolean";
  constraints: {
    trueValues: Array<string>;
    falseValues: Array<string>;
  };
}

export interface FieldTypeStringEnum extends FieldTypeBase {
  type: "Enum<string>";
  storageType: "string";
  constraints: {
    values: Array<string>;
  };
}

export interface FieldTypeOntologyTerm extends FieldTypeBase {
  type: "OntologyTerm";
  storageType: "string";
  constraints: {
    ancestor_term: string;
    ontology_namespace: string;
  };
}

export type FieldType =
  | FieldTypeString
  | FieldTypeNumber
  | FieldTypeStringEnum
  | FieldTypeOntologyTerm
  | FieldTypeDate
  | FieldTypeBoolean;

export interface FieldValueString extends FieldTypeString {
  value: string | null;
}

export interface FieldValueNumber extends FieldTypeNumber {
  value: number | null;
}

export interface FieldValueDate extends FieldTypeDate {
  value: number | null;
}

export interface FieldValueBoolean extends FieldTypeBoolean {
  value: boolean | null;
}

export interface FieldValueStringEnum extends FieldTypeStringEnum {
  value: string | null;
}

export interface FieldValueOntologyTerm extends FieldTypeOntologyTerm {
  value: string | null;
}

export type FieldValue =
  | FieldValueString
  | FieldValueNumber
  | FieldValueBoolean
  | FieldValueDate
  | FieldValueStringEnum
  | FieldValueOntologyTerm;

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

export interface FieldUnits {
  available: Array<string>;
  canonical: string;
}

export interface FieldDefinition {
  id: string;
  label: string;
  required: boolean;
  type: FieldType;
  units?: FieldUnits;
}

export type FieldDefinitions = Map<string, FieldDefinition>;

// export type FieldDefinitionsMap = { [key: string]: FieldDefinition };

export interface FieldGroup {
  name: string;
  label: string;
  description: string;
  fields: Array<string>;
}

export type FieldGroups = Map<string, FieldGroup>;

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
  fields: Array<string>;
  //   field_definitions: { [key: string]: FormatField };
  layouts: {
    grouped: Array<LayoutGroup>;
  };
}
