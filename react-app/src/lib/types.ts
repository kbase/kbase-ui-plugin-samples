import {JSONValue} from "@kbase/ui-lib/lib/json";

export interface SimpleMap<T> {
    [key: string]: T
}

export type Username = string;

export type EpochTimeMS = number;

export interface SimpleMapping {
    [key: string]: string;
}

export interface JSONObjectLike {
    [x: string]: JSONValue | undefined;
}