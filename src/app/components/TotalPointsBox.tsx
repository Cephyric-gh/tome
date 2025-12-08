import { clsx } from "clsx";
import { accounts, bestAccount } from "../functions/accounts";
import { formatNumber } from "../functions/format-number";

interface TotalPointsBoxProps {
    totalPoints: number;
    comparisonTotalPoints: number;
    comparisonAccountIndex: number;
}

export default function TotalPointsBox({
    totalPoints,
    comparisonTotalPoints,
    comparisonAccountIndex,
}: TotalPointsBoxProps) {
    const diffPoints = totalPoints - comparisonTotalPoints;

    return (
        <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-6 py-4 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Points</span>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">You</div>
                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono">
                            {formatNumber(totalPoints)}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                            {comparisonAccountIndex === -1 ? bestAccount.name : accounts[comparisonAccountIndex].name}
                        </div>
                        <div className="text-xl font-bold text-purple-600 dark:text-purple-400 font-mono">
                            {formatNumber(comparisonTotalPoints)}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">Difference</div>
                        <div
                            className={clsx(
                                "text-xl font-bold font-mono",
                                diffPoints >= 0
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400",
                            )}
                        >
                            {diffPoints > 0 ? "+" : ""}
                            {formatNumber(diffPoints)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
