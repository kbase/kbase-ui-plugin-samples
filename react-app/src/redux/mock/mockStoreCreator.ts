import mockStore from "./mockStore";
import {RootState} from "@kbase/ui-components";
import {StoreState} from "redux/store";
import {AuthenticationStatus} from "@kbase/ui-components/lib/redux/auth/store";
import {AppState} from "@kbase/ui-components/lib/redux/integration/store";
import {DevelopStatus} from "@kbase/ui-components/lib/redux/develop/store";
import {SyncViewStatus} from "redux/store/view/SyncView";
import {AsyncProcessStatus} from "redux/store/processing";

const BASE_URL = 'http://localhost:3333';

const state: StoreState = {
    root: {
        channelId: "",
        hostChannelId: "",
        state: RootState.NONE,
    },
    develop: {
        status: DevelopStatus.NONE
    },
    authentication: {
        status: AuthenticationStatus.NONE
    },
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
            baseUrl: BASE_URL,
            defaultPath: "",

            services: {
                Groups: {
                    url: `${BASE_URL}/services/groups`,
                },
                UserProfile: {
                    url: `${BASE_URL}/services/user_profile/rpc`,
                },
                Workspace: {
                    url: `${BASE_URL}/services/ws`,
                },
                SampleService: {
                    url: `${BASE_URL}/services/sampleservice`
                },
                SearchAPI2: {
                    url: `${BASE_URL}/services/searchapi2/rpc`,
                },
                SearchAPI2Legacy: {
                    url: `${BASE_URL}/services/searchapi2/legacy`,
                },
                ServiceWizard: {
                    url: `${BASE_URL}/services/service_wizard`,
                },
                Auth: {
                    url: `${BASE_URL}/services/auth`,
                },
                NarrativeMethodStore: {
                    url: `${BASE_URL}/services/narrative_method_store/rpc`,
                },
                Catalog: {
                    url: `${BASE_URL}/services/catalog/rpc`,
                },
                NarrativeJobService: {
                    url: `${BASE_URL}/services/njs_wrapper`,
                },
                RelationEngine: {
                    url: `${BASE_URL}/services/relation_engine_api`,
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


export const store = mockStore(state);

const mockStoreCreator = () => {
    return mockStore(state);
};

export default mockStoreCreator;
