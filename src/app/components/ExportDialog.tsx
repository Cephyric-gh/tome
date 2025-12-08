import React, { useState } from "react";
import { clsx } from "clsx";
import { ToolboxRow } from "../App";

interface ExportDialogProps {
    onClose: () => void;
    scores: ToolboxRow["score"][];
}

export default function ExportDialog({ onClose, scores }: ExportDialogProps) {
    const [closing, setClosing] = useState(false);
    const [copied, setCopied] = useState(false);

    const exportText = JSON.stringify(scores);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(exportText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
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
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Export Toolbox Scores</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Copy this JSON array to save your scores for backup or sharing.
                    </p>
                </div>
                <div className="px-6 py-4 flex-1">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={exportText}
                            readOnly
                            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                        <button
                            onClick={handleCopy}
                            className={clsx(
                                "px-4 py-2 rounded-lg transition-colors font-medium",
                                copied
                                    ? "bg-green-600 dark:bg-green-700 text-white"
                                    : "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600",
                            )}
                        >
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
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
