import React, { useState, useEffect, useRef } from "react";
import GridManager from "@/classes/GridManager";

interface CanvasGridRendererAnimateProps {
  rows: number;
  cols: number;
  cellSize: number;
  isGridLine?: boolean;
  data?: number[][] | number[][][];
  isNotInteractive?: boolean;
}

export default function CanvasGridRendererAnimate({
  rows,
  cols,
  cellSize,
  isGridLine,
  data,
  isNotInteractive,
}: CanvasGridRendererAnimateProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gridManager] = useState(
    () => new GridManager(rows, cols, cellSize, 0, isGridLine ?? true, data)
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

    // Highlight and update the 3×3 kernel
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const gridRow = row + r;
        const gridCol = col + c;

        if (gridRow < rows && gridCol < cols) {
          const x = gridCol * cellSize;
          const y = gridRow * cellSize;
          const value = customKernel[r][c]; // Get the kernel value

          // get the value from the grid manager
          const currentGridValue = gridManager.getValueByPosition(x, y);

          // Update the grid using `updateGridByPosition`
          gridManager.updateGridByPosition(x, y, {
            text: `${value}x${currentGridValue}`,
            fillColor: "rgba(0, 0, 255, 0.2)",
            font: `light ${cellSize / 4}px sans-serif`,
          });
        }
      }
    }
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
    }, 1500); // Update every 1500ms

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
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            background: isAnimating ? "red" : "green",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {isAnimating ? "Stop Animation" : "Start Animation"}
        </button>
      )}
    </div>
  );
}
