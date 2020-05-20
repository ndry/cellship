import {Universe} from "./Universe";
import {UniverseView} from "./UniverseView";
import {WeaponaryView} from "./WeaponaryView";
import createInputs from "game-inputs";
import { FpsMeter } from "./FpsMeter";
import { tap } from "./utils/misc";
import { Weapon } from "./Weapon";
import { WeaponView } from "./WeaponView";
// import * as Tone from "tone";

export class Application {
    paused = false;

    inputs = tap(
        createInputs(undefined, {preventDefaults: true}),
        inputs => {
            inputs.bind("move-up", "<up>");
            inputs.bind("move-down", "<down>");
            inputs.bind("move-slow", "<left>");
            inputs.bind("move-fast", "<right>");
            inputs.bind("fireWeapon1", "A");
            inputs.bind("fireWeapon2", "S");
            inputs.bind("fireWeapon3", "D");
            inputs.bind("fireWeapon4", "F");
            inputs.bind("fireWeapon5", "Z");
            inputs.bind("fireWeapon6", "X");
            inputs.bind("fireWeapon7", "C");
            inputs.bind("fireWeapon8", "V");
            inputs.bind("reroll", "<control>");
            inputs.bind("bookmark", "<shift>");

            inputs.down.on("fireWeapon1", () => this.fireOrReroll(0));
            inputs.down.on("fireWeapon2", () => this.fireOrReroll(1));
            inputs.down.on("fireWeapon3", () => this.fireOrReroll(2));
            inputs.down.on("fireWeapon4", () => this.fireOrReroll(3));
            inputs.down.on("fireWeapon5", () => this.fireOrReroll(4));
            inputs.down.on("fireWeapon6", () => this.fireOrReroll(5));
            inputs.down.on("fireWeapon7", () => this.fireOrReroll(6));
            inputs.down.on("fireWeapon8", () => this.fireOrReroll(7));
        });
    universe = new Universe();
    universeView = new UniverseView(this.universe);
    weaponaryView = new WeaponaryView(this.universe.player.weaponary);
    // synth = new Tone.Synth().toMaster();

    fpsMeter = new FpsMeter();
    upsMeter = new FpsMeter(); 
    
    update(time: number) {
        this.upsMeter.update(time);
        this.universe.update();
        
        if (this.inputs.state["move-up"] && this.universe.player.canMoveUp()) {
            this.universe.player.moveUp();
        }
        if (this.inputs.state["move-down"] && this.universe.player.canMoveDown()) {
            this.universe.player.moveDown();
        }

        this.inputs.tick();
    }
    
    fpsDisplay = document.getElementById("fps") as HTMLDivElement;
    upsDisplay = document.getElementById("ups") as HTMLDivElement;
    stepDisplay = document.getElementById("step") as HTMLDivElement;

    render(time: number) {
        this.fpsMeter.update(time);

        function renderFpsText(fps: number | undefined) {
            return fps?.toFixed(2) ?? "n/a";
        }
    
        this.fpsDisplay.textContent =
            `fps: ${renderFpsText(this.fpsMeter.fpsHistorical)} (${renderFpsText(this.fpsMeter.fps)})`;
        this.upsDisplay.textContent =
            `ups: ${renderFpsText(this.upsMeter.fpsHistorical)} (${renderFpsText(this.upsMeter.fps)})`;
        this.stepDisplay.textContent =
            "step: " + this.universe.spacetime.timeOffset;
        this.universeView.render();
    }

    

    fireOrReroll(weaponIndex: number) {
        const weaponary = this.weaponaryView.weaponary;
        const weaponaryView = this.weaponaryView;
        const weapon = weaponary.weapons[weaponIndex];
        const weaponView = weaponaryView.weaponViews[weaponIndex];
        
        if (this.inputs.state["reroll"]) {
            if (!weapon.isBookmarked) {
                weaponary.weapons[weaponIndex] = weaponary.generateRandomWeapon();
                weaponView.weapon = weaponary.weapons[weaponIndex];
                weaponView.render();
            }
        } else if (this.inputs.state["bookmark"]) {
            weapon.isBookmarked = !weapon.isBookmarked;
            weaponView.render();
            weaponary.save();
        } else {
            this.universe.player.fire(weapon);
        }
    }

    run() {
        const initialUps = 240;
        const upsStep = 4;
        let targetUps = initialUps;
        window.addEventListener("keypress", ev => {
            console.log(ev.code);
            switch (ev.code) {
                case "Space": {
                    this.paused = !this.paused;
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
        const requestAnimationFrameCallback = (time: number) => {
            let tups = targetUps;
            if (this.inputs.state["move-fast"]) {
                tups *= upsStep;
            }
            if (this.inputs.state["move-slow"]) {
                tups /= upsStep;
            }
            if ("undefined" !== typeof lastUpdateTime) {
                while (lastUpdateTime < time) {
                    if (!this.paused) {
                        this.update(lastUpdateTime);
                    }
                    lastUpdateTime += 1000 / tups;
                }
            } else {
                lastUpdateTime = time;
            }
            this.render(time);
            requestAnimationFrame(requestAnimationFrameCallback);
        }

        requestAnimationFrame(requestAnimationFrameCallback);
    }
}
