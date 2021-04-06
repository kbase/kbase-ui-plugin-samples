import { AsyncProxyFun } from "@kbase/ui-components/lib/redux/middleware/AsyncProxy";
import { UPSTREAM_TIMEOUT } from "appConstants";
import ViewModel from "lib/ViewModel/ViewModel";
import {
  ActionType,
  fetched,
  fetchError,
  fetching,
  refetching,
} from "redux/actions/sample";
import { StoreState } from "../store";
import { AsyncProcessStatus } from "../store/processing";

const sampleFun: AsyncProxyFun<StoreState> = async (
  { state, dispatch, action, next },
) => {
  if (!("category" in action)) {
    return false;
  }

  if (action.category !== "sample") {
    return false;
  }

  // This proxy fun handles the sample FETCH action.
  if (action.type !== ActionType.FETCH) {
    return false;
  }

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
  } = state;

  if (userAuthorization === null) {
    return false;
  }

  const {
    token,
  } = userAuthorization;

  // Here we initiate indicate either a fresh fetch (fetching) or a 
  // new fetch to replace an existing one (refetching).
  switch (sampleState.status) {
    case AsyncProcessStatus.NONE:
      dispatch(fetching());
      break;
    case AsyncProcessStatus.ERROR:
    case AsyncProcessStatus.SUCCESS:
      dispatch(refetching());
      break;
    default:
      return false;
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

    const sample = await viewModel.fetchSample({
      id: action.id,
      version: action.version,
    });
    dispatch(fetched(sample));
  } catch (ex) {
    dispatch(fetchError(ex.message));
  }

  return true;
};

export default sampleFun;
