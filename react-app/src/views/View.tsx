import Main from 'components/Main';
import React from 'react';
import { RouteComponentProps } from "react-router-dom";

export interface ViewParams {
    id: string;
    version?: string;
}


export type ViewProps = RouteComponentProps<ViewParams>;

export default class View extends React.Component<ViewProps, {}> {
    render() {
        const { id, version } = this.props.match.params;
        return <Main id={id} version={version ? parseInt(version) : undefined} />;
    }
}
