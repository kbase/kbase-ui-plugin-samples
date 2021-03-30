import React from 'react';
import { render, waitFor } from '@testing-library/react';

import testField1Data from '../../test/data/view.test.data.field1.json';
import testEmptyFieldData from '../../test/data/view.test.data.emptyField.json';
import testEmptyNumberFieldData from '../../test/data/view.test.data.sample.emptyNumberField.json';
import testEmptyOntologyTermFieldData from '../../test/data/view.test.data.sample.emptyOntologyTermField.json';
import testOntologyTermFieldData from '../../test/data/view.test.data.sample.ontologyTermField.json';
import testSampleData from '../../test/data/view.test.data.sample.json';

import testNumericFieldData from '../../test/data/view.test.data.numericField.json';
import testSample2Data from '../../test/data/view.test.data.sample2.json';


import {MetadataControlledField, MetadataUserField} from "../../lib/Model";
import {Sample} from "../Main/types";
import Component from "./view";

const testField1: MetadataControlledField = (testField1Data as unknown) as MetadataControlledField;
const testEmptyField: MetadataControlledField = (testEmptyFieldData as unknown) as MetadataControlledField;
const testEmptyNumberField: MetadataControlledField = (testEmptyNumberFieldData as unknown) as MetadataControlledField;
const testEmptyOntologyTermField: MetadataControlledField = (testEmptyOntologyTermFieldData as unknown) as MetadataControlledField;
const testOntologyTermField: MetadataControlledField = (testOntologyTermFieldData as unknown) as MetadataControlledField;

const testSample: Sample = (testSampleData as unknown) as Sample;

const testNumericField: MetadataControlledField = (testNumericFieldData as unknown) as MetadataControlledField;
const testSample2: Sample = (testSample2Data as unknown) as Sample;



const TIMEOUT = 10000;

test('should render', async () => {

    const { getByText } = render(<Component field={testField1} sample={testSample}/>);

    await waitFor(() => {
        const tbody = getByText('ont_term_04');
        expect(tbody).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});

test('should render an empty field', async () => {

    const { getByText } = render(<Component field={testEmptyField} sample={testSample}/>);

    await waitFor(() => {
        const tbody = getByText('∅');
        expect(tbody).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});


test('should render a numeric field', async () => {
    const { getByText } = render(<Component field={testNumericField} sample={testSample2}/>);
    await waitFor(() => {
        const tbody = getByText('-125.183');
        expect(tbody).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});

test('should render an empty numeric field', async () => {
    const { getByText } = render(<Component field={testEmptyNumberField} sample={testSample}/>);
    await waitFor(() => {
        const tbody = getByText('∅');
        expect(tbody).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});

test('should render an ontology term field', async () => {
    const { getByText } = render(<Component field={testOntologyTermField} sample={testSample}/>);
    await waitFor(() => {
        const tbody = getByText('foo');
        expect(tbody).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});

test('should render an empty ontology term field', async () => {
    const { getByText } = render(<Component field={testEmptyOntologyTermField} sample={testSample}/>);
    await waitFor(() => {
        const tbody = getByText('∅');
        expect(tbody).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});
