import React from "react";
import { Provider } from "react-redux";
import store, { NavigationView } from "./redux/store";
import { AppBase } from "@kbase/ui-components";
import "./App.css";
import Dispatcher from "./dispatcher";
import Navigation from "./navigation";
import { Unsubscribe } from "redux";
import { SyncViewStatus } from "./redux/store/view";
import { Params } from "./redux/actions";

interface AppProps { }

interface AppState { }

function arraysEquivalent(a: Array<string>, b: Array<string>): boolean {
    if (a.length !== b.length) {
        return false;
    }
    a.sort();
    b.sort();
    for (let i = 0; i < a.length; i += 1) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

function objectsEquivalent(a: Params, b: Params): boolean {
    const ak = Object.keys(a);
    const bk = Object.keys(b);
    if (!arraysEquivalent(ak, bk)) {
        return false;
    }
    for (let i = 0; i < ak.length; i += 1) {
        const key = ak[i];
        if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}

// const demoSamples = [{
//     "description": "This is from Adam's Enigma SampleMetaData.tsv file in the shared samples google drive.",
//     "samples": [
//         {
//             "id": "5f9f1098-69c0-49b2-990f-086559e03cd4",
//             "name": "0408-FW021.46.11.27.12.02"
//         },
//         {
//             "id": "c381b05f-546a-445b-9026-88591dc14e0e",
//             "name": "0408-FW021.46.11.27.12.10"
//         },
//         {
//             "id": "eeb77ac1-ed98-4979-b1fa-63b07067d883",
//             "name": "0408-FW021.7.26.12.02"
//         },
//         {
//             "id": "316e05c1-e334-4257-8752-6749cdf0700f",
//             "name": "0408-FW021.7.26.12.3"
//         },
//         {
//             "id": "b08442b7-9fbb-4c57-a653-93105ba43b69",
//             "name": "0408-FW106.7.25.12.02"
//         },
//         {
//             "id": "839dff32-5c16-4519-9017-14e6bcf9259d",
//             "name": "0408-FW233.2.17.99.11.28.12.02"
//         }
//     ]
// }];
/*
 <div>
                            <a href="/#sampleview/81563a88-0abe-4b8f-b2fc-dd2d400e41a9">Sample 81563a88-0abe-4b8f-b2fc-dd2d400e41a9</a>
                        </div>
                        <div>
                            <a href="/#sampleview/f8215f4e-82fc-4561-aa5c-e91dd3e73a47">Sample f8215f4e-82fc-4561-aa5c-e91dd3e73a47</a>
                        </div>
                        <div>
                            <a href="/#sampleview/971a7035-5a0b-4008-8177-ce23f38963d9">Sample 971a7035-5a0b-4008-8177-ce23f38963d9</a>
                        </div>
                        <div>
                            <a href="/#sampleview/81563a88-0abe-4b8f-b2fc-dd2d400e41az">Bad Sample 81563a88-0abe-4b8f-b2fc-dd2d400e41az</a>
                        </div>
                        <div>
                            <a href="/#sampleview/foo">Bad Sample foo</a>
                        </div>
                        <hr />
                        
*/


export default class App<AppProps, AppState> extends React.Component {
    storeUnsubscribe: Unsubscribe | null;
    constructor(props: AppProps) {
        super(props);
        this.storeUnsubscribe = null;
    }
    render() {
        return (
            <Provider store={store}>
                <AppBase>
                    <div className="App">

                        <Navigation>
                            <Dispatcher />
                        </Navigation>
                    </div>
                </AppBase>
            </Provider>
        );
    }
    componentDidMount() {
        let last: NavigationView | null = null;
        this.storeUnsubscribe = store.subscribe(() => {
            const state = store.getState();
            if (!state) {
                return;
            }
            const {
                // app: {
                //     runtime: { navigation }
                // },
                navigationView,
                auth: { userAuthorization }
            } = state;

            // This is a bit of a cheat.
            if (!userAuthorization) {
                return;
            }

            // const view = navigation.view;
            // const params = navigation.params as { [key: string]: string };

            if (navigationView.status !== SyncViewStatus.SUCCESS) {
                return;
            }

            const changed = (): boolean => {
                if (last) {
                    switch (navigationView.status) {
                        case SyncViewStatus.SUCCESS:
                            if (last.status !== SyncViewStatus.SUCCESS) {
                                return true;
                            }
                            if (!arraysEquivalent(navigationView.state.path, last.state.path)) {
                                return true;
                            }
                            if (!objectsEquivalent(navigationView.state.params, last.state.params)) {
                                return true;
                            }
                            return false;
                        default:
                            return true;
                    }
                } else {
                    return true;
                }
            };

            // console.log('CHANGED: ', changed());

            // const path = navigationView.state.path;
            // const params = navigationView.state.params;

            // Currently we only do one thing when navigating, select a new sample id.

            // Updating views should be as simple as updating the current view. We do this of 
            // course via actions.


            // if (
            //     view !== last.view ||
            //     last.params === null ||
            //     Object.keys(params).some((key) => {
            //         return params[key] !== last.params[key];
            //     })
            // ) {
            //     last.params = params;
            //     last.view = view;

            //     // TODO: store may change but there is not navigation yet.
            //     // if (params['relationEngineID']) {
            //     //     store.dispatch(navigate(params['relationEngineID']) as any);
            //     // }
            // }
        });
    }
    componentWillUnmount() {
        if (this.storeUnsubscribe) {
            this.storeUnsubscribe();
        }
    }
}