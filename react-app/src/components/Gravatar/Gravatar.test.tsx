import { render, waitFor } from '@testing-library/react';

import Gravatar, { GravatarProps } from './Gravatar';

const TIMEOUT = 10000;

test('renders gravatar', async () => {
    const props: GravatarProps = {
        gravatarHash: 'b4d95f8595104614355e6ee9c4c03e3f',
        username: 'kbaseuitest',
        realname: 'KBase UI Test User',
        size: 20
    };

    const { getByTestId, getByText, getByAltText } = render(<Gravatar {...props} />);
    await waitFor(() => {
        const avatarElement = getByAltText(`Avatar for ${props.username} aka ${props.realname}`);
        expect(avatarElement).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});

test('renders gravatar default', async () => {
    const props: GravatarProps = {
        username: 'kbaseuitest',
        realname: 'KBase UI Test User',
        size: 20,
        avatarOption: 'silhouette'
    };

    const { getByAltText } = render(<Gravatar {...props} />);
    await waitFor(() => {
        const avatarElement = getByAltText(`Avatar for ${props.username} aka ${props.realname}`);
        expect(avatarElement).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});

test('renders gravatar default', async () => {
    const props: GravatarProps = {
        username: 'kbaseuitest',
        realname: 'KBase UI Test User',
        size: 20,
        avatarOption: 'mysteryman'
    };

    const { getByAltText } = render(<Gravatar {...props} />);
    await waitFor(() => {
        const avatarElement = getByAltText(`Avatar for ${props.username} aka ${props.realname}`);
        expect(avatarElement).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});