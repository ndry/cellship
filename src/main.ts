import * as app from "./app";


Object.assign(window, app);

const initialUps = 300;
const upsStep = 5;
let targetUps = initialUps;

let paused = false;

window.addEventListener("keypress", ev => {
    console.log(ev.code);
    switch (ev.code) {
        case "Space": {
            paused = !paused;
            break;
        }
        case "Backquote": {
            targetUps *= upsStep;
            if (targetUps > initialUps * upsStep) {
                targetUps = initialUps / upsStep;
            }
            break;
        }
    }
});

let lastUpdateTime: number | undefined = undefined;
function requestAnimationFrameCallback(time: number) {
    if ("undefined" !== typeof lastUpdateTime) {
        while (lastUpdateTime < time) {
            app.update(lastUpdateTime);
            lastUpdateTime += 1000 / targetUps;
        }
    } else {
        lastUpdateTime = time;
    }
    app.render(time);
    requestAnimationFrame(requestAnimationFrameCallback);
}

requestAnimationFrame(requestAnimationFrameCallback);


