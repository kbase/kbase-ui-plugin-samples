import React from 'react';
import {render, waitFor} from '@testing-library/react';

import testField1Data from '../../data/view.test.data.sample.userField.json';
import testSampleData from '../../data/view.test.data.sample.json';


import Component from "components/MetadataUserField/view";
import {MetadataUserField, Sample} from "../../../lib/ViewModel/ViewModel";

const testField1: MetadataUserField = (testField1Data as unknown) as MetadataUserField;
const testSample: Sample = (testSampleData as unknown) as Sample;


const TIMEOUT = 10000;

test('should render', async () => {

    const {getByText} = render(<Component field={testField1} sample={testSample}/>);

    await waitFor(() => {
        const tbody = getByText('Dog poop');
        expect(tbody).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});