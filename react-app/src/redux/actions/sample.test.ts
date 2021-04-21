import {ActionType, fetch, SampleFetchAction} from './sample';

describe('linkedData actions', () => {
    test('"fetch" should produce the correct action.', () => {
        const id = 'test';
        const version = 1;
        const expectedAction: SampleFetchAction = {
            category: 'sample',
            type: ActionType.FETCH,
            id, version
        };
        const action = fetch(id, version);
        expect(action).toEqual(expectedAction);
    });

    test('"fetch" should produce the correct action.', () => {
        const id = 'test';
        const expectedAction: SampleFetchAction = {
            category: 'sample',
            type: ActionType.FETCH,
            id
        };
        const action = fetch(id);
        expect(action).toEqual(expectedAction);
    })
});
