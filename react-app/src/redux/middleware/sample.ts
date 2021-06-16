import {AuthenticationStatus} from "@kbase/ui-components/lib/redux/auth/store";
import {AsyncProxyFun} from "@kbase/ui-components/lib/redux/middleware/AsyncProxy";
import {UPSTREAM_TIMEOUT} from "appConstants";
import ViewModel from "lib/ViewModel/ViewModel";
import {
    ActionType, fetchError
} from "redux/actions/sample";
import {StoreState} from "../store";
import {AsyncProcessStatus} from "../store/processing";
import SampleServiceClient from "../../lib/client/SampleServiceClient";

// TODO: action needs to be typed!
const sampleFun: AsyncProxyFun<StoreState> = async (
    {state, dispatch, action},
) => {
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
                    }
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
                category: 'sample',
                type: ActionType.FETCHING
            });
            break;
        case AsyncProcessStatus.ERROR:
        case AsyncProcessStatus.SUCCESS:
            dispatch({
                category: 'sample',
                type: ActionType.REFETCHING
            });
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

        const sampleService = new SampleServiceClient({
            token,
            url: sampleServiceURL,
            timeout: UPSTREAM_TIMEOUT,
        });

        const {groups} = await sampleService.get_field_groups();
        dispatch({
            category: 'sample',
            type: ActionType.FETCHED,
            sample,
            fieldGroups: groups
        });
    } catch (ex) {
        console.error('ERROR!', ex);
        if (ex instanceof Error) {
            dispatch(fetchError({
                code: 'fetchSampleError',
                message: ex.message
            }));
        } else {
            dispatch(fetchError({
                code: 'fetchSampleError',
                message: `Unknown error ${ex}`
            }));
        }
    }

    return true;
};

export default sampleFun;
