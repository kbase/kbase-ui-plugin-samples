/* istanbul ignore file */

import React, {ComponentProps} from 'react';
import {Story} from '@storybook/react';
import linkedObjectsData
    from 'test/data/vm-samples/sample_data_links_152891ba-462f-4ead-9a83-71b0f1306161_1.json';

import DataLinks from 'components/DataLinks/view';
import {LinkedData} from "../../../../redux/store/linkedData";

const linkedData = (linkedObjectsData as unknown) as LinkedData;


export default {
    title: 'Components / DataLinks',
    component: DataLinks
}

const Template: Story<ComponentProps<typeof DataLinks>> = (args) => {
    return <DataLinks {...args} />
};

export const DataLinksStory = Template.bind({});
DataLinksStory.args = {
    baseURL: 'https://www.example.com',
    linkedData
}
