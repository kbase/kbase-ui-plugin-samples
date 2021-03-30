export enum SampleViewType {
    METADATA,
    GEOLOCATION,
    LINKED_DATA,
    OVERVIEW,
    ACCESS
}

export interface SampleViewBase<S extends SampleViewType, ParamType, StateType> {
    type: SampleViewType;
    params: ParamType;
    state: StateType;
}