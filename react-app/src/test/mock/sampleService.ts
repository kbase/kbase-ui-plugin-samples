/* istanbul ignore file */

import {
    GetDataLinksFromSampleResult,
    GetFieldDefinitionsResult,
    GetMetadataKeyStaticMetadataResult,
    SampleACLs,
    StatusResult
} from '../../lib/client/SampleServiceClient'
import {Sample} from "../../lib/client/Sample";

// Sample Data

// Samples
import sample1Data from './data/samples/sesar/sample1.json';
import sample2Data from './data/samples/sesar/sample2.json';
import sample3Data from './data/samples/sesar/sample3.json';
import {ControlledFieldNumber} from "../../lib/client/ControlledField";
import * as fs from 'fs';
import {JSONObject} from "@kbase/ui-lib/lib/json";


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

export const GET_FORMATS_RESULT_SUBSET = [{
    "name": "sesar",
    "info": {
        "title": "System for Earth Sample Registration",
        "shortTitle": "SESAR",
        "homePage": "https://www.geosamples.org/"
    },
    "mappings": {
        "id": "sesar:igsn",
        "parent": "sesar:parent_igsn",
        "name": "name",
        "skipLines": "^Object Type:"
    },
    "columns": [
        {
            "title": "Age (max)",
            "aliases": [
                "age (max)",
                "Age Max",
                "age max"
            ],
            "sampleKey": "sesar:age_max"
        },
        {
            "title": "Age (min)",
            "aliases": [
                "age (min)",
                "Age Min",
                "age min"
            ],
            "sampleKey": "sesar:age_min"
        },
        {
            "title": "Age unit (e.g. million years (Ma))",
            "aliases": [
                "age unit (e.g. million years (ma))",
                "Age Unit",
                "age unit"
            ],
            "sampleKey": "sesar:age_unit"
        },
        {
            "title": "City/Township",
            "aliases": [
                "city/township",
                "City",
                "city"
            ],
            "sampleKey": "city_township"
        },
        {
            "title": "Classification",
            "aliases": [
                "classification"
            ],
            "sampleKey": "sesar:classification"
        },
        {
            "title": "Classification Comment",
            "aliases": [
                "classification comment"
            ],
            "sampleKey": "sesar:classification_comment"
        },
        {
            "title": "Collection date",
            "aliases": [
                "collection date",
                "Collection Start Date",
                "collection start date"
            ],
            "sampleKey": "sesar:collection_date"
        },
        {
            "title": "Collection date (end)",
            "aliases": [
                "collection date (end)",
                "Collection End Date",
                "collection end date"
            ],
            "sampleKey": "sesar:collection_date_end"
        },
        {
            "title": "Collection date precision",
            "aliases": [
                "collection date precision"
            ],
            "sampleKey": "sesar:collection_date_precision"
        },
        {
            "title": "Collection method",
            "aliases": [
                "collection method"
            ],
            "sampleKey": "sesar:collection_method"
        },
        {
            "title": "Collection method description",
            "aliases": [
                "collection method description",
                "Collection Method Descr",
                "collection method descr"
            ],
            "sampleKey": "sesar:collection_method_description"
        },
        {
            "title": "Collection time",
            "aliases": [
                "collection time",
                "Collection Start Time",
                "collection start time"
            ],
            "sampleKey": "sesar:collection_time"
        },
        {
            "title": "Collection time (end)",
            "aliases": [
                "collection time (end)",
                "Collection End Time",
                "collection end time"
            ],
            "sampleKey": "sesar:collection_time_end"
        },
        {
            "title": "Collector/Chief Scientist",
            "aliases": [
                "collector/chief scientist"
            ],
            "sampleKey": "sesar:collector_chief_scientist"
        },
        {
            "title": "Collector/Chief Scientist Address",
            "aliases": [
                "collector/chief scientist address",
                "Collector/Chief Scientist Detail",
                "collector/chief scientist detail"
            ],
            "sampleKey": "sesar:collector_chief_scientist_address"
        },
        {
            "title": "Comment",
            "aliases": [
                "comment"
            ],
            "sampleKey": "comment"
        },
        {
            "title": "Country",
            "aliases": [
                "country"
            ],
            "sampleKey": "country"
        },
        {
            "title": "County",
            "aliases": [
                "county"
            ],
            "sampleKey": "county"
        },
        {
            "title": "Cur Registrant Name",
            "aliases": [
                "cur registrant name"
            ],
            "sampleKey": "sesar:registrant_current"
        },
        {
            "title": "Current Archive",
            "aliases": [
                "current archive"
            ],
            "sampleKey": "sesar:archive_current"
        },
        {
            "title": "Current Archive Contact",
            "aliases": [
                "current archive contact"
            ],
            "sampleKey": "sesar:archive_contact_current"
        },
        {
            "title": "Depth in Core (max)",
            "aliases": [
                "depth in core (max)",
                "Depth Max",
                "depth max"
            ],
            "sampleKey": "sesar:depth_in_core_max"
        },
        {
            "title": "Depth in Core (min)",
            "aliases": [
                "depth in core (min)",
                "Depth Min",
                "depth min"
            ],
            "sampleKey": "sesar:depth_in_core_min"
        },
        {
            "title": "Depth scale",
            "aliases": [
                "depth scale"
            ],
            "sampleKey": "sesar:depth_scale"
        },
        {
            "title": "Easting (m) (Coordinate system: UTM NAD83)",
            "aliases": [
                "easting (m) (coordinate system: utm nad83)"
            ],
            "sampleKey": "sesar:easting"
        },
        {
            "title": "Elevation end",
            "aliases": [
                "elevation end"
            ],
            "sampleKey": "elevation_end"
        },
        {
            "title": "Elevation start",
            "aliases": [
                "elevation start",
                "Elevation",
                "elevation"
            ],
            "sampleKey": "elevation"
        },
        {
            "title": "Elevation unit",
            "aliases": [
                "elevation unit"
            ],
            "sampleKey": "sesar:elevation_unit"
        },
        {
            "title": "Field name (informal classification)",
            "aliases": [
                "field name (informal classification)",
                "Field Name",
                "field name"
            ],
            "sampleKey": "sesar:field_name"
        },
        {
            "title": "Field program/Cruise",
            "aliases": [
                "field program/cruise"
            ],
            "sampleKey": "sesar:field_program_cruise"
        },
        {
            "title": "Geological age",
            "aliases": [
                "geological age"
            ],
            "sampleKey": "sesar:geological_age"
        },
        {
            "title": "Geological unit",
            "aliases": [
                "geological unit"
            ],
            "sampleKey": "sesar:geological_unit"
        },
        {
            "title": "IGSN",
            "aliases": [
                "igsn"
            ],
            "sampleKey": "sesar:igsn"
        },
        {
            "title": "Is Archived",
            "aliases": [
                "is archived"
            ],
            "sampleKey": "sesar:is_archived"
        },
        {
            "title": "Latitude (Coordinate system: WGS 84)",
            "aliases": [
                "latitude (coordinate system: wgs 84)",
                "Latitude Start",
                "latitude start",
                "Latitude",
                "latitude"
            ],
            "sampleKey": "latitude"
        },
        {
            "title": "Latitude (end) (Coordinate system: WGS 84)",
            "aliases": [
                "latitude (end) (coordinate system: wgs 84)",
                "Latitude End",
                "latitude end"
            ],
            "sampleKey": "latitude_end"
        },
        {
            "title": "Launch ID",
            "aliases": [
                "launch id"
            ],
            "sampleKey": "sesar:launch_id"
        },
        {
            "title": "Launch platform name",
            "aliases": [
                "launch platform name"
            ],
            "sampleKey": "sesar:launch_platform_name"
        },
        {
            "title": "Launch type",
            "aliases": [
                "launch type",
                "Launch Type Name",
                "launch type name"
            ],
            "sampleKey": "sesar:launch_type"
        },
        {
            "title": "Locality",
            "aliases": [
                "locality"
            ],
            "sampleKey": "locality"
        },
        {
            "title": "Locality description",
            "aliases": [
                "locality description"
            ],
            "sampleKey": "locality_description"
        },
        {
            "title": "Location description",
            "aliases": [
                "location description"
            ],
            "sampleKey": "location_description"
        },
        {
            "title": "Longitude (Coordinate system: WGS 84)",
            "aliases": [
                "longitude (coordinate system: wgs 84)",
                "Longitude",
                "longitude",
                "Longitude Start",
                "longitude start"
            ],
            "sampleKey": "longitude"
        },
        {
            "title": "Longitude (end) (Coordinate system: WGS 84)",
            "aliases": [
                "longitude (end) (coordinate system: wgs 84)",
                "Longitude End",
                "longitude end"
            ],
            "sampleKey": "longitude_end"
        },
        {
            "title": "Material",
            "aliases": [
                "material"
            ],
            "sampleKey": "sesar:material"
        },
        {
            "title": "Name of physiographic feature",
            "aliases": [
                "name of physiographic feature"
            ],
            "sampleKey": "sesar:physiographic_feature_name"
        },
        {
            "title": "Navigation Type",
            "aliases": [
                "navigation type",
                "Nav Type Name",
                "nav type name"
            ],
            "sampleKey": "sesar:navigation_type"
        },
        {
            "title": "Northing (m) (Coordinate system: UTM NAD83)",
            "aliases": [
                "northing (m) (coordinate system: utm nad83)"
            ],
            "sampleKey": "sesar:northing"
        },
        {
            "title": "Org Registrant Name",
            "aliases": [
                "org registrant name"
            ],
            "sampleKey": "sesar:registrant_org"
        },
        {
            "title": "Original Archive",
            "aliases": [
                "original archive"
            ],
            "sampleKey": "sesar:archive_original"
        },
        {
            "title": "Original Archive Contact",
            "aliases": [
                "original archive contact"
            ],
            "sampleKey": "sesar:archive_contact_original"
        },
        {
            "title": "Other name(s)",
            "aliases": [
                "other name(s)"
            ],
            "sampleKey": "other_names"
        },
        {
            "title": "Parent IGSN",
            "aliases": [
                "parent igsn"
            ],
            "sampleKey": "sesar:parent_igsn"
        },
        {
            "title": "Platform Description",
            "aliases": [
                "platform description"
            ],
            "sampleKey": "sesar:platform_description"
        },
        {
            "title": "Platform name",
            "aliases": [
                "platform name"
            ],
            "sampleKey": "sesar:platform_name"
        },
        {
            "title": "Platform type",
            "aliases": [
                "platform type"
            ],
            "sampleKey": "sesar:platform_type"
        },
        {
            "title": "Primary Physiographic feature",
            "aliases": [
                "primary physiographic feature",
                "Physiographic Feature",
                "physiographic feature"
            ],
            "sampleKey": "sesar:physiographic_feature_primary"
        },
        {
            "title": "Purpose",
            "aliases": [
                "purpose"
            ],
            "sampleKey": "purpose"
        },
        {
            "title": "Related URL",
            "aliases": [],
            "sampleKey": "sesar:related_url"
        },
        {
            "title": "Related URL Type",
            "aliases": [],
            "sampleKey": "sesar:related_url_type"
        },
        {
            "title": "Related URL Desription",
            "aliases": [],
            "sampleKey": "sesar:related_url_description"
        },
        {
            "title": "Related Identifiers",
            "aliases": [],
            "sampleKey": "sesar:related_identifiers"
        },
        {
            "title": "Relation Type",
            "aliases": [],
            "sampleKey": "sesar:relation_type"
        },
        {
            "title": "Release Date",
            "aliases": [
                "release date"
            ],
            "sampleKey": "sesar:release_date"
        },
        {
            "title": "Sample Description",
            "aliases": [
                "sample description",
                "Description",
                "description"
            ],
            "sampleKey": "description"
        },
        {
            "title": "Sample Name",
            "aliases": [
                "sample name"
            ],
            "sampleKey": "name"
        },
        {
            "title": "Sample Type",
            "aliases": [
                "sample type"
            ],
            "sampleKey": "sesar:sample_type"
        },
        {
            "title": "Size",
            "aliases": [
                "size"
            ],
            "sampleKey": "sesar:size"
        },
        {
            "title": "Size unit",
            "aliases": [
                "size unit"
            ],
            "sampleKey": "sesar:size_unit"
        },
        {
            "title": "State/Province",
            "aliases": [
                "state/province",
                "State",
                "state"
            ],
            "sampleKey": "state_province"
        },
        {
            "title": "Sub-object type",
            "aliases": [
                "sub-object type"
            ],
            "sampleKey": "sesar:sub-object_type"
        },
        {
            "title": "URL",
            "aliases": [
                "url"
            ],
            "sampleKey": "url"
        },
        {
            "title": "Vertical Datum",
            "aliases": [
                "vertical datum"
            ],
            "sampleKey": "sesar:vertical_datum"
        },
        {
            "title": "Zone (e.g., 11R)",
            "aliases": [
                "zone (e.g., 11r)"
            ],
            "sampleKey": "sesar:zone"
        }
    ],
    "columnsFromSchema": false
}];

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


async function getMockData(path: string): Promise<JSONObject> {
    // get the path to the data:

    try {
        const response = fs.readFileSync(`${__dirname}/mock-data/${path}`, 'utf8');
        // console.log('FORMAT!', JSON.parse(response));
        // return JSON.parse(response);
        // return Promise.resolve({
        //     status: 200,
        //     body: response
        // });
        return JSON.parse(response) as JSONObject;
    } catch (ex) {
        throw new Error(`Error reading file: ${ex.message} (${__dirname}`)
    }
}

export async function mock_get_formats(body: any, request: Request) {
    // const body = await request.json();
    const {params: [{ids}]} = body;
    const formats = await Promise.all(ids.map((id: string) => {
        return getMockData(`formats/${id.toLowerCase()}.json`);
    }));
    // console.log('FORMATS???', formats);
    return {
        body: JSON.stringify({
            version: '1.1',
            id: 'abc',
            result: [
                {formats}
            ]
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };
}

export async function mock_get_field_groups(body: any, request: Request) {
    const groups = await getMockData('groups/groups.json')
    // console.log('GROUPS???', groups);
    return {
        body: JSON.stringify({
            version: '1.1',
            id: 'abc',
            result: [
                {groups}
            ]
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };
}

export async function mock_get_field_definitions(body: any, request: Request) {
    const {params: [{keys}]} = body;
    const fields = await Promise.all(keys.map((key: string) => {
        const scrubbedKey = key.replace(/[:]/, "-");
        return getMockData(`schemas/${scrubbedKey}.json`);
    }));
    return {
        body: JSON.stringify({
            version: '1.1',
            id: 'abc',
            result: [
                {fields}
            ]
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };
}

