import {render} from '@testing-library/react';

import UserCard, {UserCardProps} from 'components/UserCard/view';
import viewTestData from './view.test.data.json';
import {User} from "lib/ViewModel/ViewModel";


interface TestData {
    users: Array<User>;
}

const testData = (viewTestData as unknown) as TestData;

test('renders a user card', async () => {
    const props: UserCardProps = {
        user: testData.users[0]
    };

    const {findByText} = render(<UserCard {...props} />);

    const historyTitle = await findByText('kbaseuitest');
    expect(historyTitle).toBeInTheDocument();

    const diffTitle = await findByText('KBase UI Test User');
    expect(diffTitle).toBeInTheDocument();

    // await waitFor(() => {
    //     const historyTitle = getByText('History');
    //     expect(historyTitle).toBeInTheDocument();
    //     const diffTitle = getByText('Diff');
    //     expect(diffTitle).toBeInTheDocument();
    // }, {
    //     timeout: TIMEOUT
    // });
});
