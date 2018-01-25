import Model from "./Model";

export interface WidgetId extends Number { }

export default class Widget implements Model<WidgetId> {
    id: WidgetId | null = null;
    name = "";
}