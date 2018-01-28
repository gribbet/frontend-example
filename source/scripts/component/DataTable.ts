import Component from "wedges/lib/Component";
import KeyedRepeater from "wedges/lib/component/KeyedRepeater";

export interface Column<T> {
    header: Component,
    cell: (row: T) => Component
}

export default class DataTable<T> extends KeyedRepeater<T | null> {
    constructor(
        rows: () => T[],
        columns: Column<T>[]
    ) {
        super(() =>
            (<(T | null)[]>[null]).concat(rows()),
            row => new KeyedRepeater(() =>
                columns,
                column => row === null
                    ? column.header
                    : column.cell(row)))
    }
}
