export function isVisible(elt: Element): boolean {
    const style = window.getComputedStyle(elt);
    return (style.width !== null && +style.width !== 0)
        && (style.height !== null && +style.height !== 0)
        && (style.opacity !== null && +style.opacity !== 0)
        && style.display !== "none"
        && style.visibility !== "hidden";
}

export function tap<T>(
    x: T,
    ...applyAdjustmentList: Array<((x: T) => void)>
): T {
    for (const applyAdjustment of applyAdjustmentList) {
        applyAdjustment(x);
    }
    return x;
}

export function getDigitsFromNumber(
    n: bigint, 
    base: number,
    digits: number[],
) {
    const basen = BigInt(base);
    for (let x = digits.length - 1; x >= 0; x--) {
        digits[x] = Number(n % basen);
        n = n / basen;
    }

    return digits;
}

export function getNumberFromDigits(
    digits: number[],
    base: number
) {
    const basen = BigInt(base);
    let n = 0n;

    for (let x = 0; x < digits.length; x++) {
        n *= basen;
        n += BigInt(digits[x]);
    }

    return n;
}
