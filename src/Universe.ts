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
        const t = this.spacetime.timeSize - 1;

        for (let x = 0; x < nr; x++) {
            this.spacetime[t][x].value = Universe.getRandomState();
            this.spacetime[t][this.spacetime[t].length - 1 - x].value = Universe.getRandomState();
        }
        for (let x = nr; x < this.spacetime[t].length - nr; x++) {
            const cell = this.spacetime[t][x];

            cell.value = rule.getState2((t, x) => {
                var cell = this.spacetime[t][x];
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
        const t = this.spacetime.length - 1;
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
