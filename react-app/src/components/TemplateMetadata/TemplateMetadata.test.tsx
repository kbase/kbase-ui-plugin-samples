import React from 'react';
import TemplateMetadata from './TemplateMetadata';
import { render, waitFor } from '@testing-library/react';
import { Sample } from '../sample/data';

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
    const { container } = render(<TemplateMetadata sample={sample} />);

    await waitFor(() => {
        const tbody = container.querySelector('.ant-table-tbody');
        expect(tbody).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});