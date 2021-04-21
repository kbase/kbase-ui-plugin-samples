import {AccessAction} from "./access";
import {LinkedDataAction} from "./linkedData";
import {SampleAction} from "./sample";

export interface Params {
    [key: string]: string;
}

// All Actions

export type AppAction =
    | SampleAction
    | AccessAction
    | LinkedDataAction;
