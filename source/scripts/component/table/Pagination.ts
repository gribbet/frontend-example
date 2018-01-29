import AttributeSetter from "wedges/lib/component/AttributeSetter";
import ClassToggler from "wedges/lib/component/ClassToggler";
import ClickHandler from "wedges/lib/component/ClickHandler";
import Container from "wedges/lib/component/Container";
import KeyedRepeater from "wedges/lib/component/KeyedRepeater";
import Label from "wedges/lib/component/Label";
import Remover from "wedges/lib/component/Remover";
import Selector from "wedges/lib/component/Selector";
import Template from "wedges/lib/component/Template";

import { range } from "../../common";

declare var require: (path: string) => string;

const count = 5;

export default class Pagination extends Container {

    constructor(
        current: () => number,
        total: () => number,
        select: (page: number) => void
    ) {
        const start = () => Math.max(0, Math.min(
            total() - count,
            current() - Math.floor(count / 2)));
        const end = () => Math.min(start() + count, total());
        super([
            new Template(require("../../../templates/pagination.pug")),
            new Remover(() => total() <= 1),
            new Selector(".previous",
                new Container([
                    new AttributeSetter("disabled",
                        () => current() === 0 ? "disabled" : null),
                    new ClickHandler(() => select(current() - 1))
                ])),
            new Selector(".next",
                new Container([
                    new AttributeSetter("disabled",
                        () => current() === total() - 1 ? "disabled" : null),
                    new ClickHandler(() => select(current() + 1))
                ])),
            new Selector(".more.before",
                new ClassToggler("hidden", () => start() === 0)),
            new Selector(".more.after",
                new ClassToggler("hidden", () => end() === total())),
            new Selector(".pages",
                new KeyedRepeater(
                    () => range(start(), end()),
                    page => new Container([
                        new Label(() => (page + 1).toString()),
                        new ClassToggler("selected",
                            () => page === current()),
                        new ClickHandler(() => select(page))
                    ])))
        ]);
    }
}