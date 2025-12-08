import { displayOrder, tome } from "../tome-raw";
import { RawTomeItem } from "../types";

export const convertRawTomeToItems = (): RawTomeItem[] => {
    const copiedParts = tome.map((part) => ({
        title: (part[0] ?? "").replace(/_/g, " "),
        max_score: Number(part[1] ?? "0"),
        formula_type: Number(part[2] ?? "0"),
        max_points: Number(part[3] ?? "0"),
        unused_part: (part[4] ?? "filler") === "filler" ? null : (part[4] ?? null),
        desc_box: (part[5] ?? "filler") === "filler" ? null : (part[5].replace(/_/g, " ") ?? null),
    }));

    return displayOrder.map((index) => copiedParts[index]);
};
