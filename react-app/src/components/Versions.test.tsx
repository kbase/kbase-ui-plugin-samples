import React from 'react';
import { render, waitFor } from '@testing-library/react';

import Versions, {VersionsProps} from './Versions'
import { Sample } from './Main/types';
import testSample from './Versions.test-data.sample.json';


const TIMEOUT = 10000;


test('renders a simple Section with no toolbar', async () => {
    const sample: Sample = (testSample as unknown) as Sample;
    const props: VersionsProps = {
        sample,
        onChangeVersion: (version: string) => {
            
        }
    };
    const { getByText } = render(<Versions {...props}></Versions>);
    await waitFor(() => {
        const messageElement = getByText('eapearson');
        expect(messageElement).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});
