/**
 * Dealing with the Sample store data (data.sample)
 */

// Action types

// The classic async actions
import { ACL } from "../../lib/ViewModel/ViewModel";
import { CategoryAction } from "./base";
import { UIError } from "redux/store/error";

export enum ActionType {
  FETCH = "@access/fetch",
  FETCHING = "@access/fetching",
  FETCHED = "@access/fetched",
  FETCH_ERROR = "@access/fetch-error",
}

export interface ActionBase<T> extends CategoryAction<"access", T> {
}
export interface FetchAction extends ActionBase<ActionType.FETCH> {
  id: string;
}
export interface FetchingAction extends ActionBase<ActionType.FETCHING> {
}
export interface FetchedAction extends ActionBase<ActionType.FETCHED> {
  accessList: ACL;
}
export interface FetchErrorAction extends ActionBase<ActionType.FETCH_ERROR> {
  error: UIError;
}

export type AccessAction =
  | FetchingAction
  | FetchedAction
  | FetchErrorAction;

export function fetch(id: string): FetchAction {
  return {
    category: "access",
    type: ActionType.FETCH,
    id,
  };
}

export function fetching(): FetchingAction {
  return {
    category: "access",
    type: ActionType.FETCHING,
  };
}

export function fetchError(error: UIError): FetchErrorAction {
  return {
    category: "access",
    type: ActionType.FETCH_ERROR,
    error,
  };
}

export function fetched(accessList: ACL): FetchedAction {
  return {
    category: "access",
    type: ActionType.FETCHED,
    accessList,
  };
}
