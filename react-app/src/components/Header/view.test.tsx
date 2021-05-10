import Header from './view';
import { render, waitFor, screen } from '@testing-library/react';

import { Format } from 'lib/client/samples/Samples';

import sampleWithVersionsData from '../../test/data/sample-with-versions.json';
import sampleData from '../../test/data/view.test.data.sample.json';

import formatData from '../../test/data/sesar-format.json';
import { Sample } from 'lib/ViewModel/ViewModel';
const sample: Sample = (sampleData as unknown) as Sample;
const sampleWithVersions: Sample = (sampleWithVersionsData as unknown) as Sample;
const format: Format = (formatData as unknown) as Format;

const TIMEOUT = 10000;

describe('Header', () => {
    test('should render with a single version', async () => {
        const { getByTestId } = render(<Header sample={sample} format={format} />);
        await waitFor(() => {
            const nameElement = getByTestId('name');
            expect(nameElement).toBeInTheDocument();
            expect(nameElement).toHaveTextContent(sample['name']);

            // const userElement = getByTestId('user');
            // expect(userElement).toBeInTheDocument();
            // expect(userElement).toHaveTextContent(sample['user']);

            // const nameElement = getByTestId('name');
            // expect(nameElement).toBeInTheDocument();
            // expect(nameElement).toHaveTextContent(sample['name']);

            // const saveDateElement = getByTestId('save_date');
            // expect(saveDateElement).toBeInTheDocument();
            // const dateDisplay = Intl.DateTimeFormat('en-US', {
            //     year: 'numeric',
            //     month: 'numeric',
            //     day: 'numeric',
            //     hour: 'numeric',
            //     minute: 'numeric',
            //     second: 'numeric',
            //     timeZoneName: 'short'
            // }).format(sample['save_date']);
            // expect(saveDateElement).toHaveTextContent(dateDisplay);

            // const versionElement = getByTestId('version');
            // expect(versionElement).toBeInTheDocument();
            // expect(versionElement).toHaveTextContent(String(sample['version']));
        }, {
            timeout: TIMEOUT
        });
    });

    test('should render with multiple versions', async () => {
        const { getByTestId } = render(<Header sample={sampleWithVersions} format={format} />);
        await waitFor(() => {
            const nameElement = getByTestId('name');
            expect(nameElement).toBeInTheDocument();
            expect(nameElement).toHaveTextContent(sampleWithVersions['name']);

        }, {
            timeout: TIMEOUT
        });
    });

    test('should select a different version', async () => {
        const { getByText } = render(<Header sample={sampleWithVersions} format={format} />);
        const button = getByText('Select a Version…');
        expect(button).toBeInTheDocument();
        button.click();

        await waitFor(() => {
            const modalTitle = getByText('All Versions');
            expect(modalTitle).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });

        // const cancelButton = s.querySelector('span.ant-modal-close-x');

        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();

        const versionButton = dialog.querySelector('[role="button"][aria-label="Click to select the latest version (7)"]');
        expect(versionButton).toBeInTheDocument();
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });

        versionButton?.dispatchEvent(event);

        // TODO: for some reason this does not tickle coverage for the 
        // button event handler in Header.
        await waitFor(() => {
            const hash = window.location.hash;
            expect(hash).toEqual(`#samples/view/${sampleWithVersions.id}/7`);
        }, {
            timeout: TIMEOUT
        });
    });

    test('should open and then cancel the dialog to switch versions', async () => {
        const { getByText } = render(<Header sample={sampleWithVersions} format={format} />);
        const button = getByText('Select a Version…');
        expect(button).toBeInTheDocument();
        button.click();

        await waitFor(() => {
            const modalTitle = getByText('All Versions');
            expect(modalTitle).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });

        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();

        const cancelButtonImage = dialog.querySelector('[role="img"]');
        expect(cancelButtonImage).toBeInTheDocument();
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        cancelButtonImage?.dispatchEvent(event);

        await waitFor(() => {
            const modalTitle = getByText('All Versions');
            expect(modalTitle).not.toBeVisible();
        }, {
            timeout: TIMEOUT
        });
    });
});
