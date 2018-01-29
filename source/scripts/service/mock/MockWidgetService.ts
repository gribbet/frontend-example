import { idSort } from "../../model/Model";
import Widget, { nameSort, WidgetId, WidgetSort } from "../../model/Widget";
import MockModelService from "./MockModelService";

export default class MockWidgetService
    extends MockModelService<WidgetId, Widget, WidgetSort> {

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

    protected newId(): WidgetId {
        return <WidgetId>(Math.max(...this.models.map(_ => <number>_.id || 0), 0) + 1);
    }

    protected comparator(sort: WidgetSort) {
        if (sort === nameSort)
            return (a: Widget, b: Widget) => a.name.localeCompare(b.name);
        if (sort === idSort)
            return (a: Widget, b: Widget) => (<number>a.id || 0) - (<number>b.id || 0);
        return super.comparator(sort);
    }

    async save(widget: Widget) {
        return await super.save(widget);
    }
}