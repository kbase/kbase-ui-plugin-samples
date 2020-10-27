import React from 'react';
import Overview from './view';
import { render, waitFor } from '@testing-library/react';
import { Sample } from '../Main/types';
import { Format } from '../../lib/comm/dynamicServices/SampleServiceClient';

const TIMEOUT = 10000;

test('should render', async () => {
    // const now = Date.now();
    // const sampleNode: SampleNode = {
    //     id: 'xyz',
    //     parent: null,
    //     type: 'BioReplicate',
    //     meta_controlled: {},
    //     meta_user: {}
    // };
    const format: Format = {
        id: 'format1',
        description: 'a format',
        name: 'Format 1',
        version: 1,
        title: 'Format 1',
        source: {
            name: 'source',
            title: 'A Source',
            url: 'https://example.com/source'
        },
        layouts: {
            grouped: [{
                key: 'group1',
                description: 'some group',
                label: 'some group',
                layout: [
                     'field1', 'field2', 'field3'
                 ]
                }
            ]
        },
        mappings: {
            record: {
                a: 'b'
            },
            sample: {
                field1: 'id',
                field2: 'parent_id'
            }
        },
        field_definitions: {
            field1: {
                label: 'Field 1',
                type: 'string'
            },
            field2: {
                label: 'Field 2',
                type: 'number'
            },
            field3: {
                label: 'Field 3',
                type: 'boolean'
            }
        }

    }
    const sample: Sample = {
        id: 'xyz',
        format,
        sampleId: 'abc',
        parentSampleId: 'xyz',
        name: 'abc',
        type: 'BioReplicate',
        created: {
            at: 0,
            by: {
                username: 'foo',
                realname: 'Foo',
                gravatarHash: ''
            }


        },
        currentVersion: {
            at: 0,
            by: {
                username: 'bar',
                realname: 'Bar',
                gravatarHash: '',
            },
            version: 1
        },
        latestVersion: {
            at: 0,
            by: {
                username: 'baz',
                realname: 'Baz',
                gravatarHash: ''
            },
            version: 2

        },
        metadata: {

        },
        userMetadata: {

        }


    };
    const { getByTestId } = render(<Overview sample={sample} />);
    await waitFor(() => {
        const idElement = getByTestId('name');
        expect(idElement).toBeInTheDocument();
        expect(idElement).toHaveTextContent(sample['name']);

        // const userElement = getByTestId('user');
        // expect(userElement).toBeInTheDocument();
        // expect(userElement).toHaveTextContent(sample['user']);

        // const nameElement = getByTestId('name');
        // expect(nameElement).toBeInTheDocument();
        // expect(nameElement).toHaveTextContent(sample['name']);

        // const saveDateElement = getByTestId('save_date');
        // expect(saveDateElement).toBeInTheDocument();
        // const dateDisplay = Intl.DateTimeFormat('en-US', {
        //     year: 'numeric',
        //     month: 'numeric',
        //     day: 'numeric',
        //     hour: 'numeric',
        //     minute: 'numeric',
        //     second: 'numeric',
        //     timeZoneName: 'short'
        // }).format(sample['save_date']);
        // expect(saveDateElement).toHaveTextContent(dateDisplay);

        // const versionElement = getByTestId('version');
        // expect(versionElement).toBeInTheDocument();
        // expect(versionElement).toHaveTextContent(String(sample['version']));
    }, {
        timeout: TIMEOUT
    });
});