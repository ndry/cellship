import {tap} from "./utils/misc";
import {deck, universe} from "./app";
import {ImageDataUint32} from "./utils/ImageDataUint32";

export class UniverseView {
    canvas = tap(
        document.getElementById("canvas") as HTMLCanvasElement,
        c => {
            c.width = universe.timeSize;
            c.height = universe.spaceSize;
        });
    ctx = tap(
        this.canvas.getContext("2d")!,
        ctx => {
            ctx.imageSmoothingEnabled = false;
        });
    imageData = new ImageDataUint32(
        this.ctx.createImageData(
            universe.timeSize,
            universe.spaceSize));
    colorMap = [0xFF000000, 0xFF808080, 0xFFFFFFFF];

    constructor() {
        let lastT: number | undefined = undefined;
        this.canvas.addEventListener("pointermove", ev => {
            const t = ev.clientX;
            const x = ev.clientY;
            if ("undefined" !== typeof lastT && t >= lastT) {
                universe.refresh(lastT, t + 1);
            }
            for (let _x = 0; _x < deck.selectedCard.cardSpace.length; _x++) {
                universe.spacetime[t][x + _x] = deck.selectedCard.cardSpace[_x];
            }
            universe.refresh(t + 1);
            lastT = t;
        });
    }

    setPixel(x: number, y: number, value: number) {
        this.imageData.setPixel(x, y, this.colorMap[value]);
    }

    render() {
        for (let t = 0; t < universe.spacetime.length; t++) {
            const space = universe.spacetime[t];
            for (let x = 0; x < space.length; x++) {
                this.setPixel(t, x, space[x]);
            }
        }
        this.ctx.putImageData(this.imageData, 0, 0);
    }
}
