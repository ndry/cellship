import {universe, universeView} from "./app";
const fpsDisplay = document.getElementById("fps") as HTMLDivElement;
const updatesPerFrameDisplay = document.getElementById("updatesPerFrame") as HTMLDivElement;
const stepDisplay = document.getElementById("step") as HTMLDivElement;




let updatesPerFrame = 100;

let paused = false;

window.addEventListener("keypress", ev => {
    console.log(ev.code);
    switch (ev.code) {
        case "Space": {
            paused = !paused;
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
    stepDisplay.textContent = "step: " + universe.step;
    universeView.render();

}

function requestAnimationFrameCallback() {
    for (let _ = 0; _ < updatesPerFrame; _++) {
        if (paused) {
            break;
        }
        universe.iterate();
    }
    render();
    requestAnimationFrame(requestAnimationFrameCallback);
}

requestAnimationFrame(requestAnimationFrameCallback);
