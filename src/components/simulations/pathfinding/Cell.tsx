import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiFlag } from 'react-icons/fi';
import { CellValue, EMPTY, START, END, WALL, VISITED, SHORTEST_PATH, WEIGHTED } from './types';

interface CellProps {
  value: CellValue;
  rowIdx: number;
  colIdx: number;
  onClick: (rowIdx: number, colIdx: number, isDragging?: boolean) => void;
  onMouseEnter: (rowIdx: number, colIdx: number) => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
  size: number;
  highlight?: boolean;
  isComparing?: boolean;
  weight?: number;
}

const Cell: React.FC<CellProps> = ({
  value,
  rowIdx,
  colIdx,
  onClick,
  onMouseEnter,
  onMouseDown,
  onMouseUp,
  size,
  highlight = false,
  isComparing = false,
  weight = 0,
}) => {
  // Determine cell appearance based on its value
  let baseColor = 'bg-white border border-gray-100';
  let gradient = '';

  if (value === WALL) {
    baseColor = 'bg-gray-800 border-gray-900';
  } else if (value === START) {
    baseColor = 'bg-emerald-100 border-emerald-300 text-emerald-800';
  } else if (value === END) {
    baseColor = 'bg-rose-100 border-rose-300 text-rose-800';
  } else if (value === WEIGHTED) {
    baseColor = 'bg-violet-50 border-violet-200 text-violet-800';
  } else if (value === VISITED) {
    baseColor = 'bg-sky-100 border-sky-200';
    gradient = 'from-sky-100 to-sky-200';
  } else if (value === SHORTEST_PATH) {
    baseColor = 'bg-amber-100 border-amber-200';
    gradient = 'from-amber-100 to-amber-200';
  }

  return (
    <motion.div
      className={`relative cursor-pointer transition-all duration-150 ${baseColor} 
        ${highlight ? 'ring-2 ring-amber-400 z-10' : ''}
        ${isComparing ? 'ring-2 ring-primary-400 z-10' : ''}
        ${value !== EMPTY ? 'flex items-center justify-center' : ''}
        ${gradient ? `bg-gradient-to-br ${gradient}` : ''}
      `}
      style={{
        width: size,
        height: size,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={() => onClick(rowIdx, colIdx)}
      onMouseEnter={() => onMouseEnter(rowIdx, colIdx)}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {value === START && <FiTarget className="w-4 h-4" />}
      {value === END && <FiFlag className="w-4 h-4" />}
      {value === WEIGHTED && (
        <div className="text-[10px] font-semibold">
          {weight}×
        </div>
      )}
    </motion.div>
  );
};

export default Cell;
