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
import {ServiceClient} from "@kbase/ui-lib";
import {JSONObject, objectToJSONObject} from "@kbase/ui-lib/lib/lib/json";
import {ServiceClientParams} from "@kbase/ui-lib/lib/comm/JSONRPC11/ServiceClient";
import {ControlledField} from "./ControlledField";
import {Format} from "./Format";

export type ControlledFieldKey = string;

export interface FieldGroup {
    name: string;
    title: string;
    fields: Array<ControlledFieldKey>;
}

export type FieldGroups = Array<FieldGroup>;

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
    ids: Array<string>;
    version?: number;
}

export interface FormatSource {
    name: string;
    url: string;
    logoUrl: string;
}

export interface GetFormatResult {
    formats: Array<Format>;
}

export interface GetFieldDefinitionsParams {
    keys: Array<string>;
}

export interface GetFieldDefinitionsResult {
    fields: Array<ControlledField>;
}

export interface GetFieldGroupsParams {
}

export interface GetFieldGroupsResult {
    groups: FieldGroups;
}

export interface SampleServiceClientParams extends ServiceClientParams {
    url: string;
}

export default class SampleServiceClient extends ServiceClient {
    module: string = "SampleService";

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

    async get_formats(params: GetFormatParams): Promise<GetFormatResult> {
        const formats = await Promise.all(params.ids.map(async (formatId) => {
            const result = await fetch(
                `${process.env.PUBLIC_URL}/mock-data/formats/${formatId.toLowerCase()}.json`,
            );
            if (result.status >= 300) {
                throw new Error(`Error fetching format ${formatId} (${result.status})`);
            }
            const payload = await result.text();
            try {
                return JSON.parse(payload) as Format;
            } catch (ex) {
                throw new Error(
                    `Invalid JSON schema for format "${formatId}": ${ex.message}`,
                );
            }
        }));
        return {
            formats
        };
    }

    async fetchSchema(schemaName: string): Promise<ControlledField> {
        const result = await fetch(
            `${process.env.PUBLIC_URL}/mock-data/schemas/${schemaName}.json`,
        );

        if (result.status >= 300) {
            throw new Error(`Error fetching schema for ${schemaName} (${result.status})`);
        }

        return await (async () => {
            const payload = await result.text();
            try {
                return JSON.parse(payload) as ControlledField;
            } catch (ex) {
                console.error('ERROR parsing field schema', ex, result.status);
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
            const scrubbedKey = key.replace(/[:]/, "-");
            return await this.fetchSchema(scrubbedKey);
        }));
        return {fields};
    }

    async get_field_groups(): Promise<GetFieldGroupsResult> {
        const result = await fetch(
            `${process.env.PUBLIC_URL}/mock-data/groups/groups.json`,
        );

        if (result.status >= 300) {
            throw new Error(`Error fetching group definitions (${result.status})`);
        }

        return await (async () => {
            const payload = await result.text();
            try {
                const groups = JSON.parse(payload) as FieldGroups;
                return {groups};
            } catch (ex) {
                throw new Error(
                    `Invalid JSON for group definitions: ${ex.message}`,
                );
            }
        })();
    }
}
