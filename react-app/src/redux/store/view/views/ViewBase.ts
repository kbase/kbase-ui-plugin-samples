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
type - an enumeration used to sort schema views at compile/run time (discriminated type)
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