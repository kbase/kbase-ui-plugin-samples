import { Action } from "redux";
import { Nav } from "../store/navigation";
import { View } from "./route";
// import { Params } from "@kbase/ui-components/lib/redux/integration/store";

export interface Params {
    [key: string]: string;
}

// Note - since this joins the union of other action types from ui/components, 
// we need to namespace by using a string enum.
export enum ActionType {
    NAVIGATE = "@sampleview/navigate",
    ROUTE = "@sampleview/route"
}

// Action type interfaces

// Navigation

export interface Navigate extends Action<ActionType.NAVIGATE> {
    nav: Nav;
}



export function navigate(nav: Nav): Navigate {
    return {
        type: ActionType.NAVIGATE,
        nav
    };
}

// Routing

export interface Route extends Action<ActionType.ROUTE> {
    view: View;
}

export function route(view: View): Route {
    return {
        type: ActionType.ROUTE,
        view
    };
}


// All Actions

export type AppAction = Navigate | Route;