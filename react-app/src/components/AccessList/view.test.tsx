import { render, waitFor } from '@testing-library/react';

import AccessList, { AccessListProps } from './view';

const TIMEOUT = 10000;

test('renders data links with no links', async () => {
    const props: AccessListProps = {
        owner: {
            username: 'kbaseuitest',
            realname: 'KBase UI Test User',
            gravatarHash: 'b4d95f8595104614355e6ee9c4c03e3f'
        },
        acl: {
            read: [],
            write: [],
            admin: []
        }
    };

    const { getByTestId, getByText } = render(<AccessList {...props} />);
    await waitFor(() => {
        const linkElement = getByTestId('accesslist');
        expect(linkElement).toBeInTheDocument();
        // const messageElement = getByText('No data linked to this sample.');
        // expect(messageElement).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});

test('renders data links with links', async () => {
    const props: AccessListProps = {
        owner: {
            username: 'kbaseuitest',
            realname: 'KBase UI Test User',
            gravatarHash: 'b4d95f8595104614355e6ee9c4c03e3f'
        },
        acl: {
            read: [{
                username: 'kbaseuitest',
                realname: 'KBase UI Test User',
                gravatarHash: 'b4d95f8595104614355e6ee9c4c03e3f'
            }, {
                username: 'kbaseuitestx',
                realname: 'KBase UI Test Userx',
                gravatarHash: 'b4d95f8595104614355e6ee9c4c03e3f'
            }],
            write: [{
                username: 'kbaseuitest',
                realname: 'KBase UI Test User',
                gravatarHash: 'b4d95f8595104614355e6ee9c4c03e3f'
            }],
            admin: [{
                username: 'kbaseuitest',
                realname: 'KBase UI Test User',
                gravatarHash: 'b4d95f8595104614355e6ee9c4c03e3f'
            }]
        }
    };

    const { getByTestId, getByText } = render(<AccessList {...props} />);
    await waitFor(() => {
        const linkElement = getByTestId('accesslist');
        expect(linkElement).toBeInTheDocument();
        // const messageElement = getByText('No data linked to this sample.');
        // expect(messageElement).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});