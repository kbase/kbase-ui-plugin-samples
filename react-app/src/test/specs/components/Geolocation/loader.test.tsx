import {render, waitFor} from '@testing-library/react';
import {GeolocationStoreState} from 'redux/store/geolocation';
import {AsyncProcessStatus} from 'redux/store/processing';

import Loader, {LoaderProps} from 'components/Geolocation/loader';
import {Sample} from "lib/ViewModel/ViewModel";
import {FieldGroups} from "lib/client/SampleServiceClient";

import sampleData from 'test/data/vm-samples/sample_768c9512-69c0-4057-ba0c-f9fd280996e6_1.json';
import groupsData from 'test/data/groups/groups.json';

const sample = (sampleData as unknown) as Sample;
const fieldGroups = (groupsData as unknown) as FieldGroups;

const TIMEOUT = 10000;

describe('Geolocation loader component', () => {

    test('should invoke the load function when in initial state', async () => {
        const geolocationState: GeolocationStoreState = {
            status: AsyncProcessStatus.NONE
        }
        let loadWasCalled: boolean = false;
        const props: LoaderProps = {
            geolocationState,
            sample,
            load: () => {
                loadWasCalled = true;
            }
        };

        const {getByText} = render(<Loader {...props} />);
        await waitFor(() => {
            const messageElement = getByText('Loading Geolocation Data...');
            expect(messageElement).toBeInTheDocument();
            expect(loadWasCalled).toEqual(true);
        }, {
            timeout: TIMEOUT
        });
    });

    test('in PROCESSING state should show the loading indicator but not invoke the loader', async () => {
        const geolocationState: GeolocationStoreState = {
            status: AsyncProcessStatus.PROCESSING
        }
        let loadWasCalled: boolean = false;
        const props: LoaderProps = {
            geolocationState,
            sample,
            load: () => {
                loadWasCalled = true;
            }
        };

        const {getByText} = render(<Loader {...props} />);
        await waitFor(() => {
            const messageElement = getByText('Loading Geolocation Data...');
            expect(messageElement).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });

        expect(loadWasCalled).toEqual(false);
    });

    test('in ERROR state should show the error', async () => {
        const geolocationState: GeolocationStoreState = {
            status: AsyncProcessStatus.ERROR,
            error: {
                code: '123',
                message: 'A Message'
            }
        }
        let loadWasCalled: boolean = false;
        const props: LoaderProps = {
            geolocationState,
            sample,
            load: () => {
                loadWasCalled = true;
            }
        };

        const {getByText} = render(<Loader {...props} />);
        await waitFor(() => {
            const messageElement = getByText(new RegExp(`${geolocationState.error.message}`));
            expect(messageElement).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });

        expect(loadWasCalled).toEqual(false);
    });


    function checkField(fieldLabel: HTMLElement, content: string) {
        const field = fieldLabel.parentElement!.parentElement;
        expect(field).not.toBeNull();
        expect(field).toBeInTheDocument();
        const fieldData = field!.querySelector('td');
        expect(fieldData).toHaveTextContent(content);
    }

    test('in SUCCESS state should render the expected data', async () => {
        const geolocationState: GeolocationStoreState = {
            status: AsyncProcessStatus.SUCCESS,
            state: {fieldGroups}
        }
        let loadWasCalled: boolean = false;
        const props: LoaderProps = {
            geolocationState,
            sample,
            load: () => {
                loadWasCalled = true;
            }
        };

        const {getByText} = render(<Loader {...props} />);
        await waitFor(() => {
            checkField(getByText('Latitude'), '38.912');
            checkField(getByText('Longitude'), '-120.662');
            checkField(getByText('Elevation'), '1,370');
            checkField(getByText('Navigation type'), 'GPS');
            checkField(getByText('Primary physiographic feature'), 'Mountain');
            checkField(getByText('Name of physiographic feature'), 'Sierra Nevada foothills');
            checkField(getByText('Location description'), 'Mixed conifer forest');
            checkField(getByText('Locality'), 'Blodgett Forest Research Station, University of California');
            checkField(getByText('Country'), 'United States');

            // We leave the details of access list rendering to the access list tests
        }, {
            timeout: TIMEOUT
        });

        expect(loadWasCalled).toEqual(false);
    });
});
