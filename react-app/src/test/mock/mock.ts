/* istanbul ignore file */

import {MockResponseInit} from "jest-fetch-mock";
import {mock_get_user_profile} from "./userProfile";
import {mock_get_service_status} from "./serviceWizard";
import {
    mock_get_data_links_from_sample, mock_get_field_definitions, mock_get_field_groups, mock_get_formats,
    mock_get_metadata_key_static_metadata, mock_get_sample,
    mock_get_sample_acls,
    mock_status, SCHEMA_FIELD_FOO
} from "./sampleService";
import {ControlledFieldNumber} from "../../lib/client/ControlledField";
import * as fs from 'fs';

async function mockJSONRPCServices(request: Request): Promise<MockResponseInit> {
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
        case 'SampleService.get_formats':
            return mock_get_formats(body, request);
        case 'SampleService.get_field_groups':
            return mock_get_field_groups(body, request);
        case 'SampleService.get_field_definitions':
            return mock_get_field_definitions(body, request);
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

export async function dummy_rest(request: Request) {
    return {
        headers: {
            'Content-Type': 'application/json'
        }
    };
}

async function mockRESTServices(request: Request): Promise<MockResponseInit> {
    if (request.url.match(/services/)) {
        return dummy_rest(request)
    } else {
        return {
            status: 404,
            body: 'Not Found'
        }
    }
}

async function mockServices(request: Request): Promise<MockResponseInit> {
    switch (request.method) {
        case 'POST':
            return mockJSONRPCServices(request);
        case 'GET':
            return mockRESTServices(request);
        default:
            throw new Error(`"${request.method} not supported in mocks`)
    }
}

async function getMockData(request: Request): Promise<MockResponseInit> {
    // get the path to the data:
    const match = request.url.match(/mock-data\/(.*)$/);
    if (match === null) {
        throw new Error(`Invalid mock-data request: ${request.url}`)
    }
    const [, path] = match;
    try {
        const response = fs.readFileSync(`${__dirname}/../../../public/mock-data/${path}`, 'utf8');
        // console.log('FORMAT!', JSON.parse(response));
        // return JSON.parse(response);
        return Promise.resolve({
            status: 200,
            body: response
        });
    } catch (ex) {
        throw new Error(`Error reading file: ${ex.message} (${__dirname}`)
    }
}

async function mockData(request: Request): Promise<MockResponseInit> {
    switch (request.method) {
        case 'GET':
            return getMockData(request);
        default:
            throw new Error(`"${request.method} not supported in mocks`)
    }
}


async function mockSchemaFields(request: Request): Promise<MockResponseInit> {
    await setTimeout(() => {
    }, 0);
    switch (request.url) {
        case 'https://fake.kbase.us/dynsrv/jsonschema/schemas/fields/foo.1-0-0.json':
            const fooField: ControlledFieldNumber = SCHEMA_FIELD_FOO
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
        } else if (request.url.match(/mock-data/)) {
            return mockData(request);
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
