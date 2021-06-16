/* istanbul ignore file */

import React, {ComponentProps} from 'react';
import {Story} from '@storybook/react';

import Header from 'components/Header/view';
import {Sample} from "lib/ViewModel/ViewModel";

import sampleData from 'test/data/vm-samples/sample_768c9512-69c0-4057-ba0c-f9fd280996e6_1.json';

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

