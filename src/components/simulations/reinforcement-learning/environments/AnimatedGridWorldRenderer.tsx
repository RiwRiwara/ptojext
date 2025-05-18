import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GridWorldCell, RLEnvironment } from '../types/reinforcement-learning-types';

interface AnimatedGridWorldRendererProps {
  environment: RLEnvironment | null;
  agentPosition: { x: number; y: number };
  goalPosition: { x: number; y: number };
  obstacles: { x: number; y: number }[];
  gridSize: number;
  isPlaying: boolean;
  showValues: boolean;
  qValues: Record<string, Record<number, number>>;
}

export const AnimatedGridWorldRenderer: React.FC<AnimatedGridWorldRendererProps> = ({
  environment,
  agentPosition,
  goalPosition,
  obstacles,
  gridSize,
  isPlaying,
  showValues,
  qValues
}) => {
  // Calculate cell size based on container
  const cellSize = `calc(100% / ${gridSize})`;
  
  // Generate grid
  const gridCells = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      // Determine cell type
      let cellType = 'empty';
      if (x === goalPosition.x && y === goalPosition.y) {
        cellType = 'goal';
      } else if (obstacles.some(obs => obs.x === x && obs.y === y)) {
        cellType = 'obstacle';
      }
      
      // Get q-values for this cell if available
      const stateKey = `${x},${y}`;
      const cellQValues = qValues[stateKey] || {};
      
      // Determine best action for this cell (for visualization)
      let bestAction = -1;
      let bestValue = -Infinity;
      if (showValues) {
        for (const [actionStr, value] of Object.entries(cellQValues)) {
          const actionId = parseInt(actionStr);
          if (value > bestValue) {
            bestValue = value;
            bestAction = actionId;
          }
        }
      }
      
      gridCells.push(
        <div 
          key={`${x}-${y}`} 
          style={{ 
            width: cellSize, 
            height: cellSize,
            position: 'absolute',
            top: `calc(${y} * ${cellSize})`,
            left: `calc(${x} * ${cellSize})`,
          }}
          className="border border-gray-200 dark:border-gray-700"
        >
          {/* Background color based on cell type */}
          <div 
            className={`
              w-full h-full 
              ${cellType === 'empty' ? 'bg-gray-50 dark:bg-gray-900' : ''} 
              ${cellType === 'obstacle' ? 'bg-gray-800 dark:bg-gray-700' : ''} 
              ${cellType === 'goal' ? 'bg-green-100 dark:bg-green-900/30' : ''}
            `}
          />
          
          {/* Show q-values as colored arrows */}
          {showValues && cellType !== 'obstacle' && (
            <div className="absolute inset-0 flex items-center justify-center">
              {bestAction === 0 && bestValue > 0 && ( // Up
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: bestValue > 0 ? Math.min(bestValue/10, 1) : 0, y: 0 }}
                  className="absolute top-1 left-1/2 transform -translate-x-1/2 text-blue-500 text-xl"
                >
                  ↑
                </motion.div>
              )}
              {bestAction === 1 && bestValue > 0 && ( // Right
                <motion.div 
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: bestValue > 0 ? Math.min(bestValue/10, 1) : 0, x: 0 }}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 text-blue-500 text-xl"
                >
                  →
                </motion.div>
              )}
              {bestAction === 2 && bestValue > 0 && ( // Down
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: bestValue > 0 ? Math.min(bestValue/10, 1) : 0, y: 0 }}
                  className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-blue-500 text-xl"
                >
                  ↓
                </motion.div>
              )}
              {bestAction === 3 && bestValue > 0 && ( // Left
                <motion.div 
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: bestValue > 0 ? Math.min(bestValue/10, 1) : 0, x: 0 }}
                  className="absolute left-1 top-1/2 transform -translate-y-1/2 text-blue-500 text-xl"
                >
                  ←
                </motion.div>
              )}
            </div>
          )}
        </div>
      );
    }
  }
  
  return (
    <div className="relative w-full h-full bg-white dark:bg-gray-800 rounded-md overflow-hidden">
      {/* Grid cells */}
      {gridCells}
      
      {/* Agent */}
      <AnimatePresence>
        <motion.div 
          key="agent"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: isPlaying ? [0.9, 1.1, 1] : 1,
            opacity: 1,
            top: `calc(${agentPosition.y} * ${cellSize})`,
            left: `calc(${agentPosition.x} * ${cellSize})`,
          }}
          transition={{ 
            duration: 0.3, 
            type: "spring", 
            bounce: 0.25,
            scale: { 
              repeat: isPlaying ? Infinity : 0, 
              repeatType: "reverse", 
              duration: 1 
            }
          }}
          style={{ 
            width: cellSize, 
            height: cellSize,
            position: 'absolute',
          }}
          className="pointer-events-none"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="h-3/5 w-3/5 rounded-full bg-red-500 shadow-lg"
              initial={{ boxShadow: "0 0 0 0 rgba(239, 68, 68, 0.7)" }}
              animate={{ 
                boxShadow: isPlaying 
                  ? ["0 0 0 0 rgba(239, 68, 68, 0)", "0 0 0 10px rgba(239, 68, 68, 0)"] 
                  : "0 0 0 0 rgba(239, 68, 68, 0)"
              }}
              transition={{ repeat: isPlaying ? Infinity : 0, duration: 1.5 }}
            />
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Goal marker */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.95, 1.05, 1],
          opacity: 1,
          top: `calc(${goalPosition.y} * ${cellSize})`,
          left: `calc(${goalPosition.x} * ${cellSize})`,
        }}
        transition={{ 
          duration: 0.5, 
          scale: { 
            repeat: Infinity, 
            repeatType: "reverse", 
            duration: 2 
          }
        }}
        style={{ 
          width: cellSize, 
          height: cellSize,
          position: 'absolute',
        }}
        className="pointer-events-none"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2/5 w-2/5 transform rotate-45 bg-green-500" />
        </div>
      </motion.div>
    </div>
  );
};
