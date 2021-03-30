import { SampleId } from "lib/client/Sample";
import { CategoryAction } from "./base";

export enum ViewType {
    SAMPLE_VIEW,
    SAMPLE_SET_VIEW
}

export interface ViewBase<T extends ViewType, S> {
    type: T,
    state: S;
}

export interface SampleViewState {
    sampleId: SampleId;
}

export interface SampleView extends ViewBase<ViewType.SAMPLE_VIEW, SampleViewState> { }

export interface SampleSetViewState {
    sampleSetId: string;
}

export interface SampleSetView extends ViewBase<ViewType.SAMPLE_SET_VIEW, SampleSetViewState> { }


export type View = SampleView | SampleSetView;

export enum ActionType {
    ROUTE = "@samples/route"
}

// Action type interfaces

// Navigation



// Routing

export interface Route extends CategoryAction<'route', ActionType.ROUTE> {
    view: View;
}

export function route(view: View): Route {
    return {
        category: 'route',
        type: ActionType.ROUTE,
        view
    };
}