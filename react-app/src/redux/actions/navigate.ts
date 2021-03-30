import { Nav } from "redux/store/navigation";
import { CategoryAction } from "./base";

export enum ActionType {
    NAVIGATE = "@samples/navigate",
    ROUTE = "@samples/route"
}

// Action type interfaces

// Navigation

export interface Navigate extends CategoryAction<'navigate', ActionType.NAVIGATE> {
    nav: Nav;
}



export function navigate(nav: Nav): Navigate {
    return {
        category: 'navigate',
        type: ActionType.NAVIGATE,
        nav
    };
}
