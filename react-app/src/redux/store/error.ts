import { JSONValue } from "@kbase/ui-lib/lib/lib/json";

export interface UIError {
    code: string;
    source: string;
    message: string;
    data?: JSONValue;
}

export class UIException extends Error {
    code: string;
    source: string;
    message: string;
    data?: JSONValue;
    constructor({ message, code, source, data }: { message: string, code: string, source: string, data?: JSONValue; }) {
        super(message);
        this.code = code;
        this.source = source;
        this.message = message;
        this.data = data;
    }
}
