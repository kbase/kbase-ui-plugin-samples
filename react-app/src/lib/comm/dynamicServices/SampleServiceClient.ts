import { DynamicServiceClient } from "../JSONRPC11x/DynamicServiceClient";

import sesarData from "./formats/sesar/sesar.json";
import enigmaData from "./formats/enigma/enigma.json";
import kbaseData from "./formats/kbase/kbase.json";
import fieldDefinitions from "./samples/sample-fields.json";
import {
    FieldDefinition,
    FieldDefinitions,
    FieldGroup,
    Format,
} from "./samples/Samples";

import sesarTemplateData from "../../Model/data/templates/sesar/sesar1.json";
import enigmaTemplateData from "../../Model/data/templates/enigma/enigma1.json";

import fieldGroups from "./samples/sample-field-groups.json";
const fieldGroupsData = fieldGroups as Array<FieldGroup>;

const sesarFormatData = sesarData as Format;
const enigmaFormatData = enigmaData as Format;
const kbaseFormatData = kbaseData as Format;
const fieldDefinitionsData = fieldDefinitions as Array<FieldDefinition>;

const fieldDefinitionsMap: FieldDefinitions = fieldDefinitionsData.reduce<
    FieldDefinitions
>((defMap, fieldDef) => {
    defMap.set(fieldDef.id, fieldDef);
    return defMap;
}, new Map());

export interface StatusResult {
    state: string;
    message: string;
    version: string;
    git_url: string;
    git_commit_hash: string;
}

export type SDKBoolean = 0 | 1;

export type SampleNodeId = string;

export type SampleId = string;

export type SampleVersion = number;

export type Username = string;

export type EpochTimeMS = number;

export type SampleNodeType = "BioReplicate" | "TechReplicate" | "SubSample";

export type WSUPA = string;
export type WorkspaceUniquePermanentAddress = WSUPA;

// export interface UserMetadata {
//     [k: string]: MetadataValue;
// }

export interface MetadataValue {
    value: string | number | boolean;
    units: string;
}

// TODO: interfaces for specific controlled metadata.
// may not be practical, but consider it.
// export interface ControlledMetadata {
//     [k: string]: MetadataValue;
// }

export type MetadataSource = Array<MetadataSourceField>;

export interface MetadataSourceField {
    key: string;
    skey: string;
    svalue: {
        value: string;
    };
}

export interface SampleNode {
    id: SampleNodeId;
    parent: SampleNodeId | null;
    type: SampleNodeType;
    meta_controlled: Metadata;
    meta_user: Metadata;
    source_meta: MetadataSource;
}

export interface Sample {
    id: SampleId;
    user: Username;
    node_tree: Array<SampleNode>;
    name: string;
    save_date: EpochTimeMS;
    version: SampleVersion;
    // TODO: these fields don't yet exist upstream.
    format_id: string;
    format_version: number;
    sample_set_ref: string;
}

/* Types for the get_sample method*/
export interface GetSampleParams {
    id: SampleId;
    version?: number;
    as_admin?: SDKBoolean;
}

export type GetSampleResult = Sample;

/* Types for the get_data_links_from_sample method */
export interface GetDataLinksFromSampleParams {
    id: SampleId;
    version: SampleVersion;
    effective_time?: EpochTimeMS;
}

export type DataId = string;

export interface DataLink {
    linkid: string;
    upa: WSUPA;
    dataid: DataId | null;
    id: SampleId;
    version: SampleVersion;
    node: SampleNodeId;
    created: EpochTimeMS;
    createdby: Username;
    expiredby: Username | null;
    expired: EpochTimeMS | null;
}

export interface GetDataLinksFromSampleResult {
    links: Array<DataLink>;
}

export type KeyPrefix = 0 | 1 | 2;

export interface GetMetadataKeyStaticMetadataParams {
    keys: Array<string>;
    prefix: KeyPrefix;
}

// export type MetadataValue = int | float | string;

export interface Metadata {
    [key: string]: MetadataValue;
}

export interface StaticMetadataValue {
    display_name: string;
    description?: string;
}

export interface StaticMetadata {
    [key: string]: StaticMetadataValue;
}

export interface GetMetadataKeyStaticMetadataResult {
    static_metadata: StaticMetadata;
}

export interface GetSampleACLsParams {
    id: SampleId;
    as_admin: SDKBoolean;
}

export interface SampleACLs {
    owner: Username;
    admin: Array<Username>;
    write: Array<Username>;
    read: Array<Username>;
}

export type GetSampleACLsResult = SampleACLs;

export interface GetFormatParams {
    id: string;
    version?: number;
}

export interface FormatSource {
    name: string;
    url: string;
    logoUrl: string;
}

export type FormatFieldType =
    | "string"
    | "number"
    | "boolean"
    | "date"
    | "enum<string>"
    | "controlled_list";

// Field Definitions

export interface FormatFieldBase {
    // id: string;
    type: FormatFieldType;
    label: string;
    // tooltip: string;
    description?: string;
    notes?: Array<string>;
    units?: {
        available?: Array<string>;
        availableFromList?: string;
        canonical?: string;
        fromField?: string;
    };
    constraints?: FormatFieldBaseConstraints;
}

export interface FormatFieldBaseConstraints {
    required?: boolean;
}

// NB using type intersection rather than extends, since we are also extending the
// nested interface for constraints.
// see, e.g.: https://stackoverflow.com/questions/53636756/typescript-interface-extending-another-interface-with-nested-properties

// String

export interface FormatFieldStringConstraints
    extends FormatFieldBaseConstraints {
    minimumLength?: number;
    maximumLength?: number;
    regex?: string;
    suggestedList: string;
    url?: boolean;
}
export interface FormatFieldString extends FormatFieldBase {
    type: "string";
    constraints?: FormatFieldStringConstraints;
} // Controlled List

export interface FormatFieldControlledListConstraints
    extends FormatFieldBaseConstraints {
    list?: string;
    lists?: Array<string>;
}
export interface FormatFieldControlledList extends FormatFieldBase {
    type: "controlled_list";
    constraints: FormatFieldControlledListConstraints;
} // Number

export interface FormatFieldNumberConstraints
    extends FormatFieldBaseConstraints {
    gte?: number;
    gt?: number;
    lte?: number;
    lt?: number;
}
export interface FormatFieldNumber extends FormatFieldBase {
    type: "number";
    constraints?: FormatFieldNumberConstraints;
    format?: {
        type: string;
        decimalPlaces?: number;
    };
} // date

export interface FormatFieldDateConstraints extends FormatFieldBaseConstraints {
    gte?: number;
    gt?: number;
    lte?: number;
    lt?: number;
}
export interface FormatFieldDate extends FormatFieldBase {
    type: "date";
    constraints?: FormatFieldDateConstraints;
} // boolean

export interface FormatFieldBooleanConstraints
    extends FormatFieldBaseConstraints {
}
export interface FormatFieldBoolean extends FormatFieldBase {
    type: "boolean";
    constraints?: FormatFieldBooleanConstraints;
} // enum

export interface FormatFieldEnumConstraints extends FormatFieldBaseConstraints {
    values: Array<string>;
}
export interface FormatFieldEnum extends FormatFieldBase {
    type: "enum<string>";
    constraints: FormatFieldEnumConstraints;
}

export type FormatField =
    | FormatFieldString
    | FormatFieldNumber
    | FormatFieldBoolean
    | FormatFieldDate
    | FormatFieldEnum
    | FormatFieldControlledList;

// A format source represents a temporary data structure matching what we have in the JSON file here.
// export interface FormatData {
//   id: string;

//     name: string;
//     title: string;
//     description: string;
//     source: {
//       name: string;
//       title: string;
//       logo_url?: string;
//       url: string;
//     };

//   //   latestVersion: number;
//   //   versions: Array<{
//   //     version: number;
//   mappings: {
//     header?: Array<string>;
//     // sample: {
//     //     id: string;
//     //     parent_id: string;
//     // };
//     record: { [key: string]: string };
//     sample: { [key: string]: string };
//     corrections?: { [key: string]: string };
//   };
//   // field_definitions: { [key: string]: FormatField };
//   layouts: {
//     grouped: Array<LayoutGroup>;
//   };
//   //   }>;
// }

// Field Values

// export interface FormatFieldValueBase {
//   id: string;
//   unit: string;
//   type: FormatFieldType;
// }

// export interface FormatFieldValueString extends FormatFieldValueBase {
//   type: "string";
//   value: string;
// }

// export interface FormatFieldValueNumber extends FormatFieldValueBase {
//   type: "number";
//   value: number;
// }

// export type FormatFieldValue = FormatFieldValueString | FormatFieldValueNumber;

export interface GetFormatResult {
    format: Format;
}

export interface GetFieldDefinitionsParams {
    keys: Array<string>;
}

export interface GetFieldDefinitionsResult {
    fields: Array<FieldDefinition>;
}

export interface GetFieldGroupsParams {
}

export interface GetFieldGroupsResult {
    groups: Array<FieldGroup>;
}

function intersect(arr1: Array<string>, arr2: Array<string>): Array<string> {
    return arr1.filter((key) => {
        return arr2.includes(key);
    });
}

export default class SampleServiceClient extends DynamicServiceClient {
    static module: string = "SampleService";

    async status(): Promise<StatusResult> {
        const [result] = await this.callFunc<[], [StatusResult]>("status", []);
        return result;
    }

    async get_sample(params: GetSampleParams): Promise<GetSampleResult> {
        const [result] = await this.callFunc<[GetSampleParams], [GetSampleResult]>(
            "get_sample",
            [params],
        );

        // FAKE: this will actually be provided by upstream, if the design goes through.

        function grokFormat(): string {
            // try again:

            // if a sample contains fields not defined by a format, then it isn't that format!
            const controlledKeys = Object.keys(result.node_tree[0].meta_controlled);
            const standardKeys = ["id", "name", "parent_id"];
            const commonKeys = intersect(
                sesarFormatData.fields,
                enigmaFormatData.fields,
            );
            const ignoreKeys = commonKeys.concat(standardKeys);

            const notSesar = controlledKeys.filter((key) => {
                if (ignoreKeys.includes(key)) {
                    return false;
                }
                return !sesarFormatData.fields.includes(key);
            });

            const notEnigma = controlledKeys.filter((key) => {
                if (ignoreKeys.includes(key)) {
                    return false;
                }
                return !enigmaFormatData.fields.includes(key);
            });

            const sesarIntersect = controlledKeys.filter((key) => {
                if (ignoreKeys.includes(key)) {
                    return false;
                }
                return sesarTemplateData.fields.includes(key);
            });

            const enigmaIntersect = controlledKeys.filter((key) => {
                if (ignoreKeys.includes(key)) {
                    return false;
                }
                return enigmaTemplateData.fields.includes(key);
            });

            if (sesarIntersect.length > 0 && notSesar.length === 0) {
                return "sesar";
            }

            if (enigmaIntersect.length > 0 && notEnigma.length === 0) {
                return "enigma";
            }

            // console.log(
            //     "KBASE",
            //     commonKeys,
            //     standardKeys,
            //     ignoreKeys,
            //     notSesar,
            //     notEnigma,
            //     sesarIntersect,
            //     enigmaIntersect,
            // );
            return "kbase";
        }

        result.format_id = grokFormat();
        result.format_version = 1;
        result.sample_set_ref = (() => {
            switch (result.format_id) {
                case "sesar":
                    return "sesar_sample_set";
                case "enigma":
                    return "enigma_sample_set";
                case "kbase":
                    return "kbase_sample_set";
                default:
                    throw new Error(
                        `Sorry, cannot fake sample set ref for ${result.format_id}`,
                    );
            }
        })();

        return result;
    }

    async get_data_links_from_sample(
        params: GetDataLinksFromSampleParams,
    ): Promise<GetDataLinksFromSampleResult> {
        const [result] = await this.callFunc<
            [GetDataLinksFromSampleParams],
            [GetDataLinksFromSampleResult]
        >("get_data_links_from_sample", [params]);
        return result;
    }

    async get_metadata_key_static_metadata(
        params: GetMetadataKeyStaticMetadataParams,
    ): Promise<GetMetadataKeyStaticMetadataResult> {
        const [result] = await this.callFunc<
            [GetMetadataKeyStaticMetadataParams],
            [GetMetadataKeyStaticMetadataResult]
        >("get_metadata_key_static_metadata", [params]);
        return result;
    }

    // async get_field_definitions(params: GetFieldDefinitionsParams): Promise<GetFieldDefinitionsResult> {
    //     const [result] = await this.callFunc<[GetFieldDefinitionsParams], [GetFieldDefinitionsResult]>('get_field_definitions', [params]);
    //     return result;
    // }

    async get_field_definitions(
        params: GetFieldDefinitionsParams,
    ): Promise<GetFieldDefinitionsResult> {
        const fields = params.keys.map((key) => {
            if (!fieldDefinitionsMap.has(key)) {
                throw new Error(`Field "${key}" is not defined`);
            }
            return fieldDefinitionsMap.get(key)!;
        });
        return Promise.resolve({
            fields,
        });
    }

    async get_field_groups(
        params: GetFieldGroupsParams,
    ): Promise<GetFieldGroupsResult> {
        const groups = fieldGroupsData;
        return Promise.resolve({
            groups,
        });
    }

    async get_sample_acls(
        params: GetSampleACLsParams,
    ): Promise<GetSampleACLsResult> {
        const [result] = await this.callFunc<
            [GetSampleACLsParams],
            [GetSampleACLsResult]
        >("get_sample_acls", [params]);
        return result;
    }

    async get_format(params: GetFormatParams): Promise<GetFormatResult> {
        // const [result] = await this.callFunc<[GetFormatParams], [GetFormatResult]>('get_sample_acls', [params]);
        const format = (() => {
            switch (params.id) {
                case "sesar":
                    return sesarFormatData;
                case "enigma":
                    return enigmaFormatData;
                case "kbase":
                    return kbaseFormatData;
                default:
                    throw new Error(`Sorry, ${params.id} not a recognized format`);
            }
        })();
        // const version = params.version || formatData.latestVersion;
        return Promise.resolve({
            format,
        });
    }
}
