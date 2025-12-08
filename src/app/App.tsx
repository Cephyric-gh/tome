import { useState, useEffect } from "react";
import { POINTS, IDLEONNUM } from "./functions/sheet-fns";
import ImportDialog from "./components/ImportDialog";
import ExportDialog from "./components/ExportDialog";
import { accounts, bestAccount } from "./functions/accounts";
import ToolboxTable from "./components/ToolboxTable";
import TotalPointsBox from "./components/TotalPointsBox";
import FiltersBar from "./components/FiltersBar";
import { useStickyState } from "./functions/use-sticky-state";
import { TomeItem } from "./types";
import { tome, tomeLength } from "./tome";

export type ToolboxRow = TomeItem & {
    index: number;
    score: number | null;
    points: number;
};

function formatToolboxScores(stored: number[]): ToolboxRow["score"][] {
    if (stored) {
        return Array.from({ length: tomeLength }, (_, i) => i).map((index) => stored[index] ?? null);
    }

    return new Array(tomeLength).fill(null);
}

function App() {
    const [storedScores, setStoredScores] = useStickyState<number[]>([], "toolboxScores");
    const [toolboxScores, setToolboxScores] = useState<ToolboxRow["score"][]>([]);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
    const [importScoreCount, setImportScoreCount] = useState(0);
    const [comparisonAccountIndex, setComparisonAccountIndex] = useState<number>(-1);
    const [showPoints, setShowPoints] = useStickyState(true, "showPoints");
    const [showMax, setShowMax] = useStickyState(false, "showMax");
    const [highlightRow, setHighlightRow] = useStickyState(false, "highlightRow");

    useEffect(() => setToolboxScores(formatToolboxScores(storedScores)), [storedScores]);
    useEffect(() => setImportScoreCount(toolboxScores.length), [toolboxScores]);

    const handleImport = (parsedScores: number[]) => {
        setStoredScores(Array.from({ length: tomeLength }, (_, i) => i).map((index) => parsedScores[index] ?? null));
        setImportScoreCount(parsedScores.length);
    };

    // Evaluate toolbox data from scores
    const evaluatedToolbox: (TomeItem & { score: number | null; points: number; index: number })[] =
        toolboxScores.length > 0
            ? toolboxScores.map((score, index) => ({
                  ...tome[index],
                  index: index + 1,
                  score: score,
                  points: POINTS(index, IDLEONNUM(score)),
              }))
            : [];

    // Calculate total points
    const totalPoints = evaluatedToolbox.reduce((sum, row) => sum + row.points, 0);

    // Calculate comparison total points
    const comparisonTotalPoints = (
        comparisonAccountIndex === -1 ? bestAccount : accounts[comparisonAccountIndex]
    ).scores.reduce((sum, score, index) => sum + POINTS(index, IDLEONNUM(score)), 0);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tome Toolbox Data</h1>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsImportDialogOpen(true)}
                                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                            >
                                Import Scores
                            </button>
                            <button
                                onClick={() => setIsExportDialogOpen(true)}
                                className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                            >
                                Export Scores
                            </button>
                        </div>
                    </div>

                    <FiltersBar
                        comparisonAccountIndex={comparisonAccountIndex}
                        setComparisonAccountIndex={(x) => setComparisonAccountIndex(x)}
                        showPoints={showPoints}
                        setShowPoints={(x) => setShowPoints(x)}
                        showMax={showMax}
                        setShowMax={(x) => setShowMax(x)}
                        highlightRow={highlightRow}
                        setHighlightRow={(x) => setHighlightRow(x)}
                    />
                </div>

                {importScoreCount > 0 && importScoreCount < tomeLength && (
                    <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg px-6 py-4 border-2 border-yellow-400 dark:border-yellow-700">
                        <div className="flex items-start gap-3">
                            <span className="text-yellow-600 dark:text-yellow-500 text-xl">⚠️</span>
                            <div>
                                <p className="font-semibold text-yellow-800 dark:text-yellow-300">Incomplete Import</p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                                    Only {importScoreCount} of {tomeLength} scores have been imported. Some achievements
                                    may be missing or have default values.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <TotalPointsBox
                    totalPoints={totalPoints}
                    comparisonTotalPoints={comparisonTotalPoints}
                    comparisonAccountIndex={comparisonAccountIndex}
                />

                <ToolboxTable
                    evaluatedToolbox={evaluatedToolbox}
                    showPoints={showPoints}
                    showMax={showMax}
                    highlightRow={highlightRow}
                    comparisonAccountIndex={comparisonAccountIndex}
                />
            </div>

            {isImportDialogOpen && (
                <ImportDialog onClose={() => setIsImportDialogOpen(false)} onImport={handleImport} />
            )}

            {isExportDialogOpen && <ExportDialog onClose={() => setIsExportDialogOpen(false)} scores={toolboxScores} />}
        </div>
    );
}

export default App;
