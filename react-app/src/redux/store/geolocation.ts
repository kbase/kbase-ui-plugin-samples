import {AsyncProcess} from "./processing";
import {AppError} from "@kbase/ui-components";
import {FieldGroups} from "../../lib/client/SampleServiceClient";

export interface GeolocationData {
    fieldGroups: FieldGroups;
}

export type GeolocationStoreState = AsyncProcess<GeolocationData, AppError>;
