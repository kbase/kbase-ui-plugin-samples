import {ACL} from "lib/ViewModel/ViewModel";
import {AsyncProcess} from "./processing";
import {AppError} from "@kbase/ui-components";

export interface AccessData {
    accessList: ACL;
}

export type AccessStoreState = AsyncProcess<AccessData, AppError>;
