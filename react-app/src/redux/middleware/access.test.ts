import {StoreState} from "../store";
import {AppState} from "@kbase/ui-components/lib/redux/integration/store";
import {SyncViewStatus} from "../store/view/SyncView";
import {RootState} from "@kbase/ui-components";
import {AuthenticationStatus} from "@kbase/ui-components/lib/redux/auth/store";
import {DevelopStatus} from "@kbase/ui-components/lib/redux/develop/store";
import {AsyncProcessStatus} from "redux/store/processing"


const TEST_STORE: StoreState = {
    root: {
        channelId: '',
        hostChannelId: '',
        state: RootState.NONE
    },
    authentication: {
        status: AuthenticationStatus.NONE
    },
    develop: {
        status: DevelopStatus.NONE,
    },
    app: {
        status: AppState.NONE,
        config: {
            baseUrl: '',
            services: {
                Groups: {
                    url: ''
                },
                UserProfile: {
                    url: ''
                },
                Workspace: {
                    url: ''
                },
                SampleService: {
                    url: ''
                },
                SearchAPI2: {
                    url: ''
                },
                SearchAPI2Legacy: {
                    url: ''
                },
                ServiceWizard: {
                    url: ''
                },
                Auth: {
                    url: ''
                },
                NarrativeMethodStore: {
                    url: ''
                },
                Catalog: {
                    url: ''
                },
                NarrativeJobService: {
                    url: ''
                },
                RelationEngine: {
                    url: ''
                }
            },
            dynamicServices: {
                JobBrowserBFF: {
                    version: ''
                },
                SampleService: {
                    version: ''
                },
                OntologyAPI: {
                    version: ''
                },
                TaxonomyAPI: {
                    version: ''
                }
            },
            defaultPath: ''
        },
        runtime: {
            channelId: null,
            hostChannelId: null,
            devMode: null,
            title: '',
            navigation: {
                view: '',
                params: {}
            }
        },

    },
    sampleview: {
        status: SyncViewStatus.NONE
    },
    data: {
        sample: {
            status: AsyncProcessStatus.NONE,
        },
        access: {
            status: AsyncProcessStatus.NONE,
        },
        linkedData: {
            status: AsyncProcessStatus.NONE,
        },
    },
}

/*
  cases to test:
  - return false if "category" not in action
  - return false if category is not "access"
  - return false if action.type is not ActionType.FETCH
  - return false if it is not authenticated (??)


  Otherwise:
    - emits ActionType.FETCHING
    - emits FETCHED if successfully fetches the access list
    - emits ERROR otherwise.
 */

describe('access middleware', () => {
    test('issuing a fetch event should emit ', () => {

    });
});