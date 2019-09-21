export class ImageDataUint32 extends ImageData {
    public dataUint32: Uint32Array;

    constructor(imageData: ImageData) {
        super(imageData.data, imageData.width, imageData.height);
        this.dataUint32 = new Uint32Array(this.data.buffer);
    }

    setPixel(x: number, y: number, abgr: number) {
        this.dataUint32[y * this.width + x] = abgr;
    }
}
