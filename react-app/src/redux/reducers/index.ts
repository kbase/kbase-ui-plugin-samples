import {baseReducer} from "@kbase/ui-components";
import {StoreState} from "../store";
import {Reducer} from "redux";
import sampleReducer from "./sample";
import accessReducer from "./access";
import linkedDataReducer from "./linkedData";
import {AppAction} from "redux/actions";

const reducer: Reducer<StoreState | undefined, AppAction> = (
    state: StoreState | undefined,
    action: AppAction,
) => {
    // This ensures that the ui-components reducers have a chance to
    // run first.
    // TODO: base reducer should take a state that is extended from base store state and return that same
    // type (generic)

    if (!state) {
        return;
    }

    const baseState = baseReducer(state, action);
    if (baseState) {
        return baseState as StoreState;
    }

    const nextState: StoreState | null = (() => {
        switch (action.category) {
            case "sample":
                const sample = sampleReducer(state, action);
                if (!sample) {
                    return null;
                }
                return {
                    ...state,
                    data: {
                        ...state.data,
                        sample,
                    },
                };
            case "access":
                const access = accessReducer(state, action);
                if (!access) {
                    return null;
                }
                return {
                    ...state,
                    data: {
                        ...state.data,
                        access,
                    },
                };
            case "linkedData":
                const linkedData = linkedDataReducer(state, action);
                if (!linkedData) {
                    return null;
                }
                return {
                    ...state,
                    data: {
                        ...state.data,
                        linkedData,
                    },
                };
            // TODO: Not sure if this is used -- well we don't have an actual reducer, so probably not.
            // case "route":
            //     return null;
        }
    })();

    // // Now ours
    // if (typeof state === 'undefined') {
    //     return state;
    // }
    // const newState = navigate(state, action);

    // if (newState !== null) {
    //     return newState;
    // }

    // const sampleState = sampleReducer(state, action as SampleAction)

    return nextState || state;

    // // Finally, if nothing matches, ignore.
    // console.warn('unhandled action in reducer', action);
    // return state;
};

export default reducer;
