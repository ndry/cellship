{
    const _Math_random = Math.random;
    Math.random = function () {
        console.warn("Use of built-in Math.random()!");
        return _Math_random();
    }
}

import { Application } from "./Application";

const app = new Application();
Object.assign(window, {app});
app.run();

