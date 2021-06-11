import React from 'react';
import {RouteComponentProps} from "react-router-dom";

export type AboutProps = RouteComponentProps;


// export default class About extends React.Component<AboutProps, {}> {
//     span: Span;
//     constructor(props: AboutProps) {
//         super(props);
//         this.span = new Span({ name: 'Views.About' }).begin();
//     }
//     render() {
//         return <div>
//             <p>About the samples Plugin...</p>
//         </div>;
//     }

//     componentWillUnmount() {
//         this.span.end();
//     }
// }

export default class About extends React.Component<AboutProps, {}> {
    render() {
        return <div>
            <p>About the samples Plugin...</p>
            {/*<p><Button onClick={() => {*/}
            {/*    if ('span' in this.props) {*/}
            {/*        const span = (this.props['span'] as unknown) as Span;*/}
            {/*        span.event('clicked-test-button');*/}
            {/*    }*/}
            {/*}}>Test</Button></p>*/}
        </div>;
    }
}

