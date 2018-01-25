import Template from "wedges/lib/component/Template";

declare var require: (path: string) => string;

export default class NotFound extends Template {

    constructor() {
        super(require("../../templates/not-found.pug"));
    }
}