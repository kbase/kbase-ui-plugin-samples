import React from "react";
import { Provider } from "react-redux";
import { ErrorBoundary } from "@kbase/ui-components";
import store from "./redux/store";
import { AppBase, AuthGate } from "@kbase/ui-components";
import "./App.css";
import Router from "./components/Router";
import { Unsubscribe } from "redux";
import { AsyncProcessStatus } from "redux/store/processing";
import { get as getSample } from "redux/actions/sample";
import { get as getLinkedData } from "redux/actions/linkedData";
import { get as getAccess } from "redux/actions/access";



interface AppProps { }
interface AppState { }

/*
TODO: <Navigation routes={devConfig.install.routes}>

*/
export default class App<AppProps, AppState> extends React.Component {
    storeUnsubscribe: Unsubscribe | null;
    constructor(props: AppProps) {
        super(props);
        this.storeUnsubscribe = null;
    }
    render() {
        return (
            <ErrorBoundary>
                <Provider store={store}>
                    <AppBase>
                        <AuthGate required={true}>
                            <div className="App">
                                <Router />
                            </div>
                        </AuthGate>
                    </AppBase>
                </Provider>
            </ErrorBoundary>
        );
    }

    setupNavDev() {
    }

    setupNavProd() {
    }

    // componentDidMount() {
    //     let lastNavigation: {
    //         view: string | null;
    //         params: { [key: string]: string; };
    //     } = {
    //         view: null,
    //         params: {}
    //     };
    //     this.storeUnsubscribe = store.subscribe(() => {
    //         const state = store.getState();
    //         if (!state) {
    //             return;
    //         }
    //         const {
    //             app: {
    //                 runtime: { navigation }
    //             },
    //             auth: { userAuthorization }
    //         } = state;

    //         // This is a bit of a cheat.
    //         if (!userAuthorization) {
    //             return;
    //         }

    //         const view = navigation.view;
    //         const params = navigation.params as { [key: string]: string; };

    //         if (
    //             view !== lastNavigation.view ||
    //             lastNavigation.params === null ||
    //             Object.keys(params).some((key) => {
    //                 return params[key] !== lastNavigation.params[key];
    //             })
    //         ) {
    //             lastNavigation.params = params;
    //             lastNavigation.view = view;
    //             // TODO: store may change but there is not navigation yet.
    //             if (params['sampleId']) {
    //                 // TODO the new internal nav considers params to be query
    //                 // params only.
    //                 console.log('nav??', params);
    //                 const nav: Nav = {
    //                     path: [params['sampleId']],
    //                     params
    //                 };
    //                 store.dispatch(navigate(nav));
    //             }
    //         }
    //     });
    // }

    componentDidMount() {
        let lastNavigation: {
            view: string | null;
            params: { [key: string]: string; };
        } = {
            view: null,
            params: {}
        };
        this.storeUnsubscribe = store.subscribe(() => {
            const state = store.getState();
            if (!state) {
                return;
            }
            const {
                app: {
                    runtime: { navigation }
                },
                auth: { userAuthorization },

            } = state;

            // This is a bit of a cheat.
            if (!userAuthorization) {
                return;
            }

            const view = navigation.view;
            const params = navigation.params as { [key: string]: string; };

            if (
                view === lastNavigation.view &&
                lastNavigation.params === null &&
                !Object.keys(params).some((key) => {
                    return params[key] !== lastNavigation.params[key];
                })
            ) {
                return;
            }

            // Our cheap observables here... until we use react-observables or whatever.

            // SampleID
            // console.log('HERE', params)
            // console.log('  sampleId:', params['sampleId'], lastNavigation.params['sampleId']);
            // console.log('  sampleVersion:', params['sampleVersion'], lastNavigation.params['sampleVersion']);

            const newSampleId = params['sampleId'];
            const newSampleVersion = parseInt(params['sampleVersion']);
            const oldSampleId = lastNavigation.params['sampleId'];
            const oldSampleVersion = parseInt(lastNavigation.params['sampleVersion']);

            lastNavigation.params = params;
            lastNavigation.view = view;


            if ((newSampleId && newSampleId !== oldSampleId) ||
                (newSampleVersion && newSampleVersion !== oldSampleVersion)) {

                // Handle sample data loading and reloading
                const {
                    data: {
                        sample: sampleState
                    }
                } = state;
                switch (sampleState.status) {
                    case AsyncProcessStatus.NONE:
                        store.dispatch(getSample(newSampleId, newSampleVersion) as any);
                        break;
                    case AsyncProcessStatus.PROCESSING:
                        store.dispatch(getSample(newSampleId, newSampleVersion) as any);
                        break;
                    case AsyncProcessStatus.ERROR:
                        store.dispatch(getSample(newSampleId, newSampleVersion) as any);
                        break;
                    case AsyncProcessStatus.SUCCESS:
                        store.dispatch(getSample(newSampleId, newSampleVersion) as any)
                        break;
                    case AsyncProcessStatus.REPROCESSING:
                        store.dispatch(getSample(newSampleId, newSampleVersion) as any)
                        break;
                }

                // Handle linkedData
                const {
                    data: {
                        linkedData
                    }
                } = state;
                switch (linkedData.status) {
                    case AsyncProcessStatus.NONE:
                        // store.dispatch(getLinkedData(newSampleId, newSampleVersion) as any);
                        break;
                    case AsyncProcessStatus.PROCESSING:
                        // store.dispatch(getLinkedData(newSampleId, newSampleVersion) as any);
                        break;
                    case AsyncProcessStatus.ERROR:
                        store.dispatch(getLinkedData(newSampleId, newSampleVersion) as any);
                        break;
                    case AsyncProcessStatus.SUCCESS:
                        store.dispatch(getLinkedData(newSampleId, newSampleVersion) as any)
                        break;
                    case AsyncProcessStatus.REPROCESSING:
                        store.dispatch(getLinkedData(newSampleId, newSampleVersion) as any)
                        break;
                }

                // Handle linkedData
                const {
                    data: {
                        access
                    }
                } = state;
                switch (access.status) {
                    case AsyncProcessStatus.NONE:
                        // store.dispatch(getLinkedData(newSampleId, newSampleVersion) as any);
                        break;
                    case AsyncProcessStatus.PROCESSING:
                        // store.dispatch(getLinkedData(newSampleId, newSampleVersion) as any);
                        break;
                    case AsyncProcessStatus.ERROR:
                        store.dispatch(getAccess(newSampleId) as any);
                        break;
                    case AsyncProcessStatus.SUCCESS:
                        store.dispatch(getAccess(newSampleId) as any)
                        break;
                    case AsyncProcessStatus.REPROCESSING:
                        store.dispatch(getAccess(newSampleId) as any)
                        break;
                }

            }

            lastNavigation.params = params;
            lastNavigation.view = view;

            // And version

            // lastNavigation.params = params;
            // lastNavigation.view = view;
            // // TODO: store may change but there is not navigation yet.
            // if (params['sampleId']) {
            //     // TODO the new internal nav considers params to be query
            //     // params only.
            //     console.log('nav??', params);
            //     const nav: Nav = {
            //         path: [params['sampleId']],
            //         params
            //     };
            //     // store.dispatch(navigate(nav));
            // }
        });
    }

    componentWillUnmount() {
        if (this.storeUnsubscribe) {
            this.storeUnsubscribe();
        }
    }
}
