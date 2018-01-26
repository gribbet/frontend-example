import ClickHandler from "wedges/lib/component/ClickHandler";
import Container from "wedges/lib/component/Container";
import KeyedRepeater from "wedges/lib/component/KeyedRepeater";
import Selector from "wedges/lib/component/Selector";
import Template from "wedges/lib/component/Template";

import { application, widgetService } from "..";
import Widget, { WidgetId } from "./../model/Widget";
import Pagination from "./Pagination";
import WidgetIdView from "./WidgetIdView";

declare var require: (path: string) => string;

const perPage = 5;

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
                new KeyedRepeater<WidgetId>(
                    () => this.widgetIds || [],
                    id => new WidgetIdView(id, {
                        onEdit: events.onEdit,
                        onDelete: () =>
                            application.update(() => this.reset())
                    }))),
            new Selector(".pagination",
                new Pagination(
                    () => this.page,
                    () => Math.ceil((this.count || 0) / perPage),
                    page => {
                        this.page = page;
                        application.update(() => this.reset());
                    }))
        ]);
    }

    private page = 0;
    private widgetIds: WidgetId[] | null = null;
    private count: number | null = null;

    async load() {
        this.count = this.count
            || await widgetService.count();
        if (this.page * perPage >= this.count)
            this.page = 0;
        this.widgetIds = this.widgetIds
            || await widgetService.listIds(perPage, this.page * perPage);
        await super.load();
    }

    async reset() {
        this.widgetIds = null;
        this.count = null;
    }
}