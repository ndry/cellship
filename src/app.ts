import {Universe} from "./Universe";
import {LehmerPrng} from "./utils/LehmerPrng";
import {UniverseView} from "./UniverseView";
import {Rule} from "./Rule";
import {DeckView} from "./DeckView";
import {Deck} from "./Deck";
import createInputs from "game-inputs";

{
    const _Math_random = Math.random;
    Math.random = function () {
        console.warn("Use of built-in Math.random()!");
        return _Math_random();
    }
}

export const random = new LehmerPrng(433783);
export const deckRandom = new LehmerPrng(433783);
export const rule = new Rule();
export const universe = new Universe();
export const universeView = new UniverseView();
export const deck = new Deck();
export const deckView = new DeckView();
export const inputs = createInputs();

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
