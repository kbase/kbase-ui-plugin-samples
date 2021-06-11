import {
    setupMocks, teardownMocks
} from "../../../mock/mock";
import {
    GET_DATA_LINKS_FROM_SAMPLE_RESULT_EMPTY,
    GET_FORMATS_RESULT_SUBSET,
    GET_METADATA_KEY_STATIC_METADATA_EMPTY,
    SAMPLE_ACLS,
    STATUS_RESULT, GET_SAMPLE_SAMPLES
} from "../../../mock/sampleService";
import SampleServiceClient, {
    GetDataLinksFromSampleParams,
    GetFormatParams,
    GetMetadataKeyStaticMetadataParams,
    GetSampleACLsParams,
    GetSampleParams
} from "lib/client/SampleServiceClient";
import {TEST_FETCH_TIMEOUT} from "../../../mock/common";

function makeSampleServiceClient() {
    return new SampleServiceClient({
        timeout: TEST_FETCH_TIMEOUT,
        url: 'https://fake.kbase.us/services/sampleservice'
    });
}

describe('SampleServiceClient', () => {
    beforeEach(() => {
        setupMocks();
    });

    afterEach(() => {
        teardownMocks();
    })

    test('It can be created without error', () => {
        const client = makeSampleServiceClient();
        expect(client).toBeDefined();
    });

    test('Can successfully call the "status" method', async () => {
        const client = makeSampleServiceClient();
        const result = await client.status();
        expect(result).toBeDefined();
        expect(result).toEqual(STATUS_RESULT)
    });

    test('Can successfully call the "get_sample_acls" method', async () => {
        const client = makeSampleServiceClient();
        const params: GetSampleACLsParams = {
            id: 'sample2',
            as_admin: 0
        }
        const result = await client.get_sample_acls(params);
        expect(result).toBeDefined();
        expect(result).toEqual(SAMPLE_ACLS['sample2'])
    });

    test('Can successfully call the "get_sample" method', async () => {
        const client = makeSampleServiceClient();
        const params: GetSampleParams = {
            id: 'sample1'
        }
        const result = await client.get_sample(params);
        expect(result).toBeDefined();
        expect(result).toEqual(GET_SAMPLE_SAMPLES['sample1'])
    });

    test('Can successfully call the "get_data_links_from_sample" method', async () => {
        const client = makeSampleServiceClient();
        const params: GetDataLinksFromSampleParams = {
            id: 'sample1',
            version: 1
        }
        const result = await client.get_data_links_from_sample(params);
        expect(result).toBeDefined();
        expect(result).toEqual(GET_DATA_LINKS_FROM_SAMPLE_RESULT_EMPTY)
    });

    test('Can successfully call the "get_metadata_key_static_metadata" method', async () => {
        const client = makeSampleServiceClient();
        const params: GetMetadataKeyStaticMetadataParams = {
            keys: [],
            prefix: 0
        }
        const result = await client.get_metadata_key_static_metadata(params);
        expect(result).toBeDefined();
        expect(result).toEqual(GET_METADATA_KEY_STATIC_METADATA_EMPTY)
    });

    // Our "faked" sample service methods; these do not call fetch, so we can use the
    // built-in fake data.

    test('Can successfully call the "get_formats" method', async () => {
        const client = makeSampleServiceClient();
        const params: GetFormatParams = {
            ids: ['sesar']
        }
        const result = await client.get_formats(params);
        expect(result).toBeDefined();
        expect(result).toMatchObject({
            formats: GET_FORMATS_RESULT_SUBSET
        });
    });

    test('Can successfully call the "get_field_groups" method', async () => {
        const client = makeSampleServiceClient();
        const result = await client.get_field_groups();
        expect(result).toBeDefined();
        // All we really depend on in this codebase is the  presence of geolocation, and within
        // that latitude and longitude.
        expect(result.groups.map(({name}) => {
            return name;
        })).toContain('geolocation');
        const geolocationGroup = result.groups.filter(({name}) => {
            return name === 'geolocation';
        })[0];
        expect(geolocationGroup.fields).toContain('latitude');
        expect(geolocationGroup.fields).toContain('longitude');
    });

    test('Can trigger an exception from the "get_format" method with an invalid id', async () => {
        const client = makeSampleServiceClient();
        const params: GetFormatParams = {
            ids: ['foo']
        }
        expect(async () => {
            return (await client.get_formats(params));
        }).rejects.toThrow();
    });
});

//
// describe('SampleServiceClient with mocked field definitions', () => {
//     beforeEach(() => {
//         setupMocks2();
//     });
//
//     afterEach(() => {
//         teardownMocks();
//     });
//
//     test('Can successfully call the "get_field_definitions" method', async () => {
//         const client = makeSampleServiceClient();
//         const params: GetFieldDefinitionsParams = {
//             keys: ['foo']
//         }
//         const result = await client.get_field_definitions(params);
//         expect(result).toBeDefined();
//         expect(result).toMatchObject({
//             fields: [SCHEMA_FIELD_FOO]
//         });
//     });
//
//     test('Can call the "get_field_definitions" method with a bad field key and get an error', async () => {
//         const client = makeSampleServiceClient();
//         const params: GetFieldDefinitionsParams = {
//             keys: ['bad_foo']
//         }
//
//         expect(async () => {
//             return await client.get_field_definitions(params);
//         }).rejects.toThrow();
//     });
//
//     test('Can call the "get_field_definitions" method with a bad field key and get an error', async () => {
//         const client = makeSampleServiceClient();
//         const params: GetFieldDefinitionsParams = {
//             keys: ['bad_foo']
//         }
//
//         expect(async () => {
//             return await client.get_field_definitions(params);
//         }).rejects.toThrow();
//     });
//
//     test('Can call the "get_field_definitions" method with an invalid field definition and get an error', async () => {
//         const client = makeSampleServiceClient();
//         const params: GetFieldDefinitionsParams = {
//             keys: ['bad_json']
//         }
//
//         expect(async () => {
//             return await client.get_field_definitions(params);
//         }).rejects.toThrow();
//     });
// });
