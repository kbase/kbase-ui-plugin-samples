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
} from "../comm/dynamicServices/SampleServiceClient";

import sesarTemplateData from "./data/templates/sesar/sesar1.json";
import enigmaTemplateData from "./data/templates/enigma/enigma1.json";
import { Template, TemplateField } from "../../components/Main/types";
import {
    FieldDefinition,
    FieldDefinitions,
    FieldGroup,
    FieldGroups,
    FieldValue,
    Format,
} from "../comm/dynamicServices/samples/Samples";
import { MetadataValue, SampleId, SampleNodeType, SampleVersion, Sample as RawSample } from "../comm/dynamicServices/Sample";

// Deal with source definitions.

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

// Metadata Definitions and Friends
// export interface FieldDefinitionBase {
//     key: string;
//     type: 'integer' | 'float' | 'string' | 'date';
//     kind: 'registration' | 'descriptive' | 'user';
//     label: string;
//     description?: string;
//     units?: string;
// }

// export interface FieldDefinitionInteger extends FieldDefinitionBase {
//     type: 'integer';
//     minimum_value?: number;
//     maximum_value?: number;
// }

// export type NumberStyle = 'unit' | 'decimal' | 'currency' | 'percent' | 'unit';

// export interface FieldDefinitionFloat extends FieldDefinitionBase {
//     type: 'float';
//     // constraints;
//     greater_than_or_equal?: number;
//     less_than_or_equal?: number;
//     greater_than?: number;
//     less_than?: number;
//     // Formatting
//     // Note follows ECMAScript Int.NumberFormat https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
//     style: NumberStyle;
//     useGrouping?: boolean;
//     minimumIntegerDigits?: number;
//     minimumFractionDigits?: number;
//     maximumFractionDigits?: number;
//     minimumSignificantDigits?: number;
//     maximumSignificantDigits?: number;
//     // precision?: number;
//     // decimal_places?: number;
// }

// export interface FieldDefinitionString extends FieldDefinitionBase {
//     type: 'string';
//     // constraints
//     regex?: string;
//     length_greater_than_or_equal?: number;
//     length_less_than_or_equal?: number;
//     length_greater_than?: number;
//     length_less_than?: number;
//     // formatting
// }

// export interface FieldDefinitionDate extends FieldDefinitionBase {
//     type: 'date';
//     // constraints
//     minimum_value?: number;
//     maximum_value?: number;
//     // formatting
// }

// export type FieldDefinition = FieldDefinitionInteger | FieldDefinitionFloat | FieldDefinitionString | FieldDefinitionDate;

// export interface FieldDefinitionsMap {
//     [key: string]: FieldDefinition;
// }

// export interface GetMetadataDefinitionsParams {

// }

// export interface GetMetadataDefinitionsResult {
//     // field_definitions: Array<FieldDefinition>;
//     field_definitions: FieldDefinitionsMap;
// }

export interface GetTemplateParams {
    sampleSetRef: string;
}

export interface GetTemplateResult {
    // definition: TemplateDefinition;
    template: Template;
    // metadataFields: Array<FieldDefinition>;
    // id: string;
    // version: number;
    // saved_at: number;
    // saved_by: string;
    // description: string;
    // source: string;
    // fields: Array<FieldDefinition>;
}

export interface GetGroupingParams {
    //   format: string;
    //   version?: number;
}

export interface GetGroupingResult {
    groups: FieldGroups;
}

export interface GetFieldGroupsParams {
}

export interface GetFieldGroupsResult {
    groups: Array<FieldGroup>;
}

export type Username = string;

export type EpochTimeMS = number;

export interface Metadata {
    [key: string]: MetadataField;
}

export interface UserMetadata {
    [label: string]: string;
}

export interface MetadataField {
    key: string;
    label: string;
    //   value: string | number | boolean | null;
    units: string;
    //   definition: FieldDefinition;
    field: FieldValue;
}

export interface MetadataStringField {
}

// export interface UserMetadataField {
//     label: string;
//     value: string;
// }

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
        // source: string;
        // templateId: string;
        id: string;
        parentId: string | null;
        type: SampleNodeType;
        metadata: Metadata;
        userMetadata: UserMetadata;
    };
    //   format: Format;
    formatId: string;
    template: Template;
    //   fieldDefinitions: FieldDefinitions;
}

export type GetSampleResult = Sample;

export interface GetFieldDefinitionsResult {
    fields: Array<FieldDefinition>;
}

// Get sample format

// export interface GetSampleSourceParams {
//     id: string;
// }

// export interface GetSampleSourceResult {
//     source: SampleSource;
// }

//

interface SimpleMapping {
    [key: string]: string;
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
        const templateData: { fields: Array<string>; } = (() => {
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
                return !(key in rawSample.node_tree[0].meta_controlled);
            })
            .map((key) => {
                // user fields are not in source_meta.
                // but since there have been import bugs regarding
                // incorrect user metadata, we have to detect if they
                // are actually controlled fields.
                // console.log("user label?", key, templateFieldKeys);
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

        //   const { fields } = await this.api.get_all_field_definitions({ keys });
        const fieldDefinitions: FieldDefinitions = fields.reduce<
            FieldDefinitions
        >((defMap, fieldDef) => {
            defMap.set(fieldDef.id, fieldDef);
            return defMap;
        }, new Map());

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
        // See, the sample importer will construct keys out of column names using certain rules, e.g. space to underscore.
        // This results in some strange keys.
        // I refuse to replicate that in the format spec, but accommodate that (for now ONLY) using a "corrections" mapping.
        // This mapping, mappings.corrections, maps from the incorrect to the correct field.
        // e.g. redox_potential_?: redox_potential
        const metadata: Metadata = template.fields.reduce<Metadata>(
            (metadata, rawField) => {
                if (rawField.type === "user") {
                    return metadata;
                }

                const fieldDefinition = fieldDefinitions.get(rawField.key);

                if (!fieldDefinition) {
                    console.error("undefined field", fieldDefinitions, rawField.key);
                    throw new Error(
                        `Sorry, field "${rawField.key}" is not defined`,
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
                })(rawField.key);

                const mappedKey = rawField.key;

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
                    if (!fieldDefinition.units) {
                        return "unit";
                    }
                    if (!fieldDefinition.units.canonical) {
                        return "unit";
                    }
                    return fieldDefinition.units.canonical;
                })();

                const field: FieldValue = (() => {
                    switch (fieldDefinition.type.type) {
                        case "string":
                            return {
                                ...fieldDefinition.type,
                                value: fieldValue === null
                                    ? fieldValue
                                    : fieldValue.value as string | null,
                            };
                        case "text":
                            return {
                                ...fieldDefinition.type,
                                value: fieldValue === null
                                    ? fieldValue
                                    : fieldValue.value as string | null,
                            };
                        case "number":
                            return {
                                ...fieldDefinition.type,
                                value: fieldValue === null
                                    ? fieldValue
                                    : fieldValue.value as number | null,
                            };
                        case "boolean":
                            return {
                                ...fieldDefinition.type,
                                value: fieldValue === null
                                    ? fieldValue
                                    : fieldValue.value as boolean | null,
                            };
                        case "Enum<string>":
                            return {
                                ...fieldDefinition.type,
                                value: fieldValue === null
                                    ? fieldValue
                                    : fieldValue.value as string | null,
                            };
                        case "OntologyTerm":
                            return {
                                ...fieldDefinition.type,
                                value: fieldValue === null
                                    ? fieldValue
                                    : fieldValue.value as string | null,
                            };
                        default:
                            throw new Error(
                                `Unsupported field type ${fieldDefinition.type.type}`,
                            );
                    }
                })();

                if (!fieldValue) {
                    metadata[mappedKey] = {
                        key: mappedKey,
                        label: fieldDefinition.label,
                        // value: null,
                        units: unit,
                        // definition: fieldDefinition,
                        field,
                    };
                } else {
                    metadata[mappedKey] = {
                        key: mappedKey,
                        label: fieldDefinition.label,
                        // value: fieldValue.value,
                        units: unit,
                        field,
                        // definition: fieldDefinition,
                    };
                }
                return metadata;
            },
            {},
        );

        const userMetadata: UserMetadata = template.fields.reduce<UserMetadata>(
            (metadata, field) => {
                if (field.type === "metadata") {
                    return metadata;
                }
                const fieldValue = rawRealSample.meta_user[field.key];
                metadata[field.label] = String(fieldValue.value);
                return metadata;
            },
            {},
        );

        // const userMetadata2: UserMetadata = (() => {
        //     return Object.entries(rawRealSample.meta_user).reduce((metadata, [key, field]) => {
        //         const label = key;
        //         metadata[label] = String(field.value);
        //         return metadata;
        //     }, {} as UserMetadata);
        // })();

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
                // source: templateDefinition.source,
                // templateId: templateDefinition.id,
                metadata,
                userMetadata,
            },
            formatId: rawSample.format_id,
            template,
            //   fieldDefinitions,
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

    // Not in sample service
    // async getMetadataDefinitions(params: GetMetadataDefinitionsParams): Promise<GetMetadataDefinitionsResult> {
    //     const fieldDefinitions: Array<FieldDefinition> = metadataDefinitions;
    //     const field_definitions: FieldDefinitionsMap = fieldDefinitions.reduce((field_definitions: FieldDefinitionsMap, def: FieldDefinition) => {
    //         field_definitions[def.key] = def;
    //         return field_definitions;
    //     }, {});
    //     return Promise.resolve({
    //         field_definitions
    //     });
    // }

    // async getTemplate(params: GetTemplateParams): Promise<GetTemplateResult> {
    //     // Look up the template given the id... fake for now.
    //     const template = (() => {
    //         switch (params.sampleSetRef) {
    //             case 'sesar_sample_set':
    //                 return sesarTemplateData;
    //             case 'enigma_sample_set':
    //                 return enigmaTemplateData;
    //             default:
    //                 throw new Error(`Sorry, unsupported fake sample set ref ${params.sampleSetRef}`);
    //         }
    //     })();
    //     return Promise.resolve({ template });
    //     // const definition = templateDefinitions.templates[params.id];
    //     // const template = (() => {
    //     //     switch (params.id) {
    //     //         case 'sesar1':
    //     //             return sesar1Template;
    //     //         case 'enigma1':
    //     //             return enigma1Template;
    //     //         default:
    //     //             throw new Error('Template not found: ' + params.id);
    //     //     }
    //     // })();
    //     // const fieldDefinitions: Array<FieldDefinition> = metadataDefinitions;
    //     // const fieldDefinitionsMap: FieldDefinitionsMap = fieldDefinitions.reduce((field_definitions: FieldDefinitionsMap, def: FieldDefinition) => {
    //     //     field_definitions[def.key] = def;
    //     //     return field_definitions;
    //     // }, {});

    //     // const metadataFields = template.columns.map((column) => {
    //     //     const field = fieldDefinitionsMap[column];
    //     //     if (!field) {
    //     //         // throw new Error(`Unknown field ${column} in template ${params.id}`);
    //     //         console.warn(`Unknown field ${column} in template ${params.id}`);
    //     //         const x: FieldDefinition = {
    //     //             key: column,
    //     //             label: column,
    //     //             description: `Unknown field ${column} in template ${params.id}`,
    //     //             type: 'string',
    //     //             kind: 'descriptive'
    //     //         };
    //     //         return x;
    //     //     }
    //     //     return field;
    //     // });

    //     // return Promise.resolve({
    //     //     definition, template, metadataFields
    //     // });
    // }

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
        // switch (params.id) {
        //     case 'sesar1':
        //         // console.log('grouping...', sesar1Template.grouping);
        //         return Promise.resolve({
        //             grouping: sesar1Template.grouping
        //         });
        //     case 'enigma1':
        //         return Promise.resolve({
        //             grouping: enigma1Template.grouping
        //         });
        //     default:
        //         throw new Error(`Unrecognized template ${params.id}`);
        // }
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

    async getFieldDefinitions(): Promise<GetFieldDefinitionsResult> {
        const result = await this.api.get_field_definitions({});
        return result;
    }

    // async getSampleSource(params: GetSampleSourceParams): Promise<GetSampleSourceResult> {
    //     switch (params.id) {
    //         case 'sesar':
    //             return Promise.resolve({
    //                 source: sampleSources.sources.sesar
    //             });
    //         case 'enigma':
    //             return Promise.resolve({
    //                 source: sampleSources.sources.enigma
    //             });
    //         default:
    //             throw new Error(`Unrecognized sample source ${params.id}`);
    //     }
    // }
}
