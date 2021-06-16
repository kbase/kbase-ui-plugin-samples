/**
 * Dealing with the Sample store data (data.sample)
 */

// Action types

// The classic async actions
import {Sample} from "../../lib/ViewModel/ViewModel";
import {CategoryAction} from "./base";
import {AppError} from "@kbase/ui-components";
import {FieldGroups} from "../../lib/client/SampleServiceClient";

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
    fieldGroups: FieldGroups;
}

export interface SampleFetchErrorAction
    extends SampleActionBase<ActionType.FETCH_ERROR> {
    error: AppError;
}

export type SampleAction =
    | SampleFetchingAction
    | SampleRefetchingAction
    | SampleFetchedAction
    | SampleFetchErrorAction;


export function fetchError(error: AppError): SampleFetchErrorAction {
    return {
        category: 'sample',
        type: ActionType.FETCH_ERROR,
        error
    }
}

export function fetch(id: string, version?: number): SampleFetchAction {
    const result: SampleFetchAction = {
        category: "sample",
        type: ActionType.FETCH,
        id
    };
    if (typeof version !== 'undefined') {
        result.version = version;
    }
    return result;
}
