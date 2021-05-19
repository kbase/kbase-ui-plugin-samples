import sesarData from "./formats/sesar/sesar.json";
import enigmaData from "./formats/enigma/enigma.json";
import kbaseData from "./formats/kbase/kbase.json";
import categoriesData from "./samples/categories.json";
import groupsData from './formats/grouping.json';
import {
    FieldCategory,
    FieldGroups,
    Format,
    SchemaField,
} from "./samples/Samples";
import {
    EpochTimeMS,
    Sample,
    SampleId,
    SampleNodeId,
    SampleVersion,
    SDKBoolean,
    Username,
    WSUPA,
} from "./Sample";
import {GenericClient, ServiceClient} from "@kbase/ui-lib";
import {JSONObject, objectToJSONObject} from "@kbase/ui-lib/lib/lib/json";
import {ServiceClientParams} from "@kbase/ui-lib/lib/comm/JSONRPC11/ServiceClient";


const sesarFormatData = sesarData as Format;
const enigmaFormatData = enigmaData as Format;
const kbaseFormatData = kbaseData as Format;
const allFormats: { [k: string]: Format; } = {
    sesar: sesarFormatData,
    enigma: enigmaFormatData,
    kbase: kbaseFormatData
};
export const ALL_CATEGORIES = categoriesData as Array<FieldCategory>;
export const REQUEST_TIMEOUT = 10000; // 10 seconds
export const CACHE_TTL = 300000; // 5 minutes

// export const SCHEMA_BASE_URL = 'https://cdn.jsdelivr.net/gh/eapearson/kbase-sdk-module-jsonschema@main/schemas';
// e.g. https://cdn.jsdelivr.net/gh/eapearson/kbase-sdk-module-jsonschema@main/schemas/sample/field/age_max.1-0-0.json
// export const SCHEMA_BASE_URL = 'http://localhost:8080/schema';

export interface StatusResult extends JSONObject {
    state: string;
    message: string;
    version: string;
    git_url: string;
    git_commit_hash: string;
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

export interface DataLink extends JSONObject {
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

export type DataLinks = Array<DataLink>;

export interface GetDataLinksFromSampleResult {
    links: DataLinks;
}

// TODO: document
export type KeyPrefix = 0 | 1 | 2;

export interface GetMetadataKeyStaticMetadataParams extends JSONObject {
    keys: Array<string>;
    prefix: KeyPrefix;
}

// export type MetadataValue = int | float | string;

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

export interface GetSampleACLsParams extends JSONObject {
    id: SampleId;
    as_admin: SDKBoolean;
}

export interface SampleACLs extends JSONObject {
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

export interface GetFormatResult {
    format: Format;
}

export interface GetFieldDefinitionsParams {
    keys: Array<string>;
}

export interface GetFieldDefinitionsResult {
    fields: Array<SchemaField>;
}

export interface GetFieldGroupsParams {
}

export interface GetFieldGroupsResult {
    groups: FieldGroups;
}

export interface GetFieldCategoriesParams {
    ids?: Array<string>;
}

export interface GetFieldCategoriesResult {
    categories: Array<FieldCategory>;
}


export interface SampleServiceClientParams extends ServiceClientParams {
    url: string;
}

export default class SampleServiceClient extends ServiceClient {
    module: string = "SampleService";
    // url: string;
    // schemaURLCacher: URLCacher;

    constructor(params: SampleServiceClientParams) {
        super(params);
        // this.url = params.url;
        // this.client = new GenericClient({
        //     module,
        //     timeout: 10000,
        //     url: this.url,
        //     token: params.token
        // });
        // this.schemaURLCacher = new URLCacher(async () => {
        //     const serviceWizard = new ServiceWizardClient({
        //         timeout: REQUEST_TIMEOUT,
        //         url: params.url,
        //         token: params.token
        //     });
        //     const {url} = await serviceWizard.get_service_status({
        //         module_name: 'JSONSchema',
        //         version: null,
        //     });
        //     return url;
        // }, REQUEST_TIMEOUT, CACHE_TTL);
    }

    async status(): Promise<StatusResult> {
        const [result] = await this.callFunc<[], [StatusResult]>("status", []);
        return result;
    }

    async get_sample(params: GetSampleParams): Promise<GetSampleResult> {
        // TODO: revive the effort to provide result verification and type coercion.
        const [result] = (await this.callFunc<[JSONObject], [JSONObject]>(
            "get_sample",
            [objectToJSONObject(params)],
        ) as unknown) as Array<GetSampleResult>;
        return result;
    }

    async get_data_links_from_sample(
        params: GetDataLinksFromSampleParams,
    ): Promise<GetDataLinksFromSampleResult> {
        const [result] = await this.callFunc<[JSONObject],
            [JSONObject]>("get_data_links_from_sample", [objectToJSONObject(params)]);
        return (result as unknown) as GetDataLinksFromSampleResult;
    }

    async get_metadata_key_static_metadata(
        params: GetMetadataKeyStaticMetadataParams,
    ): Promise<GetMetadataKeyStaticMetadataResult> {
        const [result] = await this.callFunc<[GetMetadataKeyStaticMetadataParams],
            [JSONObject]>("get_metadata_key_static_metadata", [params]);
        return (result as unknown) as GetMetadataKeyStaticMetadataResult;
    }

    async get_sample_acls(
        params: GetSampleACLsParams,
    ): Promise<GetSampleACLsResult> {
        const [result] = await this.callFunc<[GetSampleACLsParams],
            [GetSampleACLsResult]>("get_sample_acls", [params]);
        return result;
    }

    // These are not part of the sample service api, but should be:

    async get_field_categories(
        params: GetFieldCategoriesParams,
    ): Promise<GetFieldCategoriesResult> {
        const categories = (() => {
            const {ids} = params;
            if (ids !== undefined) {
                return ALL_CATEGORIES.filter((category) => {
                    return ids.includes(category.id);
                });
            } else {
                return ALL_CATEGORIES;
            }
        })();

        return Promise.resolve({
            categories
        });
    }

    async get_format(params: GetFormatParams): Promise<GetFormatResult> {
        const format = (() => {
            if (params.id in allFormats) {
                return allFormats[params.id];
            }

            throw new Error(`Sorry, ${params.id} not a recognized format`);
        })();
        return Promise.resolve({
            format,
        });
    }

    async fetchSchema(schemaName: string) {
        // const baseURL = await this.schemaURLCacher.fetch();
        // const path = `sample/fields/${schemaName}.json`;
        // const url = `${baseURL}/schemas/${path}`;

        // Get the schema!
        // const result = await fetch(url);
        const result = await fetch(
            `${process.env.PUBLIC_URL}/schemas/${schemaName}.json`,
        );

        if (result.status >= 300) {
            throw new Error(`Error fetching schema for ${schemaName} (${result.status})`);
        }

        return await (async () => {
            const payload = await result.text();
            try {
                return JSON.parse(payload) as SchemaField;
            } catch (ex) {
                throw new Error(
                    `Invalid JSON schema for field "${schemaName}": ${ex.message}`,
                );
            }
        })();
    }

    async get_field_definitions(
        params: GetFieldDefinitionsParams,
    ): Promise<GetFieldDefinitionsResult> {
        const fields = await Promise.all(params.keys.map(async (key) => {
            // const scrubbedKey = key.replace(/[?:#$%^&*()-+=]/, "_");
            // TODO: remove the version when running against the service.
            const scrubbedKey = key.replace(/[:]/, "-");

            return await this.fetchSchema(scrubbedKey);
            // const url = `${SCHEMA_BASE_URL}/sample/field/${scrubbedKey}.1-0-0.json`;
        }));
        return {fields};
    }

    async get_field_groups(): Promise<GetFieldGroupsResult> {
        const groups = await Promise.resolve((groupsData as unknown) as FieldGroups);
        return {
            groups
        }
    }
}
