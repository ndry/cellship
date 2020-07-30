import { Rule } from "./Rule";
export class RuleSpace {
    readonly id = "3st_1nr_sym_v0";
    readonly stateCount = 3;
    readonly spaceNeighbourhoodRadius = 1;
    readonly sizePower = 6 * this.stateCount;
    readonly size = Math.pow(this.stateCount, this.sizePower);

    readonly nsmap = {
        a: [
            [0, 1, 3],
            [1, 2, 4],
            [3, 4, 5],
        ],
        f(n1: number, n2: number) {
            return this.a[n1][n2];
        },
        n1s: [0, 0, 1, 0, 1, 2],
        n2s: [0, 1, 1, 2, 2, 2],
    };


    private readonly groupCombinations = [
        [0, 1, 2],
        [0, 2, 1],
        [1, 0, 2],
        [1, 2, 0],
        [2, 0, 1],
        [2, 1, 0],
    ];
    private readonly isMainEntryInCombinationGroup_t: number[] = Array.from({ length: this.sizePower });
    private readonly isMainEntryInCombinationGroup_tc: number[] = Array.from({ length: this.sizePower });
    isMainEntryInCombinationGroup(code: number) {
        const t = this.isMainEntryInCombinationGroup_t;
        const tc = this.isMainEntryInCombinationGroup_tc;
        const combinations = this.groupCombinations;
        const n1s = this.nsmap.n1s;
        const n2s = this.nsmap.n2s;
        const nsmapa = this.nsmap.a;
        const stateCount = this.stateCount;
        const generateRuleTableFromCode = this.generateRuleTableFromCode;
        const generateCodeFromRuleTable = this.generateCodeFromRuleTable;

        generateRuleTableFromCode(code, t);

        for (let ci = 0; ci < combinations.length; ci++) {
            const combination = combinations[ci];
            for (let n = 0; n < n1s.length; n++) {
                const n1c = combination[n1s[n]];
                const n2c = combination[n2s[n]];
                const nc = nsmapa[n1c][n2c];
                for (let c = 0; c < stateCount; c++) {
                    const cc = combination[c];
                    const state = n * stateCount + c;
                    const statec = nc * stateCount + cc;
                    tc[statec] = combination[t[state]];
                }
            }
            let combinationCode = generateCodeFromRuleTable(tc);
            if (combinationCode < code) {
                return false;
            }
        }

        return true;
    }

    generateRuleTableFromCode(
        code: number,
        table: number[] = Array.from({ length: this.sizePower })
    ) {
        for (let x = table.length - 1; x >= 0; x--) {
            code = (code - (table[x] = code % 3)) / 3;
        }

        return table;
    }

    generateCodeFromRuleTable(
        table: number[]
    ) {
        let code = 0;

        for (let x = 0; x < table.length; x++) {
            code *= 3;
            code += table[x];
        }

        return code;
    }

    generateRule(code: number) {
        return new Rule(this, code);
    }

    getPrestate(
        cell_m1_m1: number,
        cell_m1_z0: number,
        cell_m1_p1: number,
    ) {
        const n = this.nsmap.f(cell_m1_m1, cell_m1_p1);
        let state = n * this.stateCount + cell_m1_z0;
        return state;
    }
}
