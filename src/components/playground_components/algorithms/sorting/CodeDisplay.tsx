"use client";
import React from "react";
import { algorithmCodeSnippets } from "./constants";
import { motion } from "framer-motion";

interface CodeDisplayProps {
    selectedAlgo: string;
    customAlgorithm: string;
    setCustomAlgorithm: (code: string) => void;
    currentHighlightedLine: number;
    isPlaying: boolean;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({
    selectedAlgo,
    customAlgorithm,
    setCustomAlgorithm,
    currentHighlightedLine,
    isPlaying,
}) => {
    // Get algorithm name for display
    const getAlgorithmName = () => {
        switch (selectedAlgo) {
            case "bubble-sort":
                return "Bubble Sort Algorithm";
            case "selection-sort":
                return "Selection Sort Algorithm";
            case "insertion-sort":
                return "Insertion Sort Algorithm";
            case "merge-sort":
                return "Merge Sort Algorithm";
            case "quick-sort":
                return "Quick Sort Algorithm";
            case "custom-algorithm":
                return "Custom Algorithm";
            default:
                return "Algorithm Code";
        }
    };

    const formatPythonCode = (code: string) => {
        const lines = code.split("\n");
        return lines.map((line, index) => {
            const lineNumber = index + 1;
            const isHighlighted = lineNumber === currentHighlightedLine;

            return (
                <div
                    key={lineNumber}
                    className={`font-mono px-2 py-0.5 rounded ${isHighlighted 
                        ? "bg-[#83AFC9]/20 text-white font-medium" 
                        : "text-gray-300"
                    }`}
                >
                    {line}
                </div>
            );
        });
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 rounded-lg overflow-hidden shadow-md"
        >
            <div className="p-3 bg-gray-800 text-gray-300 text-sm font-medium border-b border-gray-700">
                {getAlgorithmName()}
            </div>
            
            {selectedAlgo === "custom-algorithm" ? (
                <div className="p-4">
                    <textarea
                        value={customAlgorithm}
                        onChange={(e) => setCustomAlgorithm(e.target.value)}
                        placeholder="# Enter your custom sorting algorithm here\ndef custom_sort(arr):\n    # Your code here\n    return arr"
                        className="w-full h-[300px] font-mono text-sm p-2 border rounded bg-gray-800 text-gray-300 border-gray-700" 
                        disabled={isPlaying}
                    />
                </div>
            ) : (
                <pre className="p-4 text-sm overflow-x-auto">
                    <code>
                        {formatPythonCode(algorithmCodeSnippets[selectedAlgo] || "")}
                    </code>
                </pre>
            )}
        </motion.div>
    );
};

export default CodeDisplay;