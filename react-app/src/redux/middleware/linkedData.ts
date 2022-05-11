import { AuthenticationStatus } from "@kbase/ui-components/lib/redux/auth/store";
import { AsyncProxyFun } from "@kbase/ui-components/lib/redux/middleware/AsyncProxy";
import { UPSTREAM_TIMEOUT } from "appConstants";
import ViewModel from "lib/ViewModel/ViewModel";
import { ActionType, fetchError } from "redux/actions/linkedData";
import { StoreState } from "../store";

const linkedDataFun: AsyncProxyFun<StoreState> = async ({
  state,
  dispatch,
  action,
  next,
}) => {
  if (!("category" in action)) {
    return false;
  }

  if (action.category !== "linkedData") {
    return false;
  }

  if (action.type !== ActionType.FETCH) {
    return false;
  }

  dispatch({
    category: "linkedData",
    type: ActionType.FETCHING,
  });

  const {
    app: {
      config: {
        services: {
          SampleService: { url: sampleServiceURL },
          UserProfile: { url: userProfileURL },
          Workspace: { url: workspaceURL },
        },
      },
    },
    authentication,
  } = state;

  const token = (() => {
    if (authentication.status !== AuthenticationStatus.AUTHENTICATED) {
      return null;
    }
    return authentication.userAuthentication.token;
  })();

  try {
    const viewModel = new ViewModel({
      token,
      userProfileURL,
      sampleServiceURL,
      workspaceURL,
      timeout: UPSTREAM_TIMEOUT,
    });

    const linkedData = await viewModel.fetchLinkedData({
      id: action.id,
      version: action.version,
    });
    dispatch({
      category: "linkedData",
      type: ActionType.FETCHED,
      linkedData,
    });
  } catch (ex) {
    const message = (() => {
      if (ex instanceof Error) {
        return ex.message;
      } else {
        return `Unknown error ${ex}`;
      }
    })();
    dispatch(
      fetchError({
        code: "fetch-error",
        message,
      })
    );
  }
  return true;
};

export default linkedDataFun;
