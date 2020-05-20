import { Universe } from "./Universe";
import { Weapon } from "./Weapon";
import { Projectile } from "./Projectile";
import { Weaponary } from "./Weaponary";


export class PlayerShip {
    constructor(
        public universe: Universe,
    ) { }

    get spacetime() { return this.universe.spacetime; }

    topX: number;
    time = 100;
    size = 51;
    lastSizeChangeStep = 0;

    weaponary = new Weaponary(this.universe.rule);

    get bottomX() {
        return this.topX + this.size;
    }

    isObstacle(x: number) {
        const cell = this.spacetime.getSpaceAtTime(this.spacetime.timeOffset + this.time)[x];
        return ("undefined" === typeof cell.projectile) && cell.value > 0;
    }

    canMoveDown() {
        return !this.isObstacle(this.bottomX + 1);
    }

    canMoveUp() {
        return !this.isObstacle(this.topX + 1);
    }

    moveDown() {
        this.topX += 1;
    }

    moveUp() {
        this.topX -= 1;
    }

    resetGrowth() {
        this.lastSizeChangeStep = this.spacetime.timeOffset;
    }

    get growthTime() {
        return this.spacetime.timeOffset - this.lastSizeChangeStep;
    }

    fire(weapon: Weapon) {
        const t = this.spacetime.timeOffset + this.time;
        const projectile = new Projectile();
        projectile.owner = this;
        projectile.timeCreated = t;
        projectile.timePosition = t + 1;
        this.universe.projectiles.push(projectile);
        const tSpace = this.spacetime.getSpaceAtTime(t);
        for (
            let x = this.topX; 
            x <= this.bottomX; 
            x++
        ) {
            const cell = tSpace[x];
            
            const cardX = x - (this.topX + (this.size - 1) / 2 + 1) + (weapon.size - 1) / 2 + 1;
            // if (cell.value !== card.cardSpace[cardX] ?? 0) {
                cell.stepUpated = this.spacetime.timeOffset;
            // }
            cell.value = weapon.space[cardX] ?? 0;
            cell.projectile = projectile;
        }
    }

    update() {
        if (this.growthTime >= 100) {
            this.size += 2;
            this.topX -= 1;
            this.resetGrowth();
        }
        while (this.isObstacle(this.topX)) {
            if (this.canMoveDown()) {
                this.moveDown();
            }
            else {
                this.size -= 2;
                this.moveDown();
            }
            this.resetGrowth();
        }
        while (this.isObstacle(this.bottomX)) {
            if (this.canMoveUp()) {
                this.moveUp();
            }
            else {
                this.size -= 2;
            }
            this.resetGrowth();
        }
    }
}
