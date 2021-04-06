import { AsyncProxyFun } from "@kbase/ui-components/lib/redux/middleware/AsyncProxy";
import { UPSTREAM_TIMEOUT } from "appConstants";
import ViewModel from "lib/ViewModel/ViewModel";
import {
  ActionType,
  fetched,
  fetchError,
  fetching,
} from "redux/actions/linkedData";
import { StoreState } from "../store";

const linkedDataFun: AsyncProxyFun<StoreState> = async (
  { state, dispatch, action, next },
) => {
  if (!("category" in action)) {
    return false;
  }

  if (action.category !== "linkedData") {
    return false;
  }

  if (action.type !== ActionType.FETCH) {
    return false;
  }

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
  } = state;

  if (userAuthorization === null) {
    return false;
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

    const linkedData = await viewModel.fetchLinkedData({
      id: action.id,
      version: action.version,
    });
    dispatch(fetched(linkedData));
  } catch (ex) {
    dispatch(fetchError(ex.message));
  }
  return true;
};

export default linkedDataFun;
