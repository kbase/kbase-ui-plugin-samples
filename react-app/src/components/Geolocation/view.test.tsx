import {render, waitFor} from '@testing-library/react';
import GeolocationViewer, {GeolocationViewerProps} from './view';
import sampleData from '../../test/data/sample-geolocation.json';
import sampleNoLatitudeData from '../../test/data/sample-geolocation-no-latitude.json';
import sampleStringLatitudeData from '../../test/data/sample-geolocation-string-latitude.json';
import sampleStringLongitudeData from '../../test/data/sample-geolocation-string-longitude.json';
import sampleEmptyLatitudeData from '../../test/data/sample-geolocation-empty-latitude.json';
import sampleEmptyLongitudeData from '../../test/data/sample-geolocation-empty-longitude.json';
import {Sample} from 'lib/ViewModel/ViewModel';
import groupsData from '../../../public/mock-data/groups/groups.json';
import {FieldGroups} from "../../lib/client/SampleServiceClient";

const groups = (groupsData as unknown) as FieldGroups;
const group = groups.filter((group) => {
    return group.name === 'geolocation';
})[0];


const sample = (sampleData as unknown) as Sample;
// const sampleNoLatitude = (sampleNoLatitudeData as unknown) as Sample;
// const sampleStringLatitude = (sampleStringLatitudeData as unknown) as Sample;
// const sampleStringLongitude = (sampleStringLongitudeData as unknown) as Sample;
// const sampleEmptyLatitude = (sampleEmptyLatitudeData as unknown) as Sample;
// const sampleEmptyLongitude = (sampleEmptyLongitudeData as unknown) as Sample;


const TIMEOUT = 10000;

describe('The Geolocation Viewer', () => {

    test('renders with a sample with geolocation information', async () => {
        const props: GeolocationViewerProps = {
            sample,
            group
        };

        const {getByTestId, getByText} = render(<GeolocationViewer {...props} />);

        function checkFieldWithSample(label: string, sample: Sample, fieldName: string) {
            const fields = sample.metadata.filter((field) => {
                return field.key === fieldName;
            });
            expect(fields.length).toEqual(1);
            const sampleField = fields[0];
            if (sampleField.type !== 'controlled') {
                throw new Error(`Expected field ${fieldName} to be controlled`);
            }
            // expect(sampleField.type).toEqual('controlled');
            const content = (() => {
                switch (sampleField.field.type) {
                    case 'number':
                        return `${sampleField.field.numberValue}`
                    case 'string':
                        return sampleField.field.stringValue;
                }
            })();
            // console.log('content!', content);

            const fieldLabel = getByText(label);
            const field = fieldLabel.parentElement!.parentElement;
            expect(field).not.toBeNull();
            expect(field).toBeInTheDocument();
            const fieldData = field!.querySelector('td');
            expect(fieldData).toHaveTextContent(content || '');
        }

        function checkField(label: string, content: string) {
            const fieldLabel = getByText(label);
            const field = fieldLabel.parentElement!.parentElement;
            expect(field).not.toBeNull();
            expect(field).toBeInTheDocument();
            const fieldData = field!.querySelector('td');
            expect(fieldData).toHaveTextContent(content);
        }

        await waitFor(() => {
            const linkElement = getByTestId('geolocation-view');
            expect(linkElement).toBeInTheDocument();
            checkField('Latitude', '38.912');
            checkField('Longitude', '-120.662');
            checkField('Elevation', '1,370');
            checkField('Navigation type', 'GPS');
            checkField('Primary physiographic feature', 'Mountain');
            checkField('Name of physiographic feature', 'Sierra Nevada foothills');
            checkField('Location description', 'Mixed conifer forest');
            checkField('Locality', 'Blodgett Forest Research Station, University of California');
            checkField('Country', 'United States');
        }, {
            timeout: TIMEOUT
        });
    });


    // test('renders with a sample without latitude', async () => {
    //     // const sample = (testData.sample1 as unknown) as Sample;
    //
    //     const props: GeolocationViewerProps = {
    //         sample: sampleNoLatitude,
    //         group
    //     };
    //
    //     const {getByText} = render(<GeolocationViewer {...props} />);
    //
    //     await waitFor(() => {
    //         const el = getByText('Both latitude and longitude must be present to display a map location');
    //         expect(el).toBeInTheDocument();
    //     }, {
    //         timeout: TIMEOUT
    //     });
    // });

    // test('renders with a sample with string latitude', async () => {
    //     const props: GeolocationViewerProps = {
    //         sample: sampleStringLatitude,
    //         group
    //     };
    //
    //     const {getByText} = render(<GeolocationViewer {...props} />);
    //
    //     await waitFor(() => {
    //         const el = getByText('latitude must be numeric field');
    //         expect(el).toBeInTheDocument();
    //     }, {
    //         timeout: TIMEOUT
    //     });
    // });

    // test('renders with a sample with string longitude', async () => {
    //     const props: GeolocationViewerProps = {
    //         sample: sampleStringLongitude,
    //         group
    //     };
    //
    //     const {getByText} = render(<GeolocationViewer {...props} />);
    //
    //     await waitFor(() => {
    //         const el = getByText('longitude must be numeric field');
    //         expect(el).toBeInTheDocument();
    //     }, {
    //         timeout: TIMEOUT
    //     });
    // });

    // test('renders with a sample with empty latitude', async () => {
    //     const props: GeolocationViewerProps = {
    //         sample: sampleEmptyLatitude,
    //         group
    //     };
    //
    //     const {getByText} = render(<GeolocationViewer {...props} />);
    //
    //     await waitFor(() => {
    //         const el = getByText('Both latitude and longitude must be present to display a map location');
    //         expect(el).toBeInTheDocument();
    //     }, {
    //         timeout: TIMEOUT
    //     });
    // });
    //
    // test('renders with a sample with empty longitude', async () => {
    //     const props: GeolocationViewerProps = {
    //         sample: sampleEmptyLongitude,
    //         group
    //     };
    //
    //     const {getByText} = render(<GeolocationViewer {...props} />);
    //
    //     await waitFor(() => {
    //         const el = getByText('Both latitude and longitude must be present to display a map location');
    //         expect(el).toBeInTheDocument();
    //     }, {
    //         timeout: TIMEOUT
    //     });
    // });

});
