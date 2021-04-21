import {Action} from "redux";

export type Categories =
    | "sample"
    | "access"
    | "linkedData";

export interface CategoryAction<C extends Categories, T> extends Action<T> {
    category: C;
}
