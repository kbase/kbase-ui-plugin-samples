import { AccessAction } from "./access";
import { LinkedDataAction } from "./linkedData";
import { Navigate } from "./navigate";
import { Route } from "./route";
import { SampleAction } from "./sample";

export interface Params {
  [key: string]: string;
}

// All Actions

export type AppAction =
  | Navigate
  | Route
  | SampleAction
  | AccessAction
  | LinkedDataAction;
