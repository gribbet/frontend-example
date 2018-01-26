import Component from "wedges/lib/Component";

export class Focuser extends Component {
    render(element: Element) {
        const input = <HTMLInputElement>element;
        return {
            update: () =>
                input.select(),
            destroy: () => undefined
        };
    }
}