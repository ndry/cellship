import {Weapon, WeaponData} from "./Weapon";
import { LehmerPrng } from "./utils/LehmerPrng";
import { Rule } from "./Rule";

export class Weaponary {
    random = new LehmerPrng(Math.floor(Date.now()));

    generateRandomWeapon() {
        const getRandomState = () => {
            return this.random.next() % this.rule.stateCount;
        }
        const size = 45;

        return new Weapon(
            this.rule,
            Array.from({length: size}, getRandomState),
            Array.from({length: size}, getRandomState),
        );
    }

    save() {
        localStorage.setItem(
            `${this.rule.code}_weaponary`, 
            JSON.stringify(
                this.weapons.map(
                    w => w.isBookmarked ? w.serialize() : undefined)));
    }

    loadOrGenerate() {
        const itemJson = localStorage.getItem(`${this.rule.code}_weaponary`);
        const weapons: Weapon[] = Array.from({length: 8});
        if (itemJson) {
            const item = JSON.parse(itemJson) as Array<WeaponData | undefined>;
            for (let i = 0; i < weapons.length; i++) {
                const itemi = item[i];
                if (itemi) {
                    weapons[i] = Weapon.deserialize(itemi)(this.rule);
                    weapons[i].isBookmarked = true;
                } else {
                    weapons[i] = this.generateRandomWeapon();
                }
            }
        } else {
            for (let i = 0; i < weapons.length; i++) {
                weapons[i] = this.generateRandomWeapon();
            }
        }
        return weapons;
    }

    constructor(
        public rule: Rule
    ) { 
    }

    weapons = this.loadOrGenerate();
}
