import { Projectile } from "./Projectile";

export interface Cell {
    value: number,
    projectile: Projectile | undefined,
    dim: number,
    stepUpated: number,
}

export class Spacetime {
    timeOffset = 0;

    data: Array<Array<Cell>>;

    constructor(
        public spaceSize = 770,
        public timeSize = 1920
    ) {
        this.data = Array.from({ length: timeSize }, () => 
            Array.from({ length: spaceSize }, () => ({
                value: 0,
                projectile: undefined,
                dim: -1e10,
                stepUpated: 0,
            })));
    }

    performStep() {
        this.timeOffset++;
    }

    getSpaceAtTime(t: number) {
        return this.data[t % this.timeSize];
    }
}
