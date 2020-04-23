import React from 'react';
import { Unsubscribe } from 'redux';
import { RootState } from '@kbase/ui-components';
import { Nav } from '../redux/store/navigation';
import { NavigationView } from '../redux/store';
import { Navigation } from '@kbase/ui-components/lib/redux/integration/store';

export interface NavigationListenerProps {
    rootState: RootState;
    navigationView: NavigationView;
    trigger: number;
    navigation: Navigation;
    navigate: (nav: Nav) => void;
}

interface NavigationListenerState {
}

interface Params {
    [k: string]: string;
};

export default class NavigationListener extends React.Component<NavigationListenerProps, NavigationListenerState> {
    storeUnsubscribe: Unsubscribe | null;
    last: Nav;
    constructor(props: NavigationListenerProps) {
        super(props);
        this.storeUnsubscribe = null;
        this.last = {
            path: [],
            params: {}
        };
    }

    parseHash(hash: string): {
        pluginId: string,
        path: Array<string>,
        params: Params;
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
        let params: Params;
        if (queryString) {
            params = queryString.split('&').reduce<Params>((query, field) => {
                const [k, v] = field.split('=');
                query[k] = v;
                return query;
            }, {});
        } else {
            params = {};
        }

        return {
            pluginId,
            path,
            params
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

    //     console.log('hmm', pluginId, path, params);
    //     throw new Error('Unrecognized nav');
    // }

    setupListener() {
        if (this.props.rootState === RootState.DEVELOP) {
            // Navigate on change of the hash
            window.addEventListener('hashchange', (ev: HashChangeEvent) => {
                const url = new URL(ev.newURL);
                const hash = url.hash;
                if (!hash) {
                    throw new Error('no hash!');
                }
                const {
                    pluginId,
                    path,
                    params
                } = this.parseHash(hash);
                // const nav = this.translatePathParams(pluginId, path, params);
                // if (nav === null) {
                //     return;
                // }
                const nav: Nav = {
                    path,
                    params
                };
                this.props.navigate(nav);

                // this.props.navigate(relationEngineID);
            });

            // First time here, we also want to navigate based on the
            // hash, or if empty (the default when a dev session starts)
            // use some default interesting taxon id.

            // don't do initial nav for now
            // return;

            const hash = window.location.hash;
            // console.log('in hash', hash, window.location);
            if (hash) {
                const {
                    pluginId,
                    path,
                    params
                } = this.parseHash(hash);
                // const nav = this.translatePathParams(pluginId, path, params);
                // if (nav === null) {
                //     return;
                // }
                // console.log('initial hash', pluginId, path, params);
                const nav: Nav = {
                    path,
                    params
                };
                this.props.navigate(nav);
                // this.props.navigate(relationEngineID);
            } else {
                // TODO: remove?
                // #review/ontology/go/GO:0007610
                // this.props.navigate('ncbi_taxonomy/562');
                // this.props.navigate('go_ontology/GO:0007610');
            }
        }
    }

    componentDidMount() {
        this.setupListener();
    }
    componentWillUnmount() {

    }
    render() {
        // console.log('navigation', this.props.navigation);
        return this.props.children;
    }
}