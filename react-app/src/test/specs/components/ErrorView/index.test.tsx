import React from 'react';
import {render} from '@testing-library/react';
import ErrorView from 'components/ErrorView';
import {AppError} from '@kbase/ui-components';

function checkField(fieldLabel: HTMLElement, content: string) {
    const field = fieldLabel.parentElement!.parentElement;
    expect(field).not.toBeNull();
    expect(field).toBeInTheDocument();
    const fieldData = field!.querySelector('td');
    expect(fieldData).toHaveTextContent(content);
}

describe('The Error View', () => {

    test('renders minimal error correctly', async () => {
        const error: AppError = {
            code: 'abc',
            message: 'error message',
        }
        const {getByText} = render(<ErrorView error={error}/>);

        checkField(getByText('Code'), 'abc');

        expect(getByText('error message')).toBeInTheDocument();
        expect(getByText('Error')).toBeInTheDocument();
    });

    test('renders slightly more complicated error correctly', async () => {
        const error: AppError = {
            code: 'abc123',
            message: 'another error message',
            info: {
                some: 'thingee',
                alist: ['of', 'several', 3, 'things', true, false, null, {and: 'more'}]
            }
        }
        const {getByText} = render(<ErrorView error={error} title="My Error Title"/>);

        checkField(getByText('Code'), 'abc123');

        expect(getByText('another error message')).toBeInTheDocument();
        expect(getByText('My Error Title')).toBeInTheDocument();
        expect(getByText('thingee')).toBeInTheDocument();
    });

    test('handles passing an invalid JSON value in info', async () => {
        const error: AppError = {
            code: 'abc123',
            message: 'another error message',
            info: {
                bad: ((new Date() as unknown) as string)
            }
        }
        const {getByText} = render(<ErrorView error={error} title="My Error Title"/>);
        expect(getByText('** Not a JSONValue ** object')).toBeInTheDocument();
    });
});