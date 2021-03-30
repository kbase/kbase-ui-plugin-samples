/*
    The top level view.
    Each top level view is a generic interface with some fixed properties.
*/


import {NoneView} from "./NoneView";
import {NotFoundView} from "./NotFoundView";
import {AboutView} from "./AboutView";
import {SampleView} from "./SampleView";


export type View = NoneView | NotFoundView | AboutView | SampleView;