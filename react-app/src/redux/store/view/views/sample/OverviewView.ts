import {SampleViewBase, SampleViewType} from "./SampleViewBase";

export interface OverviewViewParams {

}

export interface OverviewViewState {

}

export type SampleOverviewView = SampleViewBase<SampleViewType.OVERVIEW, OverviewViewParams, OverviewViewState>