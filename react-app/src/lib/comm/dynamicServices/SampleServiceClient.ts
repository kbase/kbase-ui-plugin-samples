import { DynamicServiceClient } from '../JSONRPC11x/DynamicServiceClient';

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

export type SampleNodeType = 'BioReplicate' | 'TechReplicate' | 'SubSample';

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


export interface SampleNode {
    id: SampleNodeId;
    parent: SampleNodeId | null;
    type: SampleNodeType;
    meta_controlled: Metadata;
    meta_user: Metadata;
}

export interface Sample {
    id: SampleId;
    user: Username;
    node_tree: Array<SampleNode>;
    name: string;
    save_date: EpochTimeMS;
    version: SampleVersion;
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
    upa: WSUPA;
    dataid: DataId;
    id: SampleId;
    version: SampleVersion;
    node: SampleNodeId;
    created: EpochTimeMS;
    expiredby: Username;
    expired: EpochTimeMS;

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

export default class SampleServiceClient extends DynamicServiceClient {
    static module: string = 'SampleService';

    async status(): Promise<StatusResult> {
        const [result] = await this.callFunc<[], [StatusResult]>('status', []);
        return result;
    }

    async get_sample(params: GetSampleParams): Promise<GetSampleResult> {
        const [result] = await this.callFunc<[GetSampleParams], [GetSampleResult]>('get_sample', [params]);
        return result;
    }

    async get_data_links_from_sample(params: GetDataLinksFromSampleParams): Promise<GetDataLinksFromSampleResult> {
        const [result] = await this.callFunc<[GetDataLinksFromSampleParams], [GetDataLinksFromSampleResult]>('get_data_links_from_sample', [params]);
        return result;
    }

    async get_metadata_key_static_metadata(params: GetMetadataKeyStaticMetadataParams): Promise<GetMetadataKeyStaticMetadataResult> {
        const [result] = await this.callFunc<[GetMetadataKeyStaticMetadataParams], [GetMetadataKeyStaticMetadataResult]>('get_metadata_key_static_metadata', [params]);
        return result;
    }
}