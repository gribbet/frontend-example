import Application from "wedges/lib/Application";

import Example from "./component/Example";
import { route } from "./routing";
import MockWidgetService from "./service/mock/MockWidgetService";


export const widgetService = new MockWidgetService();

export const example = new Example();

export const application = new Application(
    example,
    document.body);

application.start();

route();
window.addEventListener("popstate", () =>
    route());