import React from 'react';
import TemplateMetadata from './TemplateMetadata';
import { render, waitFor } from '@testing-library/react';
import { Sample } from './data';

const TIMEOUT = 10000;

test('should render', async () => {

    const sample: Sample = {
        id: 'xyz',
        sourceParentId: null,
        name: 'abc',
        type: 'BioReplicate',
        source: 'SESAR',
        sourceId: 'SESARID',
        created: {
            at: 0,
            by: 'foo'

        },
        currentVersion: {
            at: 0,
            by: 'bar',
            version: 1
        },
        latestVersion: {
            at: 0,
            by: 'baz',
            version: 2

        },
        metadata: {

        },
        userMetadata: {

        }


    };
    const { container } = render(<TemplateMetadata sample={sample} />);

    await waitFor(() => {
        const tbody = container.querySelector('.ant-table-tbody');
        expect(tbody).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});