"use client";

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Cell, Grid, AlgorithmType } from '@/components/simulations/pathfinding/algorithms';

export interface AlgorithmResult {
  path: Cell[];
  visitedInOrder: Cell[];
  executionTime: number;
}

// Import necessary algorithm functions
import { 
  dijkstra, 
  astar, 
  breadthFirstSearch, 
  depthFirstSearch, 
  greedyBestFirstSearch 
} from '@/components/simulations/pathfinding/algorithms';

interface SingleGridProps {
  grid: Grid;
  start: Cell;
  end: Cell;
  algorithm: AlgorithmType;
  rows: number;
  cols: number;
  allowDiagonal: boolean;
  showVisitedCells: boolean;
  animationSpeed: number;
  isComparisonRunning: boolean;
  setIsComparisonRunning: (isRunning: boolean) => void;
  onCellClick: (row: number, col: number) => void;
  onResults: (results: AlgorithmResult | null) => void;
}

export const SingleGrid = ({
  grid,
  start,
  end,
  algorithm,
  rows,
  cols,
  allowDiagonal,
  showVisitedCells,
  animationSpeed,
  isComparisonRunning,
  setIsComparisonRunning,
  onCellClick,
  onResults
}: SingleGridProps) => {
  const [path, setPath] = useState<Cell[]>([]);
  const [visitedCells, setVisitedCells] = useState<Cell[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Get cell class based on its state
  const getCellClass = useCallback((r: number, c: number, cell: number): string => {
    const isStart = start[0] === r && start[1] === c;
    const isEnd = end[0] === r && end[1] === c;
    const isVisited = showVisitedCells && visitedCells.some(([vr, vc]) => vr === r && vc === c);
    const isPath = path.some(([pr, pc]) => pr === r && pc === c);

    if (isStart) return 'bg-green-500 hover:bg-green-600 transform hover:scale-105';
    if (isEnd) return 'bg-red-500 hover:bg-red-600 transform hover:scale-105';
    if (isPath) return 'bg-blue-400 animate-pulse';
    if (isVisited) return 'bg-blue-200';
    if (cell === 1) return 'bg-gray-800 hover:bg-gray-700';

    return 'bg-white hover:bg-gray-100';
  }, [start, end, showVisitedCells, visitedCells, path]);

  // Run algorithm when comparison starts
  useEffect(() => {
    if (isComparisonRunning && !isAnimating) {
      // Small delay to ensure both grids don't fight for resources
      const delay = algorithm === 'astar' ? 0 : 50;
      setTimeout(() => {
        runAlgorithm();
      }, delay);
    }
  }, [isComparisonRunning]);
  
  // Reset when algorithm changes
  useEffect(() => {
    resetPath();
  }, [algorithm]);

  // Reset state when algorithm changes
  useEffect(() => {
    resetPath();
  }, [algorithm]);

  // Reset state when grid changes
  useEffect(() => {
    resetPath();
  }, [grid]);

  // Reset path
  const resetPath = () => {
    setPath([]);
    setVisitedCells([]);
    setAnimationComplete(false);
    setExecutionTime(0);
    onResults(null);
  };

  // Send results back to parent when animation is complete
  useEffect(() => {
    if (animationComplete && path.length > 0) {
      onResults({
        path,
        visitedInOrder: visitedCells,
        executionTime
      });
    }
  }, [animationComplete, path, visitedCells, executionTime, onResults]);

  // Update the parent component when animation completes
  useEffect(() => {
    if (animationComplete && path.length > 0) {
      // Instead of directly setting isComparisonRunning to false,
      // we'll let the parent component handle this through the results
      console.log(`Algorithm ${algorithm} completed with path length: ${path.length}`);
    }
  }, [animationComplete, path.length, algorithm]);

  // Run algorithm and animate
  const runAlgorithm = () => {
    if (isAnimating) return;
    
    setPath([]);
    setVisitedCells([]);
    setAnimationComplete(false);
    setIsAnimating(true);

    try {
      // Start timing
      const startTime = performance.now();
      
      // Run the selected algorithm
      let result: {
        path: Cell[];
        visitedInOrder: Cell[];
      };
      
      switch (algorithm) {
        case 'dijkstra':
          result = dijkstra(grid, start, end, allowDiagonal);
          break;
        case 'astar':
          result = astar(grid, start, end, allowDiagonal);
          break;
        case 'bfs':
          result = breadthFirstSearch(grid, start, end, allowDiagonal);
          break;
        case 'dfs':
          result = depthFirstSearch(grid, start, end, allowDiagonal);
          break;
        case 'greedy':
          result = greedyBestFirstSearch(grid, start, end, allowDiagonal);
          break;
        default:
          result = astar(grid, start, end, allowDiagonal);
      }
      
      // End timing
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      
      // Animate the algorithm execution
      animateAlgorithm(result.visitedInOrder, result.path);
    } catch (error) {
      console.error('Error running algorithm:', error);
      setIsAnimating(false);
      setIsComparisonRunning(false);
    }
  };

  // Animate the algorithm's progress
  const animateAlgorithm = (visitedInOrder: Cell[], path: Cell[]) => {
    if (!visitedInOrder.length) {
      setIsAnimating(false);
      setAnimationComplete(true);
      return;
    }

    // Animate visited cells
    const visitedAnimation = (i: number) => {
      if (i >= visitedInOrder.length) {
        // After visiting all cells, animate the path
        if (path.length) {
          const pathAnimation = (j: number) => {
            if (j >= path.length) {
              setIsAnimating(false);
              setAnimationComplete(true);
              return;
            }

            setTimeout(() => {
              setPath(prevPath => [...prevPath, path[j]]);
              pathAnimation(j + 1);
            }, 30); // Slower animation for the path
          };

          pathAnimation(0);
        } else {
          setIsAnimating(false);
          setAnimationComplete(true);
        }
        return;
      }

      const cellsToShow = visitedInOrder.slice(i, i + animationSpeed);
      setVisitedCells(prevCells => [...prevCells, ...cellsToShow]);

      setTimeout(() => {
        visitedAnimation(i + animationSpeed);
      }, 20);
    };

    visitedAnimation(0);
  };

  return (
    <div>
      {/* Visualization grid */}
      <div className="overflow-auto pb-4">
        <div
          className="grid gap-0 mx-auto border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded"
          style={{
            gridTemplateColumns: `repeat(${cols}, 24px)`,
            width: `${cols * 24}px`
          }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <motion.div
                key={`${algorithm}-${r}-${c}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.001 * (r + c) }}
                className={`w-6 h-6 border border-gray-200 dark:border-gray-800 transition-colors duration-200 ${getCellClass(r, c, cell)}`}
                onClick={() => onCellClick(r, c)}
              >
                {(start[0] === r && start[1] === c) && (
                  <span key={`start-${r}-${c}`} className="flex h-full items-center justify-center text-xs">S</span>
                )}
                {(end[0] === r && end[1] === c) && (
                  <span key={`end-${r}-${c}`} className="flex h-full items-center justify-center text-xs">E</span>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Results */}
      {path.length > 0 && (
        <div className="text-sm mt-4">
          <div className="mb-1 flex justify-between">
            <span className="font-medium">Path Length:</span> 
            <span>{path.length} cells</span>
          </div>
          <div className="mb-1 flex justify-between">
            <span className="font-medium">Cells Visited:</span> 
            <span>{visitedCells.length} cells</span>
          </div>
          <div className="mb-1 flex justify-between">
            <span className="font-medium">Execution Time:</span> 
            <span>{executionTime.toFixed(2)}ms</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Efficiency:</span> 
            <span>{((path.length / visitedCells.length) * 100).toFixed(1)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
