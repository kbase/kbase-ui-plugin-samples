import { AuthenticationStatus } from "@kbase/ui-components/lib/redux/auth/store";
import { AsyncProxyFun } from "@kbase/ui-components/lib/redux/middleware/AsyncProxy";
import { UPSTREAM_TIMEOUT } from "appConstants";
import ViewModel from "lib/ViewModel/ViewModel";
import { ActionType } from "redux/actions/access";
import { StoreState } from "../store";

const accessFun: AsyncProxyFun<StoreState> = async ({
  state,
  dispatch,
  action,
  next,
}) => {
  if (!("category" in action)) {
    return false;
  }

  if (action.category !== "access") {
    return false;
  }

  if (action.type !== ActionType.FETCH) {
    return false;
  }

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

  dispatch({
    category: "access",
    type: ActionType.FETCHING,
  });

  try {
    const viewModel = new ViewModel({
      token,
      userProfileURL,
      sampleServiceURL,
      workspaceURL,
      timeout: UPSTREAM_TIMEOUT,
    });

    const accessList = await viewModel.fetchACL({ id: action.id });
    console.log("access list??", accessList);
    dispatch({
      category: "access",
      type: ActionType.FETCHED,
      accessList,
    });
  } catch (ex) {
    if (ex instanceof Error) {
      dispatch({
        category: "access",
        type: ActionType.FETCH_ERROR,
        message: ex.message,
      });
    } else {
      dispatch({
        category: "access",
        type: ActionType.FETCH_ERROR,
        message: `Unknown error ${ex}`,
      });
    }
  }
  return true;
};

export default accessFun;
