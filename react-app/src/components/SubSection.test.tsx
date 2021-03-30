import React from 'react';
import { render, waitFor } from '@testing-library/react';

import SubSection, {SubSectionProps} from './SubSection'

const TIMEOUT = 10000;


test('renders a simple Section with no toolbar', async () => {
    const title = 'My Title';
    const props: SubSectionProps = {
        title
    }
    const { getByText } = render(<SubSection {...props}></SubSection>);
    await waitFor(() => {
        const messageElement = getByText(title);
        expect(messageElement).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});

test('renders a simple Section with a toolbar', async () => {
    const title = 'My Title';
    const toolbarText = 'I am a toolbar.';

    const renderToolbar = () => {
        return <div>{toolbarText}</div>;
    }
    const props: SubSectionProps = {
        title, renderToolbar
    }
    const { getByText } = render(<SubSection {...props}></SubSection>);
    await waitFor(() => {
        const messageElement = getByText(title);
        expect(messageElement).toBeInTheDocument();
        expect(getByText(toolbarText)).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});