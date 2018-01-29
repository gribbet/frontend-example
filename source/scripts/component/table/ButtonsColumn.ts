import ClassToggler from "wedges/lib/component/ClassToggler";
import ClickHandler from "wedges/lib/component/ClickHandler";
import Container from "wedges/lib/component/Container";
import Selector from "wedges/lib/component/Selector";
import Template from "wedges/lib/component/Template";

import Column from "./Column";

declare var require: (path: string) => string;

export default class ButtonsColumn<T> implements Column<T> {

    constructor(
        private onEdit: (row: T) => void,
        private onDelete: (row: T) => void
    ) { }

    header = new Container([
        new ClassToggler("header"),
        new ClassToggler("buttons")
    ]);

    cell = (row: T) => new Container([
        new Template(require("../../../templates/buttons-column.pug")),
        new ClassToggler("buttons", () => true),
        new Selector(".edit",
            new ClickHandler(() => this.onEdit(row))),
        new Selector(".delete",
            new ClickHandler(() => this.onDelete(row)))
    ]);
}