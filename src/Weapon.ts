import { Weaponary } from "./Weaponary";
import { Rule } from "./Rule";

export class Weapon {
    get size() { return this.space.length; }

    readonly spacetime: Uint8Array[];

    get spaceSize() { return this.spacetime[0].length; }
    get timeSize() { return this.spacetime.length; }

    isBookmarked = false;

    constructor(
        public rule: Rule,
        public readonly space: number[],
    ) {
        const spaceSize = this.size * 10 + 1;
        const timeSize = spaceSize;
        this.spacetime = Array.from({length: timeSize}, () => new Uint8Array(spaceSize));

        const xMargin = (this.spacetime[0].length - this.space.length) / 2;
        for (let x = 0; x < this.space.length; x++) {
            this.spacetime[0][x + xMargin] = this.space[x];
        }
        const nr = rule.spaceNeighbourhoodRadius;
        for (let t = 1; t < this.spacetime.length; t++) {
            const space = this.spacetime[t];
            for (let x = nr; x < space.length - nr; x++) {
                space[x] = rule.getState1(this.spacetime, t, x);
            }
        }
        for (let t = 0; t < timeSize; t++) {
            const space = new Uint8Array(this.size * 2 + 1);
            const xMargin = (spaceSize - space.length) / 2;
            for (let x = 0; x < space.length; x++) {
                space[x] = this.spacetime[t][x + xMargin];
            }
            this.spacetime[t] = space;
        }
    }
}
