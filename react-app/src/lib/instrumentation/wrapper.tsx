import React from 'react';
import {Span} from './core';

export interface InstrumentedProps {
    span: Span;
}

export const Instrument = <P extends object>(Component: React.ComponentType<P>, name: string, parent?: string) => {
    return class Instrumented extends React.Component<P & InstrumentedProps> {
        span: Span;

        constructor(props: P & InstrumentedProps) {
            super(props);
            this.span = new Span({name, parent: parent || null}).begin();
        }

        componentWillUnmount() {
            this.span.end();
        }

        render() {
            const props = {...this.props, span: this.span};
            return <Component {...props}></Component>;
        }
    };
};