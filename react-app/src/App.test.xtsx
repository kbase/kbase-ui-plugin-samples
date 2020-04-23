import React from 'react';
import { render, waitFor } from '@testing-library/react';
import App from './App';

const TIMEOUT = 10000;

test('renders learn react link', async () => {
    const { getByText } = render(<App />);
    await waitFor(() => {
        const linkElement = getByText(/Hello!/i);
        expect(linkElement).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});