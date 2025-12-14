import { getAllAccounts } from "../functions/accounts";

interface FiltersBarProps {
    comparisonAccountIndex: number;
    setComparisonAccountIndex: (index: number) => void;
    showPoints: boolean;
    setShowPoints: (show: boolean) => void;
    showMax: boolean;
    setShowMax: (show: boolean) => void;
    highlightRow: boolean;
    setHighlightRow: (highlight: boolean) => void;
}

export default function FiltersBar({
    comparisonAccountIndex,
    setComparisonAccountIndex,
    showPoints,
    setShowPoints,
    showMax,
    setShowMax,
    highlightRow,
    setHighlightRow,
}: FiltersBarProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <label htmlFor="comparison-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Compare with:
                </label>
                <select
                    id="comparison-select"
                    value={comparisonAccountIndex}
                    onChange={(e) => setComparisonAccountIndex(parseInt(e.target.value))}
                    className="px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                    <option value="-1">Best</option>
                    {getAllAccounts().map((account, index) => (
                        <option key={index} value={index}>
                            {account.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</span>
                <button
                    onClick={() => setShowPoints(!showPoints)}
                    className="px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                    {showPoints ? "Points" : "Scores"}
                </button>
            </div>
            <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showMax}
                        onChange={(e) => setShowMax(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                    <span>Show Max</span>
                </label>
            </div>
            <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={highlightRow}
                        onChange={(e) => setHighlightRow(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                    <span>Highlight Full Row</span>
                </label>
            </div>
        </div>
    );
}
