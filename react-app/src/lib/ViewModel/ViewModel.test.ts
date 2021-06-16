import ViewModel from './ViewModel';

// import {
//     FETCH_ACL_RESULT, FETCH_ACL_RESULT_EMPTY, FETCH_USER_PROFILE_FOO_RESULT
// } from "../../../../_attic/mock/viewModel";

const URL_BASE = 'http://localhost:3333';

function makeViewModel() {
    return new ViewModel({
        token: 'x',
        timeout: 1000,
        sampleServiceURL: `${URL_BASE}/services/sampleservice`,
        userProfileURL: `${URL_BASE}/services/user_profile/rpc`,
        workspaceURL: `${URL_BASE}/services/ws`
    });
}

describe('ViewModel', () => {
    // beforeEach(() => {
    //     setupMocks();
    // });

    test('Can create an instance of ViewModel', () => {
        const viewModel = new ViewModel({
            token: 'x',
            timeout: 1000,
            sampleServiceURL: 'x',
            userProfileURL: 'x',
            workspaceURL: 'x'
        });

        expect(viewModel).toBeDefined();
    });

    test('Can fetch a user profile', async () => {
        const viewModel = makeViewModel();

        const profile = await viewModel.fetchUsers({usernames: ['kbaseuitest']});
        expect(profile).toBeDefined();
        // TODO: test profile properties
        // expect(profile).toEqual([FETCH_USER_PROFILE_FOO_RESULT]);p
    });

    test('Fetching a user profile for a nonexistent user throws an error', async () => {
        const viewModel = makeViewModel();

        await expect(async () => {
            await viewModel.fetchUsers({usernames: ['no_foo']});
        }).rejects.toThrow();
    });

    // test('Can fetch an empty sample ACL', async () => {
    //     const viewModel = makeViewModel();
    //
    //     const acl = await viewModel.fetchACL({
    //         id: 'sample1'
    //     });
    //     expect(acl).toBeDefined();
    //     expect(acl).toEqual(FETCH_ACL_RESULT_EMPTY);
    // });

    test('Can fetch a sample ACL', async () => {
        const viewModel = makeViewModel();

        const acl = await viewModel.fetchACL({
            id: '768c9512-69c0-4057-ba0c-f9fd280996e6'
        });
        expect(acl).toBeDefined();
        // TODO: test properties
        // expect(acl).toEqual(FETCH_ACL_RESULT);
    });

    test('Can fetch a sample', async () => {
        const viewModel = makeViewModel();

        try {
            const sample = await viewModel.fetchSample({
                id: '768c9512-69c0-4057-ba0c-f9fd280996e6'
            });
            expect(sample).toBeDefined();
        } catch (ex) {
            console.error('ERROR', ex);
        }
        // expect(sample).toEqual([FETCH_SAMPLE_RESULT])
    });
});
