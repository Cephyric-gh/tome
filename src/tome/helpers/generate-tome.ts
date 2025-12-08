import type { RawTomeItem } from "../types";
import { calculateTrueMaxPoints } from "./calculate-true-max-points";
import { calculateTrueMaxScore } from "./calculate-true-max-score";
import { convertRawTomeToItems } from "./convert-raw-tome-to-raw-items";

type TomeItem = RawTomeItem & { true_max_points: number; true_max_score: number | string };

export const generatedTome: TomeItem[] = convertRawTomeToItems().map((x) => ({
    ...x,
    true_max_points: calculateTrueMaxPoints(x),
    true_max_score: calculateTrueMaxScore(x),
}));
