import {StoreState} from "../store";

import {
    ActionType,
    SampleAction,
    SampleFetchedAction,
    SampleFetchErrorAction,
    SampleFetchingAction,
    SampleRefetchingAction,
} from "../actions/sample";
import {SampleStoreState} from "redux/store/sample";
import {AsyncProcessStatus} from "redux/store/processing";

function fetched(
    state: StoreState,
    action: SampleFetchedAction,
): SampleStoreState {
    return {
        status: AsyncProcessStatus.SUCCESS,
        state: {
            sample: action.sample,
            fieldGroups: action.fieldGroups
        },
    };
}

function fetching(
    state: StoreState,
    action: SampleFetchingAction,
): SampleStoreState {
    return {
        status: AsyncProcessStatus.PROCESSING,
    };
}

function refetching(
    state: StoreState,
    action: SampleRefetchingAction,
): SampleStoreState {
    if (state.data.sample.status !== AsyncProcessStatus.SUCCESS) {
        return state.data.sample;
    }
    return {
        ...state.data.sample,
        status: AsyncProcessStatus.REPROCESSING,
    };
}

function fetchError(
    state: StoreState,
    action: SampleFetchErrorAction,
): SampleStoreState {
    console.log('FETCH ERROR', action);
    return {
        status: AsyncProcessStatus.ERROR,
        error: action.error,
    };
}

export default function reducer(
    state: StoreState,
    action: SampleAction,
): SampleStoreState {
    switch (action.type) {
        case ActionType.FETCHED:
            return fetched(state, action);
        case ActionType.FETCHING:
            return fetching(state, action);
        case ActionType.REFETCHING:
            return refetching(state, action);
        case ActionType.FETCH_ERROR:
            return fetchError(state, action);
    }
}
