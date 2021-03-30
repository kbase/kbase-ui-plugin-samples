/* Not Found View */

import {ViewBase, ViewType} from "./ViewBase";

export interface NotFoundViewParams { }

export interface NotFoundViewState { }

export type NotFoundView = ViewBase<ViewType.NOT_FOUND, NotFoundViewParams, NotFoundViewState>;