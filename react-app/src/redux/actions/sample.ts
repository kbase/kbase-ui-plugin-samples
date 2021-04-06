/**
 * Dealing with the Sample store data (data.sample)
 */

// Action types

// The classic async actions
import { Sample } from "../../lib/ViewModel/ViewModel";
import { CategoryAction } from "./base";
import { UIError } from "redux/store/error";

export enum ActionType {
  FETCH = "@sample/fetch",
  FETCHING = "@sample/fetching",
  FETCHED = "@sample/fetched",
  FETCH_ERROR = "@sample/fetch-error",
  REFETCHING = "@sample/refetching",
}

export interface SampleActionBase<T> extends CategoryAction<"sample", T> {
}

export interface SampleFetchAction extends SampleActionBase<ActionType.FETCH> {
  id: string;
  version?: number;
}

export interface SampleFetchingAction
  extends SampleActionBase<ActionType.FETCHING> {
}
export interface SampleRefetchingAction
  extends SampleActionBase<ActionType.REFETCHING> {
}
export interface SampleFetchedAction
  extends SampleActionBase<ActionType.FETCHED> {
  sample: Sample;
}
export interface SampleFetchErrorAction
  extends SampleActionBase<ActionType.FETCH_ERROR> {
  error: UIError;
}

export type SampleAction =
  | SampleFetchingAction
  | SampleRefetchingAction
  | SampleFetchedAction
  | SampleFetchErrorAction;

export function fetch(id: string, version?: number): SampleFetchAction {
  return {
    category: "sample",
    type: ActionType.FETCH,
    id,
    version,
  };
}

export function fetching(): SampleFetchingAction {
  return {
    category: "sample",
    type: ActionType.FETCHING,
  };
}

export function refetching(): SampleRefetchingAction {
  return {
    category: "sample",
    type: ActionType.REFETCHING,
  };
}

export function fetchError(error: UIError): SampleFetchErrorAction {
  return {
    category: "sample",
    type: ActionType.FETCH_ERROR,
    error,
  };
}

export function fetched(sample: Sample): SampleFetchedAction {
  return {
    category: "sample",
    type: ActionType.FETCHED,
    sample,
  };
}
