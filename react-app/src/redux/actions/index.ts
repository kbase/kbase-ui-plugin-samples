import {AccessAction} from "./access";
import {LinkedDataAction} from "./linkedData";
import {SampleAction} from "./sample";
import {GeolocationAction} from "./geolocation";

export interface Params {
    [key: string]: string;
}

// All Actions

export type AppAction =
    | SampleAction
    | AccessAction
    | LinkedDataAction
    | GeolocationAction;
