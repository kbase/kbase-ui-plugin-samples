import React from 'react';
import { render, waitFor } from '@testing-library/react';

import DataLinks, { DataLinksProps } from './view';

const TIMEOUT = 10000;

test('renders data links with no links', async () => {
    const props: DataLinksProps = {
        dataLinks: [
        ],
        baseURL: 'http://example.com'
    };

    const { getByTestId, getByText } = render(<DataLinks {...props} />);
    await waitFor(() => {
        const linkElement = getByTestId('datalinks');
        expect(linkElement).toBeInTheDocument();
        const messageElement = getByText('No data linked to this sample.');
        expect(messageElement).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});