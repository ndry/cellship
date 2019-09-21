// https://en.wikipedia.org/wiki/Lehmer_random_number_generator
System.register("utils/LehmerPrng", [], function (exports_1, context_1) {
    var MAX_INT32, MINSTD, LehmerPrng;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {// https://en.wikipedia.org/wiki/Lehmer_random_number_generator
            MAX_INT32 = 2147483647;
            MINSTD = 16807;
            LehmerPrng = class LehmerPrng {
                constructor(seed) {
                    if (!Number.isInteger(seed)) {
                        throw new TypeError("Expected `seed` to be a `integer`");
                    }
                    this.seed = seed % MAX_INT32;
                    if (this.seed <= 0) {
                        this.seed += (MAX_INT32 - 1);
                    }
                }
                next() {
                    return this.seed = this.seed * MINSTD % MAX_INT32;
                }
                nextFloat() {
                    return (this.next() - 1) / (MAX_INT32 - 1);
                }
            };
            exports_1("LehmerPrng", LehmerPrng);
        }
    };
});
System.register("Universe", ["utils/LehmerPrng", "app"], function (exports_2, context_2) {
    var LehmerPrng_1, app_1, Universe;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (LehmerPrng_1_1) {
                LehmerPrng_1 = LehmerPrng_1_1;
            },
            function (app_1_1) {
                app_1 = app_1_1;
            }
        ],
        execute: function () {
            Universe = class Universe {
                constructor() {
                    this.spaceSize = 970;
                    this.timeSize = 1920;
                    this.spacetime = Array.from({ length: this.timeSize }, () => new Uint8Array(this.spaceSize));
                    this.step = 0;
                    const t = this.spacetime.length - 1;
                    for (let x = 0; x < this.spacetime[t].length; x++) {
                        this.spacetime[t][x] = Universe.getRandomState();
                    }
                    for (let _ = 0; _ < this.spacetime.length; _++) {
                        this.iterate();
                    }
                }
                static getRandomState() {
                    return Universe.random.next() % app_1.rule.stateCount;
                }
                updateCell(t, x) {
                    this.spacetime[t][x] = app_1.rule.getState(this.spacetime, t, x);
                }
                iterate() {
                    this.spacetime.push(this.spacetime.shift());
                    const t = this.spacetime.length - 1;
                    const nr = app_1.rule.spaceNeighbourhoodRadius;
                    for (let x = 0; x < nr; x++) {
                        this.spacetime[t][x] = Universe.getRandomState();
                        this.spacetime[t][this.spacetime[t].length - 1 - x] = Universe.getRandomState();
                    }
                    for (let x = nr; x < this.spacetime[t].length - nr; x++) {
                        this.updateCell(t, x);
                    }
                    this.step++;
                }
                refresh(fromT, toT) {
                    const nr = app_1.rule.spaceNeighbourhoodRadius;
                    const _toT = "undefined" === typeof toT ? this.spacetime.length : toT;
                    for (let t = fromT; t < _toT; t++) {
                        for (let x = nr; x < this.spacetime[t].length - nr; x++) {
                            this.updateCell(t, x);
                        }
                    }
                }
            };
            exports_2("Universe", Universe);
            Universe.random = new LehmerPrng_1.LehmerPrng(4242);
        }
    };
});
System.register("utils/misc", [], function (exports_3, context_3) {
    var __moduleName = context_3 && context_3.id;
    function isVisible(elt) {
        const style = window.getComputedStyle(elt);
        return (style.width !== null && +style.width !== 0)
            && (style.height !== null && +style.height !== 0)
            && (style.opacity !== null && +style.opacity !== 0)
            && style.display !== "none"
            && style.visibility !== "hidden";
    }
    exports_3("isVisible", isVisible);
    function tap(x, ...applyAdjustmentList) {
        for (const applyAdjustment of applyAdjustmentList) {
            applyAdjustment(x);
        }
        return x;
    }
    exports_3("tap", tap);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("utils/ImageDataUint32", [], function (exports_4, context_4) {
    var ImageDataUint32;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            ImageDataUint32 = class ImageDataUint32 extends ImageData {
                constructor(imageData) {
                    super(imageData.data, imageData.width, imageData.height);
                    this.dataUint32 = new Uint32Array(this.data.buffer);
                }
                setPixel(x, y, abgr) {
                    this.dataUint32[y * this.width + x] = abgr;
                }
            };
            exports_4("ImageDataUint32", ImageDataUint32);
        }
    };
});
System.register("UniverseView", ["utils/misc", "app", "utils/ImageDataUint32"], function (exports_5, context_5) {
    var misc_1, app_2, ImageDataUint32_1, UniverseView;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (misc_1_1) {
                misc_1 = misc_1_1;
            },
            function (app_2_1) {
                app_2 = app_2_1;
            },
            function (ImageDataUint32_1_1) {
                ImageDataUint32_1 = ImageDataUint32_1_1;
            }
        ],
        execute: function () {
            UniverseView = class UniverseView {
                constructor() {
                    this.canvas = misc_1.tap(document.getElementById("canvas"), c => {
                        c.width = app_2.universe.timeSize;
                        c.height = app_2.universe.spaceSize;
                    });
                    this.ctx = misc_1.tap(this.canvas.getContext("2d"), ctx => {
                        ctx.imageSmoothingEnabled = false;
                    });
                    this.imageData = new ImageDataUint32_1.ImageDataUint32(this.ctx.createImageData(app_2.universe.timeSize, app_2.universe.spaceSize));
                    this.colorMap = [0xFF000000, 0xFF808080, 0xFFFFFFFF];
                    let lastT = undefined;
                    this.canvas.addEventListener("pointermove", ev => {
                        const t = ev.clientX;
                        const x = ev.clientY;
                        if ("undefined" !== typeof lastT && t >= lastT) {
                            app_2.universe.refresh(lastT, t + 1);
                        }
                        for (let _x = 0; _x < app_2.deck.selectedCard.cardSpace.length; _x++) {
                            app_2.universe.spacetime[t][x + _x] = app_2.deck.selectedCard.cardSpace[_x];
                        }
                        app_2.universe.refresh(t + 1);
                        lastT = t;
                    });
                }
                setPixel(x, y, value) {
                    this.imageData.setPixel(x, y, this.colorMap[value]);
                }
                render() {
                    for (let t = 0; t < app_2.universe.spacetime.length; t++) {
                        const space = app_2.universe.spacetime[t];
                        for (let x = 0; x < space.length; x++) {
                            this.setPixel(t, x, space[x]);
                        }
                    }
                    this.ctx.putImageData(this.imageData, 0, 0);
                }
            };
            exports_5("UniverseView", UniverseView);
        }
    };
});
System.register("Rule", [], function (exports_6, context_6) {
    var Rule;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
            Rule = class Rule {
                constructor() {
                    this.stateCount = 3;
                    this.ruleSpaceSizePower = 3 * (this.stateCount - 1) + 1;
                    this.spaceNeighbourhoodRadius = 1;
                    this.code = 1815;
                    this.tableString = (this.code).toString(this.stateCount).padStart(this.ruleSpaceSizePower, "0");
                    this.table = Array.from(this.tableString).reverse().map(x => +x);
                }
                getState(spacetime, t, x) {
                    const sum = spacetime[t - 1][x - 1]
                        + spacetime[t - 1][x]
                        + spacetime[t - 1][x + 1];
                    return this.table[sum];
                }
            };
            exports_6("Rule", Rule);
        }
    };
});
System.register("CardView", ["utils/misc", "utils/ImageDataUint32"], function (exports_7, context_7) {
    var misc_2, ImageDataUint32_2, CardView;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (misc_2_1) {
                misc_2 = misc_2_1;
            },
            function (ImageDataUint32_2_1) {
                ImageDataUint32_2 = ImageDataUint32_2_1;
            }
        ],
        execute: function () {
            CardView = class CardView {
                constructor(card) {
                    this.card = card;
                    this.canvas = misc_2.tap(document.createElement("canvas"), c => {
                        c.width = this.card.timeSize;
                        c.height = this.card.spaceSize;
                    });
                    this.ctx = misc_2.tap(this.canvas.getContext("2d"), ctx => {
                        ctx.imageSmoothingEnabled = false;
                    });
                    this.imageData = new ImageDataUint32_2.ImageDataUint32(this.ctx.createImageData(this.card.timeSize, this.card.spaceSize));
                    this.colorMap = [0xFF000000, 0xFF808080, 0xFFFFFFFF];
                    this.render();
                }
                setPixel(x, y, value) {
                    this.imageData.setPixel(x, y, this.colorMap[value]);
                }
                render() {
                    for (let t = 0; t < this.card.spacetime.length; t++) {
                        const space = this.card.spacetime[t];
                        for (let x = 0; x < space.length; x++) {
                            this.setPixel(t, x, space[x]);
                        }
                    }
                    this.ctx.putImageData(this.imageData, 0, 0);
                }
            };
            exports_7("CardView", CardView);
        }
    };
});
System.register("DeckView", ["CardView", "app"], function (exports_8, context_8) {
    var CardView_1, app_3, DeckView;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (CardView_1_1) {
                CardView_1 = CardView_1_1;
            },
            function (app_3_1) {
                app_3 = app_3_1;
            }
        ],
        execute: function () {
            DeckView = class DeckView {
                constructor() {
                    this.el = document.getElementById("deck");
                    for (let i = 0; i < app_3.deck.cards.length; i++) {
                        const card = app_3.deck.cards[i];
                        const cardView = new CardView_1.CardView(card);
                        this.el.appendChild(cardView.canvas);
                        cardView.canvas.addEventListener("click", () => app_3.deck.selectedCard = card);
                    }
                }
            };
            exports_8("DeckView", DeckView);
        }
    };
});
System.register("Deck", ["Card"], function (exports_9, context_9) {
    var Card_1, Deck;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (Card_1_1) {
                Card_1 = Card_1_1;
            }
        ],
        execute: function () {
            Deck = class Deck {
                constructor() {
                    this.cards = Array.from({ length: 100 }, () => Card_1.Card.generateRandomCard());
                    this.selectedCard = this.cards[0];
                }
            };
            exports_9("Deck", Deck);
        }
    };
});
System.register("app", ["Universe", "utils/LehmerPrng", "UniverseView", "Rule", "DeckView", "Deck"], function (exports_10, context_10) {
    var Universe_1, LehmerPrng_2, UniverseView_1, Rule_1, DeckView_1, Deck_1, random, deckRandom, rule, universe, universeView, deck, deckView;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (Universe_1_1) {
                Universe_1 = Universe_1_1;
            },
            function (LehmerPrng_2_1) {
                LehmerPrng_2 = LehmerPrng_2_1;
            },
            function (UniverseView_1_1) {
                UniverseView_1 = UniverseView_1_1;
            },
            function (Rule_1_1) {
                Rule_1 = Rule_1_1;
            },
            function (DeckView_1_1) {
                DeckView_1 = DeckView_1_1;
            },
            function (Deck_1_1) {
                Deck_1 = Deck_1_1;
            }
        ],
        execute: function () {
            {
                const _Math_random = Math.random;
                Math.random = function () {
                    console.warn("Use of built-in Math.random()!");
                    return _Math_random();
                };
            }
            exports_10("random", random = new LehmerPrng_2.LehmerPrng(433783));
            exports_10("deckRandom", deckRandom = new LehmerPrng_2.LehmerPrng(433783));
            exports_10("rule", rule = new Rule_1.Rule());
            exports_10("universe", universe = new Universe_1.Universe());
            exports_10("universeView", universeView = new UniverseView_1.UniverseView());
            exports_10("deck", deck = new Deck_1.Deck());
            exports_10("deckView", deckView = new DeckView_1.DeckView());
        }
    };
});
System.register("Card", ["app"], function (exports_11, context_11) {
    var app_4, Card;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (app_4_1) {
                app_4 = app_4_1;
            }
        ],
        execute: function () {
            Card = class Card {
                constructor(cardSpace) {
                    this.cardSpace = cardSpace;
                    const spaceSize = this.cardSize * 12 + 1;
                    const timeSize = spaceSize;
                    this.spacetime = Array.from({ length: timeSize }, () => new Uint8Array(spaceSize));
                    const xMargin = (this.spacetime[0].length - this.cardSpace.length) / 2;
                    for (let x = 0; x < this.cardSpace.length; x++) {
                        this.spacetime[0][x + xMargin] = this.cardSpace[x];
                    }
                    const nr = app_4.rule.spaceNeighbourhoodRadius;
                    for (let t = 1; t < this.spacetime.length; t++) {
                        const space = this.spacetime[t];
                        for (let x = nr; x < space.length - nr; x++) {
                            space[x] = app_4.rule.getState(this.spacetime, t, x);
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
                static getRandomState() {
                    return app_4.deckRandom.next() % app_4.rule.stateCount;
                }
                static createCardFromString(cardString) {
                    return new Card(new Uint8Array(Array.from(cardString).map(x => +x)));
                }
                static generateRandomCard() {
                    const cardSize = 45;
                    return new Card(new Uint8Array(Array.from({ length: cardSize }, () => Card.getRandomState())));
                }
                get cardSize() { return this.cardSpace.length; }
                get spaceSize() { return this.spacetime[0].length; }
                get timeSize() { return this.spacetime.length; }
            };
            exports_11("Card", Card);
        }
    };
});
System.register("main", ["app"], function (exports_12, context_12) {
    var app_5, fpsDisplay, updatesPerFrameDisplay, stepDisplay, updatesPerFrame, paused, lastIteration;
    var __moduleName = context_12 && context_12.id;
    function render() {
        const now = Date.now();
        const fps = 1000 / (now - lastIteration);
        lastIteration = now;
        fpsDisplay.textContent = "fps: " + fps.toFixed(2);
        updatesPerFrameDisplay.textContent = "updates per frame: " + updatesPerFrame;
        stepDisplay.textContent = "step: " + app_5.universe.step;
        app_5.universeView.render();
    }
    function requestAnimationFrameCallback() {
        for (let _ = 0; _ < updatesPerFrame; _++) {
            if (paused) {
                break;
            }
            app_5.universe.iterate();
        }
        render();
        requestAnimationFrame(requestAnimationFrameCallback);
    }
    return {
        setters: [
            function (app_5_1) {
                app_5 = app_5_1;
            }
        ],
        execute: function () {
            fpsDisplay = document.getElementById("fps");
            updatesPerFrameDisplay = document.getElementById("updatesPerFrame");
            stepDisplay = document.getElementById("step");
            updatesPerFrame = 100;
            paused = false;
            window.addEventListener("keypress", ev => {
                console.log(ev.code);
                switch (ev.code) {
                    case "Space": {
                        paused = !paused;
                        break;
                    }
                }
            });
            lastIteration = Date.now();
            requestAnimationFrame(requestAnimationFrameCallback);
        }
    };
});
//# sourceMappingURL=app.js.map