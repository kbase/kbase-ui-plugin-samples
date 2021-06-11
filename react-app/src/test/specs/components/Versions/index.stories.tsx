/* istanbul ignore file */

import React, {ComponentProps} from 'react';
import {Story} from '@storybook/react';
import Versions from 'components/Versions';
import {Sample} from 'lib/ViewModel/ViewModel';
import sampleData from '../../../data/vm-samples/sample-geolocation.json';
import sampleVersion1of4Data from '../../../data/vm-samples/sample-versions-1-of-4.json';
import sampleVersion2of4Data from '../../../data/vm-samples/sample-versions-2-of-4.json';
import sampleVersion3of4Data from '../../../data/vm-samples/sample-versions-3-of-4.json';
import sampleVersion4of4Data from '../../../data/vm-samples/sample-versions-4-of-4.json';

const sample = (sampleData as unknown) as Sample;
const sampleVersion1of4 = (sampleVersion1of4Data as unknown) as Sample;
const sampleVersion2of4 = (sampleVersion2of4Data as unknown) as Sample;
const sampleVersion3of4 = (sampleVersion3of4Data as unknown) as Sample;
const sampleVersion4of4 = (sampleVersion4of4Data as unknown) as Sample;

export default {
    title: 'Versions',
    component: Versions
}

const Template: Story<ComponentProps<typeof Versions>> = (args) => {
    return <Versions {...args} />
};

export const VersionsStory = Template.bind({});
VersionsStory.args = {
    sample,
    onChangeVersion: (_version: string) => {
        return;
    }
}

export const Versions1of4Story = Template.bind({});
Versions1of4Story.args = {
    sample: sampleVersion1of4,
    onChangeVersion: (_version: string) => {
        return;
    }
}

export const Versions2of4Story = Template.bind({});
Versions2of4Story.args = {
    sample: sampleVersion2of4,
    onChangeVersion: (_version: string) => {
        return;
    }
}

export const Versions3of4Story = Template.bind({});
Versions3of4Story.args = {
    sample: sampleVersion3of4,
    onChangeVersion: (_version: string) => {
        return;
    }
}

export const Versions4of4Story = Template.bind({});
Versions4of4Story.args = {
    sample: sampleVersion4of4,
    onChangeVersion: (_version: string) => {
        return;
    }
}

