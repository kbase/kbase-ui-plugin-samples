/* About View */

import {ViewBase, ViewType} from "./ViewBase";

export interface AboutViewParams { }

export interface AboutViewState { }

export type AboutView = ViewBase<ViewType.ABOUT, AboutViewParams, AboutViewState>;