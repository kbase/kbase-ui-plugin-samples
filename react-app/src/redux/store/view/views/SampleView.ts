import { Sample } from "lib/client/Sample";
import {ViewBase, ViewType} from './ViewBase';
import {SampleSubView} from "./sample";
/* Sample View */

export interface SampleViewParams {
    sampleId: string;
    version?: number;
    subview?: SampleSubView
}

export interface SampleViewState {
    sample: Sample;
}

export type SampleView = ViewBase<ViewType.SAMPLE, SampleViewParams, SampleViewState>;