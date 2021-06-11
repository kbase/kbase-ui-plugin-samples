import React from 'react';
import {render} from '@testing-library/react';
import NotFound from 'components/NotFound';

describe('The Not Found View', () => {
    test('renders it correctly', async () => {
        const path = 'some/path';
        const {getByText} = render(<NotFound path={path}/>);

        expect(getByText(path)).toBeInTheDocument();
    });
});