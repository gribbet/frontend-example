import ClassToggler from "wedges/lib/component/ClassToggler";
import ClickHandler from "wedges/lib/component/ClickHandler";
import Container from "wedges/lib/component/Container";
import Label from "wedges/lib/component/Label";
import Selector from "wedges/lib/component/Selector";
import Template from "wedges/lib/component/Template";

import { application } from "../..";
import Model_, { ModelSort } from "../../model/Model";
import ModelList from "./ModelTable";
import { PropertyColumn } from "./PropertyColumn";

export class SortablePropertyColumn<
    Id,
    Model extends Model_<Id>,
    Sort extends ModelSort = ModelSort
    > extends PropertyColumn<Model> {

    constructor(
        displayName: string,
        sort: Sort,
        getter: (model: Model) => string,
        private list: () => ModelList<Id, Model, Sort>
    ) {
        super(displayName, getter);
        this.header = new Container([
            new ClassToggler("header"),
            new ClassToggler(displayName.toLowerCase()),
            new ClassToggler("active", () =>
                list().sort === sort),
            new ClassToggler("reverse", () =>
                list().sort === sort && list().reverse),
            new Template("<button />"),
            new Selector("button",
                new Container([
                    new Label(() => displayName),
                    new ClickHandler(() =>
                        application.update(() => {
                            const list = this.list();
                            if (list.sort === sort)
                                list.reverse = !list.reverse;
                            if (list.sort !== sort)
                                list.reverse = false;
                            list.sort = sort;
                            list.page = 0;
                            list.reset();
                        }))
                ]))
        ]);
    }
}