import {Universe} from "./Universe";
import {LehmerPrng} from "./utils/LehmerPrng";
import {UniverseView} from "./UniverseView";
import {Rule} from "./Rule";
import {DeckView} from "./DeckView";
import {Deck} from "./Deck";
import createInputs from "game-inputs";
import { FpsMeter } from "./FpsMeter";
// import * as Tone from "tone";

{
    const _Math_random = Math.random;
    Math.random = function () {
        console.warn("Use of built-in Math.random()!");
        return _Math_random();
    }
}

export const inputs = createInputs();
export const random = new LehmerPrng(433783);
export const deckRandom = new LehmerPrng(433783);
export const rule = new Rule();
export const universe = new Universe();
export const universeView = new UniverseView();
export const deck = new Deck();
export const deckView = new DeckView();
// export const synth = new Tone.Synth().toMaster();

inputs.bind("move-up", "<up>");
inputs.bind("move-down", "<down>");
inputs.bind("fire1", "Q");
inputs.bind("fire2", "W");
inputs.bind("fire3", "E");
inputs.bind("fire4", "R");
inputs.bind("fire5", "A");
inputs.bind("fire6", "S");
inputs.bind("fire7", "D");
inputs.bind("fire8", "F");

const fpsMeter = new FpsMeter();
const upsMeter = new FpsMeter();

export function update(time: number) {
    upsMeter.update(time);
    universe.update();
    inputs.tick();
}

const fpsDisplay = document.getElementById("fps") as HTMLDivElement;
const upsDisplay = document.getElementById("ups") as HTMLDivElement;
const stepDisplay = document.getElementById("step") as HTMLDivElement;

export function render(time: number) {
    fpsMeter.update(time);

    fpsDisplay.textContent =
        `fps: ${fpsMeter.fpsHistorical?.toFixed(2) ?? "n/a"} (${fpsMeter.fps?.toFixed(2) ?? "n/a"})`;
    upsDisplay.textContent =
        `ups: ${upsMeter.fpsHistorical?.toFixed(2) ?? "n/a"} (${upsMeter.fps?.toFixed(2) ?? "n/a"})`;
    stepDisplay.textContent = "step: " + universe.spacetime.timeOffset;
    universeView.render();
}


