/* istanbul ignore file */

import React, {ComponentProps} from 'react';
import {Story} from '@storybook/react';

import Header from 'components/Header/view';
import {Sample} from "lib/ViewModel/ViewModel";

import sampleData from 'test/data/vm-samples/sample_152891ba-462f-4ead-9a83-71b0f1306161.json';

const sample = (sampleData as unknown) as Sample;

export default {
    title: 'Components / Header',
    component: Header
}

const Template: Story<ComponentProps<typeof Header>> = (args) => {
    return <Header {...args} />
};

export const HeaderStory = Template.bind({});
HeaderStory.args = {
    sample
}

