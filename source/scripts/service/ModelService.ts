import Model from "../model/Model";

export default interface ModelService<Id, Model_ extends Model<Id>> {
    save(model: Model<Id>): Promise<Model_>;
    list(count?: number, offset?: number): Promise<Model_[]>
    listIds(count?: number, offset?: number): Promise<Id[]>
    count(): Promise<number>
    find(id: Id): Promise<Model_ | null>;
    delete(id: Id): Promise<void>;
}