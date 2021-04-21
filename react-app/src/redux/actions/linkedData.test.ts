import {ActionType, fetch, FetchAction} from './linkedData';

describe('linkedData actions', () => {
    test('"fetch" should produce the correct action.', () => {
        const id = 'test';
        const version = 1;
        const expectedAction: FetchAction = {
            category: 'linkedData',
            type: ActionType.FETCH,
            id, version
        };
        const action = fetch(id, version);
        expect(action).toEqual(expectedAction);
    })
});
