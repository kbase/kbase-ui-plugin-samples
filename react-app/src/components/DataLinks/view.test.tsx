import { render, waitFor } from '@testing-library/react';
import DataLinks, { DataLinksProps } from './view';
import testData from './view.test-data.json';

const TIMEOUT = 10000;

describe('The LinkedData viewer', () => {
    test('renders data links with no links', async () => {
        const props: DataLinksProps = {
            linkedData: [
            ],
            baseURL: 'http://example.com'
        };

        const { getByTestId, getByText } = render(<DataLinks {...props} />);
        await waitFor(() => {
            const linkElement = getByTestId('linkeddata');
            expect(linkElement).toBeInTheDocument();
            // const messageElement = getByText('No data linked to this sample.');
            // expect(messageElement).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });
    });

    test('renders one data link', async () => {
        const props: DataLinksProps = {
            linkedData: testData.slice(0, 1),
            baseURL: 'http://example.com'
        };

        const { getByTestId, getByText } = render(<DataLinks {...props} />);
        await waitFor(() => {
            const linkElement = getByTestId('linkeddata');
            expect(linkElement).toBeInTheDocument();

            const message = getByText('This sample is linked to 1 data object.');
            expect(message).toBeInTheDocument();
            // const messageElement = getByText('No data linked to this sample.');
            // expect(messageElement).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });
    });


    test('renders data links with links', async () => {
        const props: DataLinksProps = {
            linkedData: testData,
            baseURL: 'http://example.com'
        };

        const { findByText, findByTestId } = render(<DataLinks {...props} />);

        const linkElement = await findByTestId('linkeddata');
        expect(linkElement).toBeInTheDocument();

        const message = await findByText('This sample is linked to 4 data objects.');
        expect(message).toBeInTheDocument();

        await waitFor(() => {
            const table = linkElement.querySelector('.ant-table-body table');
            expect(table).toBeInTheDocument();
            if (table === null) {
                throw new Error('impossible');
            }

            if (table) {
                const rows = table.querySelectorAll('tr');
                expect(rows.length).toEqual(5);
            }

        }, {
            timeout: TIMEOUT
        });
    });
});
