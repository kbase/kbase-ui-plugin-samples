import {SampleViewBase, SampleViewType} from "./SampleViewBase";


// Geolocation

export interface GeolocationViewParams {

}

export interface GeolocationViewState {

}

export type SampleGeolocationView = SampleViewBase<SampleViewType.GEOLOCATION, GeolocationViewParams, GeolocationViewState>