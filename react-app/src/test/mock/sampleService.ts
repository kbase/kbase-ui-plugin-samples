/* istanbul ignore file */

import {
    GetDataLinksFromSampleResult,
    GetFieldDefinitionsResult,
    GetMetadataKeyStaticMetadataResult,
    GetSampleACLsResult,
    GetSampleResult, SampleACLs,
    StatusResult
} from '../../lib/client/SampleServiceClient'
import {Sample} from "../../lib/client/Sample";

// Sample Data

// Samples
import sample1Data from './data/samples/sample1.json';
import sample2Data from './data/samples/sample2.json';
import sample3Data from './data/samples/sample3.json';
import {ControlledFieldNumber} from "../../lib/client/ControlledField";


// Type the sample data.
export const sample1 = (sample1Data as unknown) as Sample;
export const sample2 = (sample2Data as unknown) as Sample;
export const sample3 = (sample3Data as unknown) as Sample;


export const STATUS_RESULT: StatusResult = {
    state: 'OK',
    git_commit_hash: 'hash',
    version: '1.2.3',
    git_url: 'https://github.com/kbase/kbase-ui-plugin-samples',
    message: 'test status'
};

export const SAMPLE_ACLS: { [sampleId: string]: SampleACLs } = {
    'sample1': {
        owner: 'foo',
        admin: [],
        write: [],
        read: []
    },
    'sample2': {
        owner: 'foo',
        admin: ['bar', 'baz'],
        write: ['ping', 'pong'],
        read: ['yin', 'yang']
    }
}

// export const GET_SAMPLE_ACLS_RESULT: GetSampleACLsResult = {
//     owner: 'foo',
//     admin: ['bar', 'baz'],
//     write: ['ping', 'pong'],
//     read: ['yin', 'yang']
// }

// export const GET_SAMPLE_RESULT: GetSampleResult = {
//     id: 'sample1',
//     version: 1,
//     name: 'My Sample',
//     user: 'username1',
//     save_date: 0,
//     node_tree: []
// }

// const sample1: Sample = {
//     id: 'sample1',
//     version: 1,
//     name: 'My Sample',
//     user: 'username1',
//     save_date: 0,
//     node_tree: [{
//         id: 'sample1_id',
//         type: 'BioReplicate',
//         meta_controlled: {
//             biome: {}
//         }
//     }]
// }

export const GET_SAMPLE_SAMPLES: { [sampleId: string]: Sample } = {
    sample1, sample2, sample3
}

export const GET_METADATA_KEY_STATIC_METADATA_EMPTY: GetMetadataKeyStaticMetadataResult = {
    static_metadata: {}
}

export const GET_DATA_LINKS_FROM_SAMPLE_RESULT_EMPTY: GetDataLinksFromSampleResult = {
    links: []
}

export const GET_FORMAT_RESULT_SUBSET = {
    id: "sesar",
    name: "SESAR",
    title: "A format compatible with SESAR",
    description: "A sample template based on SESAR",
    source: {
        name: "SESAR",
        title: "System for Earth Sample Registration (SESAR)",
        logo: "https://www.geosamples.org/sites/geosamples.org/files/images/sesar_logo_right.jpg",
        url: "https://www.geosamples.org/"
    },
    mappings: {
        header: [
            "object_type",
            "user_code"
        ],
        record: {
            name: "sample_name"
        },
        sample: {
            id: "igsn",
            parent_id: "parent_igsn"
        }
    },
}

export const GET_FIELD_DEFINITIONS_RESULT_EMPTY: GetFieldDefinitionsResult = {
    fields: []
}

export const SCHEMA_FIELD_FOO: ControlledFieldNumber = {
    type: 'number',
    $id: 'id',
    $schema: 'schema',
    format: 'none',
    title: 'Foo Field',
    description: 'The Foo Field',
    minimum: 0,
    maximum: 1,
    examples: [
        '1', '2', '3'
    ],
    kbase: {
        unit: 'baz',
        format: {
            useGrouping: true
        },
        sample: {
            key: 'foo'
        }
    }
}

export async function mock_status(body: any, request: Request) {
    return {
        body: JSON.stringify({
            version: '1.1',
            id: 'abc',
            result: [
                STATUS_RESULT
            ]
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };
}

export async function mock_get_sample_acls(body: any, request: Request) {
    const {id} = body.params[0];
    const acls = SAMPLE_ACLS[id];
    return {
        body: JSON.stringify({
            version: '1.1',
            id: 'abc',
            result: [
                acls
            ]
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };
}

export async function mock_get_sample(body: any, request: Request) {
    const {id} = body.params[0];
    const sample = GET_SAMPLE_SAMPLES[id];
    return {
        body: JSON.stringify({
            version: '1.1',
            id: 'abc',
            result: [
                sample
            ]
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };
}

export async function mock_get_data_links_from_sample(body: any, request: Request) {
    return {
        body: JSON.stringify({
            version: '1.1',
            id: 'abc',
            result: [
                GET_DATA_LINKS_FROM_SAMPLE_RESULT_EMPTY
            ]
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };
}

export async function mock_get_metadata_key_static_metadata(body: any, request: Request) {
    return {
        body: JSON.stringify({
            version: '1.1',
            id: 'abc',
            result: [
                GET_METADATA_KEY_STATIC_METADATA_EMPTY
            ]
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };
}
