import { tome } from "../tome";

/**
 * Converts an "IdleOn"-style string representation of a number (e.g., "1.2K", "3M", "10Q")
 * into its numeric equivalent. It handles suffixes like K, M, B, T, Q, QQ, QQQ.
 *
 * @param input The string containing the IdleOn number.
 * @returns The numeric value.
 */
export function IDLEONNUM(input: string | number | null): number | null {
    if (input === null) {
        return null;
    }

    if (typeof input === "number") {
        return input;
    }

    return parseFloat(
        input
            .replace(/,/g, "")
            .replace(/k/g, "e3")
            .replace(/m/g, "e6")
            .replace(/b/g, "e9")
            .replace(/t/g, "e12")
            .replace(/qqq/g, "e21")
            .replace(/qq/g, "e18")
            .replace(/q/g, "e15"),
    );
}

/**
 * Calculates points for a given 'n' and 'value' by looking up its associated
 * function type, pivot, and multiplier from an external data source (represented by parameters here).
 * In the original Sheets formula, this uses VLOOKUP to retrieve these values.
 *
 * @param n The identifier for the data row.
 * @param value The input value for the calculation.
 * @returns The points calculated by FUNC.
 */
export function POINTS(n: number, value: number | null): number {
    if (value === null) {
        return 0;
    }

    let innerResult: number;
    switch (tome[n].formula_type) {
        case 0:
            innerResult = Math.pow((1.7 * value) / (value + tome[n].max_score), 0.7);
            break;
        case 1:
            const lnMax = Math.log(Math.max(value, 1));
            innerResult = (2.4 * lnMax) / 2.303 / ((2 * lnMax) / 2.303 + tome[n].max_score);
            break;
        case 2:
            innerResult = Math.min(1, value / tome[n].max_score);
            break;
        case 3:
            if (value > tome[n].max_score * 5) {
                innerResult = 0;
            } else {
                innerResult = Math.pow((1.2 * (6 * tome[n].max_score - value)) / (7 * tome[n].max_score - value), 5);
            }

            break;
        case 4:
            const minValPivot = Math.min(value, tome[n].max_score);
            innerResult = Math.pow((2 * minValPivot) / (minValPivot + tome[n].max_score), 0.7);
            break;
        default:
            throw new Error(`Invalid function type 'n': ${n}`);
    }

    return Math.ceil(innerResult * tome[n].max_points);
}
