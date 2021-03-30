import { StoreState } from "../store";

import {
  AccessAction,
  ActionType,
  FetchedAction,
  FetchErrorAction,
  FetchingAction,
} from "../actions/access";
import { AccessStoreState } from "redux/store/access";
import { AsyncProcessStatus } from "redux/store/processing";

function fetched(state: StoreState, action: FetchedAction): AccessStoreState {
  return {
    status: AsyncProcessStatus.SUCCESS,
    state: {
      accessList: action.accessList,
    },
  };
}

function fetching(state: StoreState, action: FetchingAction): AccessStoreState {
  return {
    status: AsyncProcessStatus.PROCESSING,
  };
}

function fetchError(
  state: StoreState,
  action: FetchErrorAction,
): AccessStoreState {
  return {
    status: AsyncProcessStatus.ERROR,
    error: action.error,
  };
}

export default function reducer(
  state: StoreState,
  action: AccessAction,
): AccessStoreState {
  switch (action.type) {
    case ActionType.FETCHED:
      return fetched(state, action);
    case ActionType.FETCHING:
      return fetching(state, action);
    case ActionType.FETCH_ERROR:
      return fetchError(state, action);
  }
}
