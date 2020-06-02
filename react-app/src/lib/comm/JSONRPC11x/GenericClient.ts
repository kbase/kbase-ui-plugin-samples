// import axios from 'axios';
import HTTPClient, { HTTPHeader, RequestOptions } from '../HTTPClient';
import { JSONObject, JSONValue, isJSONObject } from '../../json';

export interface GenericClientParams {
    url: string;
    module: string;
    token?: string;
    timeout?: number;
}

const DEFAULT_TIMEOUT = 10000;

export interface JSONPayload<T> {
    version: string;
    method: string;
    id: string;
    params: T;
}

export interface JSONRPCError {
    code: number;
    message: string;
    data: JSONObject;
}

export interface MethodSuccessResult<T> {
    result: T;
    error: null;
}

export interface MethodErrorResult {
    result: null;
    error: JSONRPCError;
}

export type MethodResponse<T> = MethodSuccessResult<T> | MethodErrorResult;

export type JSONRPCResponse<T> =
    // success
    | [T, null, null]
    // success, but void result
    | [null, null, null]
    // error returned by method, not sdk wrapper
    | [null, MethodErrorResult, null]
    // error returned by sdk wrapper (caught exception)
    | [null, null, JSONRPCError];

export class JSONRPCException extends Error {
    code: number;
    data: JSONObject;
    constructor({ code, message, data }: JSONRPCError) {
        super(message);
        this.code = code;
        this.data = data;
    }
}

export class classJSONRPCServerException extends Error {
    // constructor(message: string) {
    //     super(message);
    // }
}

export interface GenericClientOptions {
    timeout?: number;
}

export class GenericClient {
    url: string;
    token?: string;
    module: string;
    timeout: number;

    constructor({ url, token, module, timeout }: GenericClientParams) {
        this.url = url;
        this.token = token;
        this.module = module;
        this.timeout = timeout || DEFAULT_TIMEOUT;
    }

    protected makePayload<T>(method: string, param: T): JSONPayload<T> {
        return {
            version: '1.1',
            method: this.module + '.' + method,
            id: String(Math.random()).slice(2),
            params: param
        };
    }

    // protected makeEmptyPayload<T>(method: string): JSONPayload<T> {
    //     const params: Array<T> = [];
    //     return {
    //         version: '1.1',
    //         method: this.module + '.' + method,
    //         id: String(Math.random()).slice(2),
    //         params
    //     };
    // }

    // protected async processResponse<T>(response: AxiosResponse): Promise<T> {
    //     if (response.status === 200) {
    //         const { result } = await response.json();
    //         return result as T;
    //     } else if (response.status === 204) {
    //         // The SDK has a weird edge case in which a method can specify no
    //         // result, which is translated to a 204 response and no content.
    //         // IMO it should return a valid json value, like null so we don't
    //         // have to work around it.
    //         // const result = null
    //         // result as unknown as T
    //         const result: unknown = null;
    //         return result as T;
    //     }
    //     if (response.status === 500) {
    //         if (response.headers.get('Content-Type') === 'application/json') {
    //             const { error } = await response.json();
    //             throw new JSONRPCException(error);
    //         } else {
    //             const text = await response.text();
    //             throw new classJSONRPCServerException(text);
    //         }
    //     }
    //     throw new Error('Unexpected response: ' + response.status + ', ' + response.statusText);
    // }

    // protected async callFunc<T>(func: string, param: any): Promise<T> {
    //     const headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //     headers.append('Accept', 'application/json');
    //     if (this.token) {
    //         headers.append('Authorization', this.token);
    //     }
    //     const response = await axios.post(this.url, this.makePayload(func, param), {
    //         // mode: 'cors',
    //         // cache: 'no-store',
    //         headers
    //     });
    //     // The response may be a 200 success, a 200 with method error,
    //     // an sdk 500 error, an internal 500 server error,
    //     // or any other http error code.
    //     return response.data as T
    //     // return this.processResponse<T>(response);
    // }

    async callFunc<P, R>(func: string, param: P, options?: GenericClientOptions): Promise<R> {
        const header: HTTPHeader = new HTTPHeader();
        header.setHeader('Content-Type', 'application/json');
        header.setHeader('Accept', 'application/json');
        if (this.token) {
            header.setHeader('Authorization', this.token);
        }

        const http = new HTTPClient();
        const payload = this.makePayload<P>(func, param);

        const requestOptions: RequestOptions = {
            method: 'POST',
            url: this.url,
            timeout: options?.timeout || this.timeout,
            data: JSON.stringify(payload),
            header
        };
        const response = await http.request<string>(requestOptions);
        let jsonResponse: JSONValue;
        try {
            jsonResponse = (JSON.parse(response.response) as unknown) as JSONValue;
        } catch (ex) {
            throw new JSONRPCException({
                code: 100,
                message: 'The response from the service could not be parsed as JSON',
                data: {
                    message: ex.message,
                    text: response.response
                }
            });
        }

        // ensure jsonrpc 11 response.
        if (isJSONObject(jsonResponse) &&
            'version' in jsonResponse &&
            typeof jsonResponse.version === 'string' &&
            jsonResponse.version === '1.1') {
            if ('result' in jsonResponse) {
                return (jsonResponse.result as unknown) as R;
            }
            if ('error' in jsonResponse) {
                const error = jsonResponse.error;
                if (isJSONObject(error) &&
                    'code' in error &&
                    'message' in error &&
                    typeof error.message === 'string') {
                    throw new JSONRPCException({
                        code: 200,
                        message: error.message || 'Unknown error',
                        data: {
                            error: error.error
                        }
                    });
                }
                throw new Error('Invalid error response for JSONRPC 1.1');
            }
        }
        throw new Error('Invalid JSONRPC 1.1 response');
    }
}
