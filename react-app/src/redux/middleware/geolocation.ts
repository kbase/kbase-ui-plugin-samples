import { AuthenticationStatus } from "@kbase/ui-components/lib/redux/auth/store";
import { AsyncProxyFun } from "@kbase/ui-components/lib/redux/middleware/AsyncProxy";
import { UPSTREAM_TIMEOUT } from "appConstants";
import { ActionType } from "redux/actions/geolocation";
import { StoreState } from "../store";
import SampleServiceClient, {
  SampleServiceClientParams,
} from "../../lib/client/SampleServiceClient";

const geolocationFun: AsyncProxyFun<StoreState> = async ({
  state,
  dispatch,
  action,
  next,
}) => {
  if (!("category" in action)) {
    return false;
  }

  if (action.category !== "geolocation") {
    return false;
  }

  if (action.type !== ActionType.FETCH) {
    return false;
  }

  dispatch({
    category: "geolocation",
    type: ActionType.FETCHING,
  });
  const {
    app: {
      config: {
        services: {
          SampleService: { url },
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
    const params: SampleServiceClientParams = {
      url,
      timeout: UPSTREAM_TIMEOUT,
    };
    if (token !== null) {
      params.token = token;
    }
    const sampleService = new SampleServiceClient(params);

    const { groups } = await sampleService.get_field_groups();
    dispatch({
      category: "geolocation",
      type: ActionType.FETCHED,
      fieldGroups: groups,
    });
  } catch (ex) {
    if (ex instanceof Error) {
      dispatch({
        category: "geolocation",
        type: ActionType.FETCH_ERROR,
        message: ex.message,
      });
    } else {
      dispatch({
        category: "geolocation",
        type: ActionType.FETCH_ERROR,
        message: `Unknown error ${ex}`,
      });
    }
  }
  return true;
};

export default geolocationFun;
