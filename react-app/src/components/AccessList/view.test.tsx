import React from 'react';
import { render, waitFor } from '@testing-library/react';

import AccessList, { AccessListProps } from './view';

const TIMEOUT = 10000;

test('renders data links with no links', async () => {
    const props: AccessListProps = {
        acl: {
            read: [],
            write: [],
            admin: []
        }
    };

    const { getByTestId, getByText } = render(<AccessList {...props} />);
    await waitFor(() => {
        const linkElement = getByTestId('accesslist');
        expect(linkElement).toBeInTheDocument();
        // const messageElement = getByText('No data linked to this sample.');
        // expect(messageElement).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});