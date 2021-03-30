import {SampleMetadataView} from './MetadataView';
import {SampleGeolocationView} from "./GeolocationView";
import {SampleOverviewView} from "./OverviewView";
import {SampleLinkedDataView} from "./LinkedDataView";
import {SampleAccessView} from "./AccessView";

export type SampleSubView =
    SampleMetadataView |
    SampleGeolocationView |
    SampleLinkedDataView |
    SampleOverviewView |
    SampleAccessView;