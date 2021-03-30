// Metadata

import {SampleViewBase, SampleViewType} from "./SampleViewBase";

export interface MetadataViewParams {

}

export interface MetadataViewState {

}

export type SampleMetadataView = SampleViewBase<SampleViewType.METADATA, MetadataViewParams, MetadataViewState>