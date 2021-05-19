/**
 * Dealing with the Sample store data (data.sample)
 */

// Action types

// The classic async actions
import {CategoryAction} from "./base";
import {GeolocationData} from "redux/store/geolocation";
import {AppError} from "@kbase/ui-components";
import {FieldGroups} from "../../lib/client/samples/Samples";

export enum ActionType {
    FETCH = "@geolocation/fetch",
    FETCHING = "@geolocation/fetching",
    FETCHED = "@geolocation/fetched",
    FETCH_ERROR = "@geolocation/fetch-error",
}

export interface ActionBase<T> extends CategoryAction<"geolocation", T> {
}

export interface FetchAction extends ActionBase<ActionType.FETCH> {

}

export interface FetchingAction extends ActionBase<ActionType.FETCHING> {
}

export interface FetchedAction extends ActionBase<ActionType.FETCHED> {
    fieldGroups: FieldGroups
}

export interface FetchErrorAction extends ActionBase<ActionType.FETCH_ERROR> {
    error: AppError;
}

export type GeolocationAction =
    | FetchingAction
    | FetchedAction
    | FetchErrorAction;

export function fetch(): FetchAction {
    return {
        category: "geolocation",
        type: ActionType.FETCH
    };
}
