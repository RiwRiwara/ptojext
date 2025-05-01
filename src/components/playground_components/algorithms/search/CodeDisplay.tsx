"use client";
import React from 'react';
import { CodeDisplayProps } from './types';
import { motion } from 'framer-motion';

const CodeDisplay: React.FC<CodeDisplayProps> = ({
  selectedAlgo,
  currentHighlightedLine
}) => {
  const getAlgorithmCode = () => {
    switch (selectedAlgo) {
      case 'linear-search':
        return {
          code: `function linearSearch(array, target) {
  // Iterate through each element in the array
  for (let i = 0; i < array.length; i++) {
    // Compare current element with target
    if (array[i] === target) {
      // Element found, return its index
      return i;
    }
  }
  // Element not found in the array
  return -1;
}`,
          lineMap: {
            'init': 1,
            'compare': 4,
            'found': 6,
            'not-found': 10
          }
        };
      case 'binary-search':
        return {
          code: `function binarySearch(array, target) {
  // Initialize left and right pointers
  let left = 0;
  let right = array.length - 1;
  
  // Continue searching while left <= right
  while (left <= right) {
    // Calculate middle index
    const mid = Math.floor((left + right) / 2);
    
    // Check if middle element is the target
    if (array[mid] === target) {
      // Element found, return its index
      return mid;
    } else if (array[mid] < target) {
      // Target is in the right half
      left = mid + 1;
    } else {
      // Target is in the left half
      right = mid - 1;
    }
  }
  
  // Element not found in the array
  return -1;
}`,
          lineMap: {
            'init': 3,
            'mid': 9,
            'compare': 12,
            'found': 14,
            'update': [17, 20],
            'not-found': 25
          }
        };
      case 'jump-search':
        return {
          code: `function jumpSearch(array, target) {
  const n = array.length;
  
  // Finding block size to be jumped
  const step = Math.floor(Math.sqrt(n));
  
  // Finding the block where element is present
  let prev = 0;
  let current = step;
  
  // Finding the block where element may be present
  while (current < n && array[current - 1] < target) {
    prev = current;
    current += step;
  }
  
  // Linear search in the identified block
  for (let i = prev; i < Math.min(current, n); i++) {
    if (array[i] === target) {
      // Element found, return its index
      return i;
    }
  }
  
  // Element not found in the array
  return -1;
}`,
          lineMap: {
            'init': 4,
            'jump-init': 8,
            'compare-block': 11,
            'jump': 13,
            'linear-start': 17,
            'compare': 18,
            'found': 20,
            'not-found': 25
          }
        };
      case 'interpolation-search':
        return {
          code: `function interpolationSearch(array, target) {
  // Initialize low and high pointers
  let low = 0;
  let high = array.length - 1;
  
  // Continue searching while in range and target is in range
  while (low <= high && 
         target >= array[low] && 
         target <= array[high]) {
    
    // Calculate position using interpolation formula
    let pos = low + Math.floor(
      ((target - array[low]) * (high - low)) / 
      (array[high] - array[low])
    );
    
    // Check if element at pos is the target
    if (array[pos] === target) {
      // Element found, return its index
      return pos;
    }
    
    if (array[pos] < target) {
      // Target is in the right subarray
      low = pos + 1;
    } else {
      // Target is in the left subarray
      high = pos - 1;
    }
  }
  
  // Element not found in the array
  return -1;
}`,
          lineMap: {
            'init': 3,
            'pos': 13,
            'compare': 17,
            'found': 19,
            'update': [23, 26],
            'not-found': 31
          }
        };
      default:
        return {
          code: '// Select an algorithm to view its code',
          lineMap: {}
        };
    }
  };

  const { code, lineMap } = getAlgorithmCode();
  const codeLines = code.split('\n');

  // Determine which line to highlight based on the current step type
  const getHighlightedLineNumber = () => {
    if (!currentHighlightedLine) return null;
    
    // Type assertion to ensure TypeScript knows we're accessing a valid key
    const lineMapValue = lineMap[currentHighlightedLine as keyof typeof lineMap];
    if (Array.isArray(lineMapValue)) {
      // If multiple lines can be highlighted for this step type,
      // we'll highlight the first one for simplicity
      return lineMapValue[0] - 1; // Adjust for 0-indexing
    } else if (lineMapValue) {
      return lineMapValue - 1; // Adjust for 0-indexing
    }
    
    return null;
  };

  const highlightedLine = getHighlightedLineNumber();

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="p-3 bg-gray-800 text-gray-300 text-sm font-medium border-b border-gray-700">
        {selectedAlgo === 'linear-search' && 'Linear Search Algorithm'}
        {selectedAlgo === 'binary-search' && 'Binary Search Algorithm'}
        {selectedAlgo === 'jump-search' && 'Jump Search Algorithm'}
        {selectedAlgo === 'interpolation-search' && 'Interpolation Search Algorithm'}
        {!selectedAlgo && 'Algorithm Code'}
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code>
          {codeLines.map((line, index) => (
            <div
              key={index}
              className={`font-mono ${
                highlightedLine === index
                  ? 'bg-[#83AFC9]/20 text-white'
                  : 'text-gray-300'
              } px-2 py-0.5 rounded ${
                highlightedLine === index ? 'font-medium' : ''
              }`}
            >
              {line}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};

export default CodeDisplay;
