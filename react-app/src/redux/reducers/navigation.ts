import { StoreState } from "../store";
import { Action } from "redux";
import { ActionType, Navigate } from "../actions";
import { SyncViewStatus } from "../store/view";

// import { navigate } from "@kbase/ui-components";

function nav(state: StoreState, action: Navigate): StoreState {
    return {
        ...state,
        navigationView: {
            status: SyncViewStatus.SUCCESS,
            state: action.nav
        }
    };
}

export default function reducer(state: StoreState, action: Action): StoreState | null {
    switch (action.type) {
        case ActionType.NAVIGATE:
            return nav(state, action as Navigate);
        default:
            // not our action
            return null;
    }
}

// const reducer: Reducer<StoreState | undefined, Action> = (state: StoreState | undefined, action: AppAction) => {
//     // Now ours
//     if (typeof state === 'undefined') {
//         return state;
//     }
//     switch (action.type) {
//         case ActionType.NAVIGATE:
//             return nav(state, action)
//         default:
//             // not our action
//             return null;
//     }

//     // Finally, if nothing matches, ignore.
//     console.warn('unhandled action in reducer', action);
//     return state;
// };

// export default reducer;