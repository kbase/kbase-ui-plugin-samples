import { StoreState } from "../store";

import {
  ActionType,
  FetchedAction,
  FetchErrorAction,
  FetchingAction,
  LinkedDataAction,
} from "../actions/linkedData";
import { AsyncProcessStatus } from "redux/store/processing";
import { LinkedDataStoreState } from "redux/store/linkedData";

function fetched(
  state: StoreState,
  action: FetchedAction,
): LinkedDataStoreState {
  return {
    status: AsyncProcessStatus.SUCCESS,
    state: {
      linkedData: action.linkedData,
    },
  };
}

function fetching(
  state: StoreState,
  action: FetchingAction,
): LinkedDataStoreState {
  return {
    status: AsyncProcessStatus.PROCESSING,
  };
}

function fetchError(
  state: StoreState,
  action: FetchErrorAction,
): LinkedDataStoreState {
  return {
    status: AsyncProcessStatus.ERROR,
    error: action.error,
  };
}

export default function reducer(
  state: StoreState,
  action: LinkedDataAction,
): LinkedDataStoreState {
  switch (action.type) {
    case ActionType.FETCHED:
      return fetched(state, action);
    case ActionType.FETCHING:
      return fetching(state, action);
    case ActionType.FETCH_ERROR:
      return fetchError(state, action);
  }
}
