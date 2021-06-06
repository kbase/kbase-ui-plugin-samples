import React from 'react';
import {render} from '@testing-library/react';

import Main, {MainProps} from 'components/Main/view';
import {Sample} from 'lib/ViewModel/ViewModel';

import sampleData from '../../data/sample-with-versions.json';

const sample: Sample = (sampleData as unknown) as Sample;

const TIMEOUT = 10000;

describe('The Main wrapper component', () => {
    test('renders main', async () => {
        const props: MainProps = {
            sample,
            setTitle: (title: string) => {
                return;
            }
        } as MainProps;

        const {findByText} = render(<Main {...props} />);

        const historyTitle = await findByText('Name');
        expect(historyTitle).toBeInTheDocument();


        // await waitFor(() => {
        //     const historyTitle = getByText('History');
        //     expect(historyTitle).toBeInTheDocument();
        //     const diffTitle = getByText('Diff');
        //     expect(diffTitle).toBeInTheDocument();
        // }, {
        //     timeout: TIMEOUT
        // });
    });
});
