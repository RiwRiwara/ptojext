import React, { useState, useEffect } from 'react';
import useStore from '../state/store';
import { FiInfo, FiCopy } from 'react-icons/fi';
import { TbMathFunction, TbGridDots, TbFilter } from 'react-icons/tb';

interface ConvolutionEquationProps {
  className?: string;
  position?: { row: number; col: number } | null;
}

export default function ConvolutionEquation({ className = '', position }: ConvolutionEquationProps) {
  const { gridState, convolutionData, convolutionOutput } = useStore();
  const [showInfo, setShowInfo] = useState(false);
  const [animateCalc, setAnimateCalc] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'detailed'>('basic');
  const [copied, setCopied] = useState(false);
  
  // Reset animation when position changes
  useEffect(() => {
    if (position) {
      setAnimateCalc(true);
      const timer = setTimeout(() => setAnimateCalc(false), 500);
      return () => clearTimeout(timer);
    }
  }, [position, convolutionData]);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // If no position, show a static example
  if (!position) {
    return (
      <div className={`bg-white rounded-xl shadow-md p-5 border border-gray-200 ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <TbMathFunction className="text-blue-500 w-5 h-5" />
            <h3 className="text-lg font-semibold text-gray-800">Convolution Calculator</h3>
          </div>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
            aria-label="Show information about convolution"
          >
            <FiInfo size={20} />
          </button>
        </div>
        
        {showInfo ? (
          <div className="text-sm text-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-4 border-l-4 border-blue-400">
            <p className="mb-2">Convolution is a mathematical operation that combines two functions to produce a third function.</p>
            <p className="mb-2">In image processing, convolution applies a kernel (filter) to an input image to create an output image.</p>
            <p>The formula is: <span className="bg-white px-2 py-1 rounded font-mono text-blue-600">O[i,j] = Σ K[m,n] * I[i+m,j+n]</span> where K is the kernel and I is the input.</p>
          </div>
        ) : (
          <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 mb-4">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <TbGridDots className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Click on a cell in the input grid to see detailed calculations</p>
            </div>
          </div>
        )}
        
        <div className="mt-4 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <TbFilter className="text-gray-600" />
            <p className="text-sm font-medium text-gray-700">Example: Edge Detection Kernel</p>
          </div>
          <div className="grid grid-cols-3 gap-1.5 w-max mx-auto">
            {[
              [-1, -1, -1],
              [-1, 8, -1],
              [-1, -1, -1]
            ].map((row, rowIdx) => (
              <React.Fragment key={rowIdx}>
                {row.map((val, colIdx) => (
                  <div 
                    key={`${rowIdx}-${colIdx}`} 
                    className={`w-10 h-10 flex items-center justify-center rounded-md shadow-sm ${val === 8 ? 'bg-blue-100 font-semibold text-blue-700' : 'bg-white text-gray-700'} border border-gray-200`}
                  >
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
  const { row, col } = position || { row: 0, col: 0 };
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

  // Calculate the terms and sum for the convolution equation
  const terms: { inputValue: number; kernelValue: number; product: number }[] = [];
  let sum = 0;

  // Calculate each term and the sum
  for (let i = 0; i < maxWindowRows; i++) {
    for (let j = 0; j < maxWindowCols; j++) {
      const inputValue = inputValues[i][j];
      const kernelValue = kernelValues[i][j];
      const product = inputValue * kernelValue;
      terms.push({ inputValue, kernelValue, product });
      sum += product;
    }
  }
  
  // Format equation for copying
  const equationText = terms.map(term => `${term.inputValue} × ${term.kernelValue} = ${term.product}`).join(' + ') + ` = ${sum.toFixed(2)}`;

  return (
    <div className={`bg-white rounded-lg shadow-sm p-3 border border-gray-200 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1">
          <TbMathFunction className="text-blue-500 w-4 h-4" />
          <h3 className="text-sm font-semibold text-gray-800">Convolution Calculator</h3>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => copyToClipboard(equationText)}
            className="text-gray-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors flex items-center gap-0.5 text-xs"
            aria-label="Copy equation"
          >
            <FiCopy size={12} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
            aria-label="Show information about convolution"
          >
            <FiInfo size={14} />
          </button>
        </div>
      </div>

      {showInfo && (
        <div className="text-xs text-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-lg mb-2 border-l-3 border-blue-400">
          <p className="mb-1">At position ({row}, {col}), we apply the kernel to the input values.</p>
          <p>Formula: <span className="bg-white px-1 py-0.5 rounded font-mono text-blue-600 text-xs">O = Σ K[m,n] × I[i+m,j+n]</span></p>
        </div>
      )}
      
      {/* Compact view with tabs */}
      <div className="flex border-b border-gray-200 mb-2">
        <button
          onClick={() => setActiveTab('basic')}
          className={`px-3 py-1 text-xs font-medium ${activeTab === 'basic' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Basic View
        </button>
        <button
          onClick={() => setActiveTab('detailed')}
          className={`px-3 py-1 text-xs font-medium ${activeTab === 'detailed' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Detailed View
        </button>
      </div>
      
      {activeTab === 'basic' ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-blue-50 p-2 rounded-lg border border-blue-100 text-xs">
            <div className="text-center px-2">
              <div className="font-medium text-gray-700">Position</div>
              <div className="font-semibold text-blue-700">({row}, {col})</div>
            </div>
            <div className="text-center px-2">
              <div className="font-medium text-gray-700">Window</div>
              <div className="font-semibold text-blue-700">{maxWindowRows}×{maxWindowCols}</div>
            </div>
            <div className="text-center px-2">
              <div className="font-medium text-gray-700">Result</div>
              <div className="font-semibold text-blue-700">{typeof convolutionOutput === 'number' ? convolutionOutput.toFixed(2) : convolutionOutput}</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
            <div className="text-xs font-medium text-gray-700 mb-1">Final Equation:</div>
            <div className="text-xs bg-white p-2 rounded-lg overflow-x-auto border border-gray-100 font-mono">
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
        </div>
      ) : (
        <div>
          {/* Compact grid layout */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <div className="flex justify-between items-center">
                <div className="text-xs font-medium text-gray-700">Input ({row}, {col})</div>
                <div className="text-xs text-gray-500">{maxWindowRows}×{maxWindowCols}</div>
              </div>
              <div className="grid grid-cols-3 gap-1 border border-blue-100 p-1 rounded-lg bg-blue-50">
                {inputValues.map((row, rowIdx) => (
                  row.map((val, colIdx) => (
                    <div 
                      key={`input-${rowIdx}-${colIdx}`} 
                      className="bg-white p-1 text-center rounded-md text-xs border border-blue-100"
                    >
                      {val}
                    </div>
                  ))
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <div className="text-xs font-medium text-gray-700">Kernel</div>
                <div className="text-xs text-gray-500">{maxWindowRows}×{maxWindowCols}</div>
              </div>
              <div className="grid grid-cols-3 gap-1 border border-purple-100 p-1 rounded-lg bg-purple-50">
                {kernelValues.map((row, rowIdx) => (
                  row.map((val, colIdx) => (
                    <div 
                      key={`kernel-${rowIdx}-${colIdx}`} 
                      className="bg-white p-1 text-center rounded-md text-xs border border-purple-100"
                    >
                      {val}
                    </div>
                  ))
                ))}
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="text-xs font-medium text-gray-700 mb-1">Multiplication:</div>
            <div className="grid grid-cols-3 gap-1 border border-gray-200 p-1 rounded-lg bg-gray-50">
              {terms.map((term, idx) => {
                return (
                  <div 
                    key={`mult-${idx}`} 
                    className={`p-1 text-center rounded-md text-xs border ${animateCalc ? 'bg-yellow-100 border-yellow-300' : 'bg-white border-gray-100'}`}
                  >
                    <span className="font-mono">{term.inputValue}×{term.kernelValue}={term.product}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mb-2">
            <div className="text-xs font-medium text-gray-700 mb-1">Final Equation:</div>
            <div className="text-xs bg-white p-1 rounded-lg overflow-x-auto border border-gray-200 font-mono">
              {terms.map((term, idx) => (
                <React.Fragment key={idx}>
                  <span className={animateCalc ? 'bg-yellow-100 px-1 rounded' : ''}>
                    {term.product.toFixed(2)}
                  </span>
                  {idx < terms.length - 1 ? '+' : '='}
                </React.Fragment>
              ))}
              <span className="font-bold text-blue-600">{sum.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-3 flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-2 rounded-lg shadow-sm">
        <div className="text-xs font-medium">Output at ({row}, {col}):</div>
        <div className="text-lg font-bold">{typeof convolutionOutput === 'number' ? convolutionOutput.toFixed(2) : convolutionOutput}</div>
      </div>
    </div>
  );
}
