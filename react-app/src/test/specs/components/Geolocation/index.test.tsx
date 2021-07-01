import React from 'react';
import {render, waitFor} from '@testing-library/react';
import {Provider} from 'react-redux';

import {Sample} from 'lib/ViewModel/ViewModel';
import ComponentToTest from 'components/Geolocation';
import mockStoreCreator from 'redux/mock/mockStoreCreator';

// TODO: draw from mock data pool
import sampleData from 'test/data/generated/sampleservice/generated/sample_5cdb2854-b194-4644-a4c6-6ff2ed24b9c8-1.json';

const store = mockStoreCreator();
const sample = (sampleData as unknown) as Sample;

describe('The Geolocation connect HOF', () => {
    it('should supply the correct params which invokes the load() function prop', async () => {
        const props = {sample};
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
