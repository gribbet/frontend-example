import ClickHandler from "wedges/lib/component/ClickHandler";
import Container from "wedges/lib/component/Container";
import Selector from "wedges/lib/component/Selector";
import Template from "wedges/lib/component/Template";

import { application, widgetService } from "..";
import { idSort, updatedSort } from "../model/Model";
import Widget, { nameSort, WidgetId, WidgetSort } from "../model/Widget";
import ButtonsColumn from "./table/ButtonsColumn";
import ModelTable from "./table/ModelTable";
import { SortablePropertyColumn } from "./table/SortablePropertyColumn";

declare var require: (path: string) => string;

export default class WidgetList extends Container {

    constructor(
        events: {
            onNew: () => void,
            onEdit: (model: Widget) => void
        }) {
        const table =
            new ModelTable(widgetService, [
                new SortablePropertyColumn(
                    "ID",
                    idSort,
                    _ => (_.id || 0).toString(),
                    () => this.table),
                new SortablePropertyColumn(
                    "Name",
                    nameSort,
                    _ => _.name,
                    () => this.table),
                new SortablePropertyColumn(
                    "Updated",
                    updatedSort,
                    _ => _.updated.toLocaleTimeString(),
                    () => this.table),
                new ButtonsColumn(
                    widget => events.onEdit(widget),
                    async widget => {
                        if (widget.id !== null)
                            await widgetService.delete(widget.id);
                        await application.update(() => this.reset())
                    })
            ]);
        super([
            new Template(require("../../templates/widget-list.pug")),
            new Selector(".new",
                new ClickHandler(() => events.onNew())),
            new Selector(".model-table", table)
        ]);
        this.table = table;
    }

    private table: ModelTable<WidgetId, Widget, WidgetSort>;

    reset() {
        this.table.reset();
    }
}

