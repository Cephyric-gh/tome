import { clsx } from "clsx";
import { useState, useMemo } from "react";
import { POINTS, IDLEONNUM } from "../functions/sheet-fns";
import { getAllAccounts, bestAccount } from "../functions/accounts";
import type { ToolboxRow } from "../App";
import { formatNumber } from "../functions/format-number";

// Interpolate between two colors
function interpolateColor(color1: number[], color2: number[], factor: number): number[] {
    return color1.map((c, i) => Math.round(c + (color2[i] - c) * factor));
}

// Get diff color based on value with gradient transitions
function getDiffColor(diff: number): { light: string; dark: string } {
    // RGB values for our color stops
    const red = [220, 38, 38]; // red-600
    const yellow = [202, 138, 4]; // yellow-600
    const green = [22, 163, 74]; // green-600

    const redDark = [248, 113, 113]; // red-400
    const yellowDark = [250, 204, 21]; // yellow-400
    const greenDark = [74, 222, 128]; // green-400

    let rgb: number[];
    let rgbDark: number[];

    if (diff <= -100) {
        // Pure red
        rgb = red;
        rgbDark = redDark;
    } else if (diff <= -10) {
        // Interpolate from red to yellow
        const factor = (diff + 100) / 90; // 0 at -100, 1 at -10
        rgb = interpolateColor(red, yellow, factor);
        rgbDark = interpolateColor(redDark, yellowDark, factor);
    } else if (diff < 0) {
        // Interpolate from yellow to green
        const factor = (diff + 10) / 10; // 0 at -10, 1 at 0
        rgb = interpolateColor(yellow, green, factor);
        rgbDark = interpolateColor(yellowDark, greenDark, factor);
    } else {
        // Pure green
        rgb = green;
        rgbDark = greenDark;
    }

    return {
        light: `${rgb[0]} ${rgb[1]} ${rgb[2]}`,
        dark: `${rgbDark[0]} ${rgbDark[1]} ${rgbDark[2]}`,
    };
}

interface ToolboxTableProps {
    evaluatedToolbox: ToolboxRow[];
    showPoints: boolean;
    showMax: boolean;
    highlightRow: boolean;
    comparisonAccountIndex: number;
}

type SortColumn = "index" | "title" | "max" | "value" | "comp" | "diff";
type SortDirection = "asc" | "desc";

export default function ToolboxTable({
    evaluatedToolbox,
    showPoints,
    showMax,
    highlightRow,
    comparisonAccountIndex,
}: ToolboxTableProps) {
    const [sortColumn, setSortColumn] = useState<SortColumn>("index");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    const handleSort = (column: SortColumn) => {
        if (sortColumn === column) {
            // Toggle direction if clicking the same column
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            // Default to ascending when clicking a new column
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const sortedToolbox = useMemo(() => {
        const sorted = [...evaluatedToolbox];

        sorted.sort((a, b) => {
            let aValue: number | string;
            let bValue: number | string;

            const aIdx = a.index - 1;
            const bIdx = b.index - 1;

            const allAccounts = getAllAccounts();
            const compAccount =
                comparisonAccountIndex === -1 || comparisonAccountIndex >= allAccounts.length
                    ? bestAccount
                    : allAccounts[comparisonAccountIndex];

            const aCompScore = compAccount.scores[aIdx] ?? 0;
            const bCompScore = compAccount.scores[bIdx] ?? 0;

            const aCompPoints = POINTS(aIdx, IDLEONNUM(aCompScore));
            const bCompPoints = POINTS(bIdx, IDLEONNUM(bCompScore));

            switch (sortColumn) {
                case "index":
                    aValue = a.index;
                    bValue = b.index;
                    break;
                case "title":
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                    break;
                case "max":
                    aValue = showPoints ? a.true_max_points : Number(a.true_max_score);
                    bValue = showPoints ? b.true_max_points : Number(b.true_max_score);
                    break;
                case "value":
                    aValue = showPoints ? a.points : (a.score ?? 0);
                    bValue = showPoints ? b.points : (b.score ?? 0);
                    break;
                case "comp":
                    aValue = showPoints ? aCompPoints : aCompScore;
                    bValue = showPoints ? bCompPoints : bCompScore;
                    break;
                case "diff":
                    const aPointsDiff = a.points - aCompPoints;
                    const bPointsDiff = b.points - bCompPoints;
                    const aScoreDiff = (a.score ?? 0) - aCompScore;
                    const bScoreDiff = (b.score ?? 0) - bCompScore;
                    aValue = showPoints ? aPointsDiff : aScoreDiff;
                    bValue = showPoints ? bPointsDiff : bScoreDiff;
                    break;
            }

            if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
            if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [evaluatedToolbox, sortColumn, sortDirection, showPoints, comparisonAccountIndex]);

    const SortIcon = ({ column }: { column: SortColumn }) => {
        if (sortColumn !== column) {
            return <span className="ml-1 text-gray-400 dark:text-gray-600">⇅</span>;
        }
        return <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>;
    };
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th
                                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-19 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors select-none"
                                onClick={() => handleSort("index")}
                            >
                                NUM
                                <SortIcon column="index" />
                            </th>
                            <th
                                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors select-none"
                                onClick={() => handleSort("title")}
                            >
                                Title
                                <SortIcon column="title" />
                            </th>
                            {showMax && (
                                <th
                                    className={clsx(
                                        showPoints ? "w-28" : "w-39",
                                        "px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors select-none",
                                    )}
                                    onClick={() => handleSort("max")}
                                >
                                    Max
                                    <SortIcon column="max" />
                                </th>
                            )}
                            <th
                                className={clsx(
                                    showPoints ? "w-28" : "w-39",
                                    "px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors select-none",
                                )}
                                onClick={() => handleSort("value")}
                            >
                                {showPoints ? "Points" : "Score"}
                                <SortIcon column="value" />
                            </th>
                            <th
                                className={clsx(
                                    showPoints ? "w-28" : "w-39",
                                    "px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors select-none",
                                )}
                                onClick={() => handleSort("comp")}
                            >
                                Comp
                                <SortIcon column="comp" />
                            </th>
                            <th
                                className={clsx(
                                    showPoints ? "w-28" : "w-39",
                                    "px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors select-none",
                                )}
                                onClick={() => handleSort("diff")}
                            >
                                Diff
                                <SortIcon column="diff" />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {sortedToolbox.map((row) => {
                            const idx = row.index - 1;
                            const allAccounts = getAllAccounts();
                            const compAccount =
                                comparisonAccountIndex === -1 || comparisonAccountIndex >= allAccounts.length
                                    ? bestAccount
                                    : allAccounts[comparisonAccountIndex];
                            const comparisonScore = compAccount.scores[idx] ?? 0;
                            const comparisonPoints = POINTS(idx, IDLEONNUM(comparisonScore));
                            const pointsDiff = row.points - comparisonPoints;
                            const scoreDiff = (row.score ?? 0) - comparisonScore;

                            return (
                                <tr
                                    key={row.index}
                                    style={
                                        {
                                            "--diff-light": getDiffColor(showPoints ? pointsDiff : scoreDiff).light,
                                            "--diff-dark": getDiffColor(showPoints ? pointsDiff : scoreDiff).dark,
                                        } as React.CSSProperties
                                    }
                                    className={clsx(
                                        highlightRow
                                            ? "bg-[rgb(var(--diff-light)/20%)] dark:bg-[rgb(var(--diff-dark)/25%)]"
                                            : "text-[rgb(var(--diff-light))] dark:text-[rgb(var(--diff-dark))]",
                                        "transition-colors",
                                    )}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {formatNumber(row.index)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{row.title}</td>
                                    {showMax && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-gray-400 dark:text-gray-600 font-semibold">
                                            {showPoints
                                                ? formatNumber(row.true_max_points)
                                                : formatNumber(row.true_max_score)}
                                            <span
                                                className="ml-1 text-xs text-gray-400 dark:text-gray-500 cursor-help"
                                                title={
                                                    showPoints
                                                        ? `Value for Max: ${formatNumber(row.true_max_score)}`
                                                        : `Max Points: ${formatNumber(row.true_max_points)}`
                                                }
                                            >
                                                ?
                                            </span>
                                        </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-blue-600 dark:text-blue-400 font-semibold">
                                        {showPoints ? formatNumber(row.points) : formatNumber(row.score ?? 0)}
                                        <span
                                            className="ml-1 text-xs text-gray-400 dark:text-gray-500 cursor-help"
                                            title={
                                                showPoints
                                                    ? `Score: ${formatNumber(row.score ?? 0)}`
                                                    : `Points: ${formatNumber(row.points)}`
                                            }
                                        >
                                            ?
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-purple-600 dark:text-purple-400 font-semibold">
                                        {showPoints ? formatNumber(comparisonPoints) : formatNumber(comparisonScore)}
                                        <span
                                            className="ml-1 text-xs text-gray-400 dark:text-gray-500 cursor-help"
                                            title={
                                                showPoints
                                                    ? `Score: ${formatNumber(comparisonScore)}`
                                                    : `Points: ${formatNumber(comparisonPoints)}`
                                            }
                                        >
                                            ?
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono font-semibold">
                                        {showPoints
                                            ? (pointsDiff > 0 ? "+" : "") + formatNumber(pointsDiff)
                                            : (scoreDiff > 0 ? "+" : "") + formatNumber(scoreDiff)}
                                        <span
                                            className="ml-1 text-xs text-gray-400 dark:text-gray-500 cursor-help"
                                            title={
                                                showPoints
                                                    ? `Score Diff: ${scoreDiff > 0 ? "+" : ""}${formatNumber(scoreDiff)}`
                                                    : `Points Diff: ${pointsDiff > 0 ? "+" : ""}${formatNumber(pointsDiff)}`
                                            }
                                        >
                                            ?
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
