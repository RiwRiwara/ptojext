import React, { useState, useEffect, useRef } from "react";
import GridManager from "@/classes/GridManager";

interface CanvasGridRendererProps {
  rows: number;
  cols: number;
  cellSize: number;
  image?: string;
  isGridLine?: boolean;
}

export default function CanvasGridRenderer({
  rows,
  cols,
  cellSize,
  image,
  isGridLine,
}: CanvasGridRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gridManager] = useState(
    () => new GridManager(rows, cols, cellSize, 0.5, isGridLine ?? true)
  );
  const [grids, setGrids] = useState<Grid[]>(gridManager.getGrids());

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.crossOrigin = "anonymous";

      img.onload = () => {
        gridManager.drawImageToGrids(img);
        setGrids([...gridManager.getGrids()]);
      };
    }
  }, [image, gridManager]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx) {
      gridManager.renderGrid(ctx);
    }
  }, [grids, cellSize, gridManager]);

  // Handle grid click event
  const handleGridClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const clickedGrid = gridManager.getGridByPosition(x, y);
      console.log(clickedGrid);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={cols * cellSize}
      height={rows * cellSize}
      style={{ border: "1px solid black" }}
      onClick={handleGridClick}
    />
  );
}
