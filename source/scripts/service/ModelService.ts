import Model_, { ModelSort } from "../model/Model";

export interface SortOptions<Sort extends ModelSort> {
    offset?: number;
    count?: number;
    sort?: Sort;
    reverse?: boolean;
}

export default interface ModelService<
    Id,
    Model extends Model_<Id>,
    Sort extends ModelSort = ModelSort> {

    save(model: Model): Promise<Model>;
    list(options: SortOptions<Sort>): Promise<Model[]>
    count(): Promise<number>
    find(id: Id): Promise<Model | null>;
    delete(id: Id): Promise<void>;
}