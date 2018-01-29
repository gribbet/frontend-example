import Model, { ModelSort } from "./Model";

export interface WidgetId extends Number { }

export interface WidgetSort extends ModelSort { }

export const nameSort: WidgetSort = "name";

export default class Widget implements Model<WidgetId> {
    id: WidgetId | null = null;
    name = "";
    created = new Date();
    updated = new Date();
}