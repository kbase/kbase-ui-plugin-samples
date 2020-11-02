import React from 'react';
import { Unsubscribe } from 'redux';
import { RootState } from '@kbase/ui-components';
// import { Nav } from '../redux/store/navigation';
import { NavigationView } from '../redux/store';
import { Navigation } from '@kbase/ui-components/lib/redux/integration/store';
import { Route } from '.';
import { Router } from './Router';

export interface NavigationListenerProps {
    routes: Array<Route>;
    rootState: RootState;
    navigationView: NavigationView;
    trigger: number;
    navigation: Navigation;
    navigate: (nav: Navigation) => void;
}

interface NavigationListenerState {
}

interface Params {
    [k: string]: string;
};

export default class NavigationListener extends React.Component<NavigationListenerProps, NavigationListenerState> {
    storeUnsubscribe: Unsubscribe | null;
    last: Navigation;
    constructor(props: NavigationListenerProps) {
        super(props);
        this.storeUnsubscribe = null;
        this.last = {
            // path: [],
            view: '',
            params: {}
        };
    }

    parseHash(hash: string): {
        pluginId: string,
        path: Array<string>,
        query: Params;
    } {
        // The navigation hash format is:
        // #pluginid/path/component?a=b&c=d
        const hashRe = /^#(.*?)\/(.*?)(?:[?](.*))?$/;
        const m = hashRe.exec(hash);

        if (!m) {
            throw new Error('Invalid path');
        }

        // Just for now...
        // TODO: for real

        const [, pluginId, pathString, queryString] = m;

        let path: Array<string>;
        if (pathString) {
            path = pathString.split('/');
        } else {
            path = [];
        }
        let query: Params;
        if (queryString) {
            query = queryString.split('&').reduce<Params>((query, field) => {
                const [k, v] = field.split('=');
                query[k] = v;
                return query;
            }, {});
        } else {
            query = {};
        }

        return {
            pluginId,
            path,
            query
        };
    }

    // translatePathParams(pluginId: string, path?: Array<string>, params?: Params): Nav | null {
    //     // Wildly off! Ignore a navigation not targeted at us. 
    //     if (pluginId !== 'sampleview') {
    //         return null;
    //     }

    //     // 
    //     if (typeof path === 'undefined' || path.length === 0) {
    //         throw new Error('sampleview requires a sample id to view');
    //     }

    //     if (path.length === 1) {
    //         return {
    //             view: 'main',
    //             params: {
    //                 sampleId: path[0]
    //             }
    //         };
    //     }

    //     throw new Error('Unrecognized nav');
    // }

    navigateWithHash(hash: string) {
        if (!hash) {
            throw new Error('no hash!');
        }
        const {
            pluginId,
            path,
            query
        } = this.parseHash(hash);

        const router = new Router();
        router.addRoute({
            path: [
                {
                    type: 'literal',
                    value: 'samples'
                },
                {
                    type: 'param',
                    name: 'sampleId'
                },
                {
                    type: 'param',
                    name: 'sampleVersion',
                    optional: true
                }
            ]
        });

        // Now match the hash info to a view and params!
        // first, fake it.
        const view = 'main';
        const params = {
            sampleId: path[0],
            sampleVersion: path[1]
        };

        const nav: Navigation = {
            view,
            params
        };
        this.props.navigate(nav);
    }

    setupListener() {
        if (this.props.rootState === RootState.DEVELOP) {
            // Navigate on change of the hash
            window.addEventListener('hashchange', (ev: HashChangeEvent) => {
                const url = new URL(ev.newURL);
                const hash = url.hash;
                if (!hash) {
                    throw new Error('no hash!');
                }
                this.navigateWithHash(hash);
            });

            // First time here, we also want to navigate based on the
            // hash, or if empty (the default when a dev session starts)
            // use some default interesting taxon id.

            // don't do initial nav for now
            // return;
            const hash = window.location.hash;
            if (!hash) {
                throw new Error('no hash!');
            }

            this.navigateWithHash(hash);
        }
    }

    componentDidMount() {
        this.setupListener();
    }
    render() {
        return this.props.children;
    }
}