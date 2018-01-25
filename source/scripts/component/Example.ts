import Component from "wedges/lib/Component";
import Container from "wedges/lib/component/Container";
import Selector from "wedges/lib/component/Selector";
import Styler from "wedges/lib/component/Styler";
import Template from "wedges/lib/component/Template";
import Updater from "wedges/lib/component/Updater";

import { application, widgetService } from "..";
import Widget from "../model/Widget";
import routes from "../routes";
import { reverse } from "../routing";
import NotFound from "./NotFound";
import WidgetEdit from "./WidgetEdit";
import WidgetList from "./WidgetList";

declare var require: (path: string) => string;

export default class Example extends Container {

    constructor() {
        super([
            new Template(require("../../templates/example.pug")),
            new Styler(require("../../styles/example.pcss")),
            new Selector(".container",
                new Updater(() => this.active)),
        ]);
    }

    private active: Component | null = null;
    private cachedWidgetList: WidgetList | null;

    widgetList() {
        return this.activate(() => {
            this.navigate(
                "Widgets",
                reverse(routes.widgetList.route));
            const widgetList: WidgetList
                = this.cachedWidgetList
                = this.cachedWidgetList
                || new WidgetList({
                    onNew: () =>
                        this.widgetNew(),
                    onEdit: widget =>
                        this.widgetEdit(widget)
                });
            widgetList.reset();
            return widgetList;
        });
    }

    async widgetEditId(id: number) {
        const widget = await widgetService.find(id);
        if (widget === null)
            return this.notFound();
        return this.widgetEdit(widget);
    }

    widgetNew(): Promise<void> {
        return this.activate(() => {
            this.navigate(
                "New widget",
                reverse(routes.widgetNew.route));
            return new WidgetEdit(new Widget(), {
                onSave: () => this.widgetList()
            });
        });
    }

    widgetEdit(widget: Widget) {
        return this.activate(() => {
            this.navigate(
                `Edit Widget ${widget.id}`,
                reverse(routes.widgetEdit.route, {
                    id: widget.id
                }));
            return new WidgetEdit(widget, {
                onSave: () => this.widgetList()
            });
        });
    }

    notFound() {
        return this.activate(() => {
            this.navigate(
                "Not Found",
                window.location.pathname);
            return new NotFound()
        });
    }

    private async activate(component: () => Component) {
        await application.update(() =>
            this.active = component());
    }

    private navigate(title: string, path: string | false) {
        if (window.location.pathname !== path && path != false)
            window.history.pushState({}, title, path);
        else
            window.history.replaceState({}, title);
    }
}