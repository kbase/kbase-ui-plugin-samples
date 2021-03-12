import React from 'react';
import {Alert} from 'antd';
import {RootState, AppError} from '@kbase/ui-components';
import {Params} from '.';
import Navigation from '../navigation';
import {RouteConfig, routeConfigToSpec} from '../navigation/RouteConfig';
import Main from '../../components/Main';

const routes: Array<RouteConfig> = [
    {
        path: "samples/view/:sampleId/:-sampleVersion",
        view: 'view'
    },
    {
        path: 'samples/about',
        view: 'about'
    }
];

export interface ViewRouter {
    view: string;
    router: (path: Array<string>, params: Params) => React.ReactNode;
}

export interface ViewRouters {
    [key: string]: ViewRouter;
}

export interface DispatcherProps {
    token: string | null;
    rootState: RootState;
    view: string | null;
    path: Array<string>;
    params: Params;
}

interface DispatcherState {
    view: string | null;
    path: Array<string>;
    params: Params;
    currentRoute: ViewRouter | null;
}

export class Dispatcher extends React.Component<DispatcherProps, DispatcherState> {
    views: ViewRouters;

    constructor(props: DispatcherProps) {
        super(props);

        this.views = {
            about: {
                view: 'about',
                router: (path: Array<string>, params: Params) => {
                    return <div>About here...</div>;
                }
            },
            // help: {
            //     view: 'help',
            //     router: (path: Array<string>, params: Params) => {
            //         return <div>Help here...</div>;
            //     }
            // },
            view: {
                view: 'view',
                router: (path: Array<string>, params: Params) => {
                    // const [namespace, term] = path;
                    if (!params.sampleId) {
                        throw new Error('No sampleId!!');
                    }
                    const version = params.sampleVersion ? parseInt(params.sampleVersion) : undefined;
                    return <Main sampleId={params.sampleId} sampleVersion={version}/>;
                }
            }
        };

        this.state = {
            view: this.props.view,
            path: this.props.path,
            params: this.props.params,
            currentRoute: null
        };
    }

    renderUnauthorized() {
        return <div>Sorry, not authorized. Please log in first.</div>;
    }

    renderRootState() {
        switch (this.props.rootState) {
            case RootState.NONE:
                return '';
            case RootState.HOSTED:
                return '';
            case RootState.DEVELOP:
                return '';
            case RootState.ERROR:
                return 'error';
        }
    }

    renderNavigationNone() {
        const message = <div>
            NONE
        </div>;
        return <Alert type="error" message={message}/>;
    }

    renderError(error: AppError) {
        return <Alert type="error" message={error.message}/>;
    }

    renderNotFound(view: string) {
        return <Alert type="warning" message={`Not Found: ${view}`}/>;
    }

    renderEmptyRoute() {
        return <div></div>;
    }

    renderRoute() {
        if (!this.props.view) {
            return this.renderEmptyRoute();
        }
        const route = this.views[this.props.view];
        if (!route) {
            return this.renderEmptyRoute();
        }
        return route.router(this.props.path, this.props.params);
    }

    renderRouting() {
        if (!this.props.token) {
            return this.renderUnauthorized();
        }
        return this.renderRoute();
    }

    render() {
        if (this.props.rootState === RootState.DEVELOP) {
            const routeSpecs = routes.map(routeConfigToSpec);
            return <Navigation routes={routeSpecs}>
                {this.renderRouting()}
            </Navigation>;
        } else {
            return this.renderRouting();
        }
    }
}
