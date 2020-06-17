
export interface NavLocation {
    path: Path;
    external?: boolean;
    replace?: boolean;
    params?: Params;
}

export interface Params {
    // rest: Array<string>;
    [key: string]: string;
}

export type PathElement = string;

export type Path = Array<PathElement>;

export interface Request {
    original: string;
    path: Path;
    query: Query;
}

export interface NotFoundExceptionParams {
    original: string;
    path: string;
    params: Params;
    request: Request;
    message: string;
}

export class NotFoundException extends Error {
    original: string;
    path: string;
    params: Params;
    request: Request;
    constructor({ original, path, params, request, message }: NotFoundExceptionParams) {
        super(message);
        this.original = original;
        this.path = path;
        this.params = params;
        this.request = request;
    }
}
// function NotFoundException(request) {
//     this.name = 'NotFoundException';
//     this.original = request.original;
//     this.path = request.path;
//     this.params = request.params;
//     this.request = request.request;
// }
// NotFoundException.prototype = Object.create(Error.prototype);
// NotFoundException.prototype.constructor = NotFoundException;

export interface Query {
    [key: string]: string;
}

function parseQueryString(queryString: string): Query {
    const fields = queryString.split(/[?&]/);
    const params: Query = {};
    fields.forEach((field) => {
        if (field.length > 0) {
            const [key, value] = field.split('=');
            if (key.length > 0) {
                params[decodeURIComponent(key)] = decodeURIComponent(value);
            }
        }
    });
    return params;
}

function paramsToQueryString(params: Params): string {
    return Object.keys(params)
        .map((key) => {
            return key + '=' + encodeURIComponent(params[key]);
        })
        .join('&');
}

function getQuery(): Query {
    const query = window.location.search;
    if (!query || query.length === 1) {
        return {};
    }
    return parseQueryString(query.substr(1));
}

export interface RouterConfig {
    defaultRoute?: RouteSpec;
}

// export interface Route {

// }

// export interface PathElement {
//     type: 'literal' | 'param' | 'regexp' | 'rest';
//     name: string;

//     optional?: boolean;
// }

export interface PathElementSpecBase {
    type: 'literal' | 'param' | 'rest';
    optional?: boolean;
}

export interface PathElementLiteralSpec extends PathElementSpecBase {
    type: 'literal';
    value: string;
}

export interface PathElementParamSpec extends PathElementSpecBase {
    type: 'param';
    name: string;
}

export interface PathElementRestSpec extends PathElementSpecBase {
    type: 'rest';
    name: string;
    value: Array<string>;
}

export type PathElementSpec = PathElementLiteralSpec | PathElementParamSpec | PathElementRestSpec;

// export interface RawRouteSpec {
//     path: Array<PathElement | string>;
//     captureExtraPath?: boolean;
//     captureExtraQuery?: boolean;
// }

export type PathSpec = Array<PathElementSpec>;

export interface QueryFieldSpecBase {
    type: 'literal' | 'param';
}

export interface QueryFieldSpecLiteral {
    type: 'literal',
    value: string;
}

export interface QueryFieldSpecParam {
    type: 'param',
    optional?: boolean;
}

export type QueryFieldSpec = QueryFieldSpecLiteral | QueryFieldSpecParam;

export interface QuerySpec {
    [key: string]: QueryFieldSpec;
}

export interface ParamsSpec {
    [key: string]: string;
}

export interface RouteSpec {
    path: PathSpec;
    captureExtraPath?: boolean;
    captureExtraSearch?: boolean;
    queryParams?: QuerySpec;
    params?: ParamsSpec;
}

export class Router {
    routes: Array<RouteSpec>;
    defaultRoute?: RouteSpec;
    constructor(config?: RouterConfig) {
        // if (!config.defaultRoute) {
        //     throw new Error('The defaultRoute must be provided');
        // }
        // Routing
        this.routes = [];
        if (config) {
            this.defaultRoute = config.defaultRoute;
        }

    }

    addRoute(routeSpec: RouteSpec) {
        /*
         * The path spec is an array of elements. Each element is either a
         * string, in which case it is a literal path component,
         * regular expression, which case it is matched on a path component,
         * object with type:param
         */
        /* TODO: do something on overlapping routes */
        /* TODO: better mapping method for routes. */
        /* still, with a relatively short list of routes, this is far from a performance issue. */

        // fix up the path. This business is to make it easier to have
        // compact path specifications.
        // let rawPath = rawRouteSpec.path;
        // if (typeof rawPath === 'string') {
        //     rawPath: Array< = rawPath.split('/');
        // }
        // if (!path) {
        //     console.warn('missing path??', rawRouteSpec);
        // }

        // const path: Array<PathElement> = [];

        // Fix up the route spec???
        // RouteSpec.path = path.map((pathElement) => {
        //     // The default path element, represented by a simple string,
        //     // is a literal, matched by its value.
        //     if (typeof pathElement === 'string') {
        //         return {
        //             type: 'literal',
        //             value: pathElement
        //         };
        //     }
        //     // Otherwise, the path element is represented as a simple
        //     // object, with property 'type' one of: _____
        //     // TODO: complete this doc
        //     if (typeof pathElement === 'object') {
        //         // TODO: find instances of this and restore if need be.
        //         // if (pathElement instanceof Array) {
        //         //     return {
        //         //         type: 'options',
        //         //         value: pathElement
        //         //     };
        //         // }
        //         if (!pathElement.type) {
        //             pathElement.type = 'param';
        //         }
        //         return pathElement;
        //     }
        //     throw new Error('Unsupported route path element');
        // });

        // const routeSpec: RouteSpec {

        // }

        this.routes.push(routeSpec);
    }

    getCurrentRequest(): Request {
        let query2: Query = {};

        // Also get the query the normal way ...
        const query = getQuery();

        // Handle top level window and iframe.
        let global;
        if (window.parent) {
            global = window.parent;
        } else {
            global = window;
        }

        if (!global.location.hash || global.location.hash.length <= 1) {
            // TODO: need to use a default path??
            throw new Error('no request');
        }

        // The path is (for now) from the hash component.
        const hash = window.location.hash.substr(1);
        const pathQuery = hash.split('?', 2);

        if (pathQuery.length === 2) {
            query2 = parseQueryString(pathQuery[1]);
            Object.keys(query2).forEach((key) => {
                query[key] = query2[key];
            });
        }
        const path = pathQuery[0]
            .split('/')
            .filter((pathComponent) => {
                return pathComponent.length > 0;
            })
            .map((pathComponent) => {
                return decodeURIComponent(pathComponent);
            });
        return {
            original: hash,
            path,
            query
        };

    }

    matchPath(path: Array<string>, route: RouteSpec) {
        // Match the path.
        // Walk through the path, for each path element:
        // - if no more route path elements, and "captureExtraPath" is set,
        //   and the last path element is of type "rest", put the rest of
        //   the request path into the special "rest" parameter.
        // - process parameter based on the type.
        const params: Params = {};
        matchloop: for (let j = 0; j < path.length; j += 1) {
            const routePathElement = route.path[j];
            const requestPathElement = path[j];
            if (!routePathElement) {
                // end of the route path.
                if (route.captureExtraPath) {
                    // TODO: had to convert this back to string for now -- nicer typing
                    params.rest = path.slice(j - 1).join('/');
                    break;
                }
            }

            switch (routePathElement.type) {
                case 'literal':
                    // current path element must match current route element
                    if (routePathElement.value !== requestPathElement) {
                        return;
                    }
                    break;
                // TODO: removed for now -- restore?
                // case 'options':
                //     // current path element must match at least one of the
                //     // route elements in the "value" property (array).
                //     if (
                //         !routePathElement.value.some((option) => {
                //             if (requestPathElement === option) {
                //                 return true;
                //             }
                //         })
                //     ) {
                //         return;
                //     }
                //     break;
                case 'param':
                    // current path element is not compared, it is considered
                    // a positive match, and is stored in the params  map
                    // under the name of the route elements 'name' property.
                    params[routePathElement.name] = requestPathElement;
                    break;
                // TODO: disable regexp - restore later ??
                // case 'regexp':
                //     // current path element is matched against a regular expression
                //     // defined by the current route element.
                //     try {
                //         const regexp = new RegExp(routePathElement.regexp);
                //         if (!regexp.test(requestPathElement)) {
                //             return;
                //         }
                //     } catch (ex) {
                //         console.warn('invalid route with regexp element', ex);
                //         return;
                //     }
                //     break;
                case 'rest':
                    // unconditionally matches the rest of the request path, storing it
                    // as an array in a parameter named  by the 'name' property, or
                    // if this is missing or falsy, 'rest'.
                    var name = routePathElement.name || 'rest';
                    if (j < route.path.length - 1) {
                        console.warn('rest parameter used before final route element');
                        console.warn('  being treated as regular param');
                        params[name] = requestPathElement;
                        continue;
                    }

                    // if (routePathElement.joinWith) {
                    //     params[name] = path.slice(j).join(routePathElement.joinWith);
                    // } else {
                    //     params[name] = path.slice(j);
                    // }

                    // TODO: should we join this, or leave as array? Easier to join for now
                    // to make typing easier...
                    params[name] = path.slice(j).join('/');

                    break matchloop;
                default:
                    // If the path element is not well formed (not a recognized type)
                    // just skip it with a warning.
                    console.warn('invalid route: type not recognized', routePathElement);
                    return;
            }
        }
        return params;
    }

    processPath(path: Path) {
        let route: RouteSpec;
        for (let i = 0; i < this.routes.length; i += 1) {
            route = this.routes[i];

            const isRest = route.path[route.path.length - 1].type === 'rest';
            if (route.path.length > path.length) {
                // We can only match on a path shorter than the route path if:
                // - all params after the route path after the end of the current path are optional
                // - the route has the flag "captureExtraPath"
                // - the route has a final path element defined as type "rest"
                const isAllOptional = route.path.slice(path.length)
                    .every((routePathElement) => {
                        return routePathElement.optional;
                    });
                if (!(isAllOptional || route.captureExtraPath || isRest)) {
                    continue;
                }
            } else if (route.path.length < path.length) {
                // A longer path may match if either the route can automatically
                // capture the rest of the path or the last component is of type 'rest'
                // TODO: use one or the other, not both!
                if (!(route.captureExtraPath || isRest)) {
                    continue;
                }
            }

            const params = this.matchPath(path, route);

            if (params) {
                return { route, params };
            }
        }
        return null;
    }

    processQuery(route: RouteSpec, query: Query) {
        // Now process any query parameters.
        // Query params are not used for route selection, but are used
        // to populate the params object.
        // Only query params provided in the route will be extracted and
        // placed into the params.

        const params: Params = {};

        // The total params is the path params and query params
        const searchParamKeys = Object.keys(query);
        const queryParamsSpec = route.queryParams || {};

        // Use the query params spec in the route first. This picks up
        // literals, and also enables the strict query param protocol in
        // which only defined query params are recognized.
        // The captureExtraSearch route flag disables the latter behavior.
        // All undefined query params are simply copied to the req.query.
        Object.keys(queryParamsSpec).forEach((key) => {
            const paramSpec = queryParamsSpec[key];
            // This allows for supplying a param
            // from the config.
            // TODO: improve this, and add support for query param specs
            //       e.g. type coercion.
            if (paramSpec.type === 'literal') {
                // A query param can also be specified as a
                // literal value, in which case the value from the spec
                // is placed into the params.
                params[key] = paramSpec.value;
            } else if (typeof query[key] !== 'undefined') {
                // Defaults to simply using the query value if it is found.
                params[key] = query[key];
            } else {
                return;
            }
            // delete searchParamKeys[key];
        });
        if (route.captureExtraSearch) {
            searchParamKeys.forEach((key) => {
                params[key] = query[key];
            });
        }
        return params;
    }

    findRoute(request: Request) {
        // No route at all? Return the default route.
        if (request.path.length === 0 && Object.keys(request.query).length === 0) {
            throw new Error('No route!');
            // return {
            //     request,
            //     params: {},
            //     route: this.defaultRoute
            // };
        }

        const foundRoute = this.processPath(request.path);

        console.log('found route', foundRoute);

        if (!foundRoute) {
            throw new NotFoundException({
                request,
                params: {},
                original: request.original,
                path: request.path.join('/'),
                message: 'Not found'
            });
        }

        const queryParams = this.processQuery(foundRoute.route, request.query);
        if (queryParams) {
            Object.assign(foundRoute.params, queryParams);
        }

        // Now we handle fixed params; this operate a bit like props. They are specified
        // in the route config, and simply amend the props passed to the widget.
        // This provides a mechanism for the plugin to directly pass params to the route's
        // widget.
        if (foundRoute.route.params) {
            Object.assign(foundRoute.params, foundRoute.route.params);
        }

        return {
            ...foundRoute,
            request
        };

        // foundRoute.request = request;

        // console.log('FOUND ROUTE', foundRoute);
        // return foundRoute;
    }

    findCurrentRoute() {
        const req = this.getCurrentRequest();
        console.log('req', req);
        return this.findRoute(req);
    }

    listRoutes() {
        return this.routes.map((route) => {
            return route.path;
        });
    }

    navigateTo(location: NavLocation) {
        let queryString, finalPath;
        // if (typeof location.path === 'string') {
        //     providedPath = location.path.split('/');
        // } else if (typeof location.path === 'object' && typeof location.path.push === 'function') {
        //     providedPath = location.path;
        // } else {
        //     console.error(
        //         'Invalid path in location',
        //         typeof location.path,
        //         location.path instanceof Array,
        //         JSON.parse(JSON.stringify(location))
        //     );
        //     throw new Error('Invalid path in location');
        // }
        // we eliminate empty path components, like extra slashes, or an initial slash.
        const normalizedPath = location.path
            .filter((element) => {
                if (!element || typeof element !== 'string') {
                    return false;
                }
                return true;
            })
            .join('/');
        if (location.params) {
            queryString = paramsToQueryString(location.params);
        }

        // // Oops, may be provided as "query" property
        // if (location.query) {
        //     queryString = paramsToQueryString(location.query);
        // }
        if (queryString) {
            finalPath = normalizedPath + '?' + queryString;
        } else {
            finalPath = normalizedPath;
        }
        if (location.external) {
            finalPath = '/' + finalPath;
            if (location.replace) {
                this.replacePath(finalPath);
            } else {
                // We need to blow away the whole thing, since there will
                // be a hash there.
                window.location.href = finalPath;
            }
        } else {
            if (location.replace) {
                this.replacePath('#' + finalPath);
            } else {
                // if (location.urlPath) {
                //     const url = new URL(window.location.toString());
                //     url.hash = '#' + finalPath;
                //     url.pathname = location.urlPath;
                //     window.location.assign(url.toString());
                // } else {

                const url = new URL(window.location.toString());
                url.hash = '#' + finalPath;
                url.pathname = '';
                window.location.assign(url.toString());
                // window.location.hash = '#' + finalPath;
                // }
            }
        }
    }

    // navigateTo(location: NavLocation) {
    //     //if (window.history.pushState) {
    //     //    window.history.pushState(null, '', '#' + location);
    //     //} else {
    //     // if (!location) {
    //     //     location = this.defaultRoute.;
    //     // }
    //     // if (typeof location === 'string') {
    //     //     location = { path: location };
    //     // }

    //     // if (location.path !== undefined) {
    //     //     this.navigateToPath(location);
    //     // } else if (typeof location.redirect === 'string') {
    //     //     this.redirectTo(location.redirect);
    //     // } else {
    //     //     throw new Error('Invalid navigation location -- no path');
    //     // }

    //     if (location.)
    // }

    replacePath(location: string) {
        window.location.replace(location);
    }

    redirectTo(location: string, newWindow: boolean) {
        if (newWindow) {
            window.open(location);
        } else {
            window.location.replace(location);
        }
    }
}

