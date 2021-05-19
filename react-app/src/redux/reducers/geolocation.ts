import {StoreState} from "../store";

import {
    ActionType,
    FetchedAction,
    FetchErrorAction,
    FetchingAction,
    GeolocationAction,
} from "../actions/geolocation";
import {AsyncProcessStatus} from "redux/store/processing";
import {GeolocationStoreState} from "redux/store/geolocation";

function fetched(
    state: StoreState,
    action: FetchedAction,
): GeolocationStoreState {
    return {
        status: AsyncProcessStatus.SUCCESS,
        state: {
            fieldGroups: action.fieldGroups,
        },
    };
}

function fetching(
    state: StoreState,
    action: FetchingAction,
): GeolocationStoreState {
    return {
        status: AsyncProcessStatus.PROCESSING,
    };
}

function fetchError(
    state: StoreState,
    action: FetchErrorAction,
): GeolocationStoreState {
    return {
        status: AsyncProcessStatus.ERROR,
        error: action.error,
    };
}

export default function reducer(
    state: StoreState,
    action: GeolocationAction,
): GeolocationStoreState {
    switch (action.type) {
        case ActionType.FETCHED:
            return fetched(state, action);
        case ActionType.FETCHING:
            return fetching(state, action);
        case ActionType.FETCH_ERROR:
            return fetchError(state, action);
    }
}
