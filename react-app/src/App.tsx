import React from "react";
import { Provider } from "react-redux";
import { ErrorBoundary } from "@kbase/ui-components";
import store from "./redux/store";
import { AppBase, AuthGate } from "@kbase/ui-components";
import "./App.css";
import {
    HashRouter,
    Switch,
    Route
} from "react-router-dom";
import About from "views/About";
import Help from "views/Help";
import View from "views/View";
import NotFound from "views/NotFound";

interface AppProps { }
interface AppState { }

export default class App<AppProps, AppState> extends React.Component {
    render() {
        return (
            <HashRouter>
                <ErrorBoundary>
                    <Provider store={store}>
                        <AppBase>
                            <AuthGate required={true}>
                                <div className="App">
                                    <Switch>
                                        <Route path="/samples/about" children={About} />
                                        <Route path="/samples/help" children={Help} />
                                        <Route path="/samples/view/:id/:version?" children={View} />
                                        <Route children={NotFound} exact={true} />
                                    </Switch>
                                </div>
                            </AuthGate>
                        </AppBase>
                    </Provider>
                </ErrorBoundary>
            </HashRouter>
        );
    }

    setupNavDev() {
    }

    setupNavProd() {
    }
}
