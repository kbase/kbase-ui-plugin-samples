import React from 'react';
import { render, waitFor } from '@testing-library/react';

import DiffSelector, { DiffSelectorProps, DiffState } from './DiffSelector';

const TIMEOUT = 10000;

test('renders difference type selector', async () => {
    const props: DiffSelectorProps = {
        diffStatus: [],
        changeDiffStatus: (diffStatus: Array<DiffState>) => {

        }
    };

    const { getByTestId, getByText } = render(<DiffSelector {...props} />);
    await waitFor(() => {
        const differentElement = getByText('different');
        expect(differentElement).toBeInTheDocument();
        const sameElement = getByText('same');
        expect(sameElement).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});


test('responds to ', async () => {
    const props: DiffSelectorProps = {
        diffStatus: [],
        changeDiffStatus: (diffStatus: Array<DiffState>) => {

        }
    };

    const { getByText } = render(<DiffSelector {...props} />);
    await waitFor(() => {
        const differentElement = getByText('different');
        expect(differentElement).toBeInTheDocument();
        const sameElement = getByText('same');
        expect(sameElement).toBeInTheDocument();
        sameElement.click();
    }, {
        timeout: TIMEOUT
    });
});