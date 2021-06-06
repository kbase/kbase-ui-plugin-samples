/* istanbul ignore file */

import React, {ComponentProps} from 'react';
import {Story} from '@storybook/react';
import Header from 'components/Header/view';

import sampleData from '../../data/sample-with-versions.json';
import formatData from '../../data/formats/sesar.json';

import {Sample} from "../../../lib/ViewModel/ViewModel";
import {Format} from "../../../lib/client/Format";


const sample = (sampleData as unknown) as Sample;
const format = (formatData as unknown) as Format;

export default {
    title: 'Header',
    component: Header
}

const Template: Story<ComponentProps<typeof Header>> = (args) => {
    return <Header {...args} />
};

export const HeaderStory = Template.bind({});
HeaderStory.args = {
    sample, format
}

