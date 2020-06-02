import React from 'react';
import Overview from './Overview';
import { render, waitFor } from '@testing-library/react';
import { Sample, SampleNode } from '../../lib/comm/dynamicServices/SampleServiceClient';

const TIMEOUT = 10000;

test('should render', async () => {
    const now = Date.now();
    const sampleNode: SampleNode = {
        id: 'xyz',
        parent: null,
        type: 'BioReplicate',
        meta_controlled: {},
        meta_user: {}
    };
    const sample: Sample = {
        id: 'abc',
        user: 'user1',
        node_tree: [sampleNode],
        name: 'ABC',
        save_date: now,
        version: 1
    };
    const { getByTestId } = render(<Overview sample={sample} />);
    await waitFor(() => {
        const idElement = getByTestId('id');
        expect(idElement).toBeInTheDocument();
        expect(idElement).toHaveTextContent(sample['id']);

        const userElement = getByTestId('user');
        expect(userElement).toBeInTheDocument();
        expect(userElement).toHaveTextContent(sample['user']);

        const nameElement = getByTestId('name');
        expect(nameElement).toBeInTheDocument();
        expect(nameElement).toHaveTextContent(sample['name']);

        const saveDateElement = getByTestId('save_date');
        expect(saveDateElement).toBeInTheDocument();
        const dateDisplay = Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short'
        }).format(sample['save_date']);
        expect(saveDateElement).toHaveTextContent(dateDisplay);

        const versionElement = getByTestId('version');
        expect(versionElement).toBeInTheDocument();
        expect(versionElement).toHaveTextContent(String(sample['version']));
    }, {
        timeout: TIMEOUT
    });
});