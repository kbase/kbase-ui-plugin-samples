import SampleServiceClient, {
    GetSampleParams, GetDataLinksFromSampleParams, GetDataLinksFromSampleResult,
    GetMetadataKeyStaticMetadataParams, GetMetadataKeyStaticMetadataResult,
    GetSampleACLsParams, GetSampleACLsResult, SampleId, SampleVersion,
    SampleNodeType
} from "../comm/dynamicServices/SampleServiceClient";
import sesar1TemplateData from './data/templates/sesar1.json';
import enigma1TemplateData from './data/templates/enigma1.json';
import templateDefinitionsData from './data/templateDefinitions.json';
import sampleUploaderSpecsData from './data/sampleUploaderSpecs.json';
import metadataValidationData from './data/metadataValidation.json';

function grokField(key: string, spec: any): FieldDefinition {
    if (!spec.validators) {
        console.warn('no validators', spec);
        if (!spec.key_metadata) {
            console.warn('no key_metadata', spec);
            return {
                key,
                type: 'string',
                kind: 'descriptive',
                label: key,
                description: key
            };
        } else {
            return {
                key,
                type: 'string',
                kind: 'descriptive',
                label: spec.key_metadata.display_name,
                description: spec.key_metadata.description
            };
        }
    }
    const typedBuilders = spec.validators.filter((builder: any) => {
        return ['number', 'string', 'noop'].includes(builder.callable_builder);
    });
    if (typedBuilders.length === 0) {
        console.warn('no interesting typed builders', spec);
        return {
            key,
            type: 'string',
            kind: 'descriptive',
            label: spec.key_metadata.display_name,
            description: spec.key_metadata.description
        };
    }
    if (typedBuilders.length > 1) {
        console.warn('too many typed builders', spec);
        throw new Error('Too many typed builders');
    }
    const typedBuilder = typedBuilders[0];
    switch (typedBuilder.callable_builder) {
        case 'number': return {
            key,
            type: 'float',
            kind: 'descriptive',
            label: spec.key_metadata.display_name,
            description: spec.key_metadata.description,
            greater_than_or_equal: (typedBuilder.parameters && typedBuilder.parameters.gte),
            less_than_or_equal: (typedBuilder.parameters && typedBuilder.parameters.lte)

        };
        case 'string': return {
            key,
            type: 'string',
            kind: 'descriptive',
            label: spec.key_metadata.display_name,
            description: spec.key_metadata.description,
            length_less_than_or_equal: typedBuilder.parameters['max-len'],
            length_greater_than_or_equal: typedBuilder.parameters['min-len']
        };
        case 'noop': return {
            key,
            type: 'string',
            kind: 'descriptive',
            label: spec.key_metadata.display_name,
            description: spec.key_metadata.description
        };
        default:
            throw new Error('Unknown type: ' + typedBuilder.callable_builder);
    }
}
const metadataDefinitions: Array<FieldDefinition> = (() => {
    const data = (metadataValidationData as unknown) as any;
    const definitions = data.validators as Array<any>;
    return Object.entries(definitions).map(([key, spec]) => {
        return grokField(key, spec);
    });
})();

// Deal with source definitions.

export interface FieldMapping {
    [key: string]: string;
}
export interface SourceDefinition {
    id: string;
    columns: Array<string>;
    mapping: FieldMapping;
}

export interface SourceDefinitions {
    [source: string]: SourceDefinition;
}

const sourceDefinitions: SourceDefinitions = (() => {
    const sharedFields = sampleUploaderSpecsData.shared_fields;

    const sourceIds = Object.keys(sampleUploaderSpecsData).filter((key) => {
        return key !== 'shared_fields';
    });

    return sourceIds.reduce<SourceDefinitions>((sources, id) => {
        const source = (() => {
            switch (id) {
                case 'SESAR': return sampleUploaderSpecsData.SESAR;
                case 'ENIGMA': return sampleUploaderSpecsData.ENIGMA;
                default:
                    console.error('unrecognized source id', id, sampleUploaderSpecsData, sourceIds);
                    throw new Error('Unrecognized source id ' + id);
            }
        })();
        const columns = sharedFields.concat(source?.basic_columns);
        const sourceDefinition: SourceDefinition = {
            id,
            columns,
            mapping: {
                parent_id: 'parent'
            }
        };

        sources[id] = sourceDefinition;

        return sources;
    }, {});

})();

const templateDefinitions = (templateDefinitionsData as unknown) as TemplateDefinitions;
const sesar1Template = (sesar1TemplateData as unknown) as Template;
const enigma1Template = (enigma1TemplateData as unknown) as Template;
// const sesarGroupingLayout = (sesarGroupLayoutData as unknown) as GroupingLayout;
// const enigmaGroupingLayout = (enigmaGroupLayoutData as unknown) as GroupingLayout;

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
    grouping: GroupingLayout;
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
    greater_than_or_equal?: number;
    less_than_or_equal?: number;
    greater_than?: number;
    less_than?: number;
    precision?: number;
    decimal_places?: number;
}

export interface FieldDefinitionString extends FieldDefinitionBase {
    type: 'string';
    regex?: string;
    length_greater_than_or_equal?: number;
    length_less_than_or_equal?: number;
    length_greater_than?: number;
    length_less_than?: number;
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

export type Username = string;

export type EpochTimeMS = number;

export interface Metadata {
    [key: string]: MetadataField
}

export interface MetadataField {
    key: string;
    label: string;
    value: string | number | boolean;
    units: string
}

export interface MetadataSource {
    [key: string]: MetadataSourceField
}

export interface MetadataSourceField {
    key: string;
    label: string;
    value: string;
}

export interface Sample {
    id: SampleId;
    name: string;
    savedAt: EpochTimeMS;
    savedBy: Username;
    version: SampleVersion;
    sample: {
        source: string;
        templateId: string;
        id: string;
        parentId: string | null;
        type: SampleNodeType;
        metadata: Metadata;
        userMetadata: Metadata;
    };
}

export type GetSampleResult = Sample;

export default class Model {
    api: SampleServiceClient;
    constructor({ url, token, timeout, version }: ModelParams) {
        this.api = new SampleServiceClient({
            url,
            token,
            timeout,
            version
        });
    }

    async getSample(params: GetSampleParams): Promise<GetSampleResult> {
        const rawSample = await this.api.get_sample(params);
        const rawRealSample = rawSample.node_tree[0];

        const templateDefinition = (() => {
            const sampleSourceId = rawRealSample.id;
            // const metadataKeys = Object.keys(rawRealSample.meta_controlled).concat(Object.keys(rawRealSample.meta_user));

            for (const [, def] of Object.entries(templateDefinitions.templates)) {
                if (sampleSourceId.match(def.idPattern)) {
                    return def;
                }

                // if (def.signalFields.includes) {
                //     if (intersect<string>(def.signalFields.includes, metadataKeys)) {
                //         return def;
                //     }
                // }
                // if (def.signalFields.does_not_include) {
                //     if (!intersect(def.signalFields.does_not_include, metadataKeys)) {
                //         return def;
                //     }
                // }
            }

            throw new Error('Sorry, template definition not found!');
        })();

        const sourceMeta = rawRealSample.source_meta.reduce((sourceMeta, {key, skey, svalue: {value}}) => {
            sourceMeta[key] = {
                key, label: skey, value
            };
            return sourceMeta;
        }, {} as MetadataSource);

        const metadata: Metadata = (() => {
            return Object.entries(rawRealSample.meta_controlled).reduce((metadata, [key, field]) => {
                
                const label = (() => {
                    const fieldMeta = sourceMeta[key];
                    if (!fieldMeta) {
                        console.warn('field meta not found', key, sourceMeta);
                        return key;
                    }
                    return fieldMeta.label;
                })();
                metadata[key] = {
                    key,
                    label,
                    value: field.value,
                    units: field.units
                };
                return metadata;
            }, {} as Metadata)
        })();

        const userMetadata: Metadata = (() => {
            return Object.entries(rawRealSample.meta_user).reduce((metadata, [key, field]) => {
                const label = (() => {
                    const fieldMeta = sourceMeta[key];
                    if (!fieldMeta) {
                        console.warn('field meta not found', key, sourceMeta);
                        return key;
                    }
                    return fieldMeta.label;
                })();
                metadata[key] = {
                    key,
                    label,
                    value: field.value,
                    units: field.units
                };
                return metadata;
            }, {} as Metadata)
        })();

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
                source: templateDefinition.source,
                templateId: templateDefinition.id,
                metadata,
                userMetadata
            }
        };
    }

    getDataLinks(params: GetDataLinksFromSampleParams): Promise<GetDataLinksFromSampleResult> {
        return this.api.get_data_links_from_sample(params);
    }

    getMetadataKeyStaticMetadata(params: GetMetadataKeyStaticMetadataParams): Promise<GetMetadataKeyStaticMetadataResult> {
        return this.api.get_metadata_key_static_metadata(params);
    }

    getACL(params: GetSampleACLsParams): Promise<GetSampleACLsResult> {
        return this.api.get_sample_acls(params);
    }

    // Not in sample service
    async getMetadataDefinitions(params: GetMetadataDefinitionsParams): Promise<GetMetadataDefinitionsResult> {
        const fieldDefinitions: Array<FieldDefinition> = metadataDefinitions;
        const field_definitions: FieldDefinitionsMap = fieldDefinitions.reduce((field_definitions: FieldDefinitionsMap, def: FieldDefinition) => {
            field_definitions[def.key] = def;
            return field_definitions;
        }, {});
        return Promise.resolve({
            field_definitions
        });
    }

    async getTemplate(params: GetTemplateParams): Promise<GetTemplateResult> {
        // Look up the template given the id... fake for now.
        const definition = templateDefinitions.templates[params.id];
        const template = (() => {
            switch (params.id) {
                case 'sesar1':
                    return sesar1Template;
                case 'enigma1':
                    return enigma1Template;
                default:
                    throw new Error('Template not found: ' + params.id);
            }
        })();
        const fieldDefinitions: Array<FieldDefinition> = metadataDefinitions;
        const fieldDefinitionsMap: FieldDefinitionsMap = fieldDefinitions.reduce((field_definitions: FieldDefinitionsMap, def: FieldDefinition) => {
            field_definitions[def.key] = def;
            return field_definitions;
        }, {});

        const metadataFields = template.columns.map((column) => {
            const field = fieldDefinitionsMap[column];
            if (!field) {
                // throw new Error(`Unknown field ${column} in template ${params.id}`);
                console.warn(`Unknown field ${column} in template ${params.id}`);
                const x: FieldDefinition = {
                    key: column,
                    label: column,
                    description: `Unknown field ${column} in template ${params.id}`,
                    type: 'string',
                    kind: 'descriptive'
                };
                return x;
            }
            return field;
        });

        return Promise.resolve({
            definition, template, metadataFields
        });
    }

    async getGrouping(params: GetGroupingParams): Promise<GetGroupingResult> {
        // get the layout ... faked for now, just one.
        switch (params.id) {
            case 'sesar1':
                // console.log('grouping...', sesar1Template.grouping);
                return Promise.resolve({
                    grouping: sesar1Template.grouping
                });
            case 'enigma1':
                return Promise.resolve({
                    grouping: enigma1Template.grouping
                });
            default:
                throw new Error(`Unrecognized template ${params.id}`)
        }
        
    }
}