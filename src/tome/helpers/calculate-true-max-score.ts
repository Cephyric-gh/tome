import type { RawTomeItem } from "../types";
import { calculateTrueMaxPoints } from "./calculate-true-max-points";

export const calculateTrueMaxScore = (tome: RawTomeItem): number | string => {
    const target = calculateTrueMaxPoints(tome);

    switch (tome.formula_type) {
        case 0:
            const numerator = Math.pow((Math.pow(1.7, 0.7) * tome.max_points) / (target - 1), 10 / 7);
            return Math.ceil((numerator * tome.max_score) / (numerator - 1));
        case 1:
            return "Nah lol";
        case 2:
            return tome.max_score;
        case 3:
            return 0;
        case 4:
            return tome.max_score;
        default:
            throw new Error(`Invalid function type 'n': ${tome.formula_type}`);
    }
};
