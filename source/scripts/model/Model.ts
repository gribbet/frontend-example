export interface ModelSort extends String { }

export const idSort: ModelSort = "id";
export const updatedSort: ModelSort = "updated";

export default interface Model<Id> {
    id: Id | null;
    created: Date,
    updated: Date
}