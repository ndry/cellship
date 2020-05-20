import {tap} from "./utils/misc";
import {ImageDataUint32} from "./utils/ImageDataUint32";
import { Cell } from "./Spacetime";
import { Universe } from "./Universe";

export class UniverseView {
    constructor(
        public universe: Universe,
    ) {
    }

    canvas = tap(
        document.getElementById("canvas") as HTMLCanvasElement,
        c => {
            c.width = this.universe.spacetime.timeSize;
            c.height = this.universe.spacetime.spaceSize;
        });
    ctx = tap(
        this.canvas.getContext("2d")!,
        ctx => {
            ctx.imageSmoothingEnabled = false;
        });
    imageData = new ImageDataUint32(
        this.ctx.createImageData(
            this.universe.spacetime.timeSize,
            this.universe.spacetime.spaceSize));

    getCellColor(cell: Cell) {
        const age = this.universe.spacetime.timeOffset - cell.dim;
        let ageFactor = 1 -
            0.6 * (age < 50 ? age * 0.02 : 1) -
            0.2 * (age < 250 ? age * 0.004 : 1) -
            0.2 * (age < 2000 ? age * 0.00 : 1);
        if (ageFactor < 0) {
            ageFactor = 0;
        }

        if (cell.value == 0) {
            return 0xFF000000 + Math.floor(ageFactor * 0x1F);
        } 
        if (!cell.projectile) {
            const lumInt = Math.floor(0.5 * cell.value * ageFactor * 0x7F);
            return 0xFF808080 + lumInt - (lumInt << 8) - (lumInt << 16);
        } 
        {
            const lumInt = Math.floor(0.5 * cell.value * ageFactor * 0xFF);
            return 0xFF000000 + (lumInt << 8);
        }
    }

    render() {
        const w = this.imageData.width;
        const idd = this.imageData.dataUint32;
        for (let t = 0; t < this.universe.spacetime.timeSize; t++) {
            const space = this.universe.spacetime.getSpaceAtTime(t + this.universe.spacetime.timeOffset);
            for (let x = 0; x < space.length; x++) {
                idd[x * w + t] = this.getCellColor(space[x]);
            }
        }

        for (let x = this.universe.player.topX; x <= this.universe.player.bottomX; x++) {
            this.imageData.setPixel(100, x, 0xFF00FF00);
        }

        this.ctx.putImageData(this.imageData, 0, 0);
    }
}
