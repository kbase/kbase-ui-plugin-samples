/* istanbul ignore file */

import React, {ComponentProps} from 'react';
import {Story} from '@storybook/react';
import View from '../../../views/View';
import {MemoryRouter, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createReduxStore} from "../../../redux/mock/mockedStore";

const store = createReduxStore();

export default {
    title: 'Views / View',
    component: View
}

const Template: Story<ComponentProps<typeof MemoryRouter>> = (args) => {
    return <Provider store={store}>
        <MemoryRouter {...args} initialIndex={0}>
            <Route path="/samples/view/:id/:version?" component={View}/>
        </MemoryRouter>
    </Provider>
};

const url = '/samples/view/704986e6-a010-4c9d-883c-09ecdba1967b/1';
export const ViewStory = Template.bind({});
ViewStory.args = {
    initialEntries: [url]
}