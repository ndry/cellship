import { Cell } from "./Spacetime";

export class Rule {
    readonly stateCount = 3;
    readonly ruleSpaceSizePower = 3 * (this.stateCount - 1) + 1;
    readonly spaceNeighbourhoodRadius = 1;
    readonly code = 1815;
    readonly tableString = (this.code).toString(this.stateCount).padStart(this.ruleSpaceSizePower, "0");
    readonly table = Array.from(this.tableString).reverse().map(x => +x);

    getState(spacetime: ArrayLike<ArrayLike<Cell>>, t: number, x: number) {
        const sum = (spacetime[t - 1][x - 1].value)
            + (spacetime[t - 1][x].value)
            + (spacetime[t - 1][x + 1].value);
        return this.table[sum];
    }

    getState2(
        getValue: (t: number, x: number) => number, 
        t: number,
        x: number
    ) {
        const sum = getValue(t - 1, x - 1)
            + getValue(t - 1, x)
            + getValue(t - 1, x + 1);
        return this.table[sum];
    }

    getState3(
        cell_m1_m1: number,
        cell_m1_z0: number,
        cell_m1_p1: number,
    ) {
        const sum = cell_m1_m1
            + cell_m1_z0
            + cell_m1_p1;
        return this.table[sum];
    }

    getState1(spacetime: ArrayLike<ArrayLike<number>>, t: number, x: number) {
        const sum = (spacetime[t - 1][x - 1])
            + (spacetime[t - 1][x])
            + (spacetime[t - 1][x + 1]);
        return this.table[sum];
    }
}
