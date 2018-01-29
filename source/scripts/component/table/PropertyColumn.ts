import ClassToggler from "wedges/lib/component/ClassToggler";
import Container from "wedges/lib/component/Container";
import Label from "wedges/lib/component/Label";

import Column from "./Column";

export class PropertyColumn<T> implements Column<T> {
    constructor(
        private displayName: string,
        private getter: (row: T) => string) { }
    header = new Container([
        new Label(() => this.displayName),
        new ClassToggler("header"),
        new ClassToggler(this.displayName.toLowerCase())
    ]);
    cell = (row: T) => new Container([
        new Label(() => this.getter(row)),
        new ClassToggler(this.displayName.toLowerCase(), () => true)
    ]);
}