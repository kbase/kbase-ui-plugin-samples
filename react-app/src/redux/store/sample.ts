import {Sample} from "lib/ViewModel/ViewModel";
import {AsyncProcess} from "./processing";
import {AppError} from "@kbase/ui-components";
import {FieldGroups} from "../../lib/client/SampleServiceClient";

export interface SampleData {
    sample: Sample;
    fieldGroups: FieldGroups
}

export type SampleStoreState = AsyncProcess<SampleData, AppError>;
