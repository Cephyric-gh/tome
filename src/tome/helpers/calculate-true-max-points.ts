import { RawTomeItem } from "../types";

export const calculateTrueMaxPoints = (tome: RawTomeItem): number => {
    switch (tome.formula_type) {
        case 0:
            return Math.ceil(tome.max_points * Math.pow(1.7, 0.7));
        case 1:
            return Math.ceil(tome.max_points * 1.2);
        case 2:
            return Math.ceil(tome.max_points);
        case 3:
            return Math.ceil(Math.pow(7.2 / 7, 5) * tome.max_points);
        case 4:
            return Math.ceil(tome.max_points);
        default:
            throw new Error(`Invalid function type 'n': ${tome.formula_type}`);
    }
};
