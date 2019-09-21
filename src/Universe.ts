import {LehmerPrng} from "./utils/LehmerPrng";
import {rule} from "./app";

export class Universe {
    static random = new LehmerPrng(4242);
    static getRandomState() {
        return Universe.random.next() % rule.stateCount;
    }

    spaceSize = 970;
    timeSize = 1920;

    spacetime = Array.from({length: this.timeSize}, () => new Uint8Array(this.spaceSize));

    step = 0;

    updateCell(t: number, x: number) {
        this.spacetime[t][x] = rule.getState(this.spacetime, t, x);
    }

    iterate() {
        this.spacetime.push(this.spacetime.shift()!);
        const t = this.spacetime.length - 1;

        const nr = rule.spaceNeighbourhoodRadius;
        for (let x = 0; x < nr; x++) {
            this.spacetime[t][x] = Universe.getRandomState();
            this.spacetime[t][this.spacetime[t].length - 1 - x] = Universe.getRandomState();
        }
        for (let x = nr; x < this.spacetime[t].length - nr; x++) {
            this.updateCell(t, x);
        }

        this.step++;
    }

    constructor() {
        const t = this.spacetime.length - 1;
        for (let x = 0; x < this.spacetime[t].length; x++) {
            this.spacetime[t][x] = Universe.getRandomState();
        }
        for (let _ = 0; _ < this.spacetime.length; _++) {
            this.iterate();
        }
    }

    refresh(fromT: number, toT?: number) {
        const nr = rule.spaceNeighbourhoodRadius;
        const _toT = "undefined" === typeof toT ? this.spacetime.length : toT;
        for (let t = fromT; t < _toT; t++) {
            for (let x = nr; x < this.spacetime[t].length - nr; x++) {
                this.updateCell(t, x);
            }
        }
    }
}
