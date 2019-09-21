import {CardView} from "./CardView";
import {deck} from "./app";

export class DeckView {
    el = document.getElementById("deck")!;

    constructor() {
        for (let i = 0; i < deck.cards.length; i++) {
            const card = deck.cards[i];
            const cardView = new CardView(card);
            this.el.appendChild(cardView.canvas);
            cardView.canvas.addEventListener("click", () => deck.selectedCard = card);
        }
    }
}
