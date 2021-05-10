import ViewModel from './ViewModel';
import { setupMocks } from "../../test/mock/mock";
import { FETCH_ACL_RESULT, FETCH_ACL_RESULT_EMPTY, FETCH_USER_PROFILE_FOO_RESULT } from "../../test/mock/viewModel";

function makeViewModel() {
    return new ViewModel({
        token: 'x',
        timeout: 1000,
        sampleServiceURL: 'https://fake.kbase.us/services/sampleservice',
        userProfileURL: 'https://fake.kbase.us/services/user_profile/rpc',
        workspaceURL: 'https://fake.kbase.us/services/ws',
        serviceWizardURL: 'https://fake.kbase.us/services/ServiceWizard'
    });
}

describe('ViewModel', () => {
    beforeEach(() => {
        setupMocks();
    });

    test('Can create an instance of ViewModel', () => {
        const viewModel = new ViewModel({
            token: 'x',
            timeout: 1000,
            sampleServiceURL: 'x',
            userProfileURL: 'x',
            workspaceURL: 'x',
            serviceWizardURL: 'x'
        });

        expect(viewModel).toBeDefined();
    });

    test('Can fetch a user profile', async () => {
        const viewModel = makeViewModel();

        const profile = await viewModel.fetchUsers({ usernames: ['foo'] });
        expect(profile).toBeDefined();
        expect(profile).toEqual([FETCH_USER_PROFILE_FOO_RESULT]);
    });

    test('Fetching a user profile for a nonexistent user throws an error', async () => {
        const viewModel = makeViewModel();

        expect(async () => {
            return await viewModel.fetchUsers({ usernames: ['no_foo'] });
        }).rejects.toThrow();
    });

    test('Can fetch an empty sample ACL', async () => {
        const viewModel = makeViewModel();

        const acl = await viewModel.fetchACL({
            id: 'sample1'
        });
        expect(acl).toBeDefined();
        expect(acl).toEqual(FETCH_ACL_RESULT_EMPTY);
    });

    test('Can fetch a sample ACL', async () => {
        const viewModel = makeViewModel();

        const acl = await viewModel.fetchACL({
            id: 'sample2'
        });
        expect(acl).toBeDefined();
        expect(acl).toEqual(FETCH_ACL_RESULT);
    });

    test('Can fetch a sample', async () => {
        const viewModel = makeViewModel();

        try {
            const sample = await viewModel.fetchSample({
                id: 'sample2'
            });
            expect(sample).toBeDefined();
        } catch (ex) {
            console.error('ERROR', ex);
        }
        // expect(sample).toEqual([FETCH_SAMPLE_RESULT])
    });
});
