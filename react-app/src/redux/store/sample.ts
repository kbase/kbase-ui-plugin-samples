import { Sample } from "lib/ViewModel";
import { UIError } from "./error";
import { AsyncProcess } from "./processing";

export interface SampleData {
    sample: Sample; 
}

export type SampleStoreState = AsyncProcess<SampleData, UIError>;