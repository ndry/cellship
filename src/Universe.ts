import {LehmerPrng} from "./utils/LehmerPrng";
import {rule} from "./app";
import { tap } from "./utils/misc";
import { Spacetime } from "./Spacetime";
import { PlayerShip } from "./PlayerShip";
import { Projectile } from "./Projectile";

export class Universe {
    static random = new LehmerPrng(4242);
    static getRandomState() {
        return Universe.random.next() % rule.stateCount;
    }

    spacetime = new Spacetime();

    player = tap(new PlayerShip(), ps => {
        ps.universe = this;
        ps.topX = Math.round((this.spacetime.spaceSize - ps.size) / 2);
    });

    projectiles: Projectile[] = [];

    fillMostRecentSpace() {
        const nr = rule.spaceNeighbourhoodRadius;
        const t = this.spacetime.timeSize - 1 + this.spacetime.timeOffset;
        const tSpace = this.spacetime.getSpaceAtTime(t);

        for (let x = 0; x < nr; x++) {
            tSpace[x].value = Universe.getRandomState();
            tSpace[tSpace.length - 1 - x].value = Universe.getRandomState();
        }
        for (let x = nr; x < tSpace.length - nr; x++) {
            const cell = tSpace[x];

            cell.value = rule.getState2((t, x) => {
                var cell = this.spacetime.getSpaceAtTime(t)[x];
                if ("undefined" === typeof cell.projectile) {
                    return cell.value;
                }
                return 0;
            }, t, x);
            cell.projectile = undefined;
            cell.dim = 0;
            cell.stepUpated = 0;
        }
    }

    constructor() {
        const t = this.spacetime.timeSize - 1 + this.spacetime.timeOffset;
        // for (let x = 0; x < this.spacetime[t].length; x++) {
        //     this.spacetime[t][x].value = Universe.getRandomState();
        // }
        // for (let _ = 0; _ < this.spacetime.length; _++) {
        //     this.iterate();
        // }
    }

    update() {
        this.spacetime.performStep();
        this.fillMostRecentSpace();
        this.player.update();
        for (const p of [...this.projectiles]) {
            p.update();
        }
    }
}
