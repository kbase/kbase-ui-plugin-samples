/* istanbul ignore file */

import {SchemaFieldNumber} from "../../lib/client/samples/Samples";
import {MockResponseInit} from "jest-fetch-mock";
import {mock_get_user_profile} from "./userProfile";
import {mock_get_service_status} from "./serviceWizard";
import {
    mock_get_data_links_from_sample,
    mock_get_field_categories, mock_get_metadata_key_static_metadata, mock_get_sample,
    mock_get_sample_acls,
    mock_status, SCHEMA_FIELD_FOO
} from "./sampleService";


async function mockServices(request: Request): Promise<MockResponseInit> {
    const body = await request.json();
    const method = body['method'];
    switch (method) {
        case 'ServiceWizard.get_service_status':
            return mock_get_service_status(body, request);
        case 'SampleService.status':
            return mock_status(body, request);
        case 'SampleService.get_sample_acls':
            return mock_get_sample_acls(body, request);
        case 'SampleService.get_sample':
            return mock_get_sample(body, request);
        case 'SampleService.get_data_links_from_sample':
            return mock_get_data_links_from_sample(body, request);
        case 'SampleService.get_metadata_key_static_metadata':
            return mock_get_metadata_key_static_metadata(body, request);
        case 'SampleService.get_field_categories':
            return mock_get_field_categories(body, request);
        case 'UserProfile.get_user_profile':
            return mock_get_user_profile(body, request);
        default:
            console.warn(body);
            return {
                status: 404,
                body: 'Not Found'
            }
    }
}

async function mockSchemaFields(request: Request): Promise<MockResponseInit> {
    await setTimeout(() => {
    }, 0);
    switch (request.url) {
        case 'https://fake.kbase.us/schemas/fields/foo.1-0-0.json':
            const fooField: SchemaFieldNumber = SCHEMA_FIELD_FOO
            return {
                body: JSON.stringify(
                    fooField
                ),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        case 'https://fake.kbase.us/schemas/fields/bad_json.1-0-0.json':
            return {
                body: 'a terrible field definition',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        default:
            return {
                status: 404,
                body: 'Not found'
            }
    }
}

export function teardownMocks() {
    fetchMock.resetMocks();
}

export function setupMocks() {
    process.env = Object.assign(process.env, {PUBLIC_URL: 'https://fake.kbase.us'})
    fetchMock.mockIf(/^https:\/\/fake\.kbase\.us\//, (request) => {
        if (request.url.match(/services/)) {
            return mockServices(request);
        } else {
            throw new Error(`Unsupported url ${request.url}`);
        }
    });
}

export function setupMocks2() {
    process.env = Object.assign(process.env, {PUBLIC_URL: 'https://fake.kbase.us'})
    fetchMock.mockIf(/^https:\/\/fake\.kbase\.us\//, (request) => {
        if (request.url.match(/services/)) {
            return mockServices(request);
        } else if (request.url.match(/schemas\/fields/)) {
            return mockSchemaFields(request);
        } else {
            throw new Error(`Unsupported url ${request.url}`);
        }
    });
}
