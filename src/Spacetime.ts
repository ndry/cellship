import { Projectile } from "./Projectile";

export interface Cell {
    value: number,
    projectile: Projectile | undefined,
    dim: number,
    stepUpated: number,
}

export class Spacetime extends Array<Array<Cell>> {
    get timeSize() {
        return this.length;
    }
    get spaceSize() {
        return this[0].length;
    }

    timeOffset = 0;

    constructor(
        spaceSize = 770,
        timeSize = 1920) {
        super(
            ...Array.from(
                { length: timeSize },
                () => Array.from(
                    { length: spaceSize },
                    () => ({
                        value: 0,
                        projectile: undefined,
                        dim: 1e-5,
                        stepUpated: 0,
                    }))));
    }

    performStep() {
        this.push(this.shift()!);
        this.timeOffset++;
    }

    getSpaceAtTime(t: number) {
        return this[t - this.timeOffset];
    }
}
