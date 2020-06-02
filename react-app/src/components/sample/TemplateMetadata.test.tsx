import React from 'react';
import TemplateMetadata from './TemplateMetadata';
import { render, waitFor } from '@testing-library/react';
import { Sample, SampleNode } from '../../lib/comm/dynamicServices/SampleServiceClient';

const TIMEOUT = 10000;

test('should render', async () => {
    const sampleNode: SampleNode = {
        id: 'xyz',
        parent: null,
        type: 'BioReplicate',
        meta_controlled: {
            'Sample Name': {
                value: 'bar',
                units: 'none'
            }
        },
        meta_user: {
            'Sample Name': {
                value: 'bar',
                units: 'none'
            }
        }
    };
    const { container } = render(<TemplateMetadata sampleNode={sampleNode} />);

    await waitFor(() => {
        const tbody = container.querySelector('.ant-table-tbody');
        expect(tbody).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});