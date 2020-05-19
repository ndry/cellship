
export class FpsMeter {
    fpsHistoricalFactor = 0.96;

    lastUpdate: number | undefined = undefined;
    fps: number | undefined = undefined;
    fpsHistorical: number | undefined = undefined;

    update(time: number) {
        if ("undefined" !== typeof this.lastUpdate) {
            this.fps = 1000 / (time - this.lastUpdate);
            if ("undefined" === typeof this.fpsHistorical) {
                this.fpsHistorical = this.fps;
            } else {
                this.fpsHistorical =
                    this.fpsHistorical * this.fpsHistoricalFactor
                    + this.fps * (1 - this.fpsHistoricalFactor);
            }
        }
        this.lastUpdate = time;
    }
}
