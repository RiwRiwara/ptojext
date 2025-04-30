"use client";
import React, { useEffect, useRef } from 'react';
import { SearchVisualizerProps } from './types';
import { FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SearchVisualizer: React.FC<SearchVisualizerProps> = ({
  array,
  target,
  steps,
  currentStep,
  colorScheme,
  speed,
  isPlaying,
  isSorted,
  onSearch
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentStep_ = steps[currentStep] || { type: '', indices: [], message: '' };
  
  // Calculate element width based on array length
  const getElementWidth = () => {
    if (array.length <= 20) return 40;
    if (array.length <= 50) return 30;
    if (array.length <= 100) return 20;
    return 15;
  };

  const getElementColor = (index: number) => {
    // Found element
    if (currentStep_.type === 'found' && currentStep_.indices?.includes(index)) {
      return colorScheme.foundElement;
    }
    
    // Currently comparing element
    if (currentStep_.indices?.includes(index)) {
      return colorScheme.comparingElement;
    }
    
    // Binary search bounds
    if (currentStep_.leftBound !== undefined && currentStep_.rightBound !== undefined) {
      if (index >= currentStep_.leftBound && index <= currentStep_.rightBound) {
        return colorScheme.activeElement;
      }
    }
    
    // Interpolation search bounds
    if (currentStep_.lowBound !== undefined && currentStep_.highBound !== undefined) {
      if (index >= currentStep_.lowBound && index <= currentStep_.highBound) {
        return colorScheme.activeElement;
      }
    }
    
    // Default element color
    return colorScheme.defaultElement;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Searching for: <span className="font-bold text-[#83AFC9]">{target}</span></h3>
        <div className="bg-gray-100 p-3 rounded-lg">
          <p className="text-sm text-gray-600">{currentStep_.message || "Ready to start search"}</p>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="flex flex-wrap justify-center items-end gap-1 p-4 overflow-x-auto"
        style={{ minHeight: '200px' }}
      >
        {array.map((value, index) => (
          <div key={index} className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                backgroundColor: getElementColor(index),
                scale: currentStep_.indices?.includes(index) ? 1.1 : 1
              }}
              whileHover={{ scale: 1.15, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
              transition={{ duration: 0.3, delay: index * 0.01 }}
              className="flex items-center justify-center rounded-md shadow-sm cursor-pointer relative group"
              style={{ 
                width: `${getElementWidth()}px`,
                height: `${getElementWidth()}px`,
                fontSize: array.length > 50 ? '10px' : '12px',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0px 1px 2px rgba(0,0,0,0.3)'
              }}
              onClick={() => onSearch && onSearch(value)}
            >
              {value}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-md transition-opacity duration-200">
                <FaSearch className="text-white" size={array.length > 50 ? 8 : 12} />
              </div>
            </motion.div>
            <div className="text-xs text-gray-500 mt-1">{index}</div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: colorScheme.defaultElement }}></div>
          <span className="text-xs text-gray-600">Element</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: colorScheme.activeElement }}></div>
          <span className="text-xs text-gray-600">Search Range</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: colorScheme.comparingElement }}></div>
          <span className="text-xs text-gray-600">Comparing</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: colorScheme.foundElement }}></div>
          <span className="text-xs text-gray-600">Found</span>
        </div>
      </div>
    </div>
  );
};

export default SearchVisualizer;
