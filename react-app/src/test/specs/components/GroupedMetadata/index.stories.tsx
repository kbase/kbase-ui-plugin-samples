/* istanbul ignore file */

import React, {ComponentProps} from 'react';
import {Story} from '@storybook/react';
import GroupedMetadata from 'components/GroupdMetadata/view';

import {Sample} from 'lib/ViewModel/ViewModel';
import {FieldGroups} from "lib/client/SampleServiceClient";
import sampleData from 'test/data/vm-samples/sample_152891ba-462f-4ead-9a83-71b0f1306161.json';
import groupsData from 'test/data/generated/sampleservice/groups/groups.json';

const fieldGroups = (groupsData as unknown) as FieldGroups;
const sample = (sampleData as unknown) as Sample;


export default {
    title: 'Components / GroupedMetadata',
    component: GroupedMetadata
}

const Template: Story<ComponentProps<typeof GroupedMetadata>> = (args) => {
    return <GroupedMetadata {...args} />
};

export const GroupedMetadataStory = Template.bind({});
GroupedMetadataStory.args = {
    sample, fieldGroups
}

