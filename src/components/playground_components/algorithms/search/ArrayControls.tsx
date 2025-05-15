"use client";
import React from 'react';
import { ArrayControlsProps } from './types';
import { motion } from 'framer-motion';
import { FaRandom, FaSort } from 'react-icons/fa';

const ArrayControls: React.FC<ArrayControlsProps> = ({
  arraySize,
  onArraySizeChange,
  onGenerateArray,
  target,
  onTargetChange,
  isSorted,
  onToggleSorted,
  selectedAlgo,
  requiresSorted,
  onSearch
}) => {
  return (
    <div className="">
      <h3 className="text-lg font-medium text-gray-700 mb-3">Array Controls</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Array Size</label>
          <div className="flex items-center">
            <input
              type="range"
              min="10"
              max="100"
              value={arraySize}
              onChange={(e) => onArraySizeChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#83AFC9]"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 min-w-[30px]">{arraySize}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Target Value</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={target}
              onChange={(e) => onTargetChange(parseInt(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#83AFC9] focus:border-transparent"
              placeholder="Enter target value"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSearch}
              className="p-2 rounded-full bg-[#83AFC9] text-white hover:bg-blue-600"
              aria-label="Find Target"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGenerateArray}
          className="flex items-center gap-2 px-4 py-2 bg-[#83AFC9] text-white rounded-md shadow-sm hover:bg-[#6c9ab4] transition-colors duration-200"
        >
          <FaRandom className="text-sm" />
          Generate New Array
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSorted}
          disabled={requiresSorted && selectedAlgo !== ''}
          className={`flex items-center gap-2 px-4 py-2 rounded-md shadow-sm transition-colors duration-200 ${isSorted
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } ${requiresSorted && selectedAlgo !== '' ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FaSort className="text-sm" />
          {isSorted ? 'Sorted' : 'Unsorted'}
        </motion.button>
      </div>

      {requiresSorted && !isSorted && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700">
          Note: The selected algorithm requires a sorted array.
        </div>
      )}
    </div>
  );
};

export default ArrayControls;
