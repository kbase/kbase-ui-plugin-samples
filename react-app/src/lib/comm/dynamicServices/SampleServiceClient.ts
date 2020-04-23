import { DynamicServiceClient } from '../JSONRPC11/DynamicServiceClient';

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

export interface UserMetadata {
    [k: string]: MetadataValue;
}

export interface MetadataValue {
    value: string | number | boolean;
    units: "degrees" | "day";
}

// TODO: interfaces for specific controlled metadata.
// may not be practical, but consider it.
export interface ControlledMetadata {
    [k: string]: MetadataValue;
}

export interface GetSampleParams {
    id: SampleId;
    version?: number;
    as_admin?: SDKBoolean;
}

export interface SampleNode {
    id: SampleNodeId;
    parent: SampleNodeId;
    type: SampleNodeType;
    meta_controlled: ControlledMetadata;
    meta_user: UserMetadata;
}

export interface Sample {
    id: SampleId;
    user: Username;
    node_tree: Array<SampleNode>;
    name: string;
    save_date: EpochTimeMS;
    version: SampleVersion;
}

export type GetSampleResult = Sample;

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
}