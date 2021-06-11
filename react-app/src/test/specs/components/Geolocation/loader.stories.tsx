/* istanbul ignore file */

import React, {ComponentProps} from 'react';
import {Story} from '@storybook/react';
import LoaderView from 'components/Geolocation/loader';

import {Sample} from 'lib/ViewModel/ViewModel';
import sampleData from './storyData/sample-geolocation.json';
import {GeolocationStoreState} from "redux/store/geolocation";
import {AsyncProcessStatus} from "redux/store/processing";

const sample = (sampleData as unknown) as Sample;

export default {
    title: 'Geolocation Loader View',
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


