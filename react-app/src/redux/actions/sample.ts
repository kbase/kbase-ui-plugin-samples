/**
 * Dealing with the Sample store data (data.sample)
 */

// Action types

// The classic async actions
import { Action } from "redux";
import ViewModel, { Sample } from "../../lib/ViewModel";
import { ThunkDispatch } from "redux-thunk";
import { StoreState } from "../store";
import { UPSTREAM_TIMEOUT } from "appConstants";
import { CategoryAction } from "./base";
import { UIError } from "redux/store/error";
import { AsyncProcessStatus } from "redux/store/processing";

export enum ActionType {
  FETCH = "@sample/fetch",
  FETCHING = "@sample/fetching",
  FETCHED = "@sample/fetched",
  FETCH_ERROR = "@sample/fetch-error",
  REFETCHING = "@sample/refetching",
}

export interface SampleActionBase<T> extends CategoryAction<"sample", T> {
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

export function get(id: string, version?: number) {
  return async (
    dispatch: ThunkDispatch<StoreState, void, Action>,
    getState: () => StoreState,
  ) => {
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
      data: {
        sample: sampleState,
      },
    } = getState();

    if (userAuthorization === null) {
      return;
    }

    const {
      token,
    } = userAuthorization;

    if (sampleState.status === AsyncProcessStatus.SUCCESS) {
      dispatch(refetching());
    } else {
      dispatch(fetching());
    }

    try {
      const viewModel = new ViewModel({
        token,
        userProfileURL,
        serviceWizardURL,
        workspaceURL,
        sampleServiceConfig,
        timeout: UPSTREAM_TIMEOUT,
      });

      const sample = await viewModel.fetchSample({ id, version });
      dispatch(fetched(sample));
    } catch (ex) {
      dispatch(fetchError(ex.message));
    }
  };
}
