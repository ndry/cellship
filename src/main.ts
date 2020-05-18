import {universe, universeView, inputs} from "./app";
import * as app from "./app";
import { Universe } from "./Universe";
const fpsDisplay = document.getElementById("fps") as HTMLDivElement;
const updatesPerFrameDisplay = document.getElementById("updatesPerFrame") as HTMLDivElement;
const stepDisplay = document.getElementById("step") as HTMLDivElement;

Object.assign(window, app);


let updatesPerFrame = 10;

let paused = false;

window.addEventListener("keypress", ev => {
    console.log(ev.code);
    switch (ev.code) {
        case "Space": {
            paused = !paused;
            break;
        }
        case "Backquote": {
            switch (updatesPerFrame) {
                case 1: 
                    updatesPerFrame = 10;
                    break;
                case 10: 
                    updatesPerFrame = 100;
                    break;
                case 100: 
                    updatesPerFrame = 1;
                    break;
            }
            break;
        }
    }
});

let lastIteration = Date.now();

function render() {
    const now = Date.now();
    const fps = 1000 / (now - lastIteration);
    lastIteration = now;

    fpsDisplay.textContent = "fps: " + fps.toFixed(2);
    updatesPerFrameDisplay.textContent = "updates per frame: " + updatesPerFrame;
    stepDisplay.textContent = "step: " + universe.spacetime.timeOffset;
    universeView.render();

}

function requestAnimationFrameCallback() {
    // engine.update();
    for (let _ = 0; _ < updatesPerFrame; _++) {
        if (paused) {
            break;
        }
        
        universe.update();
    }
    render();
    inputs.tick();
    requestAnimationFrame(requestAnimationFrameCallback);
}

requestAnimationFrame(requestAnimationFrameCallback);
