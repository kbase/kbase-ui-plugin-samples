import {render, waitFor} from '@testing-library/react';
import GroupedMetadata, {GroupedMetadataProps} from 'components/GroupdMetadata/view';

import {Sample} from 'lib/ViewModel/ViewModel';
import {FieldGroups} from "lib/client/SampleServiceClient";
import sampleData from '../../data/sample-geolocation.json';
import groupsData from '../../data/groups/groups.json';

const fieldGroups = (groupsData as unknown) as FieldGroups;
const sample = (sampleData as unknown) as Sample;

const TIMEOUT = 10000;

describe('The Grouped Metadata Viewer', () => {

    test('renders with a sample with grouped metadata fields', async () => {
        const props: GroupedMetadataProps = {
            sample,
            fieldGroups
        };

        const {getByText} = render(<GroupedMetadata {...props} />);

        function checkField(label: string, content: string) {
            const fieldLabel = getByText(label);
            const field = fieldLabel.parentElement!.parentElement;
            expect(field).not.toBeNull();
            expect(field).toBeInTheDocument();
            const fieldData = field!.querySelector('div:nth-child(2)');
            expect(fieldData).toHaveTextContent(content);
        }

        await waitFor(() => {
            checkField('Sample Name', 'BWE201406031C');
            checkField('Sample Type', 'Core');
            checkField('Latitude', '38.912 degrees');
            checkField('Elevation', '1,370');
        }, {
            timeout: TIMEOUT
        });
    });
});
