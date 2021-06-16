import React from 'react';
import {render, waitFor} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {Provider} from 'react-redux';

import View from 'views/View';
import {createReduxStore} from "../../../redux/mock/mockedStore";

const store = createReduxStore();
const TIMEOUT = 10000;

describe('The "View" view', () => {
    test('renders correctly', async () => {
        const url = '/samples/view/704986e6-a010-4c9d-883c-09ecdba1967b/1';
        const {findAllByText} = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[url]} initialIndex={0}>
                    <Route path="/samples/view/:id/:version?" component={View}/>
                </MemoryRouter>
            </Provider>
        );
        await waitFor(async () => {
            // The sample name
            const nameElement = await findAllByText(/^IEBWE0004$/);
            expect(nameElement.length).toEqual(2);
        }, {
            timeout: TIMEOUT
        });
    })
});
