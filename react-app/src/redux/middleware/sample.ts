import {AuthenticationStatus} from "@kbase/ui-components/lib/redux/auth/store";
import {AsyncProxyFun} from "@kbase/ui-components/lib/redux/middleware/AsyncProxy";
import {UPSTREAM_TIMEOUT} from "appConstants";
import ViewModel from "lib/ViewModel/ViewModel";
import {
    ActionType
} from "redux/actions/sample";
import {StoreState} from "../store";
import {AsyncProcessStatus} from "../store/processing";

const sampleFun: AsyncProxyFun<StoreState> = async (
    {state, dispatch, action, next},
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
                    SampleService: {
                        url: sampleServiceURL,
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
        authentication,
        data: {
            sample: sampleState,
        },
    } = state;

    if (authentication.status !== AuthenticationStatus.AUTHENTICATED) {
        return false;
    }

    const {
        userAuthentication: {token}
    } = authentication;

    // Here we initiate indicate either a fresh fetch (fetching) or a
    // new fetch to replace an existing one (refetching).
    switch (sampleState.status) {
        case AsyncProcessStatus.NONE:
            dispatch({
                type: ActionType.FETCHING
            })
            break;
        case AsyncProcessStatus.ERROR:
        case AsyncProcessStatus.SUCCESS:
            dispatch({
                type: ActionType.REFETCHING
            })
            break;
        default:
            return false;
    }

    try {
        const viewModel = new ViewModel({
            token,
            userProfileURL,
            sampleServiceURL,
            workspaceURL,
            timeout: UPSTREAM_TIMEOUT,
        });

        const sample = await viewModel.fetchSample({
            id: action.id,
            version: action.version,
        });
        dispatch({
            type: ActionType.FETCHED,
            sample
        });
    } catch (ex) {
        dispatch({
            type: ActionType.FETCH_ERROR,
            message: ex.message
        });
    }

    return true;
};

export default sampleFun;
