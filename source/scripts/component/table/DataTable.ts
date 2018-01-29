import KeyedRepeater from "wedges/lib/component/KeyedRepeater";

import Column from "./Column";

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
