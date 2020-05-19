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
System.register("utils/misc", [], function (exports_2, context_2) {
    var __moduleName = context_2 && context_2.id;
    function isVisible(elt) {
        const style = window.getComputedStyle(elt);
        return (style.width !== null && +style.width !== 0)
            && (style.height !== null && +style.height !== 0)
            && (style.opacity !== null && +style.opacity !== 0)
            && style.display !== "none"
            && style.visibility !== "hidden";
    }
    exports_2("isVisible", isVisible);
    function tap(x, ...applyAdjustmentList) {
        for (const applyAdjustment of applyAdjustmentList) {
            applyAdjustment(x);
        }
        return x;
    }
    exports_2("tap", tap);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("PlayerShip", ["app", "Projectile"], function (exports_3, context_3) {
    var app_1, Projectile_1, PlayerShip;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (app_1_1) {
                app_1 = app_1_1;
            },
            function (Projectile_1_1) {
                Projectile_1 = Projectile_1_1;
            }
        ],
        execute: function () {
            PlayerShip = class PlayerShip {
                constructor() {
                    this.time = 100;
                    this.size = 51;
                    this.lastSizeChangeStep = 0;
                }
                get spacetime() { return this.universe.spacetime; }
                get bottomX() {
                    return this.topX + this.size;
                }
                isObstacle(x) {
                    const cell = this.spacetime.getSpaceAtTime(this.spacetime.timeOffset + this.time)[x];
                    return ("undefined" === typeof cell.projectile) && cell.value > 0;
                }
                canMoveDown() {
                    return !this.isObstacle(this.bottomX + 1);
                }
                canMoveUp() {
                    return !this.isObstacle(this.topX + 1);
                }
                moveDown() {
                    this.topX += 1;
                }
                moveUp() {
                    this.topX -= 1;
                }
                resetGrowth() {
                    this.lastSizeChangeStep = this.spacetime.timeOffset;
                }
                get growthTime() {
                    return this.spacetime.timeOffset - this.lastSizeChangeStep;
                }
                fire(card) {
                    var _a;
                    const t = this.spacetime.timeOffset + this.time;
                    const projectile = new Projectile_1.Projectile();
                    projectile.owner = this;
                    projectile.timeCreated = t;
                    projectile.timePosition = t + 1;
                    this.universe.projectiles.push(projectile);
                    const tSpace = this.spacetime.getSpaceAtTime(t);
                    for (let x = this.topX; x <= this.bottomX; x++) {
                        const cell = tSpace[x];
                        const cardX = x - (this.topX + (this.size - 1) / 2 + 1) + (card.cardSize - 1) / 2 + 1;
                        // if (cell.value !== card.cardSpace[cardX] ?? 0) {
                        cell.stepUpated = this.spacetime.timeOffset;
                        // }
                        cell.value = (_a = card.cardSpace[cardX]) !== null && _a !== void 0 ? _a : 0;
                        cell.projectile = projectile;
                    }
                }
                update() {
                    if (this.growthTime >= 100) {
                        this.size += 2;
                        this.topX -= 1;
                        this.resetGrowth();
                    }
                    while (this.isObstacle(this.topX)) {
                        if (this.canMoveDown()) {
                            this.moveDown();
                        }
                        else {
                            this.size -= 2;
                            this.moveDown();
                        }
                        this.resetGrowth();
                    }
                    while (this.isObstacle(this.bottomX)) {
                        if (this.canMoveUp()) {
                            this.moveUp();
                        }
                        else {
                            this.size -= 2;
                        }
                        this.resetGrowth();
                    }
                    if (app_1.inputs.state["move-up"] && this.canMoveUp()) {
                        this.moveUp();
                    }
                    if (app_1.inputs.state["move-down"] && this.canMoveDown()) {
                        this.moveDown();
                    }
                    if (app_1.inputs.state["fire1"]) {
                        this.fire(app_1.deck.cards[0]);
                        app_1.inputs.state["fire1"] = false;
                    }
                    if (app_1.inputs.state["fire2"]) {
                        this.fire(app_1.deck.cards[1]);
                        app_1.inputs.state["fire2"] = false;
                    }
                    if (app_1.inputs.state["fire3"]) {
                        this.fire(app_1.deck.cards[2]);
                        app_1.inputs.state["fire3"] = false;
                    }
                    if (app_1.inputs.state["fire4"]) {
                        this.fire(app_1.deck.cards[3]);
                        app_1.inputs.state["fire4"] = false;
                    }
                    if (app_1.inputs.state["fire5"]) {
                        this.fire(app_1.deck.cards[4]);
                        app_1.inputs.state["fire5"] = false;
                    }
                    if (app_1.inputs.state["fire6"]) {
                        this.fire(app_1.deck.cards[5]);
                        app_1.inputs.state["fire6"] = false;
                    }
                    if (app_1.inputs.state["fire7"]) {
                        this.fire(app_1.deck.cards[6]);
                        app_1.inputs.state["fire7"] = false;
                    }
                    if (app_1.inputs.state["fire8"]) {
                        this.fire(app_1.deck.cards[7]);
                        app_1.inputs.state["fire8"] = false;
                    }
                }
            };
            exports_3("PlayerShip", PlayerShip);
        }
    };
});
System.register("Projectile", ["app"], function (exports_4, context_4) {
    var app_2, Projectile;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (app_2_1) {
                app_2 = app_2_1;
            }
        ],
        execute: function () {
            Projectile = class Projectile {
                constructor() {
                    this.timeVelocity = 10;
                }
                get universe() { return this.owner.universe; }
                get spacetime() { return this.universe.spacetime; }
                getValue(cell) {
                    if (cell.projectile == this || "undefined" === typeof cell.projectile) {
                        return cell.value;
                    }
                    return 0;
                }
                ;
                updateSpace(t) {
                    const nr = app_2.rule.spaceNeighbourhoodRadius;
                    const prevSpace = this.spacetime.getSpaceAtTime(t - 1);
                    const tSpace = this.spacetime.getSpaceAtTime(t);
                    let owned = 0;
                    const lnr = tSpace.length - nr;
                    const timeOffset = this.spacetime.timeOffset;
                    const prevTimeOffset = timeOffset - 1;
                    let prevCell1 = prevSpace[0];
                    let prevCell2 = prevSpace[0];
                    let prevCell3 = prevSpace[1];
                    for (let x = nr; x < lnr; x++) {
                        prevCell1 = prevCell2;
                        prevCell2 = prevCell3;
                        prevCell3 = prevSpace[x + 1];
                        if (prevCell1.stepUpated !== timeOffset
                            && prevCell1.stepUpated !== prevTimeOffset
                            && prevCell2.stepUpated !== timeOffset
                            && prevCell2.stepUpated !== prevTimeOffset
                            && prevCell3.stepUpated !== timeOffset
                            && prevCell3.stepUpated !== prevTimeOffset) {
                            continue;
                        }
                        const cell = tSpace[x];
                        const value = app_2.rule.getState3(this.getValue(prevCell1), this.getValue(prevCell2), this.getValue(prevCell3));
                        if (value === 0
                            && cell.value !== 0
                            && cell.projectile
                            && cell.projectile !== this) {
                            continue;
                        }
                        let owner = undefined;
                        if (value > 0) {
                            const valuedCellsOwners = [prevCell1, prevCell2, prevCell3]
                                .filter(c => c.value > 0
                                && (c.projectile == this || "undefined" === typeof c.projectile))
                                .map(c => c.projectile);
                            owner = valuedCellsOwners.length === 0 ? undefined
                                : valuedCellsOwners.reduce((acc, o) => acc && o);
                        }
                        if (cell.value != value || cell.projectile != owner) {
                            cell.stepUpated = this.spacetime.timeOffset;
                        }
                        cell.value = value;
                        cell.projectile = owner;
                        cell.dim =
                            this.spacetime.timeOffset - (this.timePosition - t) / this.timeVelocity;
                        if (cell.projectile === this) {
                            owned++;
                        }
                    }
                    return owned;
                }
                update() {
                    const timeEndOfPrediction = this.spacetime.timeOffset + this.spacetime.timeSize;
                    if (this.timePosition < timeEndOfPrediction) {
                        for (let t = this.timePosition; t < Math.min(this.timePosition + this.timeVelocity, timeEndOfPrediction); t++) {
                            this.updateSpace(t);
                        }
                    }
                    else {
                        const owned = this.updateSpace(timeEndOfPrediction - 1);
                        if ((this.timePosition - this.timeVelocity * 1000) >= timeEndOfPrediction && owned === 0) {
                            app_2.universe.projectiles.splice(app_2.universe.projectiles.indexOf(this), 1);
                        }
                    }
                    this.timePosition += this.timeVelocity;
                }
            };
            exports_4("Projectile", Projectile);
        }
    };
});
System.register("Spacetime", [], function (exports_5, context_5) {
    var Spacetime;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
            Spacetime = class Spacetime {
                constructor(spaceSize = 770, timeSize = 1920) {
                    this.spaceSize = spaceSize;
                    this.timeSize = timeSize;
                    this.timeOffset = 0;
                    this.data = Array.from({ length: timeSize }, () => Array.from({ length: spaceSize }, () => ({
                        value: 0,
                        projectile: undefined,
                        dim: 1e-5,
                        stepUpated: 0,
                    })));
                }
                performStep() {
                    this.timeOffset++;
                }
                getSpaceAtTime(t) {
                    return this.data[t % this.timeSize];
                }
            };
            exports_5("Spacetime", Spacetime);
        }
    };
});
System.register("Universe", ["utils/LehmerPrng", "app", "utils/misc", "Spacetime", "PlayerShip"], function (exports_6, context_6) {
    var LehmerPrng_1, app_3, misc_1, Spacetime_1, PlayerShip_1, Universe;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (LehmerPrng_1_1) {
                LehmerPrng_1 = LehmerPrng_1_1;
            },
            function (app_3_1) {
                app_3 = app_3_1;
            },
            function (misc_1_1) {
                misc_1 = misc_1_1;
            },
            function (Spacetime_1_1) {
                Spacetime_1 = Spacetime_1_1;
            },
            function (PlayerShip_1_1) {
                PlayerShip_1 = PlayerShip_1_1;
            }
        ],
        execute: function () {
            Universe = /** @class */ (() => {
                class Universe {
                    constructor() {
                        this.spacetime = new Spacetime_1.Spacetime();
                        this.player = misc_1.tap(new PlayerShip_1.PlayerShip(), ps => {
                            ps.universe = this;
                            ps.topX = Math.round((this.spacetime.spaceSize - ps.size) / 2);
                        });
                        this.projectiles = [];
                        const t = this.spacetime.timeSize - 1 + this.spacetime.timeOffset;
                        // for (let x = 0; x < this.spacetime[t].length; x++) {
                        //     this.spacetime[t][x].value = Universe.getRandomState();
                        // }
                        // for (let _ = 0; _ < this.spacetime.length; _++) {
                        //     this.iterate();
                        // }
                    }
                    static getRandomState() {
                        return Universe.random.next() % app_3.rule.stateCount;
                    }
                    fillMostRecentSpace() {
                        const nr = app_3.rule.spaceNeighbourhoodRadius;
                        const t = this.spacetime.timeSize - 1 + this.spacetime.timeOffset;
                        const tSpace = this.spacetime.getSpaceAtTime(t);
                        for (let x = 0; x < nr; x++) {
                            tSpace[x].value = Universe.getRandomState();
                            tSpace[tSpace.length - 1 - x].value = Universe.getRandomState();
                        }
                        for (let x = nr; x < tSpace.length - nr; x++) {
                            const cell = tSpace[x];
                            cell.value = app_3.rule.getState2((t, x) => {
                                var cell = this.spacetime.getSpaceAtTime(t)[x];
                                if ("undefined" === typeof cell.projectile) {
                                    return cell.value;
                                }
                                return 0;
                            }, t, x);
                            cell.projectile = undefined;
                            cell.dim = 0;
                            cell.stepUpated = 0;
                        }
                    }
                    update() {
                        this.spacetime.performStep();
                        this.fillMostRecentSpace();
                        this.player.update();
                        for (const p of [...this.projectiles]) {
                            p.update();
                        }
                    }
                }
                Universe.random = new LehmerPrng_1.LehmerPrng(4242);
                return Universe;
            })();
            exports_6("Universe", Universe);
        }
    };
});
System.register("utils/ImageDataUint32", [], function (exports_7, context_7) {
    var ImageDataUint32;
    var __moduleName = context_7 && context_7.id;
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
            exports_7("ImageDataUint32", ImageDataUint32);
        }
    };
});
System.register("UniverseView", ["utils/misc", "app", "utils/ImageDataUint32"], function (exports_8, context_8) {
    var misc_2, app_4, ImageDataUint32_1, UniverseView;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (misc_2_1) {
                misc_2 = misc_2_1;
            },
            function (app_4_1) {
                app_4 = app_4_1;
            },
            function (ImageDataUint32_1_1) {
                ImageDataUint32_1 = ImageDataUint32_1_1;
            }
        ],
        execute: function () {
            UniverseView = class UniverseView {
                constructor() {
                    this.canvas = misc_2.tap(document.getElementById("canvas"), c => {
                        c.width = app_4.universe.spacetime.timeSize;
                        c.height = app_4.universe.spacetime.spaceSize;
                    });
                    this.ctx = misc_2.tap(this.canvas.getContext("2d"), ctx => {
                        ctx.imageSmoothingEnabled = false;
                    });
                    this.imageData = new ImageDataUint32_1.ImageDataUint32(this.ctx.createImageData(app_4.universe.spacetime.timeSize, app_4.universe.spacetime.spaceSize));
                    this.colorMap = [0xFF000000, 0xFF808080, 0xFFFFFFFF];
                    // let lastT: number | undefined = undefined;
                    // this.canvas.addEventListener("pointermove", ev => {
                    //     const t = ev.clientX;
                    //     const x = ev.clientY;
                    //     if ("undefined" !== typeof lastT && t >= lastT) {
                    //         universe.refresh(lastT, t + 1);
                    //     }
                    //     for (let _x = 0; _x < deck.selectedCard.cardSpace.length; _x++) {
                    //         universe.spacetime[t][x + _x] = deck.selectedCard.cardSpace[_x];
                    //     }
                    //     universe.refresh(t + 1);
                    //     lastT = t;
                    // });
                }
                getCellColor(cell) {
                    let ageFactor = 1000 - (app_4.universe.spacetime.timeOffset - cell.dim);
                    if (ageFactor < 0) {
                        ageFactor = 0;
                    }
                    else {
                        ageFactor *= 0.001;
                        ageFactor *= ageFactor;
                        ageFactor *= ageFactor;
                        ageFactor *= ageFactor;
                        ageFactor *= ageFactor;
                        ageFactor *= ageFactor;
                    }
                    if (cell.value == 0) {
                        return 0xFF000000 + Math.floor(ageFactor * 0x1F);
                    }
                    if (!cell.projectile) {
                        const lum = 0.5 * cell.value * ageFactor;
                        const lumInt = Math.floor(lum * 0x7F);
                        return 0xFF808080 + lumInt - (lumInt << 8) - (lumInt << 16);
                    }
                    {
                        let color = 0xFF << 24;
                        const lum = 0.5 * cell.value * ageFactor;
                        const lumInt = Math.floor((0.05 + 0.95 * lum) * 0xFF);
                        color += lumInt << 8;
                        return color;
                    }
                }
                render() {
                    const w = this.imageData.width;
                    const idd = this.imageData.dataUint32;
                    for (let t = 0; t < app_4.universe.spacetime.timeSize; t++) {
                        const space = app_4.universe.spacetime.getSpaceAtTime(t + app_4.universe.spacetime.timeOffset);
                        for (let x = 0; x < space.length; x++) {
                            idd[x * w + t] = this.getCellColor(space[x]);
                        }
                    }
                    for (let x = app_4.universe.player.topX; x <= app_4.universe.player.bottomX; x++) {
                        this.imageData.setPixel(100, x, 0xFF00FF00);
                    }
                    this.ctx.putImageData(this.imageData, 0, 0);
                }
            };
            exports_8("UniverseView", UniverseView);
        }
    };
});
System.register("Rule", [], function (exports_9, context_9) {
    var Rule;
    var __moduleName = context_9 && context_9.id;
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
                    const sum = (spacetime[t - 1][x - 1].value)
                        + (spacetime[t - 1][x].value)
                        + (spacetime[t - 1][x + 1].value);
                    return this.table[sum];
                }
                getState2(getValue, t, x) {
                    const sum = getValue(t - 1, x - 1)
                        + getValue(t - 1, x)
                        + getValue(t - 1, x + 1);
                    return this.table[sum];
                }
                getState3(cell_m1_m1, cell_m1_z0, cell_m1_p1) {
                    const sum = cell_m1_m1
                        + cell_m1_z0
                        + cell_m1_p1;
                    return this.table[sum];
                }
                getState1(spacetime, t, x) {
                    const sum = (spacetime[t - 1][x - 1])
                        + (spacetime[t - 1][x])
                        + (spacetime[t - 1][x + 1]);
                    return this.table[sum];
                }
            };
            exports_9("Rule", Rule);
        }
    };
});
System.register("CardView", ["utils/misc", "utils/ImageDataUint32"], function (exports_10, context_10) {
    var misc_3, ImageDataUint32_2, CardView;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (misc_3_1) {
                misc_3 = misc_3_1;
            },
            function (ImageDataUint32_2_1) {
                ImageDataUint32_2 = ImageDataUint32_2_1;
            }
        ],
        execute: function () {
            CardView = class CardView {
                constructor(card) {
                    this.card = card;
                    this.canvas = misc_3.tap(document.createElement("canvas"), c => {
                        c.width = this.card.timeSize;
                        c.height = this.card.spaceSize;
                    });
                    this.ctx = misc_3.tap(this.canvas.getContext("2d"), ctx => {
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
            exports_10("CardView", CardView);
        }
    };
});
System.register("DeckView", ["CardView", "app"], function (exports_11, context_11) {
    var CardView_1, app_5, DeckView;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (CardView_1_1) {
                CardView_1 = CardView_1_1;
            },
            function (app_5_1) {
                app_5 = app_5_1;
            }
        ],
        execute: function () {
            DeckView = class DeckView {
                constructor() {
                    this.el = document.getElementById("deck");
                    for (let i = 0; i < app_5.deck.cards.length; i++) {
                        const card = app_5.deck.cards[i];
                        const cardView = new CardView_1.CardView(card);
                        this.el.appendChild(cardView.canvas);
                        cardView.canvas.addEventListener("click", () => app_5.deck.selectedCard = card);
                    }
                }
            };
            exports_11("DeckView", DeckView);
        }
    };
});
System.register("Deck", ["Card"], function (exports_12, context_12) {
    var Card_1, Deck;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (Card_1_1) {
                Card_1 = Card_1_1;
            }
        ],
        execute: function () {
            Deck = class Deck {
                constructor() {
                    this.cards = Array.from({ length: 8 }, () => Card_1.Card.generateRandomCard());
                    this.selectedCard = this.cards[0];
                }
            };
            exports_12("Deck", Deck);
        }
    };
});
System.register("app", ["Universe", "utils/LehmerPrng", "UniverseView", "Rule", "DeckView", "Deck", "game-inputs"], function (exports_13, context_13) {
    var Universe_1, LehmerPrng_2, UniverseView_1, Rule_1, DeckView_1, Deck_1, game_inputs_1, random, deckRandom, rule, universe, universeView, deck, deckView, inputs;
    var __moduleName = context_13 && context_13.id;
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
            },
            function (game_inputs_1_1) {
                game_inputs_1 = game_inputs_1_1;
            }
        ],
        execute: function () {
            // import * as Tone from "tone";
            {
                const _Math_random = Math.random;
                Math.random = function () {
                    console.warn("Use of built-in Math.random()!");
                    return _Math_random();
                };
            }
            exports_13("random", random = new LehmerPrng_2.LehmerPrng(433783));
            exports_13("deckRandom", deckRandom = new LehmerPrng_2.LehmerPrng(433783));
            exports_13("rule", rule = new Rule_1.Rule());
            exports_13("universe", universe = new Universe_1.Universe());
            exports_13("universeView", universeView = new UniverseView_1.UniverseView());
            exports_13("deck", deck = new Deck_1.Deck());
            exports_13("deckView", deckView = new DeckView_1.DeckView());
            exports_13("inputs", inputs = game_inputs_1.default());
            // export const synth = new Tone.Synth().toMaster();
            inputs.bind("move-up", "<up>");
            inputs.bind("move-down", "<down>");
            inputs.bind("fire1", "Q");
            inputs.bind("fire2", "W");
            inputs.bind("fire3", "E");
            inputs.bind("fire4", "R");
            inputs.bind("fire5", "A");
            inputs.bind("fire6", "S");
            inputs.bind("fire7", "D");
            inputs.bind("fire8", "F");
        }
    };
});
System.register("Card", ["app"], function (exports_14, context_14) {
    var app_6, Card;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [
            function (app_6_1) {
                app_6 = app_6_1;
            }
        ],
        execute: function () {
            Card = class Card {
                constructor(cardSpace) {
                    this.cardSpace = cardSpace;
                    const spaceSize = this.cardSize * 10 + 1;
                    const timeSize = spaceSize;
                    this.spacetime = Array.from({ length: timeSize }, () => new Uint8Array(spaceSize));
                    const xMargin = (this.spacetime[0].length - this.cardSpace.length) / 2;
                    for (let x = 0; x < this.cardSpace.length; x++) {
                        this.spacetime[0][x + xMargin] = this.cardSpace[x];
                    }
                    const nr = app_6.rule.spaceNeighbourhoodRadius;
                    for (let t = 1; t < this.spacetime.length; t++) {
                        const space = this.spacetime[t];
                        for (let x = nr; x < space.length - nr; x++) {
                            space[x] = app_6.rule.getState1(this.spacetime, t, x);
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
                    return app_6.deckRandom.next() % app_6.rule.stateCount;
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
            exports_14("Card", Card);
        }
    };
});
System.register("main", ["app"], function (exports_15, context_15) {
    var app_7, app, fpsDisplay, updatesPerFrameDisplay, stepDisplay, updatesPerFrame, paused, lastIteration, fpsHistorical, fpsHistoricalFactor, f;
    var __moduleName = context_15 && context_15.id;
    function render() {
        const now = Date.now();
        const fps = 1000 / (now - lastIteration);
        lastIteration = now;
        if ("undefined" === typeof fpsHistorical) {
            fpsHistorical = fps;
        }
        else {
            fpsHistorical =
                fpsHistorical * fpsHistoricalFactor
                    + fps * (1 - fpsHistoricalFactor);
        }
        fpsDisplay.textContent =
            `fps: ${fpsHistorical.toFixed(2)} (${fps.toFixed(2)})`;
        updatesPerFrameDisplay.textContent = "updates per frame: " + updatesPerFrame;
        stepDisplay.textContent = "step: " + app_7.universe.spacetime.timeOffset;
        app_7.universeView.render();
    }
    function requestAnimationFrameCallback() {
        // engine.update();
        for (let _ = 0; _ < updatesPerFrame; _++) {
            if (paused) {
                break;
            }
            app_7.universe.update();
        }
        render();
        app_7.inputs.tick();
        requestAnimationFrame(requestAnimationFrameCallback);
        if (f == 10) {
            // app.synth.triggerAttackRelease("C4", "8n");
            f = 0;
        }
        f++;
    }
    return {
        setters: [
            function (app_7_1) {
                app_7 = app_7_1;
                app = app_7_1;
            }
        ],
        execute: function () {
            fpsDisplay = document.getElementById("fps");
            updatesPerFrameDisplay = document.getElementById("updatesPerFrame");
            stepDisplay = document.getElementById("step");
            Object.assign(window, app);
            updatesPerFrame = 10;
            paused = false;
            window.addEventListener("keypress", ev => {
                console.log(ev.code);
                switch (ev.code) {
                    case "Space": {
                        paused = !paused;
                        break;
                    }
                    case "Backquote": {
                        switch (updatesPerFrame) {
                            case 1:
                                updatesPerFrame = 10;
                                break;
                            case 10:
                                updatesPerFrame = 100;
                                break;
                            case 100:
                                updatesPerFrame = 1;
                                break;
                        }
                        break;
                    }
                }
            });
            lastIteration = Date.now();
            fpsHistorical = undefined;
            fpsHistoricalFactor = 0.98;
            f = 0;
            requestAnimationFrame(requestAnimationFrameCallback);
        }
    };
});
//# sourceMappingURL=app.js.map