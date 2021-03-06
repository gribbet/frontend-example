import { delay } from "../../common";
import { loadingIndicator } from "../../loading-indicator";
import Model_, { ModelSort, updatedSort } from "../../model/Model";
import ModelService, { SortOptions } from "../ModelService";

export default abstract class MockModelService<
    Id,
    Model extends Model_<Id>,
    Sort extends ModelSort = ModelSort>
    implements ModelService<Id, Model, Sort> {

    protected models: Model[] = [];

    protected abstract newId(): Id;

    protected comparator(sort: Sort): (a: Model, b: Model) => number {
        if (sort === updatedSort)
            return (a: Model, b: Model) => a.updated.getTime() - b.updated.getTime();
        return (a: Model, b: Model) =>
            (a.id || "").toString().localeCompare((b.id || "").toString())
    }

    async save(model: Model): Promise<Model> {
        console.log("Save");
        await this.request();

        if (model.id === null)
            model.created = new Date();
        model.updated = new Date();

        model = Object.assign({}, model);
        if (model.id === null)
            model.id = this.newId();

        const index = this.models.findIndex(_ => _.id === model.id);
        if (index !== -1)
            this.models.splice(index, 1, model);
        else
            this.models.push(model);

        return model;
    }

    async list(options: SortOptions<Sort>) {
        console.log("List");
        await this.request();

        const start = options.offset || 0;
        const end = options.count ? start + options.count : undefined;

        const models = this.models.slice(0);
        if (options.sort)
            models.sort(this.comparator(options.sort));
        if (options.reverse)
            models.reverse();

        return models.slice(start, end);
    }

    async count() {
        console.log("Count");
        await this.request();

        return this.models.length;
    }

    async find(id: Id): Promise<Model | null> {
        console.log("Find", id);
        await this.request();

        const model = this.models.find(_ => _.id === id) || null;
        if (model !== null)
            return Object.assign({}, model);
        return null;

    }

    async delete(id: Id | null) {
        console.log("Delete", id);
        await this.request();

        this.models = this.models.filter(_ => _.id !== id);
    }

    async request() {
        loadingIndicator.show();
        await delay(25);
        loadingIndicator.hide();
    }
}