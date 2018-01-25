import { example } from ".";

const routes: RouteList = {
    widgetList: {
        route: "/",
        action: () => example.widgetList()
    },
    widgetNew: {
        route: "/widgets/new",
        action: () => example.widgetNew()
    },
    widgetEdit: {
        route: "/widgets/:id",
        action: (parameters) =>
            example.widgetEditId(parseInt(parameters.id))
    },
    notFound: {
        route: "*x",
        action: () => example.notFound()
    }
};

type RouteList = {
    [name: string]: {
        route: string;
        action: (parameters?: any) => void;
    }
};

export default routes; 