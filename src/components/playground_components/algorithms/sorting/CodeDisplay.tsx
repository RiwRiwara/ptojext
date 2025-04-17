import { algorithmCodeSnippets } from "./constants";

interface CodeDisplayProps {
    selectedAlgo: string;
    customAlgorithm: string;
    setCustomAlgorithm: (code: string) => void;
    isPlaying: boolean;
    currentHighlightedLine: number;
}

export default function CodeDisplay({
    selectedAlgo,
    customAlgorithm,
    setCustomAlgorithm,
    isPlaying,
    currentHighlightedLine,
}: CodeDisplayProps) {
    const formatPythonCode = (code: string) => {
        if (!code) return [];

        return code.split("\n").map((line, index) => {
            const lineNumber = index + 1;
            const isHighlighted = lineNumber === currentHighlightedLine;

            return (
                <div
                    key={lineNumber}
                    className={`font-mono text-sm p-1 ${isHighlighted ? "bg-yellow-200 dark:bg-yellow-800" : ""
                        }`}
                >
                    <span className="inline-block w-8 text-gray-500 select-none">
                        {lineNumber}
                    </span>
                    <span>{line}</span>
                </div>
            );
        });
    };

    return (
        <section className="mb-8 bg-white rounded-lg shadow-sm p-4 border border-gray-200 overflow-hidden">
            <h3 className="text-lg font-semibold mb-3">Python Implementation</h3>
            <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[400px] text-sm">
                {selectedAlgo === "custom-algorithm" ? (
                    <textarea
                        value={customAlgorithm}
                        onChange={(e) => setCustomAlgorithm(e.target.value)}
                        placeholder="# Enter your custom sorting algorithm here\ndef custom_sort(arr):\n    # Your code here\n    return arr"
                        className="w-full h-[300px] font-mono text-sm p-2 border rounded"
                        disabled={isPlaying}
                    />
                ) : (
                    <div className="font-mono">
                        {formatPythonCode(algorithmCodeSnippets[selectedAlgo] || "")}
                    </div>
                )}
            </div>
        </section>
    );
}