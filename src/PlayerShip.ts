import { inputs, deck } from "./app";
import { Universe } from "./Universe";
import { Card } from "./Card";
import { Projectile } from "./Projectile";


export class PlayerShip {
    universe: Universe;
    get spacetime() { return this.universe.spacetime; }

    topX: number;
    time = 100;
    size = 51;
    lastSizeChangeStep = 0;

    constructor() {
        inputs.down.on("fire1", () => this.fire(deck.cards[0]));
        inputs.down.on("fire2", () => this.fire(deck.cards[1]));
        inputs.down.on("fire3", () => this.fire(deck.cards[2]));
        inputs.down.on("fire4", () => this.fire(deck.cards[3]));
        inputs.down.on("fire5", () => this.fire(deck.cards[4]));
        inputs.down.on("fire6", () => this.fire(deck.cards[5]));
        inputs.down.on("fire7", () => this.fire(deck.cards[6]));
        inputs.down.on("fire8", () => this.fire(deck.cards[7]));
    }

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

    fire(card: Card) {
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
            
            const cardX = x - (this.topX + (this.size - 1) / 2 + 1) + (card.cardSize - 1) / 2 + 1;
            // if (cell.value !== card.cardSpace[cardX] ?? 0) {
                cell.stepUpated = this.spacetime.timeOffset;
            // }
            cell.value = card.cardSpace[cardX] ?? 0;
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
        if (inputs.state["move-up"] && this.canMoveUp()) {
            this.moveUp();
        }
        if (inputs.state["move-down"] && this.canMoveDown()) {
            this.moveDown();
        }
    }
}
