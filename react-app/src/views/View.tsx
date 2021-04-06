import Main from 'components/Main';
import React from 'react';
import { RouteComponentProps } from "react-router-dom";

export interface ViewParams {
    id: string;
    version?: string;
}

// export default class View extends React.Component<RouteComponentProps<ViewParams>, {}> {
//     render() {
//         const { id, version } = this.props.match.params;
//         return <Main id={id} version={version ? parseInt(version) : undefined} />;
//     }
// }


export type ViewProps = RouteComponentProps<ViewParams>


const View: React.FC<ViewProps> = (props: ViewProps) => {
    const { id, version } = props.match.params;
    return <Main id={id} version={version ? parseInt(version) : undefined} />;
}

export default View;
