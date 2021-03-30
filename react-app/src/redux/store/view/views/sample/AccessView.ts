import {SampleViewBase, SampleViewType} from "./SampleViewBase";

export interface AccessViewParams {

}

export interface AccessViewState {

}

export type SampleAccessView = SampleViewBase<SampleViewType.ACCESS, AccessViewParams, AccessViewState>