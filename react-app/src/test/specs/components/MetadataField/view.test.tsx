import React from 'react';
import {render, waitFor} from '@testing-library/react';
import Component from "components/MetadataField/view";

import testUserFieldData from '../../../data/view.test.data.sample.userField.json';
import testSampleData from '../../../data/view.test.data.sample.json';
import {MetadataField, Sample} from 'lib/ViewModel/ViewModel';

const testUserField: MetadataField = (testUserFieldData as unknown) as MetadataField;
const testSample: Sample = (testSampleData as unknown) as Sample;

const TIMEOUT = 10000;

test('should render a user field', async () => {
    const {getByText} = render(<Component field={testUserField} sample={testSample}/>);
    await waitFor(() => {
        const tbody = getByText('Dog poop');
        expect(tbody).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});
