/**
 * Dealing with the Sample store data (data.sample)
 */

// Action types

// The classic async actions
import { Action } from "redux";
import ViewModel, { ACL } from "../../lib/ViewModel";
import { ThunkDispatch } from "redux-thunk";
import { StoreState } from "../store";
import { UPSTREAM_TIMEOUT } from "appConstants";
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

export function get(id: string) {
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

      const accessList = await viewModel.fetchACL({ id });
      dispatch(fetched(accessList));
    } catch (ex) {
      dispatch(fetchError(ex.message));
    }
  };
}
