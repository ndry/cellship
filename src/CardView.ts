import {tap} from "./utils/misc";
import {ImageDataUint32} from "./utils/ImageDataUint32";
import {Card} from "./Card";

export class CardView {
    canvas = tap(
        document.createElement("canvas"),
        c => {
            c.width = this.card.timeSize;
            c.height = this.card.spaceSize;
        });
    ctx = tap(
        this.canvas.getContext("2d")!,
        ctx => {
            ctx.imageSmoothingEnabled = false;
        });
    imageData = new ImageDataUint32(
        this.ctx.createImageData(
            this.card.timeSize,
            this.card.spaceSize));
    colorMap = [0xFF000000, 0xFF808080, 0xFFFFFFFF];

    constructor(
        public readonly card: Card,
    ) {
        this.render();
    }

    setPixel(x: number, y: number, value: number) {
        this.imageData.setPixel(x, y, this.colorMap[value]);
    }

    render() {
        for (let t = 0; t < this.card.spacetime.length; t++) {
            const space = this.card.spacetime[t];
            for (let x = 0; x < space.length; x++) {
                this.setPixel(t, x, space[x]);
            }
        }
        this.ctx.putImageData(this.imageData, 0, 0);
    }
}
