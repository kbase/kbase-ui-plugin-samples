import React from 'react';
import { RouteComponentProps } from "react-router-dom";

export type NotFoundProps = RouteComponentProps;
export default class NotFound extends React.Component<NotFoundProps, {}> {
    render() {
        return <div>
            <p>NOT FOUND!</p>
            <p>{this.props.location.pathname}</p>
        </div>;
    }
}

