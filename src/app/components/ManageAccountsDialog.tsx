import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
import { getCustomAccounts, deleteCustomAccount, renameCustomAccount } from "../functions/custom-accounts";
import { POINTS, IDLEONNUM } from "../functions/sheet-fns";

interface ManageAccountsDialogProps {
    onClose: () => void;
    onAccountsUpdated: () => void;
}

export default function ManageAccountsDialog({ onClose, onAccountsUpdated }: ManageAccountsDialogProps) {
    const [closing, setClosing] = useState(false);
    const [accounts, setAccounts] = useState(getCustomAccounts());
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editName, setEditName] = useState("");

    useEffect(() => {
        setAccounts(getCustomAccounts());
    }, []);

    const handleDelete = (index: number) => {
        if (confirm(`Are you sure you want to delete "${accounts[index].name}"?`)) {
            deleteCustomAccount(index);
            setAccounts(getCustomAccounts());
            onAccountsUpdated();
        }
    };

    const handleStartEdit = (index: number) => {
        setEditingIndex(index);
        setEditName(accounts[index].name);
    };

    const handleSaveEdit = (index: number) => {
        if (editName.trim()) {
            renameCustomAccount(index, editName.trim());
            setAccounts(getCustomAccounts());
            onAccountsUpdated();
            setEditingIndex(null);
        }
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditName("");
    };

    const calculateTotalPoints = (scores: number[]): number => {
        return scores.reduce((sum, score, index) => sum + POINTS(index, IDLEONNUM(score)), 0);
    };

    const handleCancel = () => {
        setClosing(true);
        setTimeout(() => {
            onClose();
            setClosing(false);
        }, 250);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
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
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Comparison Accounts</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        View and manage your custom comparison accounts stored in this browser.
                    </p>
                </div>

                <div className="px-6 py-4 flex-1 overflow-y-auto">
                    {accounts.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <p className="text-lg font-medium">No custom accounts yet</p>
                            <p className="text-sm mt-2">
                                Import scores and check "Save as comparison account instead" to create one.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {accounts.map((account, index) => (
                                <div
                                    key={index}
                                    className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            {editingIndex === index ? (
                                                <div className="flex gap-2 items-center mb-2">
                                                    <input
                                                        type="text"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") handleSaveEdit(index);
                                                            if (e.key === "Escape") handleCancelEdit();
                                                        }}
                                                        className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={() => handleSaveEdit(index)}
                                                        className="px-3 py-1 bg-green-600 dark:bg-green-700 text-white rounded text-sm hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="px-3 py-1 bg-gray-400 dark:bg-gray-600 text-white rounded text-sm hover:bg-gray-500 dark:hover:bg-gray-500 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                        {account.name}
                                                    </h3>
                                                    <button
                                                        onClick={() => handleStartEdit(index)}
                                                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                                                    >
                                                        Rename
                                                    </button>
                                                </div>
                                            )}
                                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                                <div>
                                                    Saved: {account.date.toLocaleDateString()}{" "}
                                                    {account.date.toLocaleTimeString()}
                                                </div>
                                                <div>{account.scores.length} achievements tracked</div>
                                                <div className="font-semibold text-blue-600 dark:text-blue-400">
                                                    Total: {calculateTotalPoints(account.scores).toLocaleString()}{" "}
                                                    points
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(index)}
                                            className="ml-4 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors text-sm font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
