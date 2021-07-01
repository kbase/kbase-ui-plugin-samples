/* istanbul ignore file */

import React, {ComponentProps} from 'react';
import {Story} from '@storybook/react';
import LoaderView from 'components/Geolocation/loader';

import {Sample} from 'lib/ViewModel/ViewModel';

import {GeolocationStoreState} from "redux/store/geolocation";
import {AsyncProcessStatus} from "redux/store/processing";

import sampleData from 'test/data/vm-samples/sample_152891ba-462f-4ead-9a83-71b0f1306161.json';

const sample = (sampleData as unknown) as Sample;

export default {
    title: 'Components / Geolocation / Loader',
    component: LoaderView
}

const Template: Story<ComponentProps<typeof LoaderView>> = (args) => {
    return <LoaderView {...args} />
};

export const GeolocationLoaderViewerStory = Template.bind({});
const geolocationStateNone: GeolocationStoreState = {
    status: AsyncProcessStatus.NONE
}
GeolocationLoaderViewerStory.args = {
    sample, geolocationState: geolocationStateNone, load: () => {
    }
}


