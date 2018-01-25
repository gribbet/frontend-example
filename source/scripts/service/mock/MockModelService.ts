import { delay } from "../../common";
import Model from "../../model/Model";
import ModelService from "../ModelService";
import { loadingIndicator } from "./../../loading-indicator";

export default abstract class MockModelService<Id, Model_
    extends Model<Id>>
    implements ModelService<Id, Model_> {

    protected models: Model_[] = [];

    abstract newId(): Id;

    async save(model: Model_): Promise<Model_> {
        console.log("Save");
        await this.request();

        model = Object.assign({}, model);
        if (model.id === null)
            model.id = this.newId();

        const index = this.models.findIndex(_ => _.id === model.id);
        if (index !== -1)
            this.models.splice(index, 1);
        this.models.push(model);

        return model;
    }

    async list() {
        console.log("List");
        await this.request();

        return this.models.slice();
    }

    async listIds() {
        console.log("ListIds");
        await this.request();

        return this.models
            .map(_ => _.id || this.newId());
    }

    async find(id: Id): Promise<Model_ | null> {
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
        await delay(100);
        loadingIndicator.hide();
    }
}