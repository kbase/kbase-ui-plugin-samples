/**
 * A relatively simple instrumentation class, wrapping OpenTelemetry, which
 * is too complex to expect to be used in code.
 * 
 * Usage:
 * - create instrumentation object at the top level
 *   This will create a module-global session
 *   ...
 * - for a the handler for each path
 * - start a session with the path and params as attributes
 * - for any 
 */
import { JSONValue } from '@kbase/ui-lib/lib/json';
import { v4 as uuidv4 } from 'uuid';

export class Event {
    name: string;
    at: number;
    constructor(name: string) {
        this.name = name;
        this.at = Date.now();
    }

    toJSON() {
        return {
            name: this.name,
            at: this.at
        };
    }
}

export interface Attributes {
    [name: string]: string | number | boolean;
};

// export class Span {
//     name: string;
//     parent: string | null;
//     start: number;
//     end: number | null = null;
//     events: Array<Event> = [];
//     attributes: Attributes;
//     constructor(name: string, parent: string | null, attributes?: Attributes) {
//         this.name = name;
//         this.parent = parent;
//         this.start = Date.now();
//         this.attributes = attributes || {};
//     }

//     stop() {
//         this.end = Date.now();
//     }

//     toJSON() {
//         if (this.end === null) {
//             throw new Error('cannot get span record without stopping first');
//         }
//         return {
//             name: this.name,
//             parent: this.parent,
//             start: this.start,
//             end: this.end,
//             elapsed: this.end - this.start,
//             events: this.events.map((event) => {
//                 return event.toJSON();
//             }),
//             attributes: this.attributes
//         };
//     }

//     addEvent(name: string) {
//         this.events.push(new Event(name));
//     }
// }

export interface SpanBaseParams {
    parent?: string,
    attributes?: Attributes;
}

export abstract class SpanBase {
    abstract id: string;
    static phase: 'begin' | 'end';
    at: number;
    attributes?: Attributes;
    constructor({ parent, attributes }: SpanBaseParams) {
        this.at = Date.now();
        this.attributes = attributes;
    }
    abstract toJSON(): JSONValue;
}

export interface SpanBeginParams extends SpanBaseParams {
    name: string;
    parent?: string;
}

export class SpanBegin extends SpanBase {
    static phase: 'begin' = 'begin';
    id: string;
    name: string;
    parent?: string;
    constructor(params: SpanBeginParams) {
        super(params);
        this.id = uuidv4();
        this.name = params.name;
        this.parent = params.parent;
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            parent: this.parent || null,
            phase: SpanBegin.phase,
            at: this.at,
            attributes: this.attributes || {}
        };
    }
}

export interface SpanEndParams extends SpanBaseParams {
    id: string;
}

export class SpanEnd extends SpanBase {
    static phase: 'end' = 'end';
    id: string;
    constructor(params: SpanEndParams) {
        super(params);
        this.id = params.id;
    }
    toJSON() {
        return {
            id: this.id,
            phase: SpanEnd.phase,
            at: this.at,
            attributes: this.attributes || {}
        };
    }
}

export interface SpanParams {
    name: string;
    parent?: string,
    attributes?: Attributes;
}

export class Session {
    id: string;
    constructor() {
        this.id = uuidv4();
    }
    newSession() {
        this.id = uuidv4();
    }
}
let currentSession: Session = new Session();

export class Span {
    id: string;
    name: string;
    at: number;
    parent?: string;
    attributes?: Attributes;
    constructor(params: SpanParams) {
        this.id = uuidv4();
        this.name = params.name;
        this.parent = params.parent;
        this.at = Date.now();
    }
    send(measurement: JSONValue) {
        console.log(measurement);
    }
    begin() {
        this.send({
            status: 'begin',
            span: this.id,
            session: currentSession.id,
            name: this.name,
            parent: this.parent || null,
            at: this.at,
            attributes: this.attributes || {}
        });
        return this;
    }
    end() {
        this.send({
            status: 'end',
            span: this.id,
            at: Date.now()
        });
    }
    error(message: string) {
        this.send({
            status: 'error',
            span: this.id,
            at: Date.now(),
            message
        });
    }
    attribute(name: string, value: JSONValue) {
        this.send({
            status: 'attribute',
            span: this.id,
            at: Date.now(),
            name, value
        });
        return this;
    }
    event(name: string) {
        this.send({
            status: 'event',
            span: this.id,
            at: Date.now(),
            name
        });
        return this;
    }
}




// export interface SpanDefinition {
//     name: string;
//     parentSpan: string;

// }

// export interface SpanDefinitions {
//     [name: string]: SpanDefinition
// }


export default class Instrumentation {
    // defs: SpanDefinitions;
    // constructor({ defs }) {
    //     this.defs = defs;
    // }

    send(measurement: JSONValue) {
        console.log(measurement);
    }

    // endComponent();


    // currentSpanName() {
    //     if (this.spanStack.length === 0) {
    //         return null;
    //     }
    //     return this.spanStack[this.spanStack.length - 1].name;
    // }

    createSpan(name: string, parent?: string) {
        const span = new Span({
            name, parent,
            attributes: {
                host: document.location.hostname,
                path: document.location.pathname
            }
        }).begin();
        return span;
    }

    // endSpan(span: Span) {
    //     const span = new SpanEnd({
    //         id,
    //         attributes: {
    //             host: document.location.hostname,
    //             path: document.location.pathname
    //         }
    //     });
    //     this.send(span.toJSON());
    //     return span;
    // }

    // addEvent(name: string) {
    //     const span = this.spanStack[this.spanStack.length - 1];
    //     span.addEvent(name);
    // }

    // begin() {
    //     this.startSpan(this.name, null);
    // }

    // end() {
    //     this.endSpan();
    // }
}

// let defaultInstrumentation: Instrumentation;

// export function makeDefaultInstrumentation(name: string) {
//     defaultInstrumentation = new Instrumentation();
//     return defaultInstrumentation;
// }

// export function getDefaultInstrumentation(): Instrumentation {
//     if (!defaultInstrumentation) {
//         throw new Error('Default instrumentation not created -  use makeDefaultInstrumentation(name: string) to do so');
//     }
//     return defaultInstrumentation;
// }
