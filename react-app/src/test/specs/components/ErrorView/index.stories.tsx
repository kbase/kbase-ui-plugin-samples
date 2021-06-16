/* istanbul ignore file */

import React, {ComponentProps} from 'react';
import {Story} from '@storybook/react';
import ErrorView from 'components/ErrorView';
import {AppError} from "@kbase/ui-components";

export default {
    title: 'Components / ErrorView',
    component: ErrorView
}

const Template: Story<ComponentProps<typeof ErrorView>> = (args) => {
    return <ErrorView {...args} />
};

export const ErrorViewStory = Template.bind({});
const error: AppError = {
    code: 'abc',
    message: 'error message',
}
ErrorViewStory.args = {
    error
}

export const ErrorViewStoryWithTitle = Template.bind({});
ErrorViewStoryWithTitle.args = {
    error,
    title: 'My Error View'
}

export const ErrorViewStoryWithInfo = Template.bind({});
const errorWithInfo: AppError = {
    code: 'abc',
    message: 'error message',
    info: {
        some: 'thingee',
        alist: ['of', 'several', 3, 'things', true, false, null, {and: 'more'}]
    }
}
ErrorViewStoryWithInfo.args = {
    error: errorWithInfo,
    title: 'My Error View'
}

export const ErrorViewStoryWithInvalidInfoJSON = Template.bind({});
const errorWithInvalidInfoJSON: AppError = {
    code: 'abc',
    message: 'error message',
    info: {
        bad: ((new Date() as unknown) as string)
    }
}
ErrorViewStoryWithInvalidInfoJSON.args = {
    error: errorWithInvalidInfoJSON,
    title: 'My Error View'
}

