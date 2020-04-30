import { Params } from "../redux/actions";

export function arraysEquivalent(a: Array<string>, b: Array<string>): boolean {
    if (a.length !== b.length) {
        return false;
    }
    a.sort();
    b.sort();
    for (let i = 0; i < a.length; i += 1) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

export function objectsEquivalent(a: Params, b: Params): boolean {
    const ak = Object.keys(a);
    const bk = Object.keys(b);
    if (!arraysEquivalent(ak, bk)) {
        return false;
    }
    for (let i = 0; i < ak.length; i += 1) {
        const key = ak[i];
        if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}