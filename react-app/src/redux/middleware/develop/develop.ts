import { StoreState } from "redux/store";
import RequestFetcher from "./Request";
import { DevelopActionType } from '@kbase/ui-components/lib/redux/develop/actions';
import { AsyncProxyFun } from "@kbase/ui-components/lib/redux/middleware/AsyncProxy";
import { navigate } from "@kbase/ui-components/lib/redux/integration/actions";
import { AnyAction, Dispatch } from "redux";
import { Router, RouteConfig } from "./Router";
import { routeConfigToSpec } from "./RouteConfig";

const routes: Array<RouteConfig> = [
    {
        path: "samples/view/:sampleId/:-sampleVersion",
        view: 'view'
    },
    {
        path: 'samples/about',
        view: 'about'
    },
    {
        path: 'samples/help',
        view: 'help'
    }
];
const router = new Router();

const routeSpecs = routes.map(routeConfigToSpec);
routeSpecs.forEach((routeSpec) => {
    router.addRoute(routeSpec);
});
// return <Navigation routes={routeSpecs}>
//     {this.renderRouting()}
// </Navigation>;


function navigateWithHash(dispatch: Dispatch<AnyAction>) {
    const request = new RequestFetcher().getHashRequest();
    const { route, params } = router.findRoute(request);
    console.log('[navigateWithHash]', route.view, params);
    dispatch(navigate({
        view: route.view,
        params
    }));
}

function setupHashListener(dispatch: Dispatch<AnyAction>) {
    // Navigate on change of the hash
    window.addEventListener('hashchange', (ev: HashChangeEvent) => {
        const url = new URL(ev.newURL);
        const hash = url.hash;
        if (!hash) {
            throw new Error('no hash!');
        }
        navigateWithHash(dispatch);
    });

    // First time here, we also want to navigate based on the
    // hash, or if empty (the default when a dev session starts)
    // use some default interesting taxon id.

    // don't do initial nav for now
    // return;

    const hash = window.location.hash;
    // TODO: a default hash/route here?
    if (!hash) {
        throw new Error('no hash!');
    }

    navigateWithHash(dispatch);
}

// FOR NOW: just intercept the start action, don't take over.
// const developFun: Middleware<
//     {}, // Most middleware do not modify the dispatch return value
//     StoreState
// > = (storeApi) =>
//         (next) =>
//             (action) => {
//                 if (action.type !== DevelopActionType.DEVELOP_START) {
//                     return false;
//                 }
//                 console.log("DEVELOP ACTION", action);
//                 return next(action);
//             };


const developFun: AsyncProxyFun<StoreState> = async (
    { state, dispatch, action, next },
) => {
    if (action.type !== DevelopActionType.DEVELOP_START) {
        return false;
    }
    console.log("DEVELOP ACTION", action);

    setupHashListener(dispatch);

    return next(action);
};

export default developFun;
