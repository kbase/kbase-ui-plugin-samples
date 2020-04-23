import { HTTPQuery, QueryMap } from './HTTPUtils';

// import * as Bluebird from 'bluebird';

// Bluebird.config({
//     cancellation: true
// });


export type HTTPHeaderFields = { [key: string]: string; };

interface ContentType {
    mediaType: string;
    charset?: string;
}

export class HTTPHeader {
    header: HTTPHeaderFields;

    public static fromXHR(xhr: XMLHttpRequest): HTTPHeaderFields {
        let responseHeaders = xhr.getAllResponseHeaders();
        if (!responseHeaders) {
            return {};
        }
        let fieldsArray = responseHeaders.split(/\n/);
        var fieldsMap: { [key: string]: string; } = {};
        fieldsArray.forEach((field) => {
            let firstColon = field.indexOf(':', 0);
            let name = field.substr(0, firstColon).trim();
            let value = field.substr(firstColon + 1).trim();
            fieldsMap[name.toLowerCase()] = value;
        });
        return fieldsMap;
    }

    public static fromMap(header: any): HTTPHeaderFields {
        var fieldsMap: { [key: string]: string; } = {};
        Object.keys(header).forEach((name) => {
            fieldsMap[name.toLowerCase()] = header[name];
        });
        return fieldsMap;
    }

    constructor(initialHeaders?: any) {
        if (typeof initialHeaders === 'undefined') {
            this.header = {};
        } else if (initialHeaders instanceof XMLHttpRequest) {
            this.header = HTTPHeader.fromXHR(initialHeaders);
        } else {
            this.header = HTTPHeader.fromMap(initialHeaders);
        }
    }

    getHeader(fieldName: string): string {
        return this.header[fieldName.toLowerCase()];
    }

    setHeader(fieldName: string, fieldValue: string): void {
        this.header[fieldName.toLowerCase()] = fieldValue;
    }

    exportHeader(xhr: XMLHttpRequest) {
        Object.keys(this.header)
            .filter((key) => {
                if (this.getHeader(key) === undefined ||
                    this.getHeader(key) === null) {
                    return false;
                }
                return true;
            })
            .forEach((key) => {
                // normalize value?
                var stringValue = ((value) => {
                    switch (typeof value) {
                        case 'string': return value;
                        case 'number': return String(value);
                        case 'boolean': return String(value);
                        default:
                            throw new Error('Invalid type for header value: ' + typeof value);
                    }
                })(this.getHeader(key));
                xhr.setRequestHeader(key, stringValue);
            });
    }

    getContentType(): ContentType | null {
        let value = this.header['content-type'];
        if (!value) {
            return null;
        }
        let values = value.split(';').map((x) => x.trim());
        if (values[1]) {
            return {
                mediaType: values[0],
                charset: values[1]
            };
        } else {
            return {
                mediaType: values[0]
            };
        }
    }
}

// interface HttpHeaderField {
//     name: string;
//     value: string;
// }


export class TimeoutError extends Error {
    timeout: number;
    elapsed: number;
    xhr: XMLHttpRequest;

    constructor(timeout: number, elapsed: number, message: string, xhr: XMLHttpRequest) {
        super(message);

        Object.setPrototypeOf(this, TimeoutError.prototype);

        this.name = 'TimeoutError';
        this.stack = new Error().stack;

        this.timeout = timeout;
        this.elapsed = elapsed;
        this.xhr = xhr;
    }

    toString(): string {
        return this.message;
    }
}

export class GeneralError extends Error {
    xhr: XMLHttpRequest;
    constructor(message: string, xhr: XMLHttpRequest) {
        super(message);

        Object.setPrototypeOf(this, GeneralError.prototype);

        this.name = 'GeneralError';
        this.stack = new Error().stack;

        this.xhr = xhr;
    }
    toString(): string {
        return this.message;
    }
}

export class AbortError extends Error {
    xhr: XMLHttpRequest;
    constructor(message: string, xhr: XMLHttpRequest) {
        super(message);
        Object.setPrototypeOf(this, AbortError.prototype);

        this.name = 'AbortError';
        this.stack = new Error().stack;

        this.xhr = xhr;
    }
    toString(): string {
        return this.message;
    }
}

export interface RequestOptions {
    url: string,
    method: string,
    query?: QueryMap,
    timeout: number,
    header?: HTTPHeader,
    responseType?: string,
    withCredentials?: boolean,
    data?: null | string | Array<number>;
    onCancel?: (callback: () => void) => void;
}

export interface Response {
    status: number,
    response: string,
    responseType: string,
    header: HTTPHeader;
}

export class HTTPClient {
    async request(options: RequestOptions): Promise<Response> {
        let startTime = new Date().getTime();
        return new Promise((resolve, reject) => {
            const xhr: XMLHttpRequest = new XMLHttpRequest();
            xhr.onload = () => {
                resolve({
                    status: xhr.status,
                    response: xhr.response,
                    responseType: xhr.responseType,
                    header: new HTTPHeader(xhr)
                });
            };
            xhr.ontimeout = () => {
                var elapsed = (new Date().getTime()) - startTime;
                reject(new TimeoutError(options.timeout, elapsed, 'Request timeout', xhr));
            };
            xhr.onerror = () => {
                reject(new GeneralError('General request error ' + options.url, xhr));
            };
            xhr.onabort = () => {
                reject(new AbortError('Request was aborted', xhr));
            };

            var url = options.url;
            if (options.query) {
                url += '?' + new HTTPQuery(options.query).toString();
            }

            const rt = (options.responseType || 'text') as XMLHttpRequestResponseType;
            xhr.responseType = rt;

            try {
                xhr.open(options.method, url, true);
            } catch (ex) {
                reject(new GeneralError('Error opening request ' + ex.name, xhr));
                return;
            }

            if (options.timeout) {
                xhr.timeout = options.timeout;
            }

            xhr.withCredentials = options.withCredentials || false;

            try {
                if (options.header) {
                    options.header.exportHeader(xhr);
                }
            } catch (ex) {
                reject(new GeneralError('Error applying header before send ' + ex.name, xhr));
            }

            try {
                if (typeof options.data === 'string') {
                    xhr.send(options.data);
                    if (options.onCancel) {
                        options.onCancel(() => {
                            xhr.abort();
                        });
                    }
                } else if (options.data instanceof Array) {
                    xhr.send(new Uint8Array(options.data));
                } else if (typeof options.data === 'undefined') {
                    xhr.send();
                } else if (options.data === null) {
                    xhr.send();
                } else {
                    reject(new Error('Invalid type of data to send: ' + typeof options.data));
                }
            } catch (ex) {
                reject(new GeneralError('Error sending data in request', xhr));
            }
        });
    }
}