import Header from './view';
import {render, waitFor, screen} from '@testing-library/react';

import sampleWithVersionsData from '../../test/data/sample-with-versions.json';
import sampleData from '../../test/data/sample-sesar.json';

import formatData from '../../test/data/sesar-format.json';
import {Sample} from 'lib/ViewModel/ViewModel';
import {Format} from "../../lib/client/Format";

const sample: Sample = (sampleData as unknown) as Sample;
const sampleWithVersions: Sample = (sampleWithVersionsData as unknown) as Sample;
const format: Format = (formatData as unknown) as Format;

const TIMEOUT = 10000;

describe('Header', () => {
    test('should render with a single version', async () => {
        const header = render(<Header sample={sample} format={format}/>);
        const {getByTestId, getByText} = header;

        function checkField(label: string, content: string) {
            const fieldLabel = getByText(label);
            const field = fieldLabel.parentElement;
            expect(field).not.toBeNull();
            expect(field).toBeInTheDocument();
            const fieldData = field!.querySelector('td');
            expect(fieldData).toHaveTextContent(content);
        }

        await waitFor(() => {
            const nameElement = getByTestId('name');
            expect(nameElement).toBeInTheDocument();
            expect(nameElement).toHaveTextContent(sample['name']);

            // Check the owner field
            checkField('Owner', sample.created.by.username);
            checkField('Owner', sample.created.by.realname);
            checkField('Format', sample.format.info.shortTitle);
            checkField('ID', sample.sampleId);
            checkField('Name', sample.name);
            const dateDisplay = Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timeZoneName: 'short'
            }).format(sample.created.at);
            checkField('Last Saved', dateDisplay);
            checkField('Versions', '1');
        }, {
            timeout: TIMEOUT
        });
    });

    test('should render with multiple versions', async () => {
        const {getByTestId} = render(<Header sample={sampleWithVersions} format={format}/>);
        await waitFor(() => {
            const nameElement = getByTestId('name');
            expect(nameElement).toBeInTheDocument();
            expect(nameElement).toHaveTextContent(sampleWithVersions['name']);

        }, {
            timeout: TIMEOUT
        });
    });

    test('should select a different version', async () => {
        const {getByText} = render(<Header sample={sampleWithVersions} format={format}/>);
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

        const buttonSelector = '[role="button"][aria-label="Click to select the latest version (4)"]'
        // const buttonSelector = '.NiceTable > tbody > tr:nth-child(3) > td:nth-child(5) > [role="button"]';
        await waitFor(() => {
            const versionButton = dialog.querySelector(buttonSelector);
            expect(versionButton).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });

        const versionButton = dialog.querySelector(buttonSelector);
        expect(versionButton).toHaveTextContent('4');

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
            expect(hash).toEqual(`#samples/view/${sampleWithVersions.id}/4`);
        }, {
            timeout: TIMEOUT
        });

        // TODO: verify that the view switched to the new version
    });

    test('should open and then cancel the dialog to switch versions', async () => {
        const {getByText} = render(<Header sample={sampleWithVersions} format={format}/>);
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

        await waitFor(() => {
            const cancelButton = dialog.querySelector('button[aria-label="Close"]');
            expect(cancelButton).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });

        const cancelButton = dialog.querySelector('button[aria-label="Close"]');
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        cancelButton?.dispatchEvent(event);

        await waitFor(() => {
            const modalTitle = getByText('All Versions');
            expect(modalTitle).not.toBeVisible();
        }, {
            timeout: TIMEOUT
        });
    });
});
