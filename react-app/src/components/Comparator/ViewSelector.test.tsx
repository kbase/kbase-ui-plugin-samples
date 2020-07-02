
import React from 'react';
import { render, waitFor } from '@testing-library/react';

import ViewSelector, { ViewSelectorProps } from './ViewSelector';
import { View } from '.';

const TIMEOUT = 10000;



test('renders difference type selector', async () => {
    const props: ViewSelectorProps = {
        view: 'sample',
        changeView: (view: View) => {

        }
    };

    const { getByText } = render(<ViewSelector {...props} />);

    const sampleInfoElement = getByText('Sample Info');
    expect(sampleInfoElement).toBeInTheDocument();
    const metadataElement = getByText('Metadata');
    expect(metadataElement).toBeInTheDocument();
    const userMetadataElement = getByText('User Metadata');
    expect(userMetadataElement).toBeInTheDocument();

});

test('switches views', async () => {
    let currentView: string | null;
    const props: ViewSelectorProps = {
        view: 'sample',
        changeView: (view: View) => {
            currentView = view;
        }
    };

    const { getByText } = render(<ViewSelector {...props} />);

    const sampleInfoElement = getByText('Sample Info');
    expect(sampleInfoElement).toBeInTheDocument();
    const metadataElement = getByText('Metadata');
    expect(metadataElement).toBeInTheDocument();
    const userMetadataElement = getByText('User Metadata');
    expect(userMetadataElement).toBeInTheDocument();

    userMetadataElement.click();

    await waitFor(() => {
        expect(currentView).toEqual('user_metadata');
    }, {
        timeout: TIMEOUT
    });
});
