import {tap} from "./utils/misc";
import {deck, universe} from "./app";
import {ImageDataUint32} from "./utils/ImageDataUint32";
import { Cell } from "./Spacetime";
import { Projectile } from "./Projectile";

export class UniverseView {
    canvas = tap(
        document.getElementById("canvas") as HTMLCanvasElement,
        c => {
            c.width = universe.spacetime.timeSize;
            c.height = universe.spacetime.spaceSize;
        });
    ctx = tap(
        this.canvas.getContext("2d")!,
        ctx => {
            ctx.imageSmoothingEnabled = false;
        });
    imageData = new ImageDataUint32(
        this.ctx.createImageData(
            universe.spacetime.timeSize,
            universe.spacetime.spaceSize));
    colorMap = [0xFF000000, 0xFF808080, 0xFFFFFFFF];

    constructor() {
        // let lastT: number | undefined = undefined;
        // this.canvas.addEventListener("pointermove", ev => {
        //     const t = ev.clientX;
        //     const x = ev.clientY;
        //     if ("undefined" !== typeof lastT && t >= lastT) {
        //         universe.refresh(lastT, t + 1);
        //     }
        //     for (let _x = 0; _x < deck.selectedCard.cardSpace.length; _x++) {
        //         universe.spacetime[t][x + _x] = deck.selectedCard.cardSpace[_x];
        //     }
        //     universe.refresh(t + 1);
        //     lastT = t;
        // });
    }

    setPixel(x: number, y: number, cell: Cell) {
        let a =  Math.max(0, (1 - (universe.spacetime.timeOffset - cell.dim) / 1000));
        a *= a;
        a *= a;
        a *= a;
        a *= a;
        a *= a;
        const ageFacctor = a;

        const lum = 0.5 * cell.value * ageFacctor;

        let color = 0xFF << 24;
        if (cell.value == 0) {
            const ageFactorInt = Math.floor(ageFacctor * 0x1F);
            color += ageFactorInt;
        } else if (cell.projectile) {
            const lumInt = Math.floor((0.05 + 0.95 * lum) * 0xFF);
            color += lumInt << 8;
        } else {
            const lumInt = Math.floor(lum * 0x7F);
            color += 0x808080;
            color += lumInt - (lumInt << 8) - (lumInt << 16);
        }

        this.imageData.setPixel(x, y, color);
    }

    render() {
        for (let t = 0; t < universe.spacetime.length; t++) {
            const space = universe.spacetime[t];
            for (let x = 0; x < space.length; x++) {
                this.setPixel(t, x, space[x]);
            }
        }
        for (let x = universe.player.topX; x <= universe.player.bottomX; x++) {
            this.imageData.setPixel(100, x, 0xFF00FF00);
        }
         this.ctx.putImageData(this.imageData, 0, 0);
    }
}
