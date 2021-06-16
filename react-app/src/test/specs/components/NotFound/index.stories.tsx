/* istanbul ignore file */

import React, {ComponentProps} from 'react';

import {Story} from '@storybook/react';

import NotFound from 'components/NotFound';

export default {
    title: 'Components / NotFound',
    component: NotFound
}

const Template: Story<ComponentProps<typeof NotFound>> = (args) => {
    return <NotFound {...args} />
};

export const NotFoundStory = Template.bind({});
NotFoundStory.args = {
    path: 'some/path'
}

