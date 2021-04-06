import { FieldValue } from "lib/client/samples/Samples";
import { Sample } from "lib/ViewModel/ViewModel";
import { MetadataControlledField, MetadataField, MetadataUserField } from "../../lib/ViewModel/ViewModel";

// interface TemplateDefinition {
//   id: string;
//   name: string;
//   description: string;
//   reference: string;
// }

// interface TemplateDefinitions {
//   templates: Array<TemplateDefinition>;
// }

// type TemplateDefinitionsMap = Map<string, TemplateDefinition>;

// interface Reference {
//   title: string;
//   url: string;
// }

// interface TemplateFieldBase {
//   type: "sample" | "metadata" | "usermetadata";
//   column: string;
//   key: string;
// }

// interface TemplateSampleField extends TemplateFieldBase {
//   type: "sample";
// }

// interface TemplateMetadataField extends TemplateFieldBase {
//   type: "metadata";
// }

// interface TemplateUserMetadataField extends TemplateFieldBase {
//   type: "usermetadata";
// }

// type TemplateField =
//   | TemplateSampleField
//   | TemplateMetadataField
//   | TemplateUserMetadataField;

// interface HeaderField {
//   key: string;
//   column: string;
// }

// interface Template {
//   header: Array<HeaderField>;
//   columns: Array<TemplateField>;
// }

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
  // value: string | number | boolean | null;
  // units: string | null;
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
  // value: string | number | boolean | null;
  // value: string | number | boolean | null;
  // units: string | null;
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
  constructor({ order, column }: SpreadsheetFieldParams) {
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

// export class IGSNField extends SpreadsheetField {
//     // static column = 'IGSN';
//     extractValue(sample: Sample) {
//         return sample.sourceId.id;
//     }
// }

// export class ParentIGSNField extends SpreadsheetField {
//     // static column = 'Parent IGSN';
//     extractValue(sample: Sample) {
//         return sample.sourceParentId ? sample.sourceParentId.id : null;
//     }
// }

// export class ReleaseDateField extends SpreadsheetField {
//   // column = 'Release date';
//   extractValue(sample: Sample) {
//     const metadataField = sample.metadata["release_date"];
//     if (!metadataField) {
//       return null;
//     }
//     return String(metadataField.value);
//   }
// }

// export class MaterialField extends SpreadsheetField {
//   // column = 'Release date';
//   extractValue(sample: Sample) {
//     const metadataField = sample.metadata["material"];
//     if (!metadataField) {
//       return null;
//     }
//     return String(metadataField.value);
//   }
// }

// export class FieldNameField extends SpreadsheetField {
//   // column = 'Release date';
//   extractValue(sample: Sample) {
//     const metadataField = sample.metadata["field_name"];
//     if (!metadataField) {
//       return null;
//     }
//     return String(metadataField.value);
//   }
// }

// export class LocationDescriptionField extends SpreadsheetField {
//   extractValue(sample: Sample) {
//     const metadataField = sample.metadata["location_description"];
//     if (!metadataField) {
//       return null;
//     }
//     return String(metadataField.value);
//   }
// }

// export class MetadataField extends SpreadsheetField {
//   key: string;
//   constructor(
//     { order, column, key }: { order: number; column: string; key: string },
//   ) {
//     super({ order, column });
//     this.key = key;
//   }
//   extractValue(sample: Sample) {
//     const metadataField = sample.metadata[this.key];
//     if (!metadataField) {
//       return null;
//     }
//     return String(metadataField.value);
//   }
// }
