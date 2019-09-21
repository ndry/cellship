export class Rule {
    readonly stateCount = 3;
    readonly ruleSpaceSizePower = 3 * (this.stateCount - 1) + 1;
    readonly spaceNeighbourhoodRadius = 1;
    readonly code = 1815;
    readonly tableString = (this.code).toString(this.stateCount).padStart(this.ruleSpaceSizePower, "0");
    readonly table = Array.from(this.tableString).reverse().map(x => +x);

    getState(spacetime: ArrayLike<ArrayLike<number>>, t: number, x: number) {
        const sum = spacetime[t - 1][x - 1]
            + spacetime[t - 1][x]
            + spacetime[t - 1][x + 1];
        return this.table[sum];
    }
}
