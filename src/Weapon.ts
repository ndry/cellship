import { Rule } from "./Rule";

export type WeaponData = ReturnType<Weapon["serialize"]>;
export class Weapon {
    serialize() {
        return {
            space: this.space,
            prevSpace: this.prevSpace,
        };
    }

    static deserialize(data: WeaponData) {
        return (rule: Rule) => new Weapon(rule, data.space, data.prevSpace);
    }

    get size() { return this.space.length; }

    readonly spacetime: Uint8Array[];

    get spaceSize() { return this.spacetime[0].length; }
    get timeSize() { return this.spacetime.length; }

    isBookmarked = false;

    constructor(
        public rule: Rule,
        public readonly space: number[],
        public readonly prevSpace: number[],
    ) {
        const spaceSize = this.size * 10 + 1;
        const timeSize = spaceSize;
        this.spacetime = Array.from({length: timeSize}, () => new Uint8Array(spaceSize));

        const xMargin = (this.spacetime[0].length - this.space.length) / 2;
        for (let x = 0; x < this.space.length; x++) {
            this.spacetime[0][x + xMargin] = this.prevSpace[x];
            this.spacetime[1][x + xMargin] = this.space[x];
        }
        const nr = rule.spaceNeighbourhoodRadius;
        for (let t = 2; t < this.spacetime.length; t++) {
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
