import ClassToggler from "wedges/lib/component/ClassToggler";
import ClickHandler from "wedges/lib/component/ClickHandler";
import Container from "wedges/lib/component/Container";
import Label from "wedges/lib/component/Label";
import Selector from "wedges/lib/component/Selector";
import Template from "wedges/lib/component/Template";

import { application } from "..";
import Model_, { idSort, ModelSort } from "../model/Model";
import ModelService from "../service/ModelService";
import DataTable, { Column } from "./DataTable";
import Pagination from "./Pagination";

declare var require: (path: string) => string;

const perPage = 5;

export class PropertyColumn<T> implements Column<T> {
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

export class SortablePropertyColumn<
    Id,
    Model extends Model_<Id>,
    Sort extends ModelSort = ModelSort
    > extends PropertyColumn<Model> {

    constructor(
        displayName: string,
        sort: Sort,
        getter: (model: Model) => string,
        private list: () => ModelList<Id, Model, Sort>
    ) {
        super(displayName, getter);
        this.header = new Container([
            new ClassToggler("header"),
            new ClassToggler(displayName.toLowerCase()),
            new ClassToggler("active", () =>
                list().sort === sort),
            new ClassToggler("reverse", () =>
                list().sort === sort && list().reverse),
            new Template("<button />"),
            new Selector("button",
                new Container([
                    new Label(() => displayName),
                    new ClickHandler(() =>
                        application.update(() => {
                            const list = this.list();
                            if (list.sort === sort)
                                list.reverse = !list.reverse;
                            if (list.sort !== sort)
                                list.reverse = false;
                            list.sort = sort;
                            list.page = 0;
                            list.reset();
                        }))
                ]))
        ]);
    }
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

export default class ModelList<
    Id,
    Model extends Model_<Id>,
    Sort extends ModelSort = ModelSort
    > extends Container {

    constructor(
        private service: ModelService<Id, Model, Sort>,
        onEdit: (model: Model) => void,
        columns: Column<Model>[],
    ) {
        super([
            new Template(require("../../templates/model-table.pug")),
            new Selector(".models",
                new DataTable<Model>(
                    () => this.models || [],
                    columns.concat(
                        new ButtonsColumn<Model>(
                            model => onEdit(model),
                            async model => {
                                if (model.id !== null)
                                    await service.delete(model.id);
                                await application.update(() => this.reset())
                            })))),
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

    public page = 0;
    public sort: Sort = <Sort>idSort;
    public reverse = false;

    private models: Model[] | null = null;
    private count: number | null = null;

    async load() {
        this.count = this.count
            || await this.service.count();
        if (this.page * perPage >= this.count)
            this.page = Math.max(0, Math.floor((this.count - 1) / perPage));
        this.models = this.models
            || await this.service.list({
                count: perPage,
                offset: this.page * perPage,
                sort: this.sort,
                reverse: this.reverse
            });
        await super.load();
    }

    async reset() {
        this.models = null;
        this.count = null;
    }
}