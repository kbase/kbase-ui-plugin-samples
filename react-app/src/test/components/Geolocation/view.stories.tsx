/* istanbul ignore file */

import React, {ComponentProps} from 'react';
import {Story} from '@storybook/react';
import GeolocationViewer from 'components/Geolocation/view';

import {Sample} from 'lib/ViewModel/ViewModel';
import {FieldGroup} from "lib/client/SampleServiceClient";
import sampleData from './storyData/sample-geolocation.json';
import geolocationGroup from './storyData/geolocationGroup.json';
import {FieldNumberValue} from "lib/ViewModel/Field";

const group = (geolocationGroup as unknown) as FieldGroup;
const sample = (sampleData as unknown) as Sample;


export default {
    title: 'Geolocation View',
    component: GeolocationViewer
}

const Template: Story<ComponentProps<typeof GeolocationViewer>> = (args) => {
    return <GeolocationViewer {...args} />
};

export const GeolocationViewerStory = Template.bind({});
GeolocationViewerStory.args = {
    sample, group
}

export const GeolocationViewerNoLatitudeStory = Template.bind({})
const sampleWithoutLatitude = (JSON.parse(JSON.stringify(sample)) as unknown) as Sample;
sampleWithoutLatitude.metadata = sampleWithoutLatitude.metadata.filter((field) => {
    return field.key !== 'latitude';
})
delete sampleWithoutLatitude.controlled['latitude'];
GeolocationViewerNoLatitudeStory.args = {
    sample: sampleWithoutLatitude, group
}

export const GeolocationViewerStringLatitudeStory = Template.bind({})
const sampleWithStringLatitude = (JSON.parse(JSON.stringify(sample)) as unknown) as Sample;
// sampleWithStringLatitude.metadata = sampleWithoutLatitude.metadata.map((field) => {
//     if (field.key !== 'latitude') {
//         field.field.type = 'string';
//     }
//     return field;
// })
sampleWithStringLatitude.controlled['latitude'].field.type = 'string';
GeolocationViewerStringLatitudeStory.args = {
    sample: sampleWithStringLatitude, group
}

export const GeolocationViewerStringLongitudeStory = Template.bind({})
const sampleWithStringLongitude = (JSON.parse(JSON.stringify(sample)) as unknown) as Sample;
// sampleWithStringLatitude.metadata = sampleWithoutLatitude.metadata.map((field) => {
//     if (field.key !== 'latitude') {
//         field.field.type = 'string';
//     }
//     return field;
// })
sampleWithStringLongitude.controlled['longitude'].field.type = 'string';
GeolocationViewerStringLongitudeStory.args = {
    sample: sampleWithStringLongitude, group
}

export const GeolocationViewerNullLongitudeStory = Template.bind({})
const sampleWithNullLongitude = (JSON.parse(JSON.stringify(sample)) as unknown) as Sample;
// sampleWithStringLatitude.metadata = sampleWithoutLatitude.metadata.map((field) => {
//     if (field.key !== 'latitude') {
//         field.field.type = 'string';
//     }
//     return field;
// })

const field = sampleWithNullLongitude.controlled['longitude'].field as FieldNumberValue;
field.numberValue = null;

GeolocationViewerNullLongitudeStory.args = {
    sample: sampleWithNullLongitude, group
}

