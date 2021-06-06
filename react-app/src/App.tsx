import React from "react";
import {Provider} from "react-redux";
import {ErrorBoundary} from "@kbase/ui-components";
import store from "./redux/store";
import {AppBase, AuthGate} from "@kbase/ui-components";
import "./App.less";
import {
    HashRouter,
    Switch,
    Route
} from "react-router-dom";
import About from "views/About";
import Help from "views/Help";
import View from "views/View";
import NotFound from "views/NotFound";
import {Span} from "lib/instrumentation/core";
import {Instrument} from "lib/instrumentation/wrapper";

interface AppProps {
}

interface AppState {
}

export default class App<AppProps, AppState> extends React.Component {
    span: Span;

    constructor(props: AppProps) {
        super(props);
        this.span = new Span({name: 'App'}).begin();
    }

    render() {
        this.span.event('rendering');
        return (
            <HashRouter>
                <ErrorBoundary>
                    <Provider store={store}>
                        <AppBase>
                            <AuthGate required={true}>
                                <div className="App">
                                    <Switch>
                                        <Route path="/samples/about"
                                               component={Instrument(About, 'View.About', 'app')}/>
                                        <Route path="/samples/help" component={Instrument(Help, 'View.Help', 'app')}/>
                                        <Route path="/samples/view/:id/:version?"
                                               component={Instrument(View, 'View.View', 'app')}/>
                                        <Route component={Instrument(NotFound, 'View.NotFound', 'app')} exact={true}/>
                                    </Switch>
                                </div>
                            </AuthGate>
                        </AppBase>
                    </Provider>
                </ErrorBoundary>
            </HashRouter>
        );
    }

    componentWillUnmount() {
        this.span.end();
    }

}
