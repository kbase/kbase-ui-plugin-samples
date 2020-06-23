import React from 'react';
import Overview from './Overview';
import { render, waitFor } from '@testing-library/react';
import { Sample } from '../sample/data';

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
    const sample: Sample = {
        id: 'xyz',
        sourceParentId: null,
        name: 'abc',
        type: 'BioReplicate',
        source: 'SESAR',
        sourceId: 'SESARID',
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