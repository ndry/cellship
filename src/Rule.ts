import { RuleSpace } from "./RuleSpace";

export class Rule {
    constructor(
        public readonly space: RuleSpace,
        public readonly code: number,
    ) {
    }

    readonly table = this.space.generateRuleTableFromCode(this.code);
    readonly tableString = this.table.join("");
    readonly desc = `${this.space.id}_${this.code}_${this.tableString}`;

    getState3(
        cell_m1_m1: number,
        cell_m1_z0: number,
        cell_m1_p1: number,
    ) {
        return this.table[
            this.space.getPrestate(cell_m1_m1, cell_m1_z0, cell_m1_p1)];
    }

    getState1(
        spacetime: ArrayLike<ArrayLike<number>>, 
        t: number,
        x: number
    ) {
        return this.getState3(
            spacetime[t - 1][x - 1], 
            spacetime[t - 1][x], 
            spacetime[t - 1][x + 1]);
    }

    getState2(
        getValue: (t: number, x: number) => number, 
        t: number,
        x: number
    ) {
        return this.getState3(
            getValue(t - 1, x - 1), 
            getValue(t - 1, x), 
            getValue(t - 1, x + 1));
    }
}
