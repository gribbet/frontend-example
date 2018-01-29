import Container from "wedges/lib/component/Container";
import Selector from "wedges/lib/component/Selector";
import Template from "wedges/lib/component/Template";

import { application } from "../..";
import Model_, { idSort, ModelSort } from "../../model/Model";
import ModelService from "../../service/ModelService";
import Column from "./Column";
import DataTable from "./DataTable";
import Pagination from "./Pagination";

declare var require: (path: string) => string;

const perPage = 5;

export default class ModelTable<
    Id,
    Model extends Model_<Id>,
    Sort extends ModelSort = ModelSort
    > extends Container {

    constructor(
        private service: ModelService<Id, Model, Sort>,
        columns: Column<Model>[],
    ) {
        super([
            new Template(require("../../../templates/model-table.pug")),
            new Selector(".models",
                new DataTable<Model>(
                    () => this.models || [],
                    columns)),
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