/**
 * Dealing with the Sample store data (data.sample)
 */

// Action types

// The classic async actions
import { Action } from "redux";
import ViewModel from "../../lib/ViewModel";
import { ThunkDispatch } from "redux-thunk";
import { StoreState } from "../store";
import { UPSTREAM_TIMEOUT } from "appConstants";
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

export function get(id: string, version: number) {
  return async (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState,
  ) => {
    dispatch(fetching());
    const {
      app: {
        config: {
          services: {
            ServiceWizard: {
              url: serviceWizardURL,
            },
            UserProfile: {
              url: userProfileURL,
            },
            Workspace: {
              url: workspaceURL,
            },
          },
          //   baseUrl: baseURL,
          dynamicServices: {
            SampleService: sampleServiceConfig,
          },
        },
      },
      auth: {
        userAuthorization,
      },
    } = getState();

    if (userAuthorization === null) {
      return;
    }

    const {
      token,
    } = userAuthorization;

    try {
      const viewModel = new ViewModel({
        token,
        userProfileURL,
        serviceWizardURL,
        workspaceURL,
        sampleServiceConfig,
        timeout: UPSTREAM_TIMEOUT,
      });

      const linkedData = await viewModel.fetchLinkedData({ id, version });
      dispatch(fetched(linkedData));
    } catch (ex) {
      dispatch(fetchError(ex.message));
    }
  };
}
