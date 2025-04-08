import React, { useEffect, useRef } from "react";
import useStore from "../state/store";

export default function CanvasGridResult() {
    const { resultGrid, gridState, hoverPosition } = useStore();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Effect to render the result grid immediately and handle hover highlighting
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx || !canvas) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const outputRows = resultGrid.length;
        const outputCols = resultGrid[0].length;
        const cellSize = gridState.cellSize;

        // Render all cells of the result grid (this happens immediately)
        for (let row = 0; row < outputRows; row++) {
            for (let col = 0; col < outputCols; col++) {
                const value = resultGrid[row][col];
                const x = col * cellSize;
                const y = row * cellSize;

                const fillColor = "white"; // Default color (you can adjust this)

                // Draw the cell
                ctx.fillStyle = fillColor;
                ctx.fillRect(x, y, cellSize, cellSize);
                ctx.strokeStyle = "grey";
                ctx.lineWidth = 0.5;
                ctx.strokeRect(x, y, cellSize, cellSize);

                // Display value as text
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = `12px sans-serif`;
                ctx.fillText(value.toString(), x + cellSize / 2, y + cellSize / 2);
            }
        }

        // Highlight hovered cell only if hoverPosition exists (optional visual feedback)
        if (hoverPosition) {
            const resultRow = hoverPosition.row;
            const resultCol = hoverPosition.col;

            if (
                resultRow >= 0 &&
                resultRow < outputRows &&
                resultCol >= 0 &&
                resultCol < outputCols
            ) {
                ctx.strokeStyle = "rgba(0, 255, 0, 0.5)";
                ctx.lineWidth = 2;
                ctx.strokeRect(
                    resultCol * cellSize,
                    resultRow * cellSize,
                    cellSize,
                    cellSize
                );
            }
        }
    }, [resultGrid, gridState.cellSize, hoverPosition]); // Dependencies ensure re-render on changes

    const outputRows = resultGrid.length;
    const outputCols = resultGrid[0].length;

    return (
        <div className="p-4 flex flex-col items-center justify-center">
            <div className="overflow-auto max-h-64 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <canvas
                    ref={canvasRef}
                    width={outputCols * gridState.cellSize}
                    height={outputRows * gridState.cellSize}
                    className="mx-auto cursor-crosshair"
                />
            </div>
            <div className="mt-2 text-center text-gray-600 text-sm w-full">
                {hoverPosition ? `Result at (${hoverPosition.row}, ${hoverPosition.col})` : 'Result Grid'}
            </div>
        </div>
    );
}