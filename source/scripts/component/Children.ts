import Component from "wedges/lib/Component";

export default class Children implements Component {

    constructor(private component: Component) { }

    render(element: Element) {

        const children: Element[] = [].slice.call(element.children);
        const renderings = children.map(_ =>
            this.component.render(_));

        return {
            update: () => renderings.forEach(_ => _.update()),
            destroy: () => renderings.forEach(_ => _.destroy())
        };
    }

    async load() {
        await this.component.load();
    }
}
