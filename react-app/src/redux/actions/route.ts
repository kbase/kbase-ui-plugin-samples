import { Action } from "redux";
import { Nav } from "../store/navigation";
import { SampleId } from "../../lib/comm/dynamicServices/SampleServiceClient";
// import { Params } from "@kbase/ui-components/lib/redux/integration/store";

export enum ViewType {
    SAMPLE_VIEW,
    SAMPLE_SET_VIEW
}

export interface ViewBase<T extends ViewType, S> {
    type: T,
    state: S;
}

export interface SampleViewState {
    sampleId: SampleId;
}

export interface SampleView extends ViewBase<ViewType.SAMPLE_VIEW, SampleViewState> { }

export interface SampleSetViewState {
    sampleSetId: string;
}

export interface SampleSetView extends ViewBase<ViewType.SAMPLE_SET_VIEW, SampleSetViewState> { }


export type View = SampleView | SampleSetView;

