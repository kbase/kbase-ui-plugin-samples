import React from 'react';
import { render, waitFor } from '@testing-library/react';

import Section, {SectionProps} from './Section'

const TIMEOUT = 10000;


test('renders a simple Section with no toolbar', async () => {
    const title = 'My Title';
    const props: SectionProps = {
        title
    }
    const { getByText } = render(<Section {...props}></Section>);
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
    const props: SectionProps = {
        title, renderToolbar
    }
    const { getByText } = render(<Section {...props}></Section>);
    await waitFor(() => {
        const messageElement = getByText(title);
        expect(messageElement).toBeInTheDocument();
        expect(getByText(toolbarText)).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});