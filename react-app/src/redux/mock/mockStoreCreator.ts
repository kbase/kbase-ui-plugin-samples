import mockStore from "./mockStore";
import {RootState} from "@kbase/ui-components";
import {StoreState} from "redux/store";
import {AuthenticationStatus} from "@kbase/ui-components/lib/redux/auth/store";
import {AppState} from "@kbase/ui-components/lib/redux/integration/store";
import {DevelopStatus} from "@kbase/ui-components/lib/redux/develop/store";
import {SyncViewStatus} from "redux/store/view/SyncView";
import {AsyncProcessStatus} from "redux/store/processing";

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
            baseUrl: "http://localhost:3000",
            defaultPath: "",

            services: {
                Groups: {
                    url: "/services/groups",
                },
                UserProfile: {
                    url: "/services/user_profile/rpc",
                },
                Workspace: {
                    url: "/services/ws",
                },
                SampleService: {
                    url: '/services/sampleservice'
                },
                SearchAPI2: {
                    url: `/services/searchapi2/rpc`,
                },
                SearchAPI2Legacy: {
                    url: `/services/searchapi2/legacy`,
                },
                ServiceWizard: {
                    url: "/services/service_wizard",
                },
                Auth: {
                    url: "/services/auth",
                },
                NarrativeMethodStore: {
                    url: "/services/narrative_method_store/rpc",
                },
                Catalog: {
                    url: "/services/catalog/rpc",
                },
                NarrativeJobService: {
                    url: "/services/njs_wrapper",
                },
                RelationEngine: {
                    url: "/services/relation_engine_api",
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
