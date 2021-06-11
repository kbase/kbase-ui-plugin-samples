import {render, waitFor} from '@testing-library/react';
import AccessList, {AccessListProps} from 'components/AccessList/view';

const TIMEOUT = 10000;

describe('AccessList view component', () => {
    test('renders empty access list', async () => {
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

        const {getByTestId, getAllByText} = render(<AccessList {...props} />);
        await waitFor(() => {
            const linkElement = getByTestId('accesslist');
            expect(linkElement).toBeInTheDocument();
            const noDataMessages = getAllByText(new RegExp('No users with this access level'));
            expect(noDataMessages.length).toEqual(3);
        }, {
            timeout: TIMEOUT
        });
    });

    test('renders access list ', async () => {
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

        const {getByTestId} = render(<AccessList {...props} />);
        await waitFor(() => {
            const linkElement = getByTestId('accesslist');
            expect(linkElement).toBeInTheDocument();
            // const messageElement = getByText('No data linked to this sample.');
            // expect(messageElement).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });
    });
});
