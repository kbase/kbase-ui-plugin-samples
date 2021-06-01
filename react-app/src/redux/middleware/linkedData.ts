import {AuthenticationStatus} from "@kbase/ui-components/lib/redux/auth/store";
import {AsyncProxyFun} from "@kbase/ui-components/lib/redux/middleware/AsyncProxy";
import {UPSTREAM_TIMEOUT} from "appConstants";
import ViewModel from "lib/ViewModel/ViewModel";
import {
    ActionType
} from "redux/actions/linkedData";
import {StoreState} from "../store";
import {FetchingAction} from "../actions/linkedData";

const linkedDataFun: AsyncProxyFun<StoreState> = async (
    {state, dispatch, action, next},
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

    dispatch({
        category: 'linkedData',
        type: ActionType.FETCHING
    });
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
                    ServiceWizard: {
                        url: serviceWizardURL
                    }
                },
            },
        },
        authentication
    } = state;

    if (authentication.status !== AuthenticationStatus.AUTHENTICATED) {
        return false;
    }

    const {
        userAuthentication: {token}
    } = authentication;


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
            category: 'linkedData',
            type: ActionType.FETCHED,
            linkedData
        });
    } catch (ex) {
        dispatch({
            category: 'linkedData',
            type: ActionType.FETCH_ERROR,
            message: ex.message
        });
    }
    return true;
};

export default linkedDataFun;
