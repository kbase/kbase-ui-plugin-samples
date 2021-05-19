import {AsyncProcess} from "./processing";
import {AppError} from "@kbase/ui-components";
import {FieldGroups} from "../../lib/client/samples/Samples";

export interface GeolocationData {
    fieldGroups: FieldGroups;
}

export type GeolocationStoreState = AsyncProcess<GeolocationData, AppError>;
