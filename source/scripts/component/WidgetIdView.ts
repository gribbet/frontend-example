import Component from "wedges/lib/Component";
import Builder from "wedges/lib/component/Builder";

import { widgetService } from "..";
import Widget, { WidgetId } from "../model/Widget";
import WidgetView from "./WidgetView";

export default class WidgetIdView extends Builder {

    constructor(
        id: WidgetId,
        events: {
            onEdit: (widget: Widget) => void,
            onDelete: () => void
        }
    ) {
        super(widgetService.find(id)
            .then(widget =>
                widget === null
                    ? new Component()
                    : new WidgetView(widget, {
                        onEdit: () => events.onEdit(widget),
                        onDelete: events.onDelete
                    })));
    }
}