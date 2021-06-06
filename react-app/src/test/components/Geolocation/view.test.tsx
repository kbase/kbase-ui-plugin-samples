import {render, waitFor} from '@testing-library/react';
import GeolocationViewer, {GeolocationViewerProps} from 'components/Geolocation/view';
import sampleData from './storyData/sample-geolocation.json';
import {Sample} from 'lib/ViewModel/ViewModel';
import groupsData from '../../data/groups/groups.json';
import {FieldGroups} from "lib/client/SampleServiceClient";
import {FieldNumberValue} from "lib/ViewModel/Field";

const groups = (groupsData as unknown) as FieldGroups;
const group = groups.filter((group) => {
    return group.name === 'geolocation';
})[0];


const sample = (sampleData as unknown) as Sample;


const TIMEOUT = 10000;

describe('The Geolocation Viewer', () => {

    function checkField(fieldLabel: HTMLElement, content: string) {
        const field = fieldLabel.parentElement!.parentElement;
        expect(field).not.toBeNull();
        expect(field).toBeInTheDocument();
        const fieldData = field!.querySelector('td');
        expect(fieldData).toHaveTextContent(content);
    }

    test('renders with a sample with geolocation information', async () => {
        const props: GeolocationViewerProps = {
            sample,
            group
        };

        const {getByTestId, getByText} = render(<GeolocationViewer {...props} />);

        await waitFor(() => {
            const linkElement = getByTestId('geolocation-view');
            expect(linkElement).toBeInTheDocument();
            checkField(getByText('Latitude'), '38.912');
            checkField(getByText('Longitude'), '-120.662');
            checkField(getByText('Elevation'), '1,370');
            checkField(getByText('Navigation type'), 'GPS');
            checkField(getByText('Primary physiographic feature'), 'Mountain');
            checkField(getByText('Name of physiographic feature'), 'Sierra Nevada foothills');
            checkField(getByText('Location description'), 'Mixed conifer forest');
            checkField(getByText('Locality'), 'Blodgett Forest Research Station, University of California');
            checkField(getByText('Country'), 'United States');
        }, {
            timeout: TIMEOUT
        });

    });

    test('renders with a sample with geolocation information but no latitude', async () => {
        const sampleWithoutLatitude = (JSON.parse(JSON.stringify(sample)) as unknown) as Sample;
        sampleWithoutLatitude.metadata = sampleWithoutLatitude.metadata.filter((field) => {
            return field.key !== 'latitude';
        })

        delete sampleWithoutLatitude.controlled['latitude'];

        const props: GeolocationViewerProps = {
            sample: sampleWithoutLatitude,
            group
        };

        const {getByTestId, getByText} = render(<GeolocationViewer {...props} />);

        await waitFor(() => {
            const linkElement = getByTestId('geolocation-view');
            expect(linkElement).toBeInTheDocument();
            checkField(getByText('Longitude'), '-120.662');
            checkField(getByText('Elevation'), '1,370');
            checkField(getByText('Navigation type'), 'GPS');
            checkField(getByText('Primary physiographic feature'), 'Mountain');
            checkField(getByText('Name of physiographic feature'), 'Sierra Nevada foothills');
            checkField(getByText('Location description'), 'Mixed conifer forest');
            checkField(getByText('Locality'), 'Blodgett Forest Research Station, University of California');
            checkField(getByText('Country'), 'United States');
            expect(getByText('Both latitude and longitude must be present to display a map location')).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });
    });

    test('renders a sample with geolocation information and strangely with a string latitude', async () => {
        const sampleWithStringLatitude = (JSON.parse(JSON.stringify(sample)) as unknown) as Sample;
        sampleWithStringLatitude.controlled['latitude'].field.type = 'string';

        const props: GeolocationViewerProps = {
            sample: sampleWithStringLatitude,
            group
        };

        const {getByTestId, getByText} = render(<GeolocationViewer {...props} />);

        await waitFor(() => {
            const linkElement = getByTestId('geolocation-view');
            expect(linkElement).toBeInTheDocument();
            expect(getByText('latitude must be numeric field')).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });
    });

    test('renders a sample with geolocation information and strangely with a string longitude', async () => {
        const sampleWithStringLatitude = (JSON.parse(JSON.stringify(sample)) as unknown) as Sample;
        sampleWithStringLatitude.controlled['longitude'].field.type = 'string';

        const props: GeolocationViewerProps = {
            sample: sampleWithStringLatitude,
            group
        };

        const {getByTestId, getByText} = render(<GeolocationViewer {...props} />);

        await waitFor(() => {
            const linkElement = getByTestId('geolocation-view');
            expect(linkElement).toBeInTheDocument();
            expect(getByText('longitude must be numeric field')).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });
    });

    test('renders a sample with geolocation information and with a null latitude', async () => {
        const sampleWithNullLatitude = (JSON.parse(JSON.stringify(sample)) as unknown) as Sample;
        const field = sampleWithNullLatitude.controlled['latitude'].field as FieldNumberValue;
        field.numberValue = null;

        const props: GeolocationViewerProps = {
            sample: sampleWithNullLatitude,
            group
        };

        const {getByTestId, getByText} = render(<GeolocationViewer {...props} />);

        await waitFor(() => {
            const linkElement = getByTestId('geolocation-view');
            expect(linkElement).toBeInTheDocument();
            expect(getByText('Both latitude and longitude must be present to display a map location')).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });
    });


    test('renders a sample with geolocation information and with a null longitude', async () => {
        const sampleWithNullLongitude = (JSON.parse(JSON.stringify(sample)) as unknown) as Sample;
        const field = sampleWithNullLongitude.controlled['latitude'].field as FieldNumberValue;
        field.numberValue = null;

        const props: GeolocationViewerProps = {
            sample: sampleWithNullLongitude,
            group
        };

        const {getByTestId, getByText} = render(<GeolocationViewer {...props} />);

        await waitFor(() => {
            const linkElement = getByTestId('geolocation-view');
            expect(linkElement).toBeInTheDocument();
            expect(getByText('Both latitude and longitude must be present to display a map location')).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });
    });


});
