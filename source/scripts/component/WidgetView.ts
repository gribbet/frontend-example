import ClassToggler from "wedges/lib/component/ClassToggler";
import ClickHandler from "wedges/lib/component/ClickHandler";
import Container from "wedges/lib/component/Container";
import Label from "wedges/lib/component/Label";
import Selector from "wedges/lib/component/Selector";

import { application, widgetService } from "..";
import Widget from "../model/Widget";

export default class WidgetView extends Container {

    constructor(
        widget: Widget,
        events: {
            onEdit: () => void,
            onDelete: () => void
        }
    ) {
        let selected = false;

        super([
            new ClickHandler(() =>
                application.update(() =>
                    selected = !selected)),
            new ClassToggler("selected", () => selected),
            new Selector(".id", new Label(() => (widget.id || 0).toString())),
            new Selector(".updated", new Label(() => widget.updated.toLocaleTimeString())),
            new Selector(".name", new Label(() => widget.name)),
            new Selector(".edit", new ClickHandler(() =>
                events.onEdit())),
            new Selector(".delete", new ClickHandler(async () => {
                await widgetService.delete(widget.id);
                events.onDelete();
            }))
        ])
    }
}