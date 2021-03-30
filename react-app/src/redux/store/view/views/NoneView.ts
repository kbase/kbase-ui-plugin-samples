/* None View */

import {ViewBase, ViewType} from "./ViewBase";

export interface NoneViewParams { }

export interface NoneViewState { }

export type NoneView = ViewBase<ViewType.NONE, NoneViewParams, NoneViewState>;