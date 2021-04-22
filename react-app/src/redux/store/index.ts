import {
    AppError,
    BaseStoreState,
    makeBaseStoreState,
} from "@kbase/ui-components";
import {applyMiddleware, compose, createStore} from "redux";
import reducer from "../reducers";
import {SyncView, SyncViewStatus} from "./view/SyncView";
import {AsyncProcessStatus} from "./processing";
import {SampleStoreState} from "./sample";
import {AccessStoreState} from "./access";
import {LinkedDataStoreState} from "./linkedData";
import {makeActionProxy} from "../middleware/fun";
import thunk from 'redux-thunk';


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
    };
}

function makeInitialStoreState(): StoreState {
    const baseStoreState = makeBaseStoreState();
    return {
        ...baseStoreState,
        sampleview: {
            status: SyncViewStatus.NONE,
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
    };
}

function createReduxStore() {
    return createStore(
        reducer,
        makeInitialStoreState(),
        compose(applyMiddleware(makeActionProxy(), thunk)),
    );
}

const store = createReduxStore();

export default store;
