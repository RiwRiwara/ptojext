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

  // Handle mouse move to update kernel position
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const row = Math.floor(y / gridState.cellSize);
    const col = Math.floor(x / gridState.cellSize);

    // Ensure the kernel stays within bounds
    if (row >= 0 && col >= 0 && row <= gridState.rows - 3 && col <= gridState.cols - 3) {
      applyConvolution(row, col);
    }
  };

  return (
    <div className="p-4 relative">
      <canvas
        ref={canvasRef}
        width={gridState.cols * gridState.cellSize}
        height={gridState.rows * gridState.cellSize}
        style={{ border: "1px solid black" }}
        onMouseMove={handleMouseMove} // Detect mouse movement
      />
      <div className="absolute top-0 left-0 flex space-x-2">
        <button onClick={() => gridConvolutionManager.scaleUpGrids()} className="w-6 h-6 rounded-full bg-primary-500 text-white text-sm font-bold">
          +
        </button>
        <button onClick={() => gridConvolutionManager.scaleDownGrids()} className="w-6 h-6 rounded-full bg-red-600 text-white text-sm font-bold">
          -
        </button>
      </div>
    </div>
  );
}

