import { AsyncProxyFun } from "@kbase/ui-components/lib/redux/middleware/AsyncProxy";
import { UPSTREAM_TIMEOUT } from "appConstants";
import ViewModel from "lib/ViewModel/ViewModel";
import {
  ActionType,
  fetched,
  fetchError,
  fetching,
} from "redux/actions/access";
import { StoreState } from "../store";

const accessFun: AsyncProxyFun<StoreState> = async (
  { state, dispatch, action, next },
) => {
  if (!("category" in action)) {
    return false;
  }

  if (action.category !== "access") {
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

    const accessList = await viewModel.fetchACL({ id: action.id });
    dispatch(fetched(accessList));
  } catch (ex) {
    dispatch(fetchError(ex.message));
  }
  return true;
};

export default accessFun;
