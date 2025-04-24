import React, { useState, useEffect } from 'react';
import useStore from '../state/store';
import { FiInfo } from 'react-icons/fi';

interface ConvolutionEquationProps {
  className?: string;
}

export default function ConvolutionEquation({ className = '' }: ConvolutionEquationProps) {
  const { hoverPosition, gridState, convolutionData, convolutionOutput } = useStore();
  const [showInfo, setShowInfo] = useState(false);
  const [animateCalc, setAnimateCalc] = useState(false);
  
  // Reset animation when position changes
  useEffect(() => {
    if (hoverPosition) {
      setAnimateCalc(true);
      const timer = setTimeout(() => setAnimateCalc(false), 500);
      return () => clearTimeout(timer);
    }
  }, [hoverPosition, convolutionData]);

  // If no hover position, show a static example
  if (!hoverPosition) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">Convolution Equation</h3>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="text-blue-500 hover:text-blue-700"
            aria-label="Show information about convolution"
          >
            <FiInfo />
          </button>
        </div>
        
        {showInfo ? (
          <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded mb-3">
            <p className="mb-2">Convolution is a mathematical operation that combines two functions to produce a third function.</p>
            <p className="mb-2">In image processing, convolution applies a kernel (filter) to an input image to create an output image.</p>
            <p>The formula is: <span className="bg-white px-1 py-0.5 rounded">O[i,j] = Σ K[m,n] * I[i+m,j+n]</span> where K is the kernel and I is the input.</p>
          </div>
        ) : (
          <div className="text-gray-500 italic mb-4">Hover over the input grid to see the calculation</div>
        )}
        
        <div className="mt-3 text-center bg-gray-50 p-2 rounded">
          <p className="text-sm text-gray-600">Example: Edge Detection</p>
          <div className="grid grid-cols-3 gap-1 my-2 w-max mx-auto">
            {[
              [-1, -1, -1],
              [-1, 8, -1],
              [-1, -1, -1]
            ].map((row, rowIdx) => (
              <React.Fragment key={rowIdx}>
                {row.map((val, colIdx) => (
                  <div key={`${rowIdx}-${colIdx}`} className="w-8 h-8 flex items-center justify-center bg-gray-50 border border-gray-100">
                    {val}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Extract the grid values at the current convolution window
  const { row, col } = hoverPosition;
  const kernelSize = convolutionData.length;
  const inputRows = gridState.rows;
  const inputCols = gridState.cols;

  // Calculate the valid window size (clip kernel if it overflows at the edge)
  const maxWindowRows = Math.min(kernelSize, inputRows - row);
  const maxWindowCols = Math.min(kernelSize, inputCols - col);

  // Get the values from the input grid at the current window
  const inputValues: number[][] = [];
  const kernelValues: number[][] = [];
  for (let i = 0; i < maxWindowRows; i++) {
    inputValues[i] = [];
    kernelValues[i] = [];
    for (let j = 0; j < maxWindowCols; j++) {
      // Access the grid data safely
      if (
        row + i < inputRows &&
        col + j < inputCols &&
        Array.isArray(gridState.data) &&
        gridState.data[row + i] &&
        gridState.data[row + i][col + j] !== undefined
      ) {
        inputValues[i][j] = typeof gridState.data[row + i][col + j] === 'number'
          ? gridState.data[row + i][col + j] as number
          : 0;
      } else {
        inputValues[i][j] = 0;
      }
      // Always use the corresponding kernel value
      kernelValues[i][j] = convolutionData[i][j];
    }
  }

  // Calculate the equation terms (multiplication of each corresponding cell)
  const terms: { inputValue: number; kernelValue: number; product: number }[] = [];
  let sum = 0;

  for (let i = 0; i < maxWindowRows; i++) {
    for (let j = 0; j < maxWindowCols; j++) {
      const inputValue = inputValues[i][j];
      const kernelValue = kernelValues[i][j];
      const product = inputValue * kernelValue;
      terms.push({ inputValue, kernelValue, product });
      sum += product;
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Convolution Equation</h3>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="text-blue-500 hover:text-blue-700"
          aria-label="Show information about convolution"
        >
          <FiInfo />
        </button>
      </div>

      {showInfo && (
        <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded mb-4">
          <p className="mb-2">At position ({row}, {col}), we apply the kernel to the input values.</p>
          <p>The formula is: <span className="bg-white px-1 py-0.5 rounded font-mono">O = Σ K[m,n] × I[i+m,j+n]</span> where K is the kernel and I is the input.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium text-gray-700">Input Values at ({row}, {col}):</div>
            <div className="text-xs text-gray-500">{maxWindowRows}×{maxWindowCols} Window</div>
          </div>
          <div className={`grid grid-cols-${maxWindowCols} gap-1 border border-blue-100 p-2 rounded bg-blue-50`}>
            {inputValues.map((row, rowIdx) => (
              row.map((val, colIdx) => (
                <div 
                  key={`input-${rowIdx}-${colIdx}`} 
                  className="bg-white p-1 text-center text-sm rounded shadow-sm border border-blue-100"
                >
                  {val}
                </div>
              ))
            ))}
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium text-gray-700">Kernel Values:</div>
            <div className="text-xs text-gray-500">{maxWindowRows}×{maxWindowCols} Filter</div>
          </div>
          <div className={`grid grid-cols-${maxWindowCols} gap-1 border border-gray-100 p-2 rounded bg-gray-50`}>
            {kernelValues.map((row, rowIdx) => (
              row.map((val, colIdx) => (
                <div 
                  key={`kernel-${rowIdx}-${colIdx}`} 
                  className="bg-white p-1 text-center text-sm rounded shadow-sm border border-gray-100"
                >
                  {val}
                </div>
              ))
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4 mt-2">
        <div className="text-sm font-medium text-gray-700 mb-2">Multiplication (Element-wise):</div>
        <div className={`grid grid-cols-${maxWindowCols} gap-1 border border-purple-100 p-2 rounded bg-purple-50`}>
          {terms.map((term, idx) => {
            return (
              <div 
                key={`mult-${idx}`} 
                className={`p-1 text-center text-sm rounded shadow-sm border border-purple-100 ${animateCalc ? 'bg-yellow-100 animate-pulse' : 'bg-white'}`}
              >
                {term.inputValue} × {term.kernelValue} = {term.product}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mb-3">
        <div className="text-sm font-medium text-gray-700 mb-2">Final Equation:</div>
        <div className="text-sm bg-gray-50 p-3 rounded overflow-x-auto border border-gray-200 font-mono">
          {terms.map((term, idx) => (
            <React.Fragment key={idx}>
              <span className={animateCalc ? 'bg-yellow-100 px-1 rounded' : ''}>
                {term.product.toFixed(2)}
              </span>
              {idx < terms.length - 1 ? ' + ' : ' = '}
            </React.Fragment>
          ))}
          <span className="font-bold text-blue-600">{sum.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between bg-blue-600 text-white p-3 rounded-lg">
        <div className="text-sm font-medium">Output at position ({row}, {col}):</div>
        <div className="text-xl font-bold">{typeof convolutionOutput === 'number' ? convolutionOutput.toFixed(2) : convolutionOutput}</div>
      </div>
    </div>
  );
}
