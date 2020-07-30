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
    function getDigitsFromNumber(n, base, digits) {
        const basen = BigInt(base);
        for (let x = digits.length - 1; x >= 0; x--) {
            digits[x] = Number(n % basen);
            n = n / basen;
        }
        return digits;
    }
    exports_2("getDigitsFromNumber", getDigitsFromNumber);
    function getNumberFromDigits(digits, base) {
        const basen = BigInt(base);
        let n = 0n;
        for (let x = 0; x < digits.length; x++) {
            n *= basen;
            n += BigInt(digits[x]);
        }
        return n;
    }
    exports_2("getNumberFromDigits", getNumberFromDigits);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Rule", ["utils/misc"], function (exports_3, context_3) {
    var misc_js_1, Rule;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (misc_js_1_1) {
                misc_js_1 = misc_js_1_1;
            }
        ],
        execute: function () {
            Rule = /** @class */ (() => {
                class Rule {
                    constructor(stateCount, tableOrCode) {
                        this.stateCount = stateCount;
                        this.tableOrCode = tableOrCode;
                        this.spaceNeighbourhoodRadius = Rule.spaceNeighbourhoodRadius;
                        this.timeNeighbourhoodRadius = Rule.timeNeighbourhoodRadius;
                        if (Array.isArray(tableOrCode)) {
                            this.table = tableOrCode;
                            this.code = misc_js_1.getNumberFromDigits(this.table, stateCount);
                        }
                        else {
                            this.code = tableOrCode;
                            this.table = misc_js_1.getDigitsFromNumber(this.code, this.stateCount, Array.from({ length: Math.pow(this.stateCount, 4) }));
                        }
                        this.tableDesc = this.table.join("");
                    }
                    static getRuleSpaceSizePower(stateCount) {
                        return stateCount ** 4;
                    }
                    static getRuleSpaceSize(stateCount) {
                        return stateCount ** (stateCount ** 4);
                    }
                    fillSpace3(space, prevSpace, prevPrevSpace) {
                        const nr = this.spaceNeighbourhoodRadius;
                        const table = this.table;
                        const stateCount = this.stateCount;
                        const ss = space.length;
                        let n1 = 0;
                        let c = prevSpace[nr - 1];
                        let n2 = prevSpace[nr];
                        for (let x = nr; x < ss - nr; x++) {
                            n1 = c;
                            c = n2;
                            n2 = prevSpace[x + 1];
                            const pc = prevPrevSpace[x];
                            let combinedState = 0;
                            combinedState = combinedState * stateCount + n1;
                            combinedState = combinedState * stateCount + c;
                            combinedState = combinedState * stateCount + n2;
                            combinedState = combinedState * stateCount + pc;
                            space[x] = table[combinedState];
                            // console.assert(table[combinedState] !== undefined);
                        }
                    }
                    fillSpace2(spacetime, t) {
                        const space = spacetime[t];
                        this.fillSpace3(space, spacetime[t - 1], spacetime[t - 2]);
                        return space;
                    }
                    getState3(n1, c, n2, pc) {
                        let combinedState = 0;
                        combinedState = combinedState * this.stateCount + n1;
                        combinedState = combinedState * this.stateCount + c;
                        combinedState = combinedState * this.stateCount + n2;
                        combinedState = combinedState * this.stateCount + pc;
                        return this.table[combinedState];
                    }
                    getState2(getValue, t, x) {
                        return this.getState3(getValue(t - 1, x - 1), getValue(t - 1, x), getValue(t - 1, x + 1), getValue(t - 2, x));
                    }
                    getState1(spacetime, t, x) {
                        return this.getState3(spacetime[t - 1][x - 1], spacetime[t - 1][x], spacetime[t - 1][x + 1], spacetime[t - 2][x]);
                    }
                }
                Rule.spaceNeighbourhoodRadius = 1;
                Rule.timeNeighbourhoodRadius = 2;
                return Rule;
            })();
            exports_3("Rule", Rule);
        }
    };
});
System.register("Weapon", [], function (exports_4, context_4) {
    var Weapon;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            Weapon = class Weapon {
                constructor(rule, space, prevSpace) {
                    this.rule = rule;
                    this.space = space;
                    this.prevSpace = prevSpace;
                    this.isBookmarked = false;
                    const spaceSize = this.size * 10 + 1;
                    const timeSize = spaceSize;
                    this.spacetime = Array.from({ length: timeSize }, () => new Uint8Array(spaceSize));
                    const xMargin = (this.spacetime[0].length - this.space.length) / 2;
                    for (let x = 0; x < this.space.length; x++) {
                        this.spacetime[0][x + xMargin] = this.prevSpace[x];
                        this.spacetime[1][x + xMargin] = this.space[x];
                    }
                    const nr = rule.spaceNeighbourhoodRadius;
                    for (let t = 2; t < this.spacetime.length; t++) {
                        const space = this.spacetime[t];
                        for (let x = nr; x < space.length - nr; x++) {
                            space[x] = rule.getState1(this.spacetime, t, x);
                        }
                    }
                    for (let t = 0; t < timeSize; t++) {
                        const space = new Uint8Array(this.size * 2 + 1);
                        const xMargin = (spaceSize - space.length) / 2;
                        for (let x = 0; x < space.length; x++) {
                            space[x] = this.spacetime[t][x + xMargin];
                        }
                        this.spacetime[t] = space;
                    }
                }
                serialize() {
                    return {
                        space: this.space,
                        prevSpace: this.prevSpace,
                    };
                }
                static deserialize(data) {
                    return (rule) => new Weapon(rule, data.space, data.prevSpace);
                }
                get size() { return this.space.length; }
                get spaceSize() { return this.spacetime[0].length; }
                get timeSize() { return this.spacetime.length; }
            };
            exports_4("Weapon", Weapon);
        }
    };
});
System.register("Weaponary", ["Weapon", "utils/LehmerPrng"], function (exports_5, context_5) {
    var Weapon_1, LehmerPrng_1, Weaponary;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (Weapon_1_1) {
                Weapon_1 = Weapon_1_1;
            },
            function (LehmerPrng_1_1) {
                LehmerPrng_1 = LehmerPrng_1_1;
            }
        ],
        execute: function () {
            Weaponary = class Weaponary {
                constructor(rule) {
                    this.rule = rule;
                    this.random = new LehmerPrng_1.LehmerPrng(Math.floor(Date.now()));
                    this.weapons = this.loadOrGenerate();
                }
                generateRandomWeapon() {
                    const getRandomState = () => {
                        return this.random.next() % this.rule.stateCount;
                    };
                    const size = 45;
                    return new Weapon_1.Weapon(this.rule, Array.from({ length: size }, getRandomState), Array.from({ length: size }, getRandomState));
                }
                save() {
                    localStorage.setItem(`${this.rule.code}_weaponary`, JSON.stringify(this.weapons.map(w => w.isBookmarked ? w.serialize() : undefined)));
                }
                loadOrGenerate() {
                    const itemJson = localStorage.getItem(`${this.rule.code}_weaponary`);
                    const weapons = Array.from({ length: 8 });
                    if (itemJson) {
                        const item = JSON.parse(itemJson);
                        for (let i = 0; i < weapons.length; i++) {
                            const itemi = item[i];
                            if (itemi) {
                                weapons[i] = Weapon_1.Weapon.deserialize(itemi)(this.rule);
                                weapons[i].isBookmarked = true;
                            }
                            else {
                                weapons[i] = this.generateRandomWeapon();
                            }
                        }
                    }
                    else {
                        for (let i = 0; i < weapons.length; i++) {
                            weapons[i] = this.generateRandomWeapon();
                        }
                    }
                    return weapons;
                }
            };
            exports_5("Weaponary", Weaponary);
        }
    };
});
System.register("PlayerShip", ["Projectile", "Weaponary"], function (exports_6, context_6) {
    var Projectile_1, Weaponary_1, PlayerShip;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (Projectile_1_1) {
                Projectile_1 = Projectile_1_1;
            },
            function (Weaponary_1_1) {
                Weaponary_1 = Weaponary_1_1;
            }
        ],
        execute: function () {
            PlayerShip = class PlayerShip {
                constructor(universe) {
                    this.universe = universe;
                    this.time = 100;
                    this.size = 51;
                    this.lastSizeChangeStep = 0;
                    this.weaponary = new Weaponary_1.Weaponary(this.universe.rule);
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
                fire(weapon) {
                    const t = this.spacetime.timeOffset + this.time;
                    const projectile = new Projectile_1.Projectile();
                    projectile.owner = this;
                    projectile.timeCreated = t;
                    projectile.timePosition = t + 1;
                    this.universe.projectiles.push(projectile);
                    const space = this.spacetime.getSpaceAtTime(t);
                    const prevSpace = this.spacetime.getSpaceAtTime(t - 1);
                    for (let x = this.topX; x <= this.bottomX; x++) {
                        const cell = space[x];
                        const prevCell = prevSpace[x];
                        const cardX = x - (this.topX + (this.size - 1) / 2 + 1) + (weapon.size - 1) / 2 + 1;
                        // if (cell.value !== card.cardSpace[cardX] ?? 0) {
                        cell.stepUpated = this.spacetime.timeOffset;
                        prevCell.stepUpated = this.spacetime.timeOffset;
                        // }
                        cell.value = weapon.space[cardX] ?? 0;
                        prevCell.value = weapon.prevSpace[cardX] ?? 0;
                        cell.projectile = projectile;
                        prevCell.projectile = projectile;
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
                }
            };
            exports_6("PlayerShip", PlayerShip);
        }
    };
});
System.register("Projectile", [], function (exports_7, context_7) {
    var Projectile;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [],
        execute: function () {
            Projectile = class Projectile {
                constructor() {
                    this.timeVelocity = 20;
                }
                get universe() { return this.owner.universe; }
                get rule() { return this.universe.rule; }
                get spacetime() { return this.universe.spacetime; }
                getValue(cell) {
                    if (cell.projectile == this || "undefined" === typeof cell.projectile) {
                        return cell.value;
                    }
                    return 0;
                }
                ;
                updateSpace(t) {
                    const nr = this.rule.spaceNeighbourhoodRadius;
                    const prevSpace = this.spacetime.getSpaceAtTime(t - 1);
                    const prevPrevSpace = this.spacetime.getSpaceAtTime(t - 2);
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
                        const prevPrevCell = prevPrevSpace[x];
                        if (prevCell1.stepUpated !== timeOffset
                            && prevCell1.stepUpated !== prevTimeOffset
                            && prevCell2.stepUpated !== timeOffset
                            && prevCell2.stepUpated !== prevTimeOffset
                            && prevCell3.stepUpated !== timeOffset
                            && prevCell3.stepUpated !== prevTimeOffset
                            && prevPrevCell.stepUpated !== timeOffset
                            && prevPrevCell.stepUpated !== prevTimeOffset) {
                            continue;
                        }
                        const cell = tSpace[x];
                        const value = this.rule.getState3(this.getValue(prevCell1), this.getValue(prevCell2), this.getValue(prevCell3), this.getValue(prevPrevCell));
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
                            this.spacetime.timeOffset - 1 - (this.timePosition - t) / this.timeVelocity;
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
                        if ((this.timePosition - this.timeVelocity * 2000) >= timeEndOfPrediction && owned === 0) {
                            this.universe.projectiles.splice(this.universe.projectiles.indexOf(this), 1);
                        }
                    }
                    this.timePosition += this.timeVelocity;
                }
            };
            exports_7("Projectile", Projectile);
        }
    };
});
System.register("Spacetime", [], function (exports_8, context_8) {
    var Spacetime;
    var __moduleName = context_8 && context_8.id;
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
                        dim: -1e10,
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
            exports_8("Spacetime", Spacetime);
        }
    };
});
System.register("Universe", ["utils/LehmerPrng", "utils/misc", "Spacetime", "PlayerShip", "Rule"], function (exports_9, context_9) {
    var LehmerPrng_2, misc_1, Spacetime_1, PlayerShip_1, Rule_1, urlSearchParams, code, Universe;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (LehmerPrng_2_1) {
                LehmerPrng_2 = LehmerPrng_2_1;
            },
            function (misc_1_1) {
                misc_1 = misc_1_1;
            },
            function (Spacetime_1_1) {
                Spacetime_1 = Spacetime_1_1;
            },
            function (PlayerShip_1_1) {
                PlayerShip_1 = PlayerShip_1_1;
            },
            function (Rule_1_1) {
                Rule_1 = Rule_1_1;
            }
        ],
        execute: function () {
            urlSearchParams = new URLSearchParams(window.location.search);
            code = urlSearchParams.has("code")
                ? BigInt(urlSearchParams.get("code"))
                : 0n; //todo
            Universe = class Universe {
                constructor() {
                    this.random = new LehmerPrng_2.LehmerPrng(4242);
                    this.rule = new Rule_1.Rule(3, code);
                    this.spacetime = new Spacetime_1.Spacetime();
                    this.player = misc_1.tap(new PlayerShip_1.PlayerShip(this), ps => {
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
                getRandomState() {
                    return this.random.next() % this.rule.stateCount;
                }
                fillMostRecentSpace() {
                    const nr = this.rule.spaceNeighbourhoodRadius;
                    const t = this.spacetime.timeSize - 1 + this.spacetime.timeOffset;
                    const tSpace = this.spacetime.getSpaceAtTime(t);
                    for (let x = 0; x < nr; x++) {
                        tSpace[x].value = this.getRandomState();
                        tSpace[tSpace.length - 1 - x].value = this.getRandomState();
                    }
                    for (let x = nr; x < tSpace.length - nr; x++) {
                        const cell = tSpace[x];
                        cell.value = this.rule.getState2((t, x) => {
                            var cell = this.spacetime.getSpaceAtTime(t)[x];
                            if ("undefined" === typeof cell.projectile) {
                                return cell.value;
                            }
                            return 0;
                        }, t, x);
                        cell.projectile = undefined;
                        cell.dim = -1e10;
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
            };
            exports_9("Universe", Universe);
        }
    };
});
System.register("utils/ImageDataUint32", [], function (exports_10, context_10) {
    var ImageDataUint32;
    var __moduleName = context_10 && context_10.id;
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
            exports_10("ImageDataUint32", ImageDataUint32);
        }
    };
});
System.register("UniverseView", ["utils/misc", "utils/ImageDataUint32"], function (exports_11, context_11) {
    var misc_2, ImageDataUint32_1, UniverseView;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (misc_2_1) {
                misc_2 = misc_2_1;
            },
            function (ImageDataUint32_1_1) {
                ImageDataUint32_1 = ImageDataUint32_1_1;
            }
        ],
        execute: function () {
            UniverseView = class UniverseView {
                constructor(universe) {
                    this.universe = universe;
                    this.canvas = misc_2.tap(document.getElementById("canvas"), c => {
                        c.width = this.universe.spacetime.timeSize;
                        c.height = this.universe.spacetime.spaceSize;
                    });
                    this.ctx = misc_2.tap(this.canvas.getContext("2d"), ctx => {
                        ctx.imageSmoothingEnabled = false;
                    });
                    this.imageData = new ImageDataUint32_1.ImageDataUint32(this.ctx.createImageData(this.universe.spacetime.timeSize, this.universe.spacetime.spaceSize));
                }
                getCellColor(cell) {
                    const age = this.universe.spacetime.timeOffset - cell.dim;
                    let ageFactor = 1 -
                        0.6 * (age < 50 ? age * 0.02 : 1) -
                        0.2 * (age < 250 ? age * 0.004 : 1) -
                        0.2 * (age < 2000 ? age * 0.00 : 1);
                    if (ageFactor < 0) {
                        ageFactor = 0;
                    }
                    if (cell.value == 0) {
                        return 0xFF000000 + Math.floor(ageFactor * 0x1F);
                    }
                    if (!cell.projectile) {
                        const lumInt = Math.floor(0.5 * cell.value * ageFactor * 0x7F);
                        return 0xFF808080 + lumInt - (lumInt << 8) - (lumInt << 16);
                    }
                    {
                        const lumInt = Math.floor(0.5 * cell.value * ageFactor * 0xFF);
                        return 0xFF000000 + (lumInt << 8);
                    }
                }
                render() {
                    const w = this.imageData.width;
                    const idd = this.imageData.dataUint32;
                    for (let t = 0; t < this.universe.spacetime.timeSize; t++) {
                        const space = this.universe.spacetime.getSpaceAtTime(t + this.universe.spacetime.timeOffset);
                        for (let x = 0; x < space.length; x++) {
                            idd[x * w + t] = this.getCellColor(space[x]);
                        }
                    }
                    for (let x = this.universe.player.topX; x <= this.universe.player.bottomX; x++) {
                        this.imageData.setPixel(100, x, 0xFF00FF00);
                    }
                    this.ctx.putImageData(this.imageData, 0, 0);
                }
            };
            exports_11("UniverseView", UniverseView);
        }
    };
});
System.register("WeaponView", ["utils/misc", "utils/ImageDataUint32"], function (exports_12, context_12) {
    var misc_3, ImageDataUint32_2, WeaponView;
    var __moduleName = context_12 && context_12.id;
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
            WeaponView = class WeaponView {
                constructor(weapon) {
                    this.weapon = weapon;
                    this.canvas = misc_3.tap(document.createElement("canvas"), c => {
                        c.width = this.weapon.timeSize;
                        c.height = this.weapon.spaceSize;
                    });
                    this.ctx = misc_3.tap(this.canvas.getContext("2d"), ctx => {
                        ctx.imageSmoothingEnabled = false;
                    });
                    this.imageData = new ImageDataUint32_2.ImageDataUint32(this.ctx.createImageData(this.weapon.timeSize, this.weapon.spaceSize));
                    this.colorMap = [0xFF000000, 0xFF808080, 0xFFFFFFFF];
                    this.colorBookmarkedMap = [0xFF000000, 0xFF800080, 0xFFFF00FF];
                    this.render();
                }
                setPixel(x, y, value) {
                    const colorMap = this.weapon.isBookmarked
                        ? this.colorBookmarkedMap
                        : this.colorMap;
                    this.imageData.setPixel(x, y, colorMap[value]);
                }
                render() {
                    for (let t = 0; t < this.weapon.spacetime.length; t++) {
                        const space = this.weapon.spacetime[t];
                        for (let x = 0; x < space.length; x++) {
                            this.setPixel(t, x, space[x]);
                        }
                    }
                    this.ctx.putImageData(this.imageData, 0, 0);
                }
            };
            exports_12("WeaponView", WeaponView);
        }
    };
});
System.register("WeaponaryView", ["WeaponView"], function (exports_13, context_13) {
    var WeaponView_1, WeaponaryView;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [
            function (WeaponView_1_1) {
                WeaponView_1 = WeaponView_1_1;
            }
        ],
        execute: function () {
            WeaponaryView = class WeaponaryView {
                constructor(weaponary) {
                    this.weaponary = weaponary;
                    this.el = document.getElementById("deck");
                    this.weaponViews = this.weaponary.weapons.map(weapon => {
                        const weaponView = new WeaponView_1.WeaponView(weapon);
                        this.el.appendChild(weaponView.canvas);
                        return weaponView;
                    });
                }
            };
            exports_13("WeaponaryView", WeaponaryView);
        }
    };
});
System.register("FpsMeter", [], function (exports_14, context_14) {
    var FpsMeter;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [],
        execute: function () {
            FpsMeter = class FpsMeter {
                constructor() {
                    this.fpsHistoricalFactor = 0.96;
                    this.lastUpdate = undefined;
                    this.fps = undefined;
                    this.fpsHistorical = undefined;
                }
                update(time) {
                    if ("undefined" !== typeof this.lastUpdate) {
                        this.fps = 1000 / (time - this.lastUpdate);
                        if ("undefined" === typeof this.fpsHistorical) {
                            this.fpsHistorical = this.fps;
                        }
                        else {
                            this.fpsHistorical =
                                this.fpsHistorical * this.fpsHistoricalFactor
                                    + this.fps * (1 - this.fpsHistoricalFactor);
                        }
                    }
                    this.lastUpdate = time;
                }
            };
            exports_14("FpsMeter", FpsMeter);
        }
    };
});
System.register("Application", ["Universe", "UniverseView", "WeaponaryView", "game-inputs", "FpsMeter", "utils/misc"], function (exports_15, context_15) {
    var Universe_1, UniverseView_1, WeaponaryView_1, game_inputs_1, FpsMeter_1, misc_4, Application;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [
            function (Universe_1_1) {
                Universe_1 = Universe_1_1;
            },
            function (UniverseView_1_1) {
                UniverseView_1 = UniverseView_1_1;
            },
            function (WeaponaryView_1_1) {
                WeaponaryView_1 = WeaponaryView_1_1;
            },
            function (game_inputs_1_1) {
                game_inputs_1 = game_inputs_1_1;
            },
            function (FpsMeter_1_1) {
                FpsMeter_1 = FpsMeter_1_1;
            },
            function (misc_4_1) {
                misc_4 = misc_4_1;
            }
        ],
        execute: function () {
            // import * as Tone from "tone";
            Application = class Application {
                constructor() {
                    this.paused = false;
                    this.inputs = misc_4.tap(game_inputs_1.default(undefined, { preventDefaults: true }), inputs => {
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
                    this.universe = new Universe_1.Universe();
                    this.universeView = new UniverseView_1.UniverseView(this.universe);
                    this.weaponaryView = new WeaponaryView_1.WeaponaryView(this.universe.player.weaponary);
                    // synth = new Tone.Synth().toMaster();
                    this.fpsMeter = new FpsMeter_1.FpsMeter();
                    this.upsMeter = new FpsMeter_1.FpsMeter();
                    this.fpsDisplay = document.getElementById("fps");
                    this.upsDisplay = document.getElementById("ups");
                    this.stepDisplay = document.getElementById("step");
                }
                update(time) {
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
                render(time) {
                    this.fpsMeter.update(time);
                    function renderFpsText(fps) {
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
                fireOrReroll(weaponIndex) {
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
                    }
                    else if (this.inputs.state["bookmark"]) {
                        weapon.isBookmarked = !weapon.isBookmarked;
                        weaponView.render();
                        weaponary.save();
                    }
                    else {
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
                    let lastUpdateTime = undefined;
                    const requestAnimationFrameCallback = (time) => {
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
                        }
                        else {
                            lastUpdateTime = time;
                        }
                        this.render(time);
                        requestAnimationFrame(requestAnimationFrameCallback);
                    };
                    requestAnimationFrame(requestAnimationFrameCallback);
                }
            };
            exports_15("Application", Application);
        }
    };
});
System.register("main", ["Application"], function (exports_16, context_16) {
    var Application_1, app;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (Application_1_1) {
                Application_1 = Application_1_1;
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
            app = new Application_1.Application();
            Object.assign(window, { app });
            app.run();
        }
    };
});
//# sourceMappingURL=app.js.map