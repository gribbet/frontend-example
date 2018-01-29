import Component from "wedges/lib/Component";

export default interface Column<T> {
    header: Component,
    cell: (row: T) => Component
}