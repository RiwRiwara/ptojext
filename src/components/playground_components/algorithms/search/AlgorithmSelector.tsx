"use client";
import React from 'react';
import { AlgorithmSelectorProps } from './types';
import { motion } from 'framer-motion';

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  algorithms,
  selectedAlgo,
  onSelectAlgorithm
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-medium text-gray-700 mb-3">Select Algorithm</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {algorithms.map((algo) => (
          <motion.button
            key={algo.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectAlgorithm(algo.key)}
            className={`p-3 rounded-lg transition-all duration-200 text-left ${
              selectedAlgo === algo.key
                ? 'bg-[#83AFC9] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="font-medium">{algo.label}</div>
            <div className="text-xs mt-1 opacity-90">
              {selectedAlgo === algo.key ? (
                algo.description
              ) : (
                <span className="line-clamp-1">{algo.description}</span>
              )}
            </div>
            {algo.requiresSorted && (
              <div className="text-xs mt-1 font-medium">
                {selectedAlgo === algo.key ? (
                  <span className="bg-white/20 text-white px-2 py-0.5 rounded-full">Requires sorted array</span>
                ) : (
                  <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Requires sorted array</span>
                )}
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default AlgorithmSelector;
