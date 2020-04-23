import { BaseStoreState, makeBaseStoreState } from '@kbase/ui-components';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducers';

export interface Nav {
    // view: string | null;
    path: Array<string>;
    params: { [key: string]: string; };
}

// export enum ViewType {
//     NONE,
//     LANDING_PAGE,
//     ABOUT
// }

// // import { AsyncViewStatus, TopLevelView, ViewType, ViewBase } from './view';

// export interface NavigationBase {
//     type: ViewType;
// }

// export interface NavigationNone extends NavigationBase {
//     type: ViewType.NONE;
// }

// export interface NavigationLandingPage extends NavigationBase {
//     type: ViewType.LANDING_PAGE;
// }

// export interface NavigationAbout {
//     type: ViewType.ABOUT;
// }

// export type NavigationSome = NavigationLandingPage | NavigationAbout;
// export type Navigation = NavigationNone | NavigationSome;

// export type View = ViewBase<TaxonomyView> | ViewBase<OntologyView> | null;


