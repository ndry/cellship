import {WeaponView} from "./WeaponView";
import { Weaponary } from "./Weaponary";

export class WeaponaryView {
    el = document.getElementById("deck")!;

    keys = ["A", "S", "D", "F", "Z", "X", "C", "V"];

    constructor(
        public weaponary: Weaponary
    ) {
    }

    weaponViews = this.weaponary.weapons.map((weapon, i) => {
        const weaponView = new WeaponView(weapon, this.keys[i]);
        this.el.appendChild(weaponView.html);
        return weaponView;
    })
}
