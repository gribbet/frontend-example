import * as Route from "route-parser";

import routes from "./routes";

export function reverse(
    route: string,
    parameters?: any) {

    return new Route(route).reverse(parameters);
}

export function route() {

    const route = Object.keys(routes)
        .map(_ => routes[_])
        .map(_ => ({
            action: _.action,
            parameters: new Route(_.route)
                .match(window.location.pathname)
        }))
        .find(_ => _.parameters !== false);
    if (route)
        route.action(route.parameters);
}