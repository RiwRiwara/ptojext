import React, { useRef, useEffect } from 'react';
import Matter from 'matter-js';
import { AnimatePresence } from 'framer-motion';
import Cell from './Cell';
import { Grid, CellValue } from './types';

interface GridComponentProps {
  grid: Grid;
  cellSize: number;
  handleCellClick: (rowIdx: number, colIdx: number, isDragging?: boolean) => void;
  setIsDragging: (value: boolean) => void;
  isDragging: boolean;
  highlightedCell: [number, number] | null;
  comparingCells: [number, number][];
  weights: Record<string, number>;
  world: Matter.World | null;
  agentPath: [number, number][];
  agentBodyRef: React.MutableRefObject<Matter.Body | null>;
  agentAnimating: boolean;
}

const GridComponent: React.FC<GridComponentProps> = ({
  grid,
  cellSize,
  handleCellClick,
  setIsDragging,
  isDragging,
  highlightedCell,
  comparingCells,
  weights,
  world,
  agentPath,
  agentBodyRef,
  agentAnimating
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Set up Matter.js engine
  useEffect(() => {
    if (!world || !canvasRef.current) return;

    // Add agent if we have a path
    if (agentPath && agentPath.length > 0 && !agentBodyRef.current) {
      const [startR, startC] = agentPath[0];
      const agent = Matter.Bodies.circle(
        startC * cellSize + cellSize / 2,
        startR * cellSize + cellSize / 2,
        cellSize * 0.3,
        {
          isStatic: false,
          frictionAir: 0.2,
          render: {
            fillStyle: '#2563eb',
            strokeStyle: '#1e40af',
            lineWidth: 2,
          },
        }
      );
      agentBodyRef.current = agent;
      Matter.World.add(world, agent);
    }
    
    // Add a second object (square) at a random position
    if (!agentAnimating) {
      // Only add square when not animating agent
      const square = Matter.Bodies.rectangle(
        Math.random() * 400,
        Math.random() * 400,
        cellSize * 0.8,
        cellSize * 0.8,
        {
          isStatic: false,
          frictionAir: 0.15,
          restitution: 0.6,
          render: {
            fillStyle: '#fb923c', // Orange
            strokeStyle: '#ea580c',
            lineWidth: 2,
          },
          label: 'demo-square'
        }
      );
      Matter.World.add(world, square);
    }
  }, [grid, agentPath, agentAnimating, world, cellSize, agentBodyRef]);

  return (
    <div className="relative w-full h-full">
      {/* Matter.js canvas overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Grid of cells */}
      <div
        className="relative grid bg-gray-100 rounded-lg overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${grid[0].length}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${grid.length}, ${cellSize}px)`,
          width: 'fit-content',
          margin: '0 auto',
        }}
        onMouseLeave={() => setIsDragging(false)}
      >
        <AnimatePresence>
          {grid.map((row, rowIdx) =>
            row.map((cell: CellValue, colIdx) => {
              const isHighlighted = highlightedCell?.[0] === rowIdx && highlightedCell?.[1] === colIdx;
              const isComparing = comparingCells.some(([r, c]) => r === rowIdx && c === colIdx);
              const weight = weights[`${rowIdx},${colIdx}`] || 0;

              return (
                <Cell
                  key={`${rowIdx}-${colIdx}`}
                  value={cell}
                  rowIdx={rowIdx}
                  colIdx={colIdx}
                  onClick={handleCellClick}
                  onMouseEnter={() => {
                    if (isDragging) {
                      handleCellClick(rowIdx, colIdx, true);
                    }
                  }}
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  size={cellSize}
                  highlight={isHighlighted}
                  isComparing={isComparing}
                  weight={weight}
                />
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GridComponent;
