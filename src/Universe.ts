import {LehmerPrng} from "./utils/LehmerPrng";
import { tap } from "./utils/misc";
import { Spacetime } from "./Spacetime";
import { PlayerShip } from "./PlayerShip";
import { Projectile } from "./Projectile";
import { Rule } from "./Rule";

export class Universe {
    random = new LehmerPrng(4242);
    rule = new Rule();
    getRandomState() {
        return this.random.next() % this.rule.stateCount;
    }

    spacetime = new Spacetime();

    player = tap(new PlayerShip(this), ps => {
        ps.topX = Math.round((this.spacetime.spaceSize - ps.size) / 2);
    });

    projectiles: Projectile[] = [];

    fillMostRecentSpace() {
        const nr = this.rule.spaceNeighbourhoodRadius;
        const t = this.spacetime.timeSize - 1 + this.spacetime.timeOffset;
        const tSpace = this.spacetime.getSpaceAtTime(t);

        for (let x = 0; x < nr; x++) {
            tSpace[x].value = this.getRandomState();
            tSpace[tSpace.length - 1 - x].value = this.getRandomState();
        }
        for (let x = nr; x < tSpace.length - nr; x++) {
            const cell = tSpace[x];

            cell.value = this.rule.getState2((t, x) => {
                var cell = this.spacetime.getSpaceAtTime(t)[x];
                if ("undefined" === typeof cell.projectile) {
                    return cell.value;
                }
                return 0;
            }, t, x);
            cell.projectile = undefined;
            cell.dim = -1e10;
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
