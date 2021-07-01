import React from 'react';
import {Provider} from 'react-redux';
import {render, waitFor} from '@testing-library/react';
import ComponentToTest from 'components/DataLinks';
import mockStoreCreator from 'redux/mock/mockStoreCreator';
import {Sample} from 'lib/ViewModel/ViewModel';

// TODO: draw from mock data pool
import sampleData from '../../../data/vm-samples/sample_152891ba-462f-4ead-9a83-71b0f1306161.json';

const sample = (sampleData as unknown) as Sample;
const store = mockStoreCreator();

describe('The LinkedData connect HOF', () => {
    it('should supply the correct params which invokes the load() function prop', async () => {
        const props = {sampleId: sample.id, version: sample.currentVersion.version};
        render(
            <Provider store={store}>
                <ComponentToTest {...props} />
            </Provider>
        );

        await waitFor(() => {
            return store.getActions().length === 1;
        });
    });
});
