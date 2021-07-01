/* istanbul ignore file */

import React, {ComponentProps} from 'react';
import {Story} from '@storybook/react';
import LoaderView from 'components/Main/loader';
import {AsyncProcessStatus} from "redux/store/processing";
import testSampleData from 'test/data/vm-samples/sample-704986e6-a010-4c9d-883c-09ecdba1967b.json';
import {Sample} from "../../../../lib/ViewModel/ViewModel";
import groupsData from 'test/data/generated/sampleservice/groups/groups.json';
import {FieldGroups} from "../../../../lib/client/SampleServiceClient";
import {Provider} from 'react-redux';
import {createReduxStore} from "../../../../redux/mock/mockedStore";

const testSample: Sample = (testSampleData as unknown) as Sample;
const fieldGroups = (groupsData as unknown) as FieldGroups;

const store = createReduxStore();

export default {
    title: 'Components / Main / Loader',
    component: LoaderView
}

const Template: Story<ComponentProps<typeof LoaderView>> = (args) => {
    return <Provider store={store}>
        <LoaderView {...args} />
    </Provider>
};

export const MainLoaderViewer_NoneState = Template.bind({});
MainLoaderViewer_NoneState.args = {
    id: 'sample1',
    version: 1,
    sampleState: {
        status: AsyncProcessStatus.NONE
    },
    load: () => {
    },
    setTitle: (title: string) => {
    }
}

export const MainLoaderViewer_LoadingState = Template.bind({});
MainLoaderViewer_LoadingState.args = {
    id: 'sample1',
    version: 1,
    sampleState: {
        status: AsyncProcessStatus.PROCESSING
    },
    load: () => {
    },
    setTitle: (title: string) => {
    }
}

export const MainLoaderViewer_ErrorState = Template.bind({});
MainLoaderViewer_ErrorState.args = {
    id: 'sample1',
    version: 1,
    sampleState: {
        status: AsyncProcessStatus.ERROR,
        error: {
            code: 'error_code',
            message: 'Error Message'
        }
    },
    load: () => {
    },
    setTitle: (title: string) => {
    }
}


export const MainLoaderViewer_SuccessState = Template.bind({});
MainLoaderViewer_SuccessState.args = {
    id: 'sample1',
    version: 1,
    sampleState: {
        status: AsyncProcessStatus.SUCCESS,
        state: {
            sample: testSample,
            fieldGroups
        }
    },
    load: () => {
    },
    setTitle: (title: string) => {
    }
}
