import React from 'react';
import { render, waitFor } from '@testing-library/react';

import testField1Data from '../../test/data/view.test.data.sample.userField.json';
import testSampleData from '../../test/data/view.test.data.sample.json';

import {MetadataUserField} from "../../lib/Model";
import {Sample} from "../Main/types";
import Component from "./view";

const testField1: MetadataUserField = (testField1Data as unknown) as MetadataUserField;
const testSample: Sample = (testSampleData as unknown) as Sample;


const TIMEOUT = 10000;

test('should render', async () => {

    const { getByText } = render(<Component field={testField1} sample={testSample}/>);

    await waitFor(() => {
        const tbody = getByText('Dog poop');
        expect(tbody).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});