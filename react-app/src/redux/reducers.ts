import { baseReducer, BaseStoreState } from "@kbase/ui-components";
import { StoreState } from "./store";
import { Action, Reducer } from "redux";

const reducer: Reducer<StoreState | undefined, Action> = (state: StoreState | undefined, action: Action) => {
    const baseState = baseReducer(state as BaseStoreState, action);
    if (baseState) {
        return baseState as StoreState;
    }
    return state;
};

export default reducer;