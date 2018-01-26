import Component from "wedges/lib/Component";

export class Focuser extends Component {
    render(element: Element) {
        (<HTMLInputElement>element).focus();
        return super.render(element);
    }
}