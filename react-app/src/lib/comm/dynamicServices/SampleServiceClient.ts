import { DynamicServiceClient } from '../JSONRPC11x/DynamicServiceClient';
import metadataDefinitionsData from './data/metadata.definitions.json';
import templateDefinitionsData from './data/template-definitions.json';
import sesarTemplateData from './data/sesar-template.json';
import sesarGroupingLayoutData from './data/grouping-layout.sesar.json';

const metadataDefinitions = (metadataDefinitionsData as unknown) as { fields: Array<FieldDefinition>; };

const templateDefinitions = (templateDefinitionsData as unknown) as TemplateDefinitions;

const sesarTemplate = (sesarTemplateData as unknown) as Template;

const sesarGroupingLayout = (sesarGroupingLayoutData as unknown) as GroupingLayout;

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

export interface Template {
    id: string;
    version: number;
    created_at: number;
    created_by: string;
    header: Array<string>;
    columns: Array<string>;
}

export interface TemplateDefinitions {
    templates: Array<TemplateDefinition>;
}

export interface TemplateDefinition {
    id: string;
    name: string;
    description: string;
    reference: string;
}

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

export interface FieldDefinitionBase {
    key: string;
    type: 'integer' | 'float' | 'string' | 'date';
    kind: 'registration' | 'descriptive' | 'user';
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

export interface GetTemplateParams {
    id: string;
    version?: number;
}

export interface GetTemplateResult {
    definition: TemplateDefinition;
    template: Template;
    metadataFields: Array<FieldDefinition>;
    // id: string;
    // version: number;
    // saved_at: number;
    // saved_by: string;
    // description: string;
    // source: string;
    // fields: Array<FieldDefinition>;
}

export interface GetGroupingParams {
    id: string;
    version?: number;
}

export interface GetGroupingResult {
    grouping: GroupingLayout;
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

    async get_metadata_definitions(params: GetMetadataDefinitionsParams): Promise<GetMetadataDefinitionsResult> {
        // const [result] = await this.callFunc<[GetMetadataDefinitionsParams], [GetMetadataDefinitionsResult]>('get_metadata_key_static_metadata', [params]);
        const fieldDefinitions: Array<FieldDefinition> = metadataDefinitions.fields;
        const field_definitions: FieldDefinitionsMap = fieldDefinitions.reduce((field_definitions: FieldDefinitionsMap, def: FieldDefinition) => {
            field_definitions[def.key] = def;
            return field_definitions;
        }, {});
        return Promise.resolve({
            field_definitions
        });
    }

    async get_template(params: GetTemplateParams): Promise<GetTemplateResult> {
        // Look up the template given the id... fake for now.
        const definition = templateDefinitions.templates[0];
        const template = sesarTemplate;
        const fieldDefinitions: Array<FieldDefinition> = metadataDefinitions.fields;
        const fieldDefinitionsMap: FieldDefinitionsMap = fieldDefinitions.reduce((field_definitions: FieldDefinitionsMap, def: FieldDefinition) => {
            field_definitions[def.key] = def;
            return field_definitions;
        }, {});

        const metadataFields = template.columns.map((column) => {
            const field = fieldDefinitionsMap[column];
            if (!field) {
                throw new Error(`Unknown field ${column} in template ${params.id}`);
            }
            return field;
        });

        return Promise.resolve({
            definition, template, metadataFields
        });
    }

    async get_grouping(params: GetGroupingParams): Promise<GetGroupingResult> {
        // get the layout ... faked for now, just one.
        return Promise.resolve({
            grouping: sesarGroupingLayout
        });
    }

    async get_sample_acls(params: GetSampleACLsParams): Promise<GetSampleACLsResult> {
        const [result] = await this.callFunc<[GetSampleACLsParams], [GetSampleACLsResult]>('get_sample_acls', [params]);
        return result;
    }
}