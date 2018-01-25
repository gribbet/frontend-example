import Model from "../model/Model";

export default interface ModelService<Id, Model_ extends Model<Id>> {
    save(model: Model<Id>): Promise<Model_>;
    list(): Promise<Model_[]>
    listIds(): Promise<Id[]>
    find(id: Id): Promise<Model_ | null>;
    delete(id: Id): Promise<void>;
}