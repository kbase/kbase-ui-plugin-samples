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
    linkid: string;
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

export interface FieldDefinitionBase {
    key: string;
    type: 'integer' | 'float' | 'string' | 'date';
    label: string;
    description?: string;
    units?: string;
}

export interface FieldDefinitionInteger extends FieldDefinitionBase {
    type: 'integer';
    minimum_value?: number;
    maximum_value?: number;
}

export interface FieldDefinitionFloat extends FieldDefinitionBase {
    type: 'float';
    minimum_value?: number;
    maximum_value?: number;
    precision?: number;
}

export interface FieldDefinitionString extends FieldDefinitionBase {
    type: 'string';
    regex?: string;
    minimum_length?: number;
    maximum_length?: number;
}

export interface FieldDefinitionDate extends FieldDefinitionBase {
    type: 'date';
    minimum_value?: number;
    maximum_value?: number;
}

export type FieldDefinition = FieldDefinitionInteger | FieldDefinitionFloat | FieldDefinitionString | FieldDefinitionDate;

export interface FieldDefinitionsMap {
    [key: string]: FieldDefinition;
}

export interface GetMetadataDefinitionsParams {

}

export interface GetMetadataDefinitionsResult {
    // field_definitions: Array<FieldDefinition>;
    field_definitions: FieldDefinitionsMap;
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

    async get_metadata_definitions(params: GetMetadataDefinitionsParams): Promise<GetMetadataDefinitionsResult> {
        // const [result] = await this.callFunc<[GetMetadataDefinitionsParams], [GetMetadataDefinitionsResult]>('get_metadata_key_static_metadata', [params]);
        const fieldDefinitions: Array<FieldDefinition> = [
            {
                key: 'purpose',
                type: 'string',
                label: 'Purpose'
            },
            {
                key: 'material',
                type: 'string',
                label: 'Material'
            },
            {
                key: 'collection_date',
                type: 'date',
                description: 'Date upon which the sample was collected',
                label: 'Collection Date'
            },
            {
                key: 'collection_date_precision',
                type: 'integer',
                label: 'Collection date precision'
            },
            {
                key: 'collector_chief_scientist',
                type: 'string',
                label: 'Collector Chief Scientist'
            },
            {
                key: 'collection_method',
                type: 'string',
                label: 'Collection Methohd'
            },
            {
                key: 'release_date',
                type: 'date',
                label: 'Release Date'
            },
            {
                key: 'field_name',
                type: 'string',
                label: 'field Name'
            },
            {
                key: 'elevation_start',
                type: 'float',
                label: 'Elevation start'
            },
            {
                key: 'elevation_unit',
                type: 'string',
                label: 'Elevation unit'
            },
            {
                key: 'field_program_cruise',
                type: 'string',
                label: 'Field program / cruise'
            },
            {
                key: 'current_archive',
                type: 'string',
                label: 'Current Archive'
            },
            {
                key: 'current_archive_contact',
                type: 'string',
                label: 'Current Archive Contact'
            },
            {
                key: 'coordinate_precision?',
                type: 'integer',
                label: 'Coordinate Precision'
            },
            {
                key: 'latitude',
                type: 'float',
                label: 'Latitude',
                units: 'degrees',
                precision: 5
            },
            {
                key: 'longitude',
                type: 'float',
                label: 'Longitude',
                precision: 5
            },
            {
                key: 'navigation_type',
                type: 'string',
                label: 'Navigation Type'
            },
            {
                key: 'locality_description',
                type: 'string',
                label: 'Locality Description'
            },
            {
                key: 'location_description',
                type: 'string',
                label: 'Location Description'
            },
            {
                key: 'name_of_physiographic_feature',
                type: 'string',
                label: 'Name of Physiographic Feature'
            },
            {
                key: 'primary_physiographic_feature',
                type: 'string',
                label: 'Primary Physiographic Feature'
            },
            {
                key: 'related_identifiers',
                type: 'string',
                label: 'Related Identifiers'
            },
            {
                key: 'relation_type',
                type: 'string',
                label: 'Relation Type'
            }
        ];
        const field_definitions: FieldDefinitionsMap = fieldDefinitions.reduce((field_definitions: FieldDefinitionsMap, def: FieldDefinition) => {
            field_definitions[def.key] = def;
            return field_definitions;
        }, {});
        return Promise.resolve({
            field_definitions
        });
    }

    async get_sample_acls(params: GetSampleACLsParams): Promise<GetSampleACLsResult> {
        const [result] = await this.callFunc<[GetSampleACLsParams], [GetSampleACLsResult]>('get_sample_acls', [params]);
        return result;
    }
}