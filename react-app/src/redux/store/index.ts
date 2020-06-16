import { BaseStoreState, makeBaseStoreState, AppError } from "@kbase/ui-components";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "../reducers";
import { SyncView, SyncViewStatus } from "./view";
import { Nav } from "./navigation";

export interface SampleViewState {
    sampleId: string;
    sampleVersion?: number;
}

export type SampleView = SyncView<SampleViewState, AppError>;

export type NavigationView = SyncView<Nav, AppError>;


export interface StoreState extends BaseStoreState {
    navigationView: NavigationView;
    sampleview: SampleView;
}

function makeInitialStoreState(): StoreState {
    const baseStoreState = makeBaseStoreState();
    return {
        ...baseStoreState,
        navigationView: {
            status: SyncViewStatus.NONE
        },
        sampleview: {
            status: SyncViewStatus.NONE
        }
    };
}

function createReduxStore() {
    return createStore(reducer, makeInitialStoreState(), compose(applyMiddleware(thunk)));
}

const store = createReduxStore();

export default store;