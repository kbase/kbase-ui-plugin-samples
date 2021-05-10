import React from 'react';
import { RouteComponentProps } from "react-router-dom";

export type HelpProps = RouteComponentProps;
export default class About extends React.Component<HelpProps, {}> {
    render() {
        return <div>
            <p>Help for the samples Plugin...</p>
        </div>;
    }
}
