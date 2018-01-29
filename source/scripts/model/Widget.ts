import Model from "./Model";

export interface WidgetId extends Number { }

export type WidgetSort = "id" | "name" | "updated";

export default class Widget implements Model<WidgetId> {
    id: WidgetId | null = null;
    name = "";
    created = new Date();
    updated = new Date();
}