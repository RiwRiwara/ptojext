import React, { useState, useEffect, useRef } from "react";
import useStore from "../state/store";
import GridManager from "@/classes/GridManager";
import { FiEdit } from 'react-icons/fi';
import { BiReset } from 'react-icons/bi';

interface CanvasGridConvolutionProps {
  [key: string]: unknown;
}

export default function CanvasGridConvolution({
}: CanvasGridConvolutionProps) {
  const { convolutionData, applyConvolution, hoverPosition, setHoverPosition } = useStore();
  const [localMatrix, setLocalMatrix] = useState<number[][]>(convolutionData);
  const [editing, setEditing] = useState<{row: number, col: number} | null>(null);
  const [GridManagerShow, setGridManagerShow] = useState<GridManager>(
    new GridManager(
      convolutionData.length,
      convolutionData.length,
      30,
      0,
      true,
      convolutionData
    )
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  // Update local matrix when convolutionData changes
  useEffect(() => {
    setLocalMatrix(convolutionData);
  }, [convolutionData]);

  // Focus input when editing
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  // Handle matrix value change
  const handleValueChange = (row: number, col: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newMatrix = localMatrix.map((r, rIdx) => 
      r.map((c, cIdx) => rIdx === row && cIdx === col ? numValue : c)
    );
    setLocalMatrix(newMatrix);
    
    // Update store with new matrix and apply convolution if we have a hover position
    useStore.setState({ convolutionData: newMatrix });
    if (hoverPosition) {
      applyConvolution(hoverPosition.row, hoverPosition.col);
    }
  };

  // Handle cell click to start editing
  const handleCellClick = (row: number, col: number) => {
    setEditing({ row, col });
  };

  // Handle finish editing on blur or enter key
  const handleFinishEditing = () => {
    setEditing(null);
  };

  // Re-initialize the GridManager when matrix changes
  useEffect(() => {
    setGridManagerShow(new GridManager(
      localMatrix.length,
      localMatrix.length,
      30,
      0,
      true,
      localMatrix
    ));
  }, [localMatrix]);

  // Redraw the grid whenever the grids state updates
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      // Clear the entire canvas to prevent ghosting/duplication
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      GridManagerShow.renderGrid(ctx);
    }
  }, [GridManagerShow]);



  // Function to handle preset kernels
  const applyPreset = (preset: number[][]) => {
    setLocalMatrix([...preset]);
    useStore.setState({ convolutionData: preset });
    if (hoverPosition) {
      applyConvolution(hoverPosition.row, hoverPosition.col);
    }
  };

  // Common kernel presets
  const presets = {
    identity: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0]
    ],
    edge: [
      [-1, -1, -1],
      [-1, 8, -1],
      [-1, -1, -1]
    ],
    blur: [
      [0.0625, 0.125, 0.0625],
      [0.125, 0.25, 0.125],
      [0.0625, 0.125, 0.0625]
    ],
    sharpen: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0]
    ],
    sobelX: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ],
    sobelY: [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1]
    ]
  };

  return (
    <div className="p-4">
      <div className="flex flex-col items-center">
        <div className="mb-2 text-sm font-medium text-gray-700">Convolution Kernel</div>
        <div className="relative" style={{ width: localMatrix[0].length * 30, height: localMatrix.length * 30 }}>
          {/* Visual canvas representation */}
          <canvas
            ref={canvasRef}
            width={localMatrix[0].length * 30}
            height={localMatrix.length * 30}
            style={{ position: "absolute", top: 0, left: 0, border: "1px solid black" }}
          />
          
          {/* Interactive matrix editor */}
          <div 
            className="absolute top-0 left-0 w-full h-full grid" 
            style={{
              gridTemplateColumns: `repeat(${localMatrix[0].length}, 1fr)`,
              gridTemplateRows: `repeat(${localMatrix.length}, 1fr)`,
              pointerEvents: "auto"
            }}
          >
            {localMatrix.flatMap((row, rowIdx) =>
              row.map((cell, colIdx) => (
                <div 
                  key={`${rowIdx}-${colIdx}`}
                  className="flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors relative z-10"
                  onClick={() => handleCellClick(rowIdx, colIdx)}
                >
                  {editing && editing.row === rowIdx && editing.col === colIdx ? (
                    <input
                      ref={inputRef}
                      type="number"
                      value={cell}
                      onChange={(e) => handleValueChange(rowIdx, colIdx, e.target.value)}
                      onBlur={handleFinishEditing}
                      onKeyDown={(e) => e.key === 'Enter' && handleFinishEditing()}
                      className="w-full h-full text-center outline-none bg-white border border-blue-500"
                      style={{ width: '28px', height: '28px' }}
                    />
                  ) : (
                    <div className="text-sm font-medium bg-white bg-opacity-75 px-1 rounded">{cell}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="flex gap-2 mt-3">
          <button 
            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md flex items-center gap-1 hover:bg-blue-200 transition-colors"
            onClick={() => handleCellClick(1, 1)}
          >
            <FiEdit size={12} />
            Edit
          </button>
          <button 
            className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-md flex items-center gap-1 hover:bg-gray-200 transition-colors"
            onClick={() => applyPreset(presets.identity)}
          >
            <BiReset size={12} />
            Reset
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Kernel Presets</h3>
          <div className="grid grid-cols-3 gap-2">
            <button 
              className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              onClick={() => applyPreset(presets.identity)}
            >
              Identity
            </button>
            <button 
              className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              onClick={() => applyPreset(presets.blur)}
            >
              Blur
            </button>
            <button 
              className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              onClick={() => applyPreset(presets.sharpen)}
            >
              Sharpen
            </button>
            <button 
              className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              onClick={() => applyPreset(presets.edge)}
            >
              Edge Detect
            </button>
            <button 
              className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              onClick={() => applyPreset(presets.sobelX)}
            >
              Sobel X
            </button>
            <button 
              className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              onClick={() => applyPreset(presets.sobelY)}
            >
              Sobel Y
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
