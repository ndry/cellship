import {deckRandom, rule} from "./app";

export class Card {
    static getRandomState() {
        return deckRandom.next() % rule.stateCount;
    }

    static createCardFromString(cardString: string) {
        return new Card(new Uint8Array(Array.from(cardString).map(x => +x)));
    }

    static generateRandomCard() {
        const cardSize = 45;
        return new Card(new Uint8Array(Array.from({length: cardSize}, () => Card.getRandomState())));
    }

    get cardSize() { return this.cardSpace.length; }

    readonly spacetime: Uint8Array[];

    get spaceSize() { return this.spacetime[0].length; }
    get timeSize() { return this.spacetime.length; }

    constructor(
        public readonly cardSpace: ArrayLike<number>,
    ) {
        const spaceSize = this.cardSize * 12 + 1;
        const timeSize = spaceSize;
        this.spacetime = Array.from({length: timeSize}, () => new Uint8Array(spaceSize));

        const xMargin = (this.spacetime[0].length - this.cardSpace.length) / 2;
        for (let x = 0; x < this.cardSpace.length; x++) {
            this.spacetime[0][x + xMargin] = this.cardSpace[x];
        }
        const nr = rule.spaceNeighbourhoodRadius;
        for (let t = 1; t < this.spacetime.length; t++) {
            const space = this.spacetime[t];
            for (let x = nr; x < space.length - nr; x++) {
                space[x] = rule.getState(this.spacetime, t, x);
            }
        }
        for (let t = 0; t < timeSize; t++) {
            const space = new Uint8Array(this.cardSize * 2 + 1);
            const xMargin = (spaceSize - space.length) / 2;
            for (let x = 0; x < space.length; x++) {
                space[x] = this.spacetime[t][x + xMargin];
            }
            this.spacetime[t] = space;
        }
    }
}
