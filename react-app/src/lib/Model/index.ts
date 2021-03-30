import SampleServiceClient, {
  GetDataLinksFromSampleParams,
  GetDataLinksFromSampleResult,
  GetFormatParams,
  GetFormatResult,
  GetMetadataKeyStaticMetadataParams,
  GetMetadataKeyStaticMetadataResult,
  GetSampleACLsParams,
  GetSampleACLsResult,
  GetSampleParams,
} from "lib/client/SampleServiceClient";

import sesarTemplateData from "./data/templates/sesar/sesar1.json";
import enigmaTemplateData from "./data/templates/enigma/enigma1.json";
import {
  FieldGroup,
  FieldGroups,
  FieldNumberValue,
  FieldStringValue,
  FieldValue,
  Format,
  SchemaField,
  UserFieldValue,
} from "lib/client/samples/Samples";
import {
  MetadataValue,
  Sample as RawSample,
  SampleId,
  SampleNodeType,
  SampleVersion,
} from "lib/client/Sample";
import { EpochTimeMS, SimpleMap, Username } from "../types";

// Constants

import { Template, TemplateField } from "lib/ViewModel";

// Types

export interface FieldMapping {
  [key: string]: string;
}

export interface GroupingLayout {
  id: string;
  name: string;
  description: string;
  layout: Array<FieldLayout>;
}

export interface FieldLayout {
  key: string;
  label: string;
  description: string;
  layout: Array<string>;
}

export interface TemplateMap {
  [templateId: string]: TemplateDefinition;
}

export interface TemplateDefinitions {
  templates: TemplateMap;
}

export interface TemplateDefinition {
  id: string;
  source: string;
  name: string;
  description: string;
  reference: string;
  signalFields: {
    does_not_include?: Array<string>;
    includes?: Array<string>;
  };
  idPattern: string;
}

export interface ModelParams {
  url: string;
  token: string;
  timeout: number;
  version?: string;
}

export interface GetTemplateParams {
  sampleSetRef: string;
}

export interface GetTemplateResult {
  template: Template;
}

export interface GetGroupingParams {
}

export interface GetGroupingResult {
  groups: FieldGroups;
}

export interface GetFieldGroupsParams {
}

export interface GetFieldGroupsResult {
  groups: Array<FieldGroup>;
}

//

// Metadata

export interface UserMetadata {
  [label: string]: string;
}

export interface MetadataFieldBase {
  type: string;
  key: string;
  label: string;
  isEmpty: boolean;
}

export interface MetadataControlledField extends MetadataFieldBase {
  type: "controlled";
  field: FieldValue;
}

export interface MetadataUserField extends MetadataFieldBase {
  type: "user";
  field: UserFieldValue;
}

export type MetadataField =
  | MetadataControlledField
  | MetadataUserField;

export interface MetadataSource {
  [key: string]: MetadataSourceField;
}

export interface MetadataSourceField {
  key: string;
  label: string;
  value: string;
}

export type FormatName = string;

export interface Sample {
  id: SampleId;
  name: string;
  savedAt: EpochTimeMS;
  savedBy: Username;
  version: SampleVersion;
  sample: {
    id: string;
    parentId: string | null;
    type: SampleNodeType;
    metadata: Array<MetadataField>;
    controlled: SimpleMap<MetadataControlledField>;
  };
  formatId: string;
  template: Template;
}

export type GetSampleResult = Sample;

export interface GetFieldDefinitionsParams {
  keys: Array<string>;
}

export interface GetFieldDefinitionsResult {
  fields: Array<SchemaField>;
}

interface SimpleMapping {
  [key: string]: string;
}

export interface FetchSampleProps {
  serviceWizardURL: string;
  userProfileURL: string;
  token: string;
  sampleId: SampleId;
  sampleVersion?: SampleVersion;
  setTitle: (title: string) => void;
}

export default class Model {
  api: SampleServiceClient;

  constructor({ url, token, timeout, version }: ModelParams) {
    this.api = new SampleServiceClient({
      url,
      token,
      timeout,
      version,
    });
  }

  // HACK ALERT: this is not how a template will live in real life
  // TODO: replace when/if templates are supported.
  getTemplate(
    rawSample: RawSample,
    format: Format,
    // fieldDefinitions: FieldDefinitions,
  ): Template {
    // This is the hardcoded "template"
    const templateData: { fields: Array<string> } = (() => {
      switch (rawSample.format_id) {
        case "sesar":
          return sesarTemplateData;
        case "enigma":
          return enigmaTemplateData;
        case "kbase":
          return {
            fields: [],
          };
        default:
          throw new Error(
            `Sorry, no template for format ${rawSample.format_id}`,
          );
      }
    })();

    const sampleMapping = format.mappings.sample as SimpleMapping;
    const recordMapping = format.mappings.record as SimpleMapping;

    const getMappedKey = (key: string) => {
      if (key in recordMapping) {
        return recordMapping[key];
      }
      if (key in sampleMapping) {
        return sampleMapping[key];
      }
    };

    const templateFieldKeys = templateData.fields;

    const metadataFields: Array<TemplateField> = templateFieldKeys.map(
      (key) => {
        return {
          type: "metadata",
          key,
        };
      },
    );

    // now we fetch the user fields from the sample
    const userFields: Array<TemplateField> = Object.keys(
      rawSample.node_tree[0].meta_user,
    )
      .filter((key) => {
        // Here we filter out user keys which are (in error)
        // included in the controlled metadata. This is due
        // to a bug in the importer, and this code should
        // eventually be removed.
        return !(key in rawSample.node_tree[0].meta_controlled);
      })
      .map((key) => {
        // user fields are not in source_meta.
        // but since there have been import bugs regarding
        // incorrect user metadata, we have to detect if they
        // are actually controlled fields.
        const label = (() => {
          if (templateFieldKeys.includes(key)) {
            return `USER ${key}`;
          }
          return key;
        })();

        return {
          type: "user",
          key,
          label,
        };
      });

    // const userFields: Array<TemplateField> = userFieldLabels.map((label) => {
    //   return {
    //     type: "user",
    //     label,
    //   };
    // });

    const templateFields = templateFieldKeys.reduce<Set<string>>(
      (fields, field) => {
        fields.add(field);
        return fields;
      },
      new Set(),
    );

    // Here we handle controlled fields which we know are absent because they
    // are in the template, but not in the sample itself.
    const missingMetadataFields: Array<TemplateField> = Object.entries(
      rawSample.node_tree[0].meta_controlled,
    ).reduce<Array<TemplateField>>((fields, [key, value]) => {
      // In our model, we map the special keys name, id, parent_id back to their
      // original fields. The original field names may be in the canned template above.
      const mappedKey = getMappedKey(key) || key;
      if (mappedKey && templateFields.has(mappedKey)) {
        return fields;
      }
      fields.push({
        type: "metadata",
        key: mappedKey,
      });
      return fields;
    }, []);

    const fields = metadataFields.concat(missingMetadataFields).concat(
      userFields,
    );

    // now we merge them together into the format
    return {
      fields,
    };
  }

  async getSample(params: GetSampleParams): Promise<GetSampleResult> {
    // 1. Get the sample.
    const rawSample = await this.api.get_sample(params);
    const rawRealSample = rawSample.node_tree[0];

    // 2. Get the format
    const { format } = await this.api.get_format({ id: rawSample.format_id });
    const sampleMapping = format.mappings.sample;
    const reverseSampleMapping: SimpleMapping = Object.entries(sampleMapping)
      .reduce<SimpleMapping>((mapping, [key, value]) => {
        mapping[value] = key;
        return mapping;
      }, {});

    const recordMapping = format.mappings.record;
    const reverseRecordMapping: SimpleMapping = Object.entries(recordMapping)
      .reduce<SimpleMapping>((mapping, [key, value]) => {
        mapping[value] = key;
        return mapping;
      }, {});

    // const correctionMapping = format.mappings.corrections || {};
    // const reverseCorrectionMapping: SimpleMapping = Object.entries(correctionMapping).reduce<SimpleMapping>((mapping, [key, value]) => {
    //     mapping[value] = key;
    //     return mapping;
    // }, {});
    // const formatVersion = 1;

    // 3. Get the template.
    // FAKE: now pretend we are fetching the sample set associated with this sample,
    // which will include the template used to upload.
    const template: Template = this.getTemplate(rawSample, format);

    // 2. Get the field definitions for this sample.
    const keys = template.fields
      .filter((field) => {
        return field.type === "metadata";
      })
      .map((field) => {
        if (field.type === "metadata") {
          return field.key;
        } else {
          throw new Error("Impossible!");
        }
      });
    // keys.forEach((key) => {
    //   if (key in reverseRecordMapping) {
    //     keys.push(reverseRecordMapping[key]);
    //   }
    //   if (key in reverseSampleMapping) {
    //     keys.push(reverseSampleMapping[key]);
    //   }
    // });

    // also include mapped keys

    const { fields } = await this.api.get_field_definitions({ keys });

    // Make a map for quick lookup.
    const fieldDefinitions: Map<string, SchemaField> = fields.reduce(
      (defMap, fieldDef) => {
        defMap.set(fieldDef.kbase.sample.key, fieldDef);
        return defMap;
      },
      new Map(),
    );

    // We expand the metadata into the full template.
    // const sampleMappings = format.mappings.sample as { [key: string]: string };
    // const correctionMappings = format.mappings.corrections || {};
    // const recordMappings = format.mappings.record || {};

    // We reconstruct the full metadata here, using the definition of the metadata for this format.
    // A few gotchas here.
    // Currently the sample importer will transform some sample fields into canonical non-metadata fields:
    // id - the user supplied id (e.g. sample_id for enigma, igsn for sesar)
    // parent_id - the user supplied parent id (e.g. well_name for enigma, parent_igsn for sesar)
    // name -- ???
    // we reverse those back to their original sample field names for metadata. They are of retained in the
    // sample outside of the metadata.
    // This is done using the mappings part of the sample format definition.
    // Specifically mappings.sample provides a mapping from the sample fields (id, parent_id) to the
    // format-specific names for those fields.
    //
    // Another gotcha is that some fields end up weird after the sample import transformation.
    // See, the sample importer will construct keys schema of column names using certain rules, e.g. space to underscore.
    // This results in some strange keys.
    // I refuse to replicate that in the format spec, but accommodate that (for now ONLY) using a "corrections" mapping.
    // This mapping, mappings.corrections, maps from the incorrect to the correct field.
    // e.g. redox_potential_?: redox_potential
    const controlled: SimpleMap<MetadataControlledField> = {};
    const metadata = template.fields.map<MetadataField>((templateField) => {
      // Skip user fields in the template.
      if (templateField.type === "user") {
        const userFieldValue = rawRealSample.meta_user[templateField.key].value;
        const a: MetadataUserField = {
          type: "user",
          key: templateField.key,
          label: templateField.label,
          // value: fieldValue.value,
          // units: unit,
          isEmpty: userFieldValue ? true : false,
          field: userFieldValue,
          // definition: fieldDefinition,
        };
        return a;
      }

      const fieldDefinition = fieldDefinitions.get(templateField.key);

      if (!fieldDefinition) {
        console.error("undefined field", fieldDefinitions, templateField.key);
        throw new Error(
          `Sorry, field "${templateField.key}" is not defined`,
        );
      }

      // map the template key back to the mapped key.
      const reverseMappedKey = ((key) => {
        // sample mapping is first, because the record mapping (name)
        // may be the same as the sample mapping (id)
        if (key in reverseSampleMapping) {
          return reverseSampleMapping[key];
        }
        if (key in reverseRecordMapping) {
          return reverseRecordMapping[key];
        }

        return key;
      })(templateField.key);

      const mappedKey = templateField.key;

      const fieldValue: MetadataValue | null = (() => {
        const value = rawRealSample.meta_controlled[reverseMappedKey];
        if (typeof value === "undefined") {
          return null;
        }
        return value;
      })();

      const unit = (() => {
        if (fieldValue && fieldValue.units) {
          return fieldValue.units;
        }
        if (!fieldDefinition.kbase.units) {
          return "unit";
        }
        if (!fieldDefinition.kbase.units.canonical) {
          return "unit";
        }
        return fieldDefinition.kbase.units.canonical;
      })();

      const field: FieldValue = (() => {
        switch (fieldDefinition.type) {
          case "string":
            const y: FieldStringValue = {
              type: "string",
              format: fieldDefinition.format,
              schema: fieldDefinition,
              isEmpty: fieldValue === null,
              unit: fieldValue !== null ? fieldValue.units : undefined,
              stringValue: fieldValue === null
                ? fieldValue
                : fieldValue.value as string,
            };
            return y;
          // case "text":
          //     return {
          //         schema: fieldDefinition,
          //         value: fieldValue === null
          //             ? fieldValue
          //             : fieldValue.value as string | null,
          //     };
          case "number":
            const x: FieldNumberValue = {
              type: "number",
              schema: fieldDefinition,
              isEmpty: fieldValue === null,
              unit: fieldValue !== null ? fieldValue.units : undefined,
              numberValue: fieldValue === null
                ? fieldValue
                : fieldValue.value as number,
            };
            return x;
            // case "boolean":
            //     return {
            //         schema: fieldDefinition,
            //         value: fieldValue === null
            //             ? fieldValue
            //             : fieldValue.value as boolean | null,
            //     };
            // case "Enum<string>":
            //     return {
            //         ...fieldDefinition.type,
            //         value: fieldValue === null
            //             ? fieldValue
            //             : fieldValue.value as string | null,
            //     };
            // case "OntologyTerm":
            //     return {
            //         ...fieldDefinition.type,
            //         value: fieldValue === null
            //             ? fieldValue
            //             : fieldValue.value as string | null,
            //     };
            // default:
            //     throw new Error(
            //         `Unsupported field type ${fieldDefinition.type}`,
            //     );
        }
      })();

      const controlledField: MetadataControlledField = {
        type: "controlled",
        key: mappedKey,
        label: fieldDefinition.kbase.display.label,
        // value: fieldValue.value,
        // units: unit,
        isEmpty: field.isEmpty,
        field,
        // definition: fieldDefinition,
      };
      controlled[mappedKey] = controlledField;
      return controlledField;
    });

    return {
      id: rawSample.id,
      name: rawSample.name,
      savedAt: rawSample.save_date,
      savedBy: rawSample.user,
      version: rawSample.version,
      sample: {
        id: rawRealSample.id,
        type: rawRealSample.type,
        parentId: rawRealSample.parent,
        metadata,
        controlled,
      },
      formatId: rawSample.format_id,
      template,
    };
  }

  getDataLinks(
    params: GetDataLinksFromSampleParams,
  ): Promise<GetDataLinksFromSampleResult> {
    return this.api.get_data_links_from_sample(params);
  }

  getMetadataKeyStaticMetadata(
    params: GetMetadataKeyStaticMetadataParams,
  ): Promise<GetMetadataKeyStaticMetadataResult> {
    return this.api.get_metadata_key_static_metadata(params);
  }

  getACL(params: GetSampleACLsParams): Promise<GetSampleACLsResult> {
    return this.api.get_sample_acls(params);
  }

  async getGrouping(params: GetGroupingParams): Promise<GetGroupingResult> {
    // get the layout ... faked for now, just one.
    const { groups } = await this.api.get_field_groups(
      {},
    );
    const fieldGroups = groups.reduce<FieldGroups>((groups, group) => {
      groups.set(group.name, group);
      return groups;
    }, new Map());
    return {
      groups: fieldGroups,
    };
  }

  async getFieldGroups(
    params: GetFieldGroupsParams,
  ): Promise<GetFieldGroupsResult> {
    // get the layout ... faked for now, just one.
    const { groups } = await this.api.get_field_groups(
      {},
    );
    return { groups };
  }

  async getFormat(params: GetFormatParams): Promise<GetFormatResult> {
    const { format } = await this.api.get_format({ id: params.id });
    return { format };
  }

  async getFieldDefinitions(
    params: GetFieldDefinitionsParams,
  ): Promise<GetFieldDefinitionsResult> {
    return await this.api.get_field_definitions({ keys: params.keys });
  }
}
