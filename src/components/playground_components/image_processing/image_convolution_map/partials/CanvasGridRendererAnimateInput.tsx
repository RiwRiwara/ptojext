import React, { useEffect, useRef, useState } from "react";
import useStore from "../state/store";
import ConvolutionEquation from "./ConvolutionEquation";
import { motion, AnimatePresence } from "framer-motion";
import { TbClick, TbEye } from "react-icons/tb";

export default function CanvasGridRendererAnimateInput() {
  const { gridConvolutionManager, gridState, applyConvolution, setHoverPosition, hoverPosition } = useStore();
  const [selectedPosition, setSelectedPosition] = useState<{ row: number, col: number } | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      gridConvolutionManager.renderGrid(ctx);

      // If we have a selected position, highlight it with a stronger border
      if (selectedPosition) {
        const { row, col } = selectedPosition;
        const cellSize = gridState.cellSize;
        ctx.strokeStyle = "rgba(59, 130, 246, 0.8)"; // Blue highlight for selection
        ctx.lineWidth = 3;
        ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
      // If we're hovering, show a lighter highlight
      else if (hoverPosition && isHovering) {
        const { row, col } = hoverPosition;
        const cellSize = gridState.cellSize;
        ctx.strokeStyle = "rgba(99, 102, 241, 0.5)"; // Indigo highlight for hover
        ctx.lineWidth = 2;
        ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }, [gridState, gridConvolutionManager, hoverPosition, selectedPosition, isHovering]);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    setIsHovering(true);

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const cellSize = gridState.cellSize;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);

    // Allow convolution at any cell, including edges
    if (
      row >= 0 && row < gridState.rows &&
      col >= 0 && col < gridState.cols
    ) {
      setHoverPosition({ row, col });
      applyConvolution(row, col);
    } else {
      setHoverPosition(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
    setIsHovering(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !hoverPosition) return;
    
    // Toggle selection if clicking the same cell
    if (selectedPosition && 
        selectedPosition.row === hoverPosition.row && 
        selectedPosition.col === hoverPosition.col) {
      setSelectedPosition(null);
      setShowCalculator(false);
    } else {
      setSelectedPosition(hoverPosition);
      setShowCalculator(true);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 bg-white">
        {/* Interactive instruction overlay */}
        {!selectedPosition && !showCalculator && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10 pointer-events-none rounded-lg">
            <div className="bg-white p-3 rounded-lg shadow-lg text-center max-w-xs">
              <div className="flex justify-center mb-2">
                <TbClick className="text-blue-500 w-6 h-6 animate-pulse" />
              </div>
              <p className="text-sm font-medium">Click on a cell to see detailed calculations</p>
            </div>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          width={gridState.cols * gridState.cellSize}
          height={gridState.rows * gridState.cellSize}
          className="w-full h-auto cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />
      </div>

      {/* Action buttons */}
      <div className="flex justify-center mt-2 gap-2">
        <button 
          onClick={() => setShowCalculator(!showCalculator)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${showCalculator ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          <TbEye className="w-4 h-4" />
          {showCalculator ? 'Hide Calculator' : 'Show Calculator'}
        </button>
      </div>

      {/* Convolution Equation with animation */}
      <AnimatePresence>
        {showCalculator && (selectedPosition || hoverPosition) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <ConvolutionEquation position={selectedPosition || hoverPosition} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}