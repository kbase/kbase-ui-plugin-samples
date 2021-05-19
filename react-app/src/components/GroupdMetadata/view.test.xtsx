import React from 'react';
import { render, waitFor } from '@testing-library/react';

import MetadataViewer, { MetadataViewerProps } from './view';

import testData from './view.test-data.json';
import { Sample } from '../Main/types';

const TIMEOUT = 10000;

/*
export interface Sample {
    id: SampleId;
    name: string;
    created: {
        at: EpochTimeMS;
        by: User;
    };
    currentVersion: {
        at: EpochTimeMS;
        by: User;
        version: number;
    };
    latestVersion: {
        at: EpochTimeMS;
        by: User;
        version: number;
    };
    source: string;
    sourceId: string;
    sourceParentId: string | null;
    type: SampleType;
    metadata: Metadata;
    userMetadata: UserMetadata;
}
*/

test('renders data links with no links', async () => {
    const sample = (testData.sample1 as unknown) as Sample;
    const props: MetadataViewerProps = {
        fields: {},
        sample: sample,
        layout: {
            id: 'layout',
            name: 'My Layout',
            description: 'This is my layout',
            layout: []
        },
        template: {
            id: 'template',
            version: 1,
            created_at: 0,
            created_by: 'foo',
            header: [],
            columns: []
        }

    };

    const { getByTestId, getByText } = render(<MetadataViewer {...props} />);
    await waitFor(() => {
        const linkElement = getByTestId('metadataviewer');
        expect(linkElement).toBeInTheDocument();
        // const messageElement = getByText('No data linked to this sample.');
        // expect(messageElement).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});

// test('renders one data link', async () => {
//     const props: DataLinksProps = {
//         dataLinks: testData.slice(0, 1),
//         baseURL: 'http://example.com'
//     };q

//     const { getByTestId, getByText } = render(<DataLinks {...props} />);
//     await waitFor(() => {
//         const linkElement = getByTestId('datalinks');
//         expect(linkElement).toBeInTheDocument();

//         const message = getByText('This sample is linked to 1 data object.');
//         expect(message).toBeInTheDocument();
//         // const messageElement = getByText('No data linked to this sample.');
//         // expect(messageElement).toBeInTheDocument();
//     }, {
//         timeout: TIMEOUT
//     });
// });


// test('renders data links with links', async () => {
//     const props: DataLinksProps = {
//         dataLinks: testData,
//         baseURL: 'http://example.com'
//     };

//     const { findByText, findByTestId } = render(<DataLinks {...props} />);

//     const linkElement = await findByTestId('datalinks');
//     expect(linkElement).toBeInTheDocument();

//     const message = await findByText('This sample is linked to 4 data objects.');
//     expect(message).toBeInTheDocument();

//     await waitFor(() => {
//         const table = linkElement.querySelector('.ant-table-body table');
//         expect(table).toBeInTheDocument();
//         if (table === null) {
//             throw new Error('impossible');
//         }

//         if (table) {
//             const rows = table.querySelectorAll('tr');
//             expect(rows.length).toEqual(5);
//         }

//     }, {
//         timeout: TIMEOUT
//     });
// });