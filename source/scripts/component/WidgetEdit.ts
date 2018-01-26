import Container from "wedges/lib/component/Container";
import EventHandler from "wedges/lib/component/EventHandler";
import InputHandler from "wedges/lib/component/InputHandler";
import Remover from "wedges/lib/component/Remover";
import Selector from "wedges/lib/component/Selector";
import Template from "wedges/lib/component/Template";

import { widgetService } from "..";
import Widget from "../model/Widget";
import { Focuser } from "./Focuser";

declare var require: (path: string) => string;

export default class WidgetEdit extends Container {

    constructor(
        widget: Widget,
        events: {
            onSave: () => void
        }
    ) {
        super([
            new Template(require("../../templates/widget-edit.pug")),
            new Selector("form",
                new Container([
                    new EventHandler("submit", async event => {
                        event.preventDefault();
                        await widgetService.save(widget);
                        events.onSave();
                    }),
                    new Selector(".id",
                        new Container([
                            new Remover(() => widget.id === null),
                            new Selector("input",
                                new InputHandler(
                                    () => (widget.id || 0).toString(),
                                    _ => undefined))
                        ])),
                    new Selector(".name input",
                        new Container([
                            new Focuser(),
                            new InputHandler(
                                () => widget.name,
                                name => widget.name = name)
                        ]))
                ]))
        ])
    }
}