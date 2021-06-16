import Main, {OwnProps} from 'components/Main';
import React from 'react';
import {RouteComponentProps} from "react-router-dom";

export interface ViewParams {
    id: string;
    version: string;
}

export type ViewProps = RouteComponentProps<ViewParams>;

export default class View extends React.Component<ViewProps, {}> {
    render() {
        console.log('view', this.props.match.params);
        const {id} = this.props.match.params;
        const props: OwnProps = {
            id
        }
        const version = (() => {
            if ('version' in this.props.match.params) {
                const version = parseInt(this.props.match.params.version);
                if (isNaN(version)) {
                    // TODO: or throw error?
                    return null;
                } else {
                    return version;
                }
            } else {
                // No version?
                return null;
            }
        })();

        if (version !== null) {
            props.version = version;
        }
        return <Main {...props}/>;
    }
}
