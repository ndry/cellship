import { rule, universe } from "./app";
import { PlayerShip } from "./PlayerShip";
import { Cell } from "./Spacetime";

export class Projectile {
    owner: PlayerShip;
    get universe() { return this.owner.universe; }
    get spacetime() { return this.universe.spacetime; }

    timeVelocity = 10;
    timeCreated: number;
    timePosition: number;

    getValue(cell: Cell) {
        if (cell.projectile == this || "undefined" === typeof cell.projectile) {
            return cell.value;
        }
        return 0;
    };

    updateSpace(t: number) {
        const nr = rule.spaceNeighbourhoodRadius;
        const prevSpace = this.spacetime.getSpaceAtTime(t - 1);
        const tSpace = this.spacetime.getSpaceAtTime(t);
        
        let owned = 0;
        const lnr = tSpace.length - nr;
        const timeOffset = this.spacetime.timeOffset;
        const prevTimeOffset = timeOffset - 1;
        let prevCell1 = prevSpace[0];
        let prevCell2 = prevSpace[0];
        let prevCell3 = prevSpace[1];
        for (let x = nr; x < lnr; x++) {
            prevCell1 = prevCell2;
            prevCell2 = prevCell3;
            prevCell3 = prevSpace[x + 1];
            if (prevCell1.stepUpated !== timeOffset
                && prevCell1.stepUpated !== prevTimeOffset
                && prevCell2.stepUpated !== timeOffset
                && prevCell2.stepUpated !== prevTimeOffset
                && prevCell3.stepUpated !== timeOffset
                && prevCell3.stepUpated !== prevTimeOffset
            ) {
                continue;
            }

            const cell = tSpace[x];
            const value = rule.getState3(
                this.getValue(prevCell1),
                this.getValue(prevCell2),
                this.getValue(prevCell3));

            if (value === 0 
                && cell.value !== 0 
                && cell.projectile 
                && cell.projectile !== this
            ) {
                continue;
            }

            let owner: Projectile | undefined = undefined;
            if (value > 0) {
                const valuedCellsOwners = [prevCell1, prevCell2, prevCell3]
                .filter(c => 
                    c.value > 0 
                    && (c.projectile == this || "undefined" === typeof c.projectile))
                .map(c => c.projectile);
    
                owner = valuedCellsOwners.length === 0 ? undefined
                    : valuedCellsOwners.reduce((acc, o) => acc && o);
            }

            if (cell.value != value || cell.projectile != owner) {
                cell.stepUpated = this.spacetime.timeOffset;
            }

            cell.value = value;
            cell.projectile = owner;
            cell.dim = 
                this.spacetime.timeOffset - 1 - (this.timePosition - t) / this.timeVelocity;

            if (cell.projectile === this) {
                owned++;
            }
        }
        return owned;
    }

    update() {
        const timeEndOfPrediction = this.spacetime.timeOffset + this.spacetime.timeSize;
        if (this.timePosition < timeEndOfPrediction) {
            for (let t = this.timePosition; t < Math.min(this.timePosition + this.timeVelocity, timeEndOfPrediction); t++) {
                this.updateSpace(t);
            }
        } else {
            const owned = this.updateSpace(timeEndOfPrediction - 1);
            if ((this.timePosition - this.timeVelocity * 2000) >= timeEndOfPrediction && owned === 0) {
                universe.projectiles.splice(universe.projectiles.indexOf(this), 1);
            }
        }

        this.timePosition += this.timeVelocity;
    }
}
