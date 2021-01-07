import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import { AppBase, AuthGate } from "@kbase/ui-components";
import "./App.css";
import Dispatcher from "./ui/dispatcher";
// import Navigation from "./navigation";
import { Unsubscribe } from "redux";
import { navigate } from "./redux/actions";
import { Nav } from "./redux/store/navigation";
// import devConfig from './devConfig.json';
import ErrorBoundary from "./components/ErrorBoundary";

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
                                <Dispatcher />
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
    componentDidMount() {
        let last: {
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
                auth: { userAuthorization }
            } = state;

            // This is a bit of a cheat.
            if (!userAuthorization) {
                return;
            }

            const view = navigation.view;
            const params = navigation.params as { [key: string]: string; };

            if (
                view !== last.view ||
                last.params === null ||
                Object.keys(params).some((key) => {
                    return params[key] !== last.params[key];
                })
            ) {
                last.params = params;
                last.view = view;
                // TODO: store may change but there is not navigation yet.
                if (params['sampleId']) {
                    // TODO the new internal nav considers params to be query
                    // params only.
                    const nav: Nav = {
                        path: [params['sampleId']],
                        params
                    };
                    store.dispatch(navigate(nav));
                    // store.dispatch(navigate(params['relationEngineID']) as any);
                }
            }
        });
    }

    componentWillUnmount() {
        if (this.storeUnsubscribe) {
            this.storeUnsubscribe();
        }
    }
}
