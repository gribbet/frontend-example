import Model from "../model/Model";

export interface SortOptions<Sort> {
    offset?: number;
    count?: number;
    sort?: Sort;
    reverse?: boolean;
}

export default interface ModelService<Id, Sort, Model_ extends Model<Id>> {
    save(model: Model<Id>): Promise<Model_>;
    list(options: SortOptions<Sort>): Promise<Model_[]>
    count(): Promise<number>
    find(id: Id): Promise<Model_ | null>;
    delete(id: Id): Promise<void>;
}