import {WeaponView} from "./WeaponView";
import { Weaponary } from "./Weaponary";

export class WeaponaryView {
    el = document.getElementById("deck")!;

    constructor(
        public weaponary: Weaponary
    ) {
    }

    weaponViews = this.weaponary.weapons.map(weapon => {
        const weaponView = new WeaponView(weapon);
        this.el.appendChild(weaponView.canvas);
        return weaponView;
    })
}
