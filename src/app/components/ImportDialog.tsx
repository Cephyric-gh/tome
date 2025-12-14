import React, { useState } from "react";
import { clsx } from "clsx";
import { IDLEONNUM } from "../functions/sheet-fns";
import { saveCustomAccount } from "../functions/custom-accounts";

interface ImportDialogProps {
    onClose: () => void;
    onImport: (scores: number[]) => void;
    onAccountsUpdated?: () => void;
}

function parseImportText(text: string): number[] {
    const lines = text.split("\n");
    const parsedNumbers: number[] = [];

    for (const line of lines) {
        const trimmed = line.trim().toLowerCase();
        // Skip empty lines
        if (trimmed.length === 0 || trimmed.endsWith("pts")) continue;

        // Remove commas and try to parse as number
        const cleaned = IDLEONNUM(trimmed);
        const num = Number(cleaned);

        // Only add if it's a valid number
        if (!isNaN(num)) {
            parsedNumbers.push(num);
        }
    }

    return parsedNumbers;
}

export default function ImportDialog({ onClose, onImport, onAccountsUpdated }: ImportDialogProps) {
    const [importText, setImportText] = useState("");
    const [closing, setClosing] = useState(false);
    const [error, setError] = useState("");
    const [saveAsComparison, setSaveAsComparison] = useState(false);
    const [accountName, setAccountName] = useState("");

    const handleImport = () => {
        setError("");
        const parsedScores = parseImportText(importText);

        if (parsedScores.length === 0) {
            setError(`Improper data copied from IdleonToolbox, please try again`);
            return;
        }

        if (saveAsComparison) {
            if (!accountName.trim()) {
                setError("Please enter a name for the comparison account");
                return;
            }
            saveCustomAccount(accountName.trim(), parsedScores);
            onAccountsUpdated?.();
            onClose();
        } else {
            onImport(parsedScores);
            onClose();
        }
    };

    const handleCancel = () => {
        setClosing(true);
        setTimeout(() => {
            onClose();
            setClosing(false);
        }, 250);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Only close if clicking directly on the backdrop, not on the dialog content
        if (e.target === e.currentTarget) {
            handleCancel();
        }
    };

    return (
        <div
            className={clsx(
                closing ? "backdrop-blur-none bg-transparent" : "backdrop-blur-sm bg-black/20",
                "fixed inset-0 flex items-center justify-center z-50 starting:backdrop-blur-none transition-all",
            )}
            onClick={handleBackdropClick}
        >
            <div
                className={clsx(
                    closing ? "opacity-0 scale-90" : "",
                    "bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 flex flex-col starting:opacity-0 starting:scale-90 transition-all",
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Import Toolbox Scores</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        This is not the normal export JSON. Go to the IdleonToolbox tome page, select all the entries
                        from Account LV to Highest Leveled Spelunker instead. Do not alter the way it pastes into the
                        input.
                    </p>
                </div>
                <div className="px-6 py-4 flex-1">
                    {error.length > 0 && (
                        <div className="w-full bg-red-100 dark:bg-red-800/40 px-4 rounded-lg py-3 border-2 mb-4 border-red-300 dark:border-red-800/80">
                            {error}
                        </div>
                    )}

                    <textarea
                        value={importText}
                        onChange={(e) => setImportText(e.target.value)}
                        placeholder="Account LV&#10;&#10;42069&#10;&#10;6,769 PTS&#10;&#10;..."
                        className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 mb-4"
                    />

                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={saveAsComparison}
                                onChange={(e) => setSaveAsComparison(e.target.checked)}
                                className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
                            <span>Save as comparison account instead</span>
                        </label>

                        {saveAsComparison && (
                            <input
                                type="text"
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                                placeholder="Enter account name"
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
                        )}
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleImport}
                        className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                    >
                        {saveAsComparison ? "Save Comparison" : "Import"}
                    </button>
                </div>
            </div>
        </div>
    );
}
