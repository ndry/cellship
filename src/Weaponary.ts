import {Weapon} from "./Weapon";
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
            Array.from({length: size}, getRandomState)
        );
    }

    save() {
        localStorage.setItem(
            `${this.rule.id}_weaponary`, 
            JSON.stringify(
                this.weapons.map(w => w.isBookmarked ? w.space : undefined)));
    }

    loadOrGenerate() {
        const itemJson = localStorage.getItem(`${this.rule.id}_weaponary`);
        const weapons: Weapon[] = Array.from({length: 8});
        if (itemJson !== null) {
            const item = JSON.parse(itemJson) as Array<number[] | undefined>;
            for (let i = 0; i < weapons.length; i++) {
                const itemi = item[i];
                if (itemi) {
                    weapons[i] = new Weapon(this.rule, itemi);
                    weapons[i].isBookmarked = true;
                } else {
                    weapons[i] = this.generateRandomWeapon();
                }
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
