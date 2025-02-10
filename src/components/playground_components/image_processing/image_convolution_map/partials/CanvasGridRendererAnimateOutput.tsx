import React, { useEffect, useRef } from "react";
import useStore from "../state/store";

export default function CanvasGridRendererAnimateOutput() {
  const { gridConvolutionManager, gridState, applyConvolution, convolutionOutput } = useStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw updated grid
      gridState.data.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const x = colIndex * gridState.cellSize;
          const y = rowIndex * gridState.cellSize;

          // If we have a convolution result, use that color
          if (convolutionOutput) {
            const convolutionValue = Array.isArray(convolutionOutput)
              ? convolutionOutput[0] // For now, we use the first channel's value for coloring
              : convolutionOutput; // Or the grayscale value

            // Use convolution output to adjust color intensity (scale it)
            ctx.fillStyle = `rgba(0, 0, 255, ${convolutionValue / 10})`; 
          } else {
            //@ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
            ctx.fillStyle = `rgba(0, 0, 255, ${cell / 10})`;
          }

          ctx.fillRect(x, y, gridState.cellSize, gridState.cellSize);

          ctx.strokeStyle = "black";
          ctx.strokeRect(x, y, gridState.cellSize, gridState.cellSize);

          ctx.fillStyle = "white";
          ctx.font = `${gridState.cellSize / 3}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(cell.toString(), x + gridState.cellSize / 2, y + gridState.cellSize / 2);
        });
      });
    }
  }, [gridState, convolutionOutput]); // Add convolutionOutput as a dependency

  return (
    <div className="p-4 relative cursor-none">
      <canvas
        ref={canvasRef}
        width={gridState.cols * gridState.cellSize}
        height={gridState.rows * gridState.cellSize}
        style={{ border: "1px solid black" }}
      />
      <div className="absolute top-2 left-2 bg-white p-2 border ">
        <p>Convolution Output:</p>
        {Array.isArray(convolutionOutput)
          ? convolutionOutput.map((val, i) => <p key={i}>Channel {i + 1}: {val.toFixed(2)}</p>)
          : <p>Gray: {convolutionOutput.toFixed(2)}</p>
        }
      </div>
    </div>
  );
}
