import { Sample } from "../../lib/comm/dynamicServices/SampleServiceClient";

// VIEW STATES

/*
 Sync view state
 Primarily for top level views which don't have an async load operation.
*/

export enum SyncViewStatus {
    NONE = 'NONE',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR'
}

export interface SyncViewNone {
    status: SyncViewStatus.NONE;
}

export interface SyncViewError<E> {
    status: SyncViewStatus.ERROR;
    error: E;
}

export interface SyncViewSuccess<S> {
    status: SyncViewStatus.SUCCESS;
    state: S;
}
export type SyncView<S, E> = SyncViewNone | SyncViewSuccess<S> | SyncViewError<E>;


// Views which are async in nature 

export enum AsyncViewStatus {
    NONE,
    PROCESSING,
    SUCCESS,
    ERROR
}

export interface AsyncViewNone<> {
    status: AsyncViewStatus.NONE;
}

export interface AsyncViewProcessing<> {
    status: AsyncViewStatus.PROCESSING;
}

export interface AsyncViewError<E> {
    status: AsyncViewStatus.ERROR;
    error: E;
}

export interface AsyncViewSuccess<S> {
    status: AsyncViewStatus.SUCCESS;
    state: S;
}

export type AsyncView<S, E> = AsyncViewNone | AsyncViewProcessing | AsyncViewSuccess<S> | AsyncViewError<E>;

/*
The view base is the wrapper for all landing page views.
It's purpose is to provide an anchor for the view, regardless of what happens in that view
(which is to be found in the "state" property)
*/

export enum ViewType {
    NONE,
    SAMPLE,
    ABOUT,
    SAMPLE_SET,
    NOT_FOUND
}

/*
A view is composed of three generic attributes:
type - an enumeration used to sort out views at compile/run time (discriminated type)
params - required and optional parameters passed from the url, or otherwise;
         these are the external inputs to the view
state - any state the view wants to play with outside of components, or shared across components;
        may be 
*/

export interface ViewBase<S extends ViewType, ParamType, StateType> {
    type: ViewType;
    params: ParamType;
    state: StateType;
}

/* Views */

/* Sample View */

export interface SampleViewParams {
    sampleId: string;
}

export interface SampleViewState {
    sample: Sample;
}

export interface AboutViewParams {
    // no properties
}

export type SampleView = ViewBase<ViewType.SAMPLE, SampleViewParams, SampleViewState>;

/* Sample Set View */

export interface SampleSetViewParams {
    sampleSetId: string;
}

export interface SampleSetViewState {

}

export type SampleSetView = ViewBase<ViewType.SAMPLE_SET, SampleSetViewParams, SampleSetViewState>;

/* About View */

export interface AboutViewParams { }

export interface AboutViewState { }

export type AboutView = ViewBase<ViewType.ABOUT, AboutViewParams, AboutViewState>;

/* None View */

export interface NoneViewParams { }

export interface NoneViewState { }

export type NoneView = ViewBase<ViewType.NONE, NoneViewParams, NoneViewState>;

/* Not Found View */

export interface NotFoundViewParams { }

export interface NotFoundViewState { }

export type NotFoundView = ViewBase<ViewType.NOT_FOUND, NotFoundViewParams, NotFoundViewState>;

/*
    The top level view.
    Each top level view is a generic interface with some fixed properties.
*/

export type View = NoneView | NotFoundView | AboutView | SampleView | SampleSetView;

// export interface TopLevelViewStateBase {
//     type: ViewType;
//     ref: RelationEngineReference;
//     view: MainView;
// }

// export interface TopLevelViewStateTaxonomy extends TopLevelViewStateBase {
//     type: ViewType.TAXONOMY;
//     view: AsyncView<TaxonomyView, UIError>;
// };

// export interface TopLevelViewStateOntology extends TopLevelViewStateBase {
//     type: ViewType.ONTOLOGY;
//     view: AsyncView<OntologyView, UIError>;
// }

// export type TopLevelViewState = TopLevelViewStateTaxonomy | TopLevelViewStateOntology;


// export type TopLevelView = AsyncView<TopLevelViewState, UIError>;
