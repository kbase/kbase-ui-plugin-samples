import {Sample} from "lib/ViewModel/ViewModel";
import {AsyncProcess} from "./processing";
import {AppError} from "@kbase/ui-components";

export interface SampleData {
    sample: Sample;
}

export type SampleStoreState = AsyncProcess<SampleData, AppError>;
