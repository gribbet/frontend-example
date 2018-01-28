import ClassToggler from "wedges/lib/component/ClassToggler";
import ClickHandler from "wedges/lib/component/ClickHandler";
import Container from "wedges/lib/component/Container";
import Label from "wedges/lib/component/Label";
import Selector from "wedges/lib/component/Selector";
import Template from "wedges/lib/component/Template";

import { application, widgetService } from "..";
import Widget from "./../model/Widget";
import DataTable, { Column } from "./DataTable";
import Pagination from "./Pagination";

declare var require: (path: string) => string;

const perPage = 5;

class PropertyColumn<T> implements Column<T> {
    constructor(
        private displayName: string,
        private getter: (row: T) => string) { }
    header = new Container([
        new Label(() => this.displayName),
        new ClassToggler("header"),
        new ClassToggler(this.displayName.toLowerCase())
    ]);
    cell = (row: T) => new Container([
        new Label(() => this.getter(row)),
        new ClassToggler(this.displayName.toLowerCase(), () => true)
    ]);
}

class ButtonsColumn<T> implements Column<T> {

    constructor(
        private onEdit: (row: T) => void,
        private onDelete: (row: T) => void
    ) { }

    header = new Container([
        new ClassToggler("header"),
        new ClassToggler("buttons")
    ]);

    cell = (row: T) => new Container([
        new Template(require("../../templates/buttons-column.pug")),
        new ClassToggler("buttons", () => true),
        new Selector(".edit",
            new ClickHandler(() => this.onEdit(row))),
        new Selector(".delete",
            new ClickHandler(() => this.onDelete(row)))
    ]);
}

export default class WidgetList extends Container {

    constructor(
        events: {
            onNew: () => void,
            onEdit: (widget: Widget) => void
        }
    ) {
        super([
            new Template(require("../../templates/widget-list.pug")),
            new Selector(".new",
                new ClickHandler(() => events.onNew())),
            new Selector(".widgets",
                new DataTable<Widget>(
                    () => this.widgets || [], [
                        new PropertyColumn<Widget>(
                            "ID",
                            widget => (widget.id || 0).toString()),
                        new PropertyColumn<Widget>(
                            "Name",
                            widget => widget.name),
                        new PropertyColumn<Widget>(
                            "Updated",
                            widget => widget.updated.toLocaleTimeString()),
                        new ButtonsColumn<Widget>(
                            widget => events.onEdit(widget),
                            async  widget => {
                                await widgetService.delete(widget.id);
                                await application.update(() => this.reset());
                            })
                    ])),
            new Selector(".pagination",
                new Pagination(
                    () => this.page,
                    () => Math.ceil((this.count || 0) / perPage),
                    page =>
                        application.update(() => {
                            this.page = page;
                            this.reset();
                        })))
        ]);
    }

    private page = 0;
    private widgets: Widget[] | null = null;
    private count: number | null = null;

    async load() {
        this.count = this.count
            || await widgetService.count();
        if (this.page * perPage >= this.count)
            this.page = Math.floor((this.count - 1) / perPage);
        this.widgets = this.widgets
            || await widgetService.list(perPage, this.page * perPage);
        await super.load();
    }

    async reset() {
        this.widgets = null;
        this.count = null;
    }
}