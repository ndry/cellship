import {tap} from "./utils/misc";
import {ImageDataUint32} from "./utils/ImageDataUint32";
import {Weapon} from "./Weapon";

export class WeaponView {
    canvas = tap(
        document.createElement("canvas"),
        c => {
            c.width = this.weapon.timeSize;
            c.height = this.weapon.spaceSize;
        });
    ctx = tap(
        this.canvas.getContext("2d")!,
        ctx => {
            ctx.imageSmoothingEnabled = false;
        });
    imageData = new ImageDataUint32(
        this.ctx.createImageData(
            this.weapon.timeSize,
            this.weapon.spaceSize));
    colorMap = [0xFF000000, 0xFF808080, 0xFFFFFFFF];
    colorBookmarkedMap = [0xFF000000, 0xFF800080, 0xFFFF00FF];

    constructor(
        public weapon: Weapon,
    ) {
        this.render();
    }

    setPixel(x: number, y: number, value: number) {
        const colorMap = this.weapon.isBookmarked
            ? this.colorBookmarkedMap 
            : this.colorMap;
        this.imageData.setPixel(x, y, colorMap[value]);
    }

    render() {
        for (let t = 0; t < this.weapon.spacetime.length; t++) {
            const space = this.weapon.spacetime[t];
            for (let x = 0; x < space.length; x++) {
                this.setPixel(t, x, space[x]);
            }
        }
        this.ctx.putImageData(this.imageData, 0, 0);
    }
}
