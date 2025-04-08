import React, { useEffect, useRef } from "react";
import useStore from "../state/store";

export default function CanvasGridRendererAnimateInput() {
  const { gridConvolutionManager, gridState, applyConvolution, setHoverPosition } = useStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      gridConvolutionManager.renderGrid(ctx);
    }
  }, [gridState, gridConvolutionManager]);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const cellSize = gridState.cellSize;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);

    const kernelSize = 3;
    if (
      row >= 0 &&
      col >= 0 &&
      row <= gridState.rows - kernelSize &&
      col <= gridState.cols - kernelSize
    ) {
      setHoverPosition({ row, col }); // Update hover position in store
      applyConvolution(row, col);

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        gridConvolutionManager.renderGrid(ctx);
        ctx.strokeStyle = "rgba(0, 255, 0, 0.5)";
        ctx.lineWidth = 2;
        ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    } else {
      setHoverPosition(null); // Clear hover if outside bounds
    }
  };

  const handleMouseLeave = () => {
    setHoverPosition(null); // Clear hover when mouse leaves
  };

  return (
    <div className="relative max-w-4xl mx-auto p-4">
      <div className="relative overflow-hidden rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <canvas
          ref={canvasRef}
          width={gridState.cols * gridState.cellSize}
          height={gridState.rows * gridState.cellSize}
          className="w-full h-auto cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
      </div>


    </div>
  );
}