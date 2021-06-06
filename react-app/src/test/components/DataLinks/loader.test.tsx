import {render, waitFor} from '@testing-library/react';
import {LinkedData, LinkedDataStoreState} from 'redux/store/linkedData';
import {AsyncProcessStatus} from 'redux/store/processing';
import Loader, {LoaderProps} from 'components/DataLinks/loader';

import linkedDataRaw from '../../data/sample3-linked-data.json';

const linkedData = (linkedDataRaw as unknown) as LinkedData;

const TIMEOUT = 10000;

describe('LinkedData loader component', () => {

    test('The access list loader should invoke the load function when in initial state', async () => {
        const linkedDataState: LinkedDataStoreState = {
            status: AsyncProcessStatus.NONE
        }
        let loadWasCalled: boolean = false;
        const props: LoaderProps = {
            linkedDataState,
            baseURL: 'foo',
            load: () => {
                loadWasCalled = true;
            }
        };

        const {getByText} = render(<Loader {...props} />);
        await waitFor(() => {
            const messageElement = getByText('Loading Linked Data...');
            expect(messageElement).toBeInTheDocument();
            expect(loadWasCalled).toEqual(true);
        }, {
            timeout: TIMEOUT
        });
    });

    test('The access list loader in PROCESSING state should show the loading indicator but not invoke the loader', async () => {
        const linkedDataState: LinkedDataStoreState = {
            status: AsyncProcessStatus.PROCESSING
        }
        let loadWasCalled: boolean = false;
        const props: LoaderProps = {
            linkedDataState,
            baseURL: 'foo',
            load: () => {
                loadWasCalled = true;
            }
        };

        const {getByText} = render(<Loader {...props} />);
        await waitFor(() => {
            const messageElement = getByText('Loading Linked Data...');
            expect(messageElement).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });

        expect(loadWasCalled).toEqual(false);
    });

    test('The access list loader in ERROR state should show the error', async () => {
        const linkedDataState: LinkedDataStoreState = {
            status: AsyncProcessStatus.ERROR,
            error: {
                code: '123',
                message: 'A Message'
            }
        }
        let loadWasCalled: boolean = false;
        const props: LoaderProps = {
            linkedDataState,
            baseURL: 'foo',
            load: () => {
                loadWasCalled = true;
            }
        };

        const {getByText} = render(<Loader {...props} />);
        await waitFor(() => {
            const messageElement = getByText(new RegExp(`${linkedDataState.error.message}`));
            expect(messageElement).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });

        expect(loadWasCalled).toEqual(false);
    });


    test('The linked data loader in SUCCESS state should show the linked data list', async () => {
        const linkedDataState: LinkedDataStoreState = {
            status: AsyncProcessStatus.SUCCESS,
            state: {linkedData}
        }
        let loadWasCalled: boolean = false;
        const props: LoaderProps = {
            linkedDataState,
            baseURL: 'foo',
            load: () => {
                loadWasCalled = true;
            }
        };

        const {getByTestId} = render(<Loader {...props} />);
        await waitFor(() => {
            // We really just need to assert that the data list did render.
            const linkElement = getByTestId('linkeddata');
            expect(linkElement).toBeInTheDocument();

            // We leave the details of access list rendering to the access list tests
        }, {
            timeout: TIMEOUT
        });

        expect(loadWasCalled).toEqual(false);
    });
});
