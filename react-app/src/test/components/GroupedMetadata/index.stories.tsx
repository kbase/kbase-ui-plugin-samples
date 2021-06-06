/* istanbul ignore file */

import React, {ComponentProps} from 'react';
import {Story} from '@storybook/react';
import GroupedMetadata from 'components/GroupdMetadata/view';

import {Sample} from 'lib/ViewModel/ViewModel';
import {FieldGroups} from "lib/client/SampleServiceClient";
import sampleData from './storyData/sample-geolocation.json';
import groupsData from './storyData/groups.json';

const fieldGroups = (groupsData as unknown) as FieldGroups;
const sample = (sampleData as unknown) as Sample;


export default {
    title: 'Grouped Metadata View',
    component: GroupedMetadata
}

const Template: Story<ComponentProps<typeof GroupedMetadata>> = (args) => {
    return <GroupedMetadata {...args} />
};

export const GroupedMetadataStory = Template.bind({});
GroupedMetadataStory.args = {
    sample, fieldGroups
}

