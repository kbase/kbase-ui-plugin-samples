import React from 'react';
import {render, waitFor} from '@testing-library/react';
import NotFound from './NotFound';
import {MemoryRouter, Route} from 'react-router-dom';

const TIMEOUT = 10000;

test('renders Not Found view', async () => {
    const {getByText} = render(
        <MemoryRouter initialEntries={['/samples/foo']} initialIndex={0}>
            <Route component={NotFound} exact={true}/>
        </MemoryRouter>
    );
    await waitFor(() => {
        const errorMessageElement = getByText(/Not Found/i);
        expect(errorMessageElement).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});
