import AsyncKeyedRepeater from "wedges/lib/component/AsyncKeyedRepeater";
import ClickHandler from "wedges/lib/component/ClickHandler";
import Container from "wedges/lib/component/Container";
import Selector from "wedges/lib/component/Selector";
import Template from "wedges/lib/component/Template";

import { application, widgetService } from "..";
import Widget, { WidgetId } from "./../model/Widget";
import WidgetIdView from "./WidgetIdView";

declare var require: (path: string) => string;

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
                new AsyncKeyedRepeater<WidgetId>(
                    () =>
                        this.widgetIds =
                        this.widgetIds
                        || widgetService.listIds(),
                    id => new WidgetIdView(id, {
                        onEdit: events.onEdit,
                        onDelete: () =>
                            application.update(() =>
                                this.reset())
                    })))
        ]);
    }

    private widgetIds: Promise<WidgetId[]> | null = null;

    reset() {
        this.widgetIds = null;
    }
}