import React, { useEffect, useRef } from "react";
import useStore from "../state/store";

export default function CanvasGridRendererAnimateInput() {
  const { gridConvolutionManager, gridState, applyConvolution } = useStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);


  // Redraw grid when gridState updates
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      gridConvolutionManager.renderGrid(ctx);
    }
  }, [gridState, gridConvolutionManager]);

  // Handle mouse move with improved precision
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Account for canvas scaling and offset
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Get precise mouse coordinates relative to canvas
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    // Calculate grid position with rounding for better precision
    const cellSize = gridState.cellSize;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);

    // Validate bounds (assuming 3x3 kernel)
    const kernelSize = 3;
    if (
      row >= 0 &&
      col >= 0 &&
      row <= gridState.rows - kernelSize &&
      col <= gridState.cols - kernelSize
    ) {
      applyConvolution(row, col);

      // Optional: Visual feedback for precision (highlight hovered cell)
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        gridConvolutionManager.renderGrid(ctx);
        ctx.strokeStyle = "rgba(0, 255, 0, 0.5)"; // Green outline for feedback
        ctx.lineWidth = 2;
        ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="relative overflow-hidden rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <canvas
          ref={canvasRef}
          width={gridState.cols * gridState.cellSize}
          height={gridState.rows * gridState.cellSize}
          className="w-full h-auto cursor-crosshair"
          onMouseMove={handleMouseMove}
        />

        <div className="absolute top-4 left-4 flex space-x-3 pointer-events-none">
          <div className="pointer-events-auto flex gap-2 bg-white/90 p-1 rounded-lg shadow-md border border-gray-100 backdrop-blur-sm">
            <button
              onClick={() => gridConvolutionManager.scaleUpGrids()}
              className="w-4 h-4 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
              aria-label="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => gridConvolutionManager.scaleDownGrids()}
              className="w-4 h-4 flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
              aria-label="Zoom Out"
            >
              -
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-gray-600 text-sm">
        Use mouse to interact grid • Adjsut matrix size with buttons
      </div>
    </div>
  );
}