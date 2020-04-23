import { baseReducer } from "@kbase/ui-components";
import { StoreState } from "../store";
import { Action, Reducer } from "redux";
import navigate from './navigation';

const reducer: Reducer<StoreState | undefined, Action> = (state: StoreState | undefined, action: Action) => {
    // This ensures that the ui-components reducers have a chance to 
    // run first.
    // TODO: base reducer should take a state that is extended from base store state and return that same
    // type (generic)


    const baseState = baseReducer(state, action);
    if (baseState) {
        return baseState as StoreState;
    }

    // Now ours
    if (typeof state === 'undefined') {
        return state;
    }
    const newState = navigate(state, action);

    return newState || state;


    // // Finally, if nothing matches, ignore.
    // console.warn('unhandled action in reducer', action);
    // return state;
};

export default reducer;