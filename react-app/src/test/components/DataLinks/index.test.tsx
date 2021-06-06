import React from 'react';
import {render, waitFor} from '@testing-library/react';
import sampleData from '../../data/view.test.data.sample.json';
import {Sample} from 'lib/ViewModel/ViewModel';

import ComponentToTest from 'components/DataLinks/index';
import {Provider} from 'react-redux';
import mockStoreCreator from 'redux/mock/mockStoreCreator';


const store = mockStoreCreator();

const sample = (sampleData as unknown) as Sample;

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
