import Header from './view';
import { render, waitFor } from '@testing-library/react';
import { Sample } from '../Main/types';
import { Format } from 'lib/client/samples/Samples';

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
        // version: 1,
        title: 'Format 1',
        source: {
            name: 'source',
            title: 'A Source',
            url: 'https://example.com/source'
        },
        layouts: {
            grouped: [{
                name: 'group1',
                description: 'some group',
                label: 'some group',
                fields: [
                    'field1', 'field2', 'field3'
                ]
            }
            ]
        },
        fields: [
            'field1', 'field1', 'sample_name'
        ],
        mappings: {
            record: {
                name: 'sample_name'
            },
            sample: {
                id: 'field1',
                parent_id: 'field2'
            }
        },
        // field_definitions: {
        //     field1: {
        //         label: 'Field 1',
        //         type: 'string'
        //     },
        //     field2: {
        //         label: 'Field 2',
        //         type: 'number'
        //     },
        //     field3: {
        //         label: 'Field 3',
        //         type: 'boolean'
        //     }
        // }

    };
    const sample: Sample = {
        id: 'xyz',
        formatId: format.id,
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
    const { getByTestId } = render(<Header sample={sample} format={format} />);
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