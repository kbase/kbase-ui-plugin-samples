import { DataLink } from "lib/client/SampleServiceClient";
import { UIError } from "./error";
import { AsyncProcess } from "./processing";

export interface DataLink2 extends DataLink {
  key: string;
  objectType: string;
  objectName: string;
}

export type LinkedData = Array<DataLink2>;

export interface LinkedDataData {
  linkedData: LinkedData;
}

export type LinkedDataStoreState = AsyncProcess<LinkedDataData, UIError>;
