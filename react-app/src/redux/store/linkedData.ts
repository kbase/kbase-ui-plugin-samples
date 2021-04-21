import {DataLink} from "lib/client/SampleServiceClient";
import {AsyncProcess} from "./processing";
import {AppError} from "@kbase/ui-components";

export interface DataLink2 extends DataLink {
    key: string;
    objectType: string;
    objectName: string;
}

export type LinkedData = Array<DataLink2>;

export interface LinkedDataData {
    linkedData: LinkedData;
}

export type LinkedDataStoreState = AsyncProcess<LinkedDataData, AppError>;
