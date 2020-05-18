import {Card} from "./Card";

export class Deck {
    cards = Array.from({length: 8}, () => Card.generateRandomCard());
    selectedCard = this.cards[0];
}
