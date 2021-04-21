import {ActionType, fetch, FetchAction} from './access';

describe('access actions', () => {
    test('"fetch" should produce the correct action.', () => {
        const id = 'test';
        const expectedAction: FetchAction = {
            category: 'access',
            type: ActionType.FETCH,
            id
        };
        const action = fetch(id);
        expect(action).toEqual(expectedAction);
    })
});
