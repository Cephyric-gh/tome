import React, { useState } from "react";
import { clsx } from "clsx";
import { expandShorthand, IDLEONNUM, POINTS } from "../functions/sheet-fns";
import { tome, tomeLength } from "../tome";
import { saveCustomAccount } from "../functions/custom-accounts";

interface BulkImportDialogProps {
    onClose: () => void;
    onImport: (scores: number[]) => void;
    onAccountsUpdated?: () => void;
}

interface ParsedAccount {
    scores: number[];
    totalPoints: number;
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

function parseColumnBasedAccounts(text: string): number[][] {
    const lines = text.split("\n");
    const accountColumns: number[][] = [];

    for (const line of lines) {
        const trimmed = line.trim().toLowerCase();
        // Skip empty lines
        if (trimmed.length === 0 || trimmed.endsWith("pts")) continue;

        // Split by whitespace/tabs to get multiple values on the same line
        const parts = expandShorthand(trimmed).split(/\t+/);
        const numbersOnLine: number[] = [];

        for (const part of parts) {
            const cleaned = parseFloat(part);

            if (!isNaN(cleaned)) {
                numbersOnLine.push(cleaned);
            }
        }

        // If we found multiple numbers on this line, distribute them to columns
        if (numbersOnLine.length > 0) {
            for (let i = 0; i < numbersOnLine.length; i++) {
                if (!accountColumns[i]) {
                    accountColumns[i] = [];
                }
                accountColumns[i].push(numbersOnLine[i]);
            }
        }
    }

    return accountColumns.filter((col) => col.length > 0);
}

function calculateTotalPoints(scores: number[]): number {
    return scores.reduce((sum, score, index) => {
        if (index >= tome.length) return sum;
        return sum + POINTS(index, IDLEONNUM(score));
    }, 0);
}

function splitByAccountLV(text: string): string[] {
    // Case-insensitive split by "Account LV"
    const regex = /account\s+lv/i;
    const parts = text.split(regex);

    // Filter out empty parts and return
    return parts.filter((part) => part.trim().length > 0);
}

export default function BulkImportDialog({ onClose, onImport, onAccountsUpdated }: BulkImportDialogProps) {
    const [importText, setImportText] = useState("");
    const [closing, setClosing] = useState(false);
    const [error, setError] = useState("");
    const [parsedAccounts, setParsedAccounts] = useState<ParsedAccount[]>([]);
    const [selectedAccountIndex, setSelectedAccountIndex] = useState<number>(0);
    const [expandedAccounts, setExpandedAccounts] = useState<Set<number>>(new Set());
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [saveAsComparison, setSaveAsComparison] = useState(false);
    const [accountName, setAccountName] = useState("");

    const toggleExpand = (index: number) => {
        const newExpanded = new Set(expandedAccounts);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedAccounts(newExpanded);
    };

    const handleCopy = async (index: number, scores: number[]) => {
        const arrayString = JSON.stringify(scores);
        await navigator.clipboard.writeText(arrayString);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleParse = () => {
        setError("");
        setParsedAccounts([]);
        setExpandedAccounts(new Set());
        setCopiedIndex(null);

        // Method 1: Try splitting by "Account LV" (case-insensitive)
        const sections = splitByAccountLV(importText);
        let accounts: ParsedAccount[] = [];

        if (sections.length > 1) {
            // Found multiple sections, parse each one
            for (const section of sections) {
                const scores = parseImportText(section);
                if (scores.length > 0) {
                    accounts.push({
                        scores,
                        totalPoints: calculateTotalPoints(scores),
                    });
                }
            }
        }

        // Method 2: If we only found 0-1 accounts, try column-based parsing
        if (accounts.length <= 1) {
            const columnAccounts = parseColumnBasedAccounts(importText);

            if (columnAccounts.length > 1) {
                // Found multiple columns, use those instead
                accounts = columnAccounts.map((scores) => ({
                    scores,
                    totalPoints: calculateTotalPoints(scores),
                }));
            } else if (accounts.length === 0 && columnAccounts.length === 1) {
                // Only found one column and no section-based accounts
                accounts = columnAccounts.map((scores) => ({
                    scores,
                    totalPoints: calculateTotalPoints(scores),
                }));
            }
        }

        if (accounts.length === 0) {
            setError("No valid account data found. Please check your input.");
            return;
        }

        setParsedAccounts(accounts);
        setSelectedAccountIndex(0);
    };

    const handleImport = () => {
        if (parsedAccounts.length === 0) {
            setError("Please parse the accounts first.");
            return;
        }

        if (selectedAccountIndex < 0 || selectedAccountIndex >= parsedAccounts.length) {
            setError("Please select a valid account.");
            return;
        }

        if (saveAsComparison) {
            if (!accountName.trim()) {
                setError("Please enter a name for the comparison account");
                return;
            }
            saveCustomAccount(accountName.trim(), parsedAccounts[selectedAccountIndex].scores);
            onAccountsUpdated?.();
            onClose();
        } else {
            onImport(parsedAccounts[selectedAccountIndex].scores);
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
                    "bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 flex flex-col starting:opacity-0 starting:scale-90 transition-all max-h-[90vh]",
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bulk Import Toolbox Scores</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Paste data from multiple accounts. The importer will automatically split by "Account LV" and let
                        you choose which account to import.
                    </p>
                </div>
                <div className="px-6 py-4 flex-1 overflow-y-auto">
                    {error.length > 0 && (
                        <div className="w-full bg-red-100 dark:bg-red-800/40 px-4 rounded-lg py-3 border-2 mb-4 border-red-300 dark:border-red-800/80">
                            {error}
                        </div>
                    )}

                    <textarea
                        value={importText}
                        onChange={(e) => setImportText(e.target.value)}
                        placeholder="Account LV&#10;&#10;42069&#10;&#10;6,769 PTS&#10;&#10;...&#10;&#10;Account LV&#10;&#10;69420&#10;&#10;..."
                        className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 mb-4"
                    />

                    <button
                        onClick={handleParse}
                        className="w-full px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors mb-4"
                    >
                        Parse Accounts
                    </button>

                    {parsedAccounts.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Found {parsedAccounts.length} account{parsedAccounts.length !== 1 ? "s" : ""}
                            </h3>

                            <div className="space-y-3 pb-3 border-b border-gray-200 dark:border-gray-700">
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
                            <div className="space-y-2">
                                {parsedAccounts.map((account, index) => {
                                    const isIncomplete = account.scores.length !== tomeLength;
                                    const isExpanded = expandedAccounts.has(index);
                                    return (
                                        <div
                                            key={index}
                                            className={clsx(
                                                "rounded-lg border-2 transition-all",
                                                selectedAccountIndex === index
                                                    ? isIncomplete
                                                        ? "border-yellow-500 dark:border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
                                                        : "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                                    : isIncomplete
                                                      ? "border-yellow-400 dark:border-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/10"
                                                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700",
                                            )}
                                        >
                                            <button
                                                onClick={() => setSelectedAccountIndex(index)}
                                                className="w-full p-4 text-left hover:opacity-80 transition-opacity"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                                Account {index + 1}
                                                            </div>
                                                            {isIncomplete && (
                                                                <span className="text-yellow-600 dark:text-yellow-500 text-lg">
                                                                    ⚠️
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div
                                                            className={clsx(
                                                                "text-sm",
                                                                isIncomplete
                                                                    ? "text-yellow-700 dark:text-yellow-400 font-medium"
                                                                    : "text-gray-600 dark:text-gray-400",
                                                            )}
                                                        >
                                                            {account.scores.length} / {tomeLength} scores imported
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                                                            {account.totalPoints.toLocaleString()} pts
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                            <div className="px-4 pb-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleExpand(index);
                                                    }}
                                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                    {isExpanded ? "Hide raw" : "Show raw"}
                                                </button>
                                            </div>
                                            {isExpanded && (
                                                <div className="px-4 pb-4">
                                                    <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-900 justify-center border border-gray-300 dark:border-gray-600">
                                                        <pre className=" grow rounded text-xs pl-3 py-3 overflow-x-auto scrollbar-hidden">
                                                            <code className="text-gray-800 dark:text-gray-200">
                                                                {JSON.stringify(account.scores)}
                                                            </code>
                                                        </pre>

                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleCopy(index, account.scores);
                                                            }}
                                                            className={clsx(
                                                                "px-3 py-1 mr-3 my-3 rounded text-xs font-medium transition-colors",
                                                                copiedIndex === index
                                                                    ? "bg-green-600 dark:bg-green-700 text-white"
                                                                    : "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600",
                                                            )}
                                                        >
                                                            {copiedIndex === index ? "Copied!" : "Copy"}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
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
                        disabled={parsedAccounts.length === 0}
                        className={clsx(
                            "px-4 py-2 text-white rounded-lg transition-colors",
                            parsedAccounts.length === 0
                                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                                : "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600",
                        )}
                    >
                        {saveAsComparison ? "Save Comparison" : "Import Selected Account"}
                    </button>
                </div>
            </div>
        </div>
    );
}
