import React from 'react';
import { HiPlay, HiRefresh, HiPuzzle } from "react-icons/hi";
import { AlgorithmKey, AlgorithmInfo, CellMode, AlgorithmResult } from './types';

interface ControlPanelProps {
  algorithm: AlgorithmKey;
  setAlgorithm: (algorithm: AlgorithmKey) => void;
  mode: CellMode;
  setMode: (mode: CellMode) => void;
  weightValue: number;
  setWeightValue: (value: number) => void;
  algorithms: AlgorithmInfo[];
  running: boolean;
  gridSize: number;
  setGridSize: (size: number) => void;
  gridSizes: number[];
  findPath: () => void;
  resetGrid: () => void;
  randomWalls: () => void;
  compareModeActive: boolean;
  setCompareModeActive: (active: boolean) => void;
  runComparisonMode: () => void;
  algorithmResults: Record<string, AlgorithmResult>;
  selectedAlgorithms: Record<AlgorithmKey, boolean>;
  setSelectedAlgorithms: (algorithms: Record<AlgorithmKey, boolean>) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  algorithm,
  setAlgorithm,
  mode,
  setMode,
  weightValue,
  setWeightValue,
  algorithms,
  running,
  gridSize,
  setGridSize,
  gridSizes,
  findPath,
  resetGrid,
  randomWalls,
  compareModeActive,
  setCompareModeActive,
  runComparisonMode,
  algorithmResults,
  selectedAlgorithms,
  setSelectedAlgorithms
}) => {
  return (
    <div className="w-full mb-6">
      {/* Algorithm selector */}
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
            {algorithms.map(a => (
              <button
                key={a.key}
                onClick={() => {
                  if (compareModeActive) {
                    // Toggle algorithm selection for comparison
                    setSelectedAlgorithms({
                      ...selectedAlgorithms,
                      [a.key]: !selectedAlgorithms[a.key]
                    });
                  } else {
                    // Normal mode - select algorithm
                    setAlgorithm(a.key as 'bfs' | 'dfs' | 'dijkstra' | 'astar');
                  }
                }}
                disabled={running}
                className={`px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all
                  ${!compareModeActive && algorithm === a.key ? `bg-white shadow-sm text-${a.color}-600` : 'text-slate-600 hover:bg-white/60'}
                  ${compareModeActive && selectedAlgorithms[a.key] ? `bg-${a.color}-100 text-${a.color}-700 ring-2 ring-${a.color}-400` : ''}
                  ${compareModeActive && algorithmResults[a.key] ? `ring-2 ring-${a.color}-400` : ''}`}
              >
                {a.icon}
                <span className="font-medium">{a.shortLabel}</span>
                {compareModeActive && (
                  <span className="ml-1 w-4 h-4 flex items-center justify-center rounded-full bg-white border border-gray-300">
                    {selectedAlgorithms[a.key] && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="relative group">
            <button
              className={`p-2 rounded-lg flex items-center gap-1.5 text-sm font-semibold transition-all 
                ${compareModeActive ? 'bg-primary-100 text-primary-900' : 'bg-white hover:bg-slate-100'}`}
              onClick={() => {
                if (compareModeActive) {
                  setCompareModeActive(false);
                } else {
                  setCompareModeActive(true);
                }
              }}
              disabled={running}
              aria-label="Toggle comparison mode"
            >
              {compareModeActive ? 'Comparison Mode' : 'Compare'}
            </button>
            <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-lg p-2 text-xs hidden group-hover:block w-60 z-10">
              {compareModeActive ? 
                "Disable comparison mode. Click on algorithms to select which ones to compare." : 
                "Enable comparison mode to run multiple algorithms simultaneously"}
            </div>
          </div>
        </div>
        <div className="text-sm text-slate-600 px-1">
          {algorithms.find(a => a.key === algorithm)?.desc}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Cell mode selector */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-medium mb-3 text-gray-700">Drawing Mode</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                mode === 'wall'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setMode('wall')}
              disabled={running}
            >
              <div className="w-3 h-3 bg-gray-700 rounded-sm" />
              Walls
            </button>
            <button
              className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                mode === 'weight'
                  ? 'bg-violet-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setMode('weight')}
              disabled={running}
            >
              <div className="w-3 h-3 bg-violet-200 rounded-sm border border-violet-400" />
              Weights
            </button>
            <button
              className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                mode === 'start'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setMode('start')}
              disabled={running}
            >
              <div className="w-3 h-3 bg-emerald-200 rounded-sm border border-emerald-400" />
              Start
            </button>
            <button
              className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                mode === 'end'
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setMode('end')}
              disabled={running}
            >
              <div className="w-3 h-3 bg-rose-200 rounded-sm border border-rose-400" />
              End
            </button>
          </div>

          {mode === 'weight' && (
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Weight Value: {weightValue}×</h3>
              <input
                type="range"
                min="2"
                max="10"
                value={weightValue}
                onChange={(e) => setWeightValue(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500 disabled:opacity-50"
                disabled={running}
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Lighter (2x)</span>
                <span>Heavier (10x)</span>
              </div>
            </div>
          )}
        </div>

        {/* Grid size selector */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-medium mb-3 text-gray-700">Grid Size</h3>
          <div className="flex flex-wrap gap-2">
            {gridSizes.map(size => (
              <button
                key={size}
                className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-colors
                  ${gridSize === size
                    ? 'bg-primary-100 border-primary-300 text-primary-900'
                    : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                onClick={() => setGridSize(size)}
                disabled={running}
              >
                {size}×{size}
              </button>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-500">
            <p>Smaller grids are faster to search but less complex.</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-medium mb-3 text-gray-700">Actions</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold shadow-sm hover:bg-emerald-600 transition flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => compareModeActive ? runComparisonMode() : findPath()}
              disabled={running}
            >
              <HiPlay className="w-4 h-4" />
              {compareModeActive ? 'Compare All' : 'Start'}
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
              onClick={resetGrid}
              disabled={running}
            >
              <HiRefresh className="w-4 h-4" />
              Reset
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-amber-400 text-amber-900 font-semibold hover:bg-amber-500 transition flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
              onClick={randomWalls}
              disabled={running}
            >
              <HiPuzzle className="w-4 h-4" />
              Random Walls
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
