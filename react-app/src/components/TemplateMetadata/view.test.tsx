import React from 'react';
import { render, waitFor } from '@testing-library/react';

import TemplateMetadata from './view';
import testSample from '../../test/data/view.test.data.sample.json';
import testTemplate from '../../test/data/view.test.data.template.json';
import {Sample, Template} from "../Main/types";

const sample: Sample = (testSample as unknown) as Sample;
const template: Template = (testTemplate as unknown) as Template;

const TIMEOUT = 10000;

test('should render', async () => {

    const { container } = render(<TemplateMetadata sample={sample} template={template}/>);

    await waitFor(() => {
        const tbody = container.querySelector('.ant-table-tbody');
        expect(tbody).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});