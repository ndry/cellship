import { rule, universe } from "./app";
import { PlayerShip } from "./PlayerShip";

export class Projectile {
    owner: PlayerShip;
    get universe() { return this.owner.universe; }
    get spacetime() { return this.universe.spacetime; }

    timeVelocity = 10;
    timeCreated: number;
    topXCreated: number;
    bottomXCreated: number;
    timePosition: number;
    topX: number;
    bottomX: number;

    lastChanged: Set<number>;

    updateSpace(t: number) {
        const nr = rule.spaceNeighbourhoodRadius;
        const prevSpace = this.spacetime.getSpaceAtTime(t - 1);
        const tSpace = this.spacetime.getSpaceAtTime(t);

        const getValue = (t: number, x: number) => {
            var cell = this.spacetime.getSpaceAtTime(t)[x];
            if (cell.projectile == this || "undefined" === typeof cell.projectile) {
                return cell.value;
            }
            return 0;
        };
        
        let owned = 0;
        for (
            let x = nr; 
            x < tSpace.length - nr; 
            x++
        ) {
            const cell1 = prevSpace[x - 1];
            const cell2 = prevSpace[x];
            const cell3 = prevSpace[x + 1];
            const cell = tSpace[x];

            const value = rule.getState2(getValue, t, x);

            if (value !== cell.value && x === this.topX - 1) {
                this.topX = x;
            }

            if (value !== cell.value && x === this.bottomX + 1) {
                this.bottomX = x;
            }

            const valuedCellsOwners = [cell1, cell2, cell3]
                .filter(c => 
                    c.value > 0 
                    && (c.projectile == this || "undefined" === typeof c.projectile))
                .map(c => c.projectile);

            const dsds = [cell1, cell2, cell3]
                .filter(c => (c.stepUpated === this.spacetime.timeOffset - 1)
                    || (c.stepUpated === this.spacetime.timeOffset));

            if (dsds.length === 0) {
                continue;
            }

            if (value === 0 && cell.value !== 0 && cell.projectile && cell.projectile !== this) {
                continue;
            }
            

            // const dsds1 = [cell1, cell2, cell3]
            //     .filter(c => 
            //         (c.value > 0 && (c.projectile == this)));

            // if (dsds1.length === 0) {
            //     continue;
            // }

            const mergedOwner = valuedCellsOwners.length == 0 ? undefined
                : valuedCellsOwners.reduce((acc, o) => acc && o);
            const owner = value > 0 ? mergedOwner : undefined;

            if (cell.value != value || cell.projectile != owner) {
                cell.stepUpated = this.spacetime.timeOffset;
            }

            cell.value = value;
            cell.projectile = owner;
            cell.dim = 
                this.spacetime.timeOffset - (this.timePosition - t) / this.timeVelocity;

            if (cell.projectile === this) {
                owned++;
            }
        }
        return owned;
    }

    update() {
        if ("undefined" === typeof this.lastChanged) {
            this.lastChanged = new Set(Array.from(
                {length: this.bottomXCreated - this.topXCreated + 1},
                (_, i) => this.topXCreated + i));
        }

        const timeEndOfPrediction = this.spacetime.timeOffset + this.spacetime.timeSize;
        if (this.timePosition < timeEndOfPrediction) {
            for (let t = this.timePosition; t < Math.min(this.timePosition + this.timeVelocity, timeEndOfPrediction); t++) {
                this.updateSpace(t);
            }
        } else {
            const owned = this.updateSpace(timeEndOfPrediction - 1);
            if ((this.timePosition - this.timeVelocity * 1000) >= timeEndOfPrediction && owned === 0) {
                universe.projectiles.splice(universe.projectiles.indexOf(this), 1);
            }
        }

        this.timePosition += this.timeVelocity;
    }
}
