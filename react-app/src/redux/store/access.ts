import { ACL } from "lib/ViewModel";
import { UIError } from "./error";
import { AsyncProcess } from "./processing";

export interface AccessData {
  accessList: ACL;
}

export type AccessStoreState = AsyncProcess<AccessData, UIError>;
