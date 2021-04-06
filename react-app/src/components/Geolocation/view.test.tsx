import { render, waitFor } from '@testing-library/react';
import GeolocationViewer, { GeolocationViewerProps } from './view';
import sampleData from '../../test/data/sample-geolocation.json';
import sampleNoLatitudeData from '../../test/data/sample-geolocation-no-latitude.json';
import sampleStringLatitudeData from '../../test/data/sample-geolocation-string-latitude.json';
import sampleStringLongitudeData from '../../test/data/sample-geolocation-string-longitude.json';
import sampleEmptyLatitudeData from '../../test/data/sample-geolocation-empty-latitude.json';
import sampleEmptyLongitudeData from '../../test/data/sample-geolocation-empty-longitude.json';

import { Sample } from 'lib/ViewModel/ViewModel';
const sample = (sampleData as unknown) as Sample;
const sampleNoLatitude = (sampleNoLatitudeData as unknown) as Sample;
const sampleStringLatitude = (sampleStringLatitudeData as unknown) as Sample;
const sampleStringLongitude = (sampleStringLongitudeData as unknown) as Sample;
const sampleEmptyLatitude = (sampleEmptyLatitudeData as unknown) as Sample;
const sampleEmptyLongitude = (sampleEmptyLongitudeData as unknown) as Sample;


const TIMEOUT = 10000;

describe('The Geolocation Viewer', () => {

    // TODO: cannot test with testing-library because jsdom does not support svg well enough.

    // test('renders with a sample', async () => {
    //     // const sample = (testData.sample1 as unknown) as Sample;
    //     Object.defineProperty(global.SVGSVGElement.prototype, 'createSVGRect', {
    //         writable: true,
    //         value: jest.fn().mockImplementation(() => ({
    //             // does nothing
    //         }))
    //     });
    //     const props: GeolocationViewerProps = {
    //         sample
    //     };

    //     const { getByTestId } = render(<GeolocationViewer {...props} />);

    //     await waitFor(() => {
    //         const linkElement = getByTestId('geolocation-view');
    //         expect(linkElement).toBeInTheDocument();
    //         // const messageElement = getByText('No data linked to this sample.');
    //         // expect(messageElement).toBeInTheDocument();
    //     }, {
    //         timeout: TIMEOUT
    //     });
    // });


    test('renders with a sample without latitude', async () => {
        // const sample = (testData.sample1 as unknown) as Sample;
        const props: GeolocationViewerProps = {
            sample: sampleNoLatitude
        };

        const { getByText } = render(<GeolocationViewer {...props} />);

        await waitFor(() => {
            const el = getByText('Both latitude and longitude must be present to display a map location');
            expect(el).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });
    });

    test('renders with a sample with string latitude', async () => {
        const props: GeolocationViewerProps = {
            sample: sampleStringLatitude
        };

        const { getByText } = render(<GeolocationViewer {...props} />);

        await waitFor(() => {
            const el = getByText('latitude must be numeric field');
            expect(el).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });
    });

    test('renders with a sample with string longitude', async () => {
        const props: GeolocationViewerProps = {
            sample: sampleStringLongitude
        };

        const { getByText } = render(<GeolocationViewer {...props} />);

        await waitFor(() => {
            const el = getByText('longitude must be numeric field');
            expect(el).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });
    });

    test('renders with a sample with empty latitude', async () => {
        const props: GeolocationViewerProps = {
            sample: sampleEmptyLatitude
        };

        const { getByText } = render(<GeolocationViewer {...props} />);

        await waitFor(() => {
            const el = getByText('Both latitude and longitude must be present to display a map location');
            expect(el).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });
    });

    test('renders with a sample with empty longitude', async () => {
        const props: GeolocationViewerProps = {
            sample: sampleEmptyLongitude
        };

        const { getByText } = render(<GeolocationViewer {...props} />);

        await waitFor(() => {
            const el = getByText('Both latitude and longitude must be present to display a map location');
            expect(el).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });
    });

});
