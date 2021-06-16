import {
    AppError,
    BaseStoreState,
    RootState,
} from "@kbase/ui-components";
import {applyMiddleware, compose, createStore} from "redux";
import reducer from "../reducers";
import {SyncView, SyncViewStatus} from "redux/store/view/SyncView";
import {AsyncProcessStatus} from "redux/store/processing";
import {SampleStoreState} from "redux/store/sample";
import {AccessStoreState} from "redux/store/access";
import {LinkedDataStoreState} from "redux/store/linkedData";
import {makeActionProxy} from "../middleware/fun";
import thunk from 'redux-thunk';
import {GeolocationStoreState} from "redux/store/geolocation";
import {DevelopStatus} from "@kbase/ui-components/lib/redux/develop/store";
import {AppState} from "@kbase/ui-components/lib/redux/integration/store";
import {
    Authentication,
    AuthenticationAuthenticated,
    AuthenticationNone,
    AuthenticationStatus
} from "@kbase/ui-lib/lib/Auth";

export interface SampleViewState {
    sampleId: string;
    sampleVersion?: number;
}

export type SampleView = SyncView<SampleViewState, AppError>;

export interface StoreState extends BaseStoreState {
    sampleview: SampleView;
    data: {
        sample: SampleStoreState;
        access: AccessStoreState;
        linkedData: LinkedDataStoreState;
        geolocation: GeolocationStoreState;
    };
}

function createStoreState(authenticated: boolean, baseURL: string): StoreState {
    const authentication: Authentication = (() => {
        if (authenticated) {
            const ua: AuthenticationAuthenticated = {
                status: AuthenticationStatus.AUTHENTICATED,
                userAuthentication: {
                    token: 'token',
                    username: 'kbaseuitest',
                    realname: 'KBase UI Test',
                    roles: []
                }
            }
            return ua;
        } else {
            const an: AuthenticationNone = {
                status: AuthenticationStatus.NONE
            };
            return an;
        }
    })();
    return {
        root: {
            channelId: "",
            hostChannelId: "",
            state: RootState.NONE,
        },
        develop: {
            status: DevelopStatus.NONE
        },
        authentication,
        app: {
            status: AppState.READY,
            runtime: {
                channelId: "123",
                devMode: true,
                hostChannelId: "456",
                navigation: {
                    view: "foo",
                    params: {},
                },
                title: "",
            },
            config: {
                baseUrl: baseURL,
                defaultPath: "",

                services: {
                    Groups: {
                        url: `${baseURL}/services/groups`,
                    },
                    UserProfile: {
                        url: `${baseURL}/services/user_profile/rpc`,
                    },
                    Workspace: {
                        url: `${baseURL}/services/ws`,
                    },
                    SampleService: {
                        url: `${baseURL}/services/sampleservice`
                    },
                    SearchAPI2: {
                        url: `${baseURL}/services/searchapi2/rpc`,
                    },
                    SearchAPI2Legacy: {
                        url: `${baseURL}/services/searchapi2/legacy`,
                    },
                    ServiceWizard: {
                        url: `${baseURL}/services/service_wizard`,
                    },
                    Auth: {
                        url: `${baseURL}/services/auth`,
                    },
                    NarrativeMethodStore: {
                        url: `${baseURL}/services/narrative_method_store/rpc`,
                    },
                    Catalog: {
                        url: `${baseURL}/services/catalog/rpc`,
                    },
                    NarrativeJobService: {
                        url: `${baseURL}/services/njs_wrapper`,
                    },
                    RelationEngine: {
                        url: `${baseURL}/services/relation_engine_api`,
                    },
                },
                dynamicServices: {
                    JobBrowserBFF: {
                        version: "dev",
                    },
                    OntologyAPI: {
                        version: "dev",
                    },
                    TaxonomyAPI: {
                        version: "dev",
                    },
                },
            },
        },
        sampleview: {
            status: SyncViewStatus.NONE,
        },
        data: {
            access: {
                status: AsyncProcessStatus.NONE,
            },
            linkedData: {
                status: AsyncProcessStatus.NONE,
            },
            sample: {
                status: AsyncProcessStatus.NONE,
            },
            geolocation: {
                status: AsyncProcessStatus.NONE
            }
        },
    };
}

export function createReduxStore() {
    return createStore(
        reducer,
        createStoreState(true, 'http://localhost:3333'),
        compose(applyMiddleware(makeActionProxy(), thunk)),
    );
}
