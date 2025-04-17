"use client";
import React, { useState } from "react";

const GRID_SIZE = 12;
const EMPTY = 0, WALL = 1, START = 2, END = 3, PATH = 4, VISITED = 5;

function createGrid(size: number) {
  const grid = Array(size)
    .fill(null)
    .map(() => Array(size).fill(EMPTY));
  grid[1][1] = START;
  grid[size - 2][size - 2] = END;
  return grid;
}

function cloneGrid(grid: number[][]) {
  return grid.map(row => [...row]);
}

interface CellProps {
  value: number;
  onClick: () => void;
}

const cellColors = {
  [EMPTY]: "bg-white",
  [WALL]: "bg-gray-700",
  [START]: "bg-green-400",
  [END]: "bg-red-400",
  [PATH]: "bg-yellow-300",
  [VISITED]: "bg-blue-200",
};

const Cell: React.FC<CellProps> = ({ value, onClick }) => (
  <div
    className={`w-6 h-6 border border-gray-300 cursor-pointer ${cellColors[value as keyof typeof cellColors]}`}
    onClick={onClick}
  />
);

const PathfindingDemo: React.FC = () => {
  const [grid, setGrid] = useState(() => createGrid(GRID_SIZE));
  const [mode, setMode] = useState<'wall' | 'start' | 'end'>('wall');
  const [running, setRunning] = useState(false);
  const [found, setFound] = useState(false);

  const handleCellClick = (rowIdx: number, colIdx: number) => {
    if (running) return;
    setGrid(oldGrid => {
      const newGrid = cloneGrid(oldGrid);
      if (mode === 'wall') {
        if (newGrid[rowIdx][colIdx] === EMPTY) newGrid[rowIdx][colIdx] = WALL;
        else if (newGrid[rowIdx][colIdx] === WALL) newGrid[rowIdx][colIdx] = EMPTY;
      } else if (mode === 'start') {
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            if (newGrid[r][c] === START) newGrid[r][c] = EMPTY;
          }
        }
        newGrid[rowIdx][colIdx] = START;
      } else if (mode === 'end') {
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            if (newGrid[r][c] === END) newGrid[r][c] = EMPTY;
          }
        }
        newGrid[rowIdx][colIdx] = END;
      }
      return newGrid;
    });
  };

  const findPath = async () => {
    setRunning(true);
    setFound(false);
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const queue: [number, number, [number, number][]][] = [];
    const visited = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(false));
    let start: [number, number] = [0, 0];
    let end: [number, number] = [0, 0];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c] === START) start = [r, c];
        if (grid[r][c] === END) end = [r, c];
      }
    }
    queue.push([start[0], start[1], []]);
    visited[start[0]][start[1]] = true;
    let foundPath: [number, number][] | null = null;
    const newGrid = cloneGrid(grid);
    while (queue.length) {
      const [r, c, path] = queue.shift()!;
      if (r === end[0] && c === end[1]) {
        foundPath = path;
        break;
      }
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (
          nr >= 0 &&
          nr < GRID_SIZE &&
          nc >= 0 &&
          nc < GRID_SIZE &&
          !visited[nr][nc] &&
          (grid[nr][nc] === EMPTY || grid[nr][nc] === END)
        ) {
          visited[nr][nc] = true;
          queue.push([nr, nc, [...path, [nr, nc]]]);
          if (grid[nr][nc] !== END) newGrid[nr][nc] = VISITED;
        }
      }
      setGrid(cloneGrid(newGrid));
      await new Promise(res => setTimeout(res, 15));
    }
    if (foundPath) {
      for (const [r, c] of foundPath) {
        if (newGrid[r][c] !== END) newGrid[r][c] = PATH;
        setGrid(cloneGrid(newGrid));
        await new Promise(res => setTimeout(res, 30));
      }
      setFound(true);
    }
    setRunning(false);
  };

  const resetGrid = () => {
    setGrid(createGrid(GRID_SIZE));
    setFound(false);
    setRunning(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Pathfinding Simulation (BFS)</h2>
      <div className="mb-2 flex gap-2">
        <button
          className={`px-2 py-1 rounded border ${mode === 'wall' ? 'bg-blue-200' : 'bg-white'}`}
          onClick={() => setMode('wall')}
          disabled={running}
        >
          Place Walls
        </button>
        <button
          className={`px-2 py-1 rounded border ${mode === 'start' ? 'bg-green-200' : 'bg-white'}`}
          onClick={() => setMode('start')}
          disabled={running}
        >
          Set Start
        </button>
        <button
          className={`px-2 py-1 rounded border ${mode === 'end' ? 'bg-red-200' : 'bg-white'}`}
          onClick={() => setMode('end')}
          disabled={running}
        >
          Set End
        </button>
        <button
          className="px-2 py-1 rounded border bg-yellow-100"
          onClick={findPath}
          disabled={running}
        >
          Find Path
        </button>
        <button
          className="px-2 py-1 rounded border bg-gray-100"
          onClick={resetGrid}
          disabled={running}
        >
          Reset
        </button>
      </div>
      <div className="inline-block">
        {grid.map((row, rIdx) => (
          <div key={rIdx} className="flex">
            {row.map((cell, cIdx) => (
              <Cell key={cIdx} value={cell} onClick={() => handleCellClick(rIdx, cIdx)} />
            ))}
          </div>
        ))}
      </div>
      {found && <div className="mt-4 text-green-600 font-semibold">Path found!</div>}
      {!found && !running && <div className="mt-4 text-gray-600">Try to find a path from <span className="font-semibold text-green-600">green</span> to <span className="font-semibold text-red-600">red</span>.</div>}
    </div>
  );
};

export default PathfindingDemo;
