"use client";
import React, { useState, useEffect, useRef } from "react";
import GridManager from "@/classes/GridManager";
import { Card } from "@heroui/card";
import { Slider } from "@nextui-org/slider";
import { Switch } from "@heroui/switch";

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
  isGridLine = true,
}: CanvasGridRenderImageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rows, setRows] = useState(initialRows);
  const [cols, setCols] = useState(initialCols);
  const [cellSize, setCellSize] = useState(initialCellSize);
  const [showGridLine, setshowGridLine] = useState(isGridLine);
  const [gridManager, setGridManager] = useState(
    new GridManager(rows, cols, cellSize, 0.5, isGridLine)
  );

  const [hoverCell, setHoverCell] = useState<{ x: number; y: number; color: string } | null>(null);


  useEffect(() => {
    setGridManager(new GridManager(rows, cols, cellSize, 0.5, isGridLine));
  }, [rows, cols, cellSize, isGridLine]);

  useEffect(() => {
    if (image && gridManager) {
      const img = new Image();
      img.src = image;
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            gridManager.drawImageToGrids(img);
          }
        }
      };
    }
  }, [image, gridManager]);


  useEffect(() => {
    if (gridManager) {
      const observer = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) gridManager.renderGrid(ctx); // Force redraw
        }
      };

      gridManager.addObserver(observer);

      return () => {
        gridManager.removeObserver(observer);
      };
    }
  }, [gridManager]);



  // =========== Handle change events ===========
  const handleChangeRows = (value: number) => {
    if (isNaN(Number(value))) return;
    setRows(value);
    gridManager.rows = value;
  };

  const handleChangeCols = (value: number) => {
    if (isNaN(Number(value))) return;
    setCols(value);
    gridManager.cols = value;
  };

  const handleChangeCellSize = (value: number) => {
    if (isNaN(Number(value))) return;
    setCellSize(value);
    gridManager.cellSize = value;
  };

  const handleChangeIsGridLine = (value: boolean) => {
    if (typeof value !== "boolean") return;
    setshowGridLine(value);
    setGridManager(new GridManager(rows, cols, cellSize, 0.5, value));
  };

  // ============ Redraw canvas ============
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gridManager.renderGrid(ctx);

    if (hoverCell) {
      highlightCell(ctx, hoverCell.x, hoverCell.y);
    }
  };

  // ============== Handle mouse events ===============
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);

    if (x < 0 || x >= cols || y < 0 || y >= rows) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      const pixelData = ctx.getImageData(x * cellSize, y * cellSize, 1, 1).data;
      const color = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;

      setHoverCell({ x, y, color });
      redrawCanvas();
    }
  };

  const handleMouseLeave = () => {
    setHoverCell(null);
    redrawCanvas();
  };

  const highlightCell = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = "rgba(255, 255, 0, 0.3)"; // Yellow semi-transparent
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
  };



  return (
    <div className="flex gap-4 flex-col justify-center items-center">
      <div className="flex flex-row gap-4 shadow-sm p-2 rounded">
        <div>
          <label>Rows: {rows}</label>
          <Slider minValue={1} maxValue={300} value={rows}
            aria-label="Rows slider"
            onChange={(value) => handleChangeRows(Array.isArray(value) ? value[0] : value)}
          />
        </div>
        <div>
          <label>Columns: {cols}</label>
          <Slider minValue={1} maxValue={300} value={cols}
            aria-label="Cols slider"
            onChange={(value) => handleChangeCols(Array.isArray(value) ? value[0] : value)}
          />
        </div>
        <div>
          <label>Cell Size: {cellSize}px</label>
          <Slider minValue={1} maxValue={10} step={1} value={cellSize}
            aria-label="Cells slider"
            onChange={
              (value) => handleChangeCellSize(Array.isArray(value) ? value[0] : value)
            }
          />
        </div>
        <div>
          <p>Show Grid</p>
          <Switch defaultSelected size="sm" aria-label="Show grid"
            onChange={(value) => handleChangeIsGridLine(value.target.checked)}
          >
          </Switch>
        </div>
      </div>
      <div className="relative cursor-none">
        <canvas
          ref={canvasRef}
          width={cols * cellSize}
          height={rows * cellSize}
          className="border"
          style={{ width: cols * cellSize, height: rows * cellSize }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        {hoverCell && (
          <div
            className="absolute bg-black text-white p-1 text-sm rounded"
            style={{
              top: hoverCell.y * cellSize + 20,
              left: hoverCell.x * cellSize + 20,
              pointerEvents: "none",
            }}
          >
            ({hoverCell.x}, {hoverCell.y}) <br /> {hoverCell.color}
          </div>
        )}
      </div>
    </div>
  );
}
