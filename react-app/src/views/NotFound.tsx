// import NotFound from 'components/NotFound';

import { NotFound } from '@kbase/ui-components';
import React from 'react';
import { RouteComponentProps } from "react-router-dom";

export type NotFoundProps = RouteComponentProps;
export default class NotFoundView extends React.Component<NotFoundProps, {}> {
    render() {
        return <NotFound path={this.props.location.pathname} />;
    }
}
