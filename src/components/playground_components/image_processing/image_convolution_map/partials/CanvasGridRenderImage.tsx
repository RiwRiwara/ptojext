"use client";
import React, { useState, useEffect, useRef } from "react";
import GridManager from "@/classes/GridManager";

interface CanvasGridRenderImageProps {
  initialRows: number;
  initialCols: number;
  initialCellSize: number;
  image?: string;
  isGridLine?: boolean;
}

export default function CanvasGridRenderImage({
  initialRows,
  initialCols,
  initialCellSize,
  image,
  isGridLine,
}: CanvasGridRenderImageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rows, setRows] = useState(initialRows);
  const [cols, setCols] = useState(initialCols);
  const [cellSize, setCellSize] = useState(initialCellSize);

  const [gridManager, setGridManager] = useState<GridManager>(
    () => new GridManager(rows, cols, cellSize, 0.5, isGridLine ?? true)
  );
  const [grids, setGrids] = useState<Grid[]>(gridManager.getGrids());

  useEffect(() => {
    setGridManager(
      new GridManager(rows, cols, cellSize, 0.5, isGridLine ?? true)
    );
  }, [rows, cols, cellSize, isGridLine]);

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
    <div className="flex flex-row gap-4">
      <canvas
        ref={canvasRef}
        width={cols * cellSize}
        height={rows * cellSize}
        onClick={handleGridClick}
      />

      <div className=" hidden">
        <div className="flex flex-row gap-2">
          <label className="">
            Rows:
            <input
              type="range"
              min={1}
              max={200}
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
            />
          </label>
          {rows}
        </div>

        <div className="flex flex-row gap-2">
          <label>
            Columns:
            <input
              type="range"
              min={1}
              max={200}
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
            />
          </label>
          {cols}
        </div>

        <div className="flex flex-row gap-2">
          <label>
            Cell Size:
            <input
              type="range"
              min={10}
              max={100}
              step={1}
              value={cellSize}
              onChange={(e) => setCellSize(Number(e.target.value))}
            />
          </label>
          {cellSize}
        </div>
      </div>
    </div>
  );
}
