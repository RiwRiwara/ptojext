import React, { useState, useEffect, useRef } from "react";
import GridConvolutionManager from "@/classes/GridConvolutionManager";

interface CanvasGridRendererAnimateUpdateProps {
  rows: number;
  cols: number;
  cellSize: number;
  isGridLine?: boolean;
  data?: number[][] | number[][][];
  isNotInteractive?: boolean;
  gridManagerProvider?: GridConvolutionManager;
}

export default function CanvasGridRendererAnimateUpdate({
  rows,
  cols,
  cellSize,
  isGridLine,
  data,
  isNotInteractive,
  gridManagerProvider,
}: CanvasGridRendererAnimateUpdateProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gridManager] = useState<GridConvolutionManager>(
    gridManagerProvider ??
      new GridConvolutionManager(
        rows,
        cols,
        cellSize,
        0,
        isGridLine ?? true,
        data
      )
  );

  // Convolution state variables
  const [kernelPosition, setKernelPosition] = useState({ row: 0, col: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const defaultKernel = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateKernel = (
    row: number,
    col: number,
    customKernel: number[][] = defaultKernel
  ) => {
    // Clear the previous kernel
    gridManager.resetGrids();
    gridManager.updateKernel(row, col, customKernel);
    gridManager.setKernelPosition(row, col);
  };



  // Animate the convolution process
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setKernelPosition((prevPosition) => {
        let { row, col } = prevPosition;

        // Move the kernel to the next position
        if (col + 3 < cols) {
          col++;
        } else if (row + 3 < rows) {
          col = 0;
          row++;
        } else {
          // Restart animation
          col = 0;
          row = 0;
        }

        updateKernel(row, col, defaultKernel);
        return { row, col };
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isAnimating, cols, rows, updateKernel, defaultKernel]);

  // Redraw the grid whenever the grids state updates
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      gridManager.renderGrid(ctx);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridManager.getGrids(), cellSize, gridManager]);

  // Start/stop animation
  const toggleAnimation = () => {
    setIsAnimating((prev) => !prev);
    if (!isAnimating) {
      gridManager.resetGrids();
    } // Clear the grid when starting the animation
  };

  return (
    <div className="p-4">
      <canvas
        ref={canvasRef}
        width={cols * cellSize}
        height={rows * cellSize}
        style={{ border: "1px solid black" }}
      />
      {!isNotInteractive && (
        <button
          onClick={toggleAnimation}
          className="text-white rounded-full px-4 py-2 font-normal mt-2"
          style={{
            background: isAnimating ? "red" : "green",
          }}
        >
          {isAnimating ? "Stop Animation" : "Start Animation"}
        </button>
      )}
    </div>
  );
}
