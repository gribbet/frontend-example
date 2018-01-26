import Widget from "../../model/Widget";
import { WidgetId } from "../../model/Widget";
import MockModelService from "./MockModelService";

export default class MockWidgetService
    extends MockModelService<WidgetId, Widget> {

    constructor() {
        super();

        const names = new Array(10)
            .fill(0)
            .map((_, i) =>
                Math.random().toString(36).substring(2, 15))

        names.forEach(name => {
            const widget = new Widget();
            widget.name = name;
            this.save(widget);
        });
    }

    newId(): WidgetId {
        return <WidgetId>(Math.max(...this.models.map(_ => <number>_.id || 0), 0) + 1);
    }

    async save(widget: Widget) {
        if (widget.id === null)
            widget.created = new Date();
        widget.updated = new Date();
        return await super.save(widget);
    }
}