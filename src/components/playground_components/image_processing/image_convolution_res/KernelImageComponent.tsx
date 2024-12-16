"use client";
import { useState, useEffect, useRef } from "react";

interface KernelImageComponentProps {
  setKernel: (kernel: number[][]) => void;
}

const PRESETS: { [key: string]: number[][] } = {
  Blur: [
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
  ],
  Sharpen: [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0],
  ],
  EdgeDetection: [
    [-1, -1, -1],
    [-1, 8, -1],
    [-1, -1, -1],
  ],
  Identity: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
};

export default function KernelImageComponent({
  setKernel,
}: KernelImageComponentProps) {
  const [grid, setGrid] = useState(3);
  const [matrix, setMatrix] = useState<number[][]>(PRESETS.Blur);

  const handleMatrixChange = (row: number, col: number, value: string) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = parseFloat(value) || 0;
    setMatrix(newMatrix);
    setKernel(newMatrix);
  };

  const handlePresetChange = (preset: string) => {
    const presetMatrix = PRESETS[preset];
    if (presetMatrix) {
      setGrid(presetMatrix.length);
      setMatrix(presetMatrix);
      setKernel(presetMatrix);
    }
  };

  useEffect(() => {
    setKernel(matrix);
  }, [matrix, setKernel]);

  return (
    <section>
      <div className="flex gap-2 items-center mb-4">
        <label htmlFor="presets" className="font-medium">Presets:</label>
        <select
          id="presets"
          className="border rounded px-2 py-1"
          onChange={(e) => handlePresetChange(e.target.value)}
        >
          {Object.keys(PRESETS).map((preset) => (
            <option key={preset} value={preset}>
              {preset}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `repeat(${grid}, 1fr)` }}>
        {matrix.map((row, rowIndex) =>
          row.map((value, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              step={0.1}
              type="number"
              className="w-12 h-12 text-center border rounded"
              value={value}
              onChange={(e) =>
                handleMatrixChange(rowIndex, colIndex, e.target.value)
              }
            />
          ))
        )}
      </div>
    </section>
  );
}
