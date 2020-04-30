export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

export interface JSONArray extends Array<JSONValue> { };

export interface JSONObject {
    [x: string]: JSONValue;
}

export function isJSONObject(value: JSONValue): value is JSONObject {
    if (typeof value !== 'object') {
        return false;
    }
    if (value === null) {
        return false;
    }
    if (Array.isArray(value)) {
        return false;
    }
    return true;
}

export function isJSONArray(value: JSONValue): value is JSONArray {
    if (Array.isArray(value)) {
        return true;
    }
    return false;
}