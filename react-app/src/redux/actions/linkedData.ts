/**
 * Dealing with the Sample store data (data.sample)
 */

// Action types

// The classic async actions
import { CategoryAction } from "./base";
import { UIError } from "redux/store/error";
import { LinkedData } from "redux/store/linkedData";

export enum ActionType {
  FETCH = "@linkedData/fetch",
  FETCHING = "@linkedData/fetching",
  FETCHED = "@linkedData/fetched",
  FETCH_ERROR = "@linkedData/fetch-error",
}

export interface ActionBase<T> extends CategoryAction<"linkedData", T> {
}
export interface FetchAction extends ActionBase<ActionType.FETCH> {
  id: string;
  version: number;
}
export interface FetchingAction extends ActionBase<ActionType.FETCHING> {
}
export interface FetchedAction extends ActionBase<ActionType.FETCHED> {
  linkedData: LinkedData;
}
export interface FetchErrorAction extends ActionBase<ActionType.FETCH_ERROR> {
  error: UIError;
}

export type LinkedDataAction =
  | FetchingAction
  | FetchedAction
  | FetchErrorAction;

export function fetch(id: string, version: number): FetchAction {
  return {
    category: "linkedData",
    type: ActionType.FETCH,
    id,
    version,
  };
}

export function fetching(): FetchingAction {
  return {
    category: "linkedData",
    type: ActionType.FETCHING,
  };
}

export function fetchError(error: UIError): FetchErrorAction {
  return {
    category: "linkedData",
    type: ActionType.FETCH_ERROR,
    error,
  };
}

export function fetched(linkedData: LinkedData): FetchedAction {
  return {
    category: "linkedData",
    type: ActionType.FETCHED,
    linkedData,
  };
}
