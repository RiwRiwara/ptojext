import React from 'react';
import { HiLightningBolt, HiPuzzle, HiAdjustments, HiClock } from "react-icons/hi";
import { Grid, AlgorithmInfo, AlgorithmKey, CellValue, EMPTY, END, START, VISITED, WALL, WEIGHTED } from "./types";

// Helper function for animation delays
export const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Algorithm definitions with metadata
export const ALGORITHMS: AlgorithmInfo[] = [
  {
    key: 'bfs',
    label: 'Breadth-First Search',
    shortLabel: 'BFS',
    desc: 'Explores neighbors level by level, guaranteeing the shortest path in unweighted graphs.',
    icon: React.createElement(HiLightningBolt, { className: "text-primary-500" }), 
    color: 'primary',
    speed: 'Medium',
    optimalPath: 'Yes (unweighted)',
    complexity: 'O(V + E)',
    worksWithWeights: false,
  },
  {
    key: 'dfs',
    label: 'Depth-First Search',
    shortLabel: 'DFS',
    desc: 'Explores as far as possible along each branch before backtracking. Not guaranteed to find the shortest path.',
    icon: React.createElement(HiPuzzle, { className: "text-primary-500" }),
    color: 'primary',
    speed: 'Fast',
    optimalPath: 'No',
    complexity: 'O(V + E)',
    worksWithWeights: false,
  },
  {
    key: 'dijkstra',
    label: 'Dijkstra\'s Algorithm',
    shortLabel: 'Dijkstra',
    desc: 'Finds the shortest path in weighted graphs by prioritizing the path with the smallest total weight.',
    icon: React.createElement(HiAdjustments, { className: "text-amber-500" }),
    color: 'amber',
    speed: 'Medium-Slow',
    optimalPath: 'Yes (weighted)',
    complexity: 'O((V+E)log V)',
    worksWithWeights: true,
  },
  {
    key: 'astar',
    label: 'A* Search',
    shortLabel: 'A*',
    desc: 'Uses heuristics to find the shortest path more efficiently than Dijkstra\'s by using a "best-first" approach.',
    icon: React.createElement(HiClock, { className: "text-emerald-500" }),
    color: 'emerald',
    speed: 'Fast-Medium',
    optimalPath: 'Yes (weighted)',
    complexity: 'O(E)',
    worksWithWeights: true,
  },
];

// Helper function to get neighboring cells
export function getNeighbors(
  grid: Grid,
  row: number,
  col: number,
  weights: Record<string, number>
): [number, number, number][] {
  const neighbors: [number, number, number][] = [];
  const directions = [
    [-1, 0], // up
    [1, 0], // down
    [0, -1], // left
    [0, 1], // right
  ];

  directions.forEach(([dr, dc]) => {
    const newRow = row + dr;
    const newCol = col + dc;

    if (
      newRow >= 0 &&
      newRow < grid.length &&
      newCol >= 0 &&
      newCol < grid[0].length &&
      grid[newRow][newCol] !== WALL &&
      grid[newRow][newCol] !== VISITED
    ) {
      let weight = 1;
      if (grid[newRow][newCol] === WEIGHTED) {
        const key = `${newRow},${newCol}`;
        weight = weights[key] || 1;
      }
      neighbors.push([newRow, newCol, weight]);
    }
  });

  return neighbors;
}

// Manhattan distance heuristic for A*
export function manhattanDistance(r1: number, c1: number, r2: number, c2: number): number {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}

// Find path using breadth-first search
export async function bfs(
  grid: Grid,
  startCoords: [number, number],
  endCoords: [number, number],
  weights: Record<string, number>,
  setGridVisited: (r: number, c: number) => void,
  returnPath: boolean = false,
  animationSpeed: number = 20
): Promise<[number, number][]> {
  const [startRow, startCol] = startCoords;
  const [endRow, endCol] = endCoords;
  
  const visited = new Set<string>();
  const queue: [number, number][] = [[startRow, startCol]];
  const prev: Record<string, [number, number]> = {};
  
  visited.add(`${startRow},${startCol}`);
  
  while (queue.length > 0) {
    const [row, col] = queue.shift()!;
    
    // For visualization - update the grid
    if (grid[row][col] !== START && grid[row][col] !== END) {
      setGridVisited(row, col);
      await delay(animationSpeed);
    }
    
    if (row === endRow && col === endCol) {
      if (returnPath) {
        // Reconstruct path
        const path: [number, number][] = [];
        let current: [number, number] = [endRow, endCol];
        
        while (current[0] !== startRow || current[1] !== startCol) {
          path.unshift(current);
          const key = `${current[0]},${current[1]}`;
          current = prev[key];
        }
        
        path.unshift([startRow, startCol]);
        return path;
      }
      return [[endRow, endCol]]; // Just to indicate we found it
    }
    
    const neighbors = getNeighbors(grid, row, col, weights);
    
    for (const [newRow, newCol] of neighbors) {
      const key = `${newRow},${newCol}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push([newRow, newCol]);
        prev[key] = [row, col];
      }
    }
  }
  
  return []; // No path found
}

// Find path using depth-first search
export async function dfs(
  grid: Grid,
  startCoords: [number, number],
  endCoords: [number, number],
  weights: Record<string, number>,
  setGridVisited: (r: number, c: number) => void,
  returnPath: boolean = false,
  animationSpeed: number = 20
): Promise<[number, number][]> {
  const [startRow, startCol] = startCoords;
  const [endRow, endCol] = endCoords;
  
  const visited = new Set<string>();
  const stack: [number, number][] = [[startRow, startCol]];
  const prev: Record<string, [number, number]> = {};
  
  visited.add(`${startRow},${startCol}`);
  
  while (stack.length > 0) {
    const [row, col] = stack.pop()!;
    
    // For visualization - update the grid
    if (grid[row][col] !== START && grid[row][col] !== END) {
      setGridVisited(row, col);
      await delay(animationSpeed);
    }
    
    if (row === endRow && col === endCol) {
      if (returnPath) {
        // Reconstruct path
        const path: [number, number][] = [];
        let current: [number, number] = [endRow, endCol];
        
        while (current[0] !== startRow || current[1] !== startCol) {
          path.unshift(current);
          const key = `${current[0]},${current[1]}`;
          current = prev[key];
        }
        
        path.unshift([startRow, startCol]);
        return path;
      }
      return [[endRow, endCol]]; // Just to indicate we found it
    }
    
    const neighbors = getNeighbors(grid, row, col, weights);
    
    for (const [newRow, newCol] of neighbors) {
      const key = `${newRow},${newCol}`;
      if (!visited.has(key)) {
        visited.add(key);
        stack.push([newRow, newCol]);
        prev[key] = [row, col];
      }
    }
  }
  
  return []; // No path found
}

// Find path using Dijkstra's algorithm
export async function dijkstra(
  grid: Grid,
  startCoords: [number, number],
  endCoords: [number, number],
  weights: Record<string, number>,
  setGridVisited: (r: number, c: number) => void,
  returnPath: boolean = false,
  animationSpeed: number = 20
): Promise<[number, number][]> {
  const [startRow, startCol] = startCoords;
  const [endRow, endCol] = endCoords;
  
  // Priority queue implementation using array (for simplicity)
  const pq: [number, number, number][] = [[0, startRow, startCol]]; // [distance, row, col]
  const distances: Record<string, number> = {};
  const prev: Record<string, [number, number]> = {};
  const visited = new Set<string>();
  
  // Initialize distances
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      const key = `${r},${c}`;
      distances[key] = r === startRow && c === startCol ? 0 : Infinity;
    }
  }
  
  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]); // Sort by distance
    const [dist, row, col] = pq.shift()!;
    const key = `${row},${col}`;
    
    if (visited.has(key)) continue;
    visited.add(key);
    
    // For visualization
    if (grid[row][col] !== START && grid[row][col] !== END) {
      setGridVisited(row, col);
      await delay(animationSpeed);
    }
    
    if (row === endRow && col === endCol) {
      if (returnPath) {
        // Reconstruct path
        const path: [number, number][] = [];
        let current: [number, number] = [endRow, endCol];
        
        while (current[0] !== startRow || current[1] !== startCol) {
          path.unshift(current);
          const key = `${current[0]},${current[1]}`;
          current = prev[key];
        }
        
        path.unshift([startRow, startCol]);
        return path;
      }
      return [[endRow, endCol]]; // Just to indicate we found it
    }
    
    const neighbors = getNeighbors(grid, row, col, weights);
    
    for (const [newRow, newCol, weight] of neighbors) {
      const neighborKey = `${newRow},${newCol}`;
      const newDist = dist + weight;
      
      if (newDist < distances[neighborKey]) {
        distances[neighborKey] = newDist;
        prev[neighborKey] = [row, col];
        pq.push([newDist, newRow, newCol]);
      }
    }
  }
  
  return []; // No path found
}

// Find path using A* algorithm
export async function astar(
  grid: Grid,
  startCoords: [number, number],
  endCoords: [number, number],
  weights: Record<string, number>,
  setGridVisited: (r: number, c: number) => void,
  returnPath: boolean = false,
  animationSpeed: number = 20
): Promise<[number, number][]> {
  const [startRow, startCol] = startCoords;
  const [endRow, endCol] = endCoords;
  
  // Priority queue implementation using array (for simplicity)
  const openSet: [number, number, number][] = [[0, startRow, startCol]]; // [f-score, row, col]
  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const prev: Record<string, [number, number]> = {};
  const visited = new Set<string>();
  
  // Initialize scores
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      const key = `${r},${c}`;
      gScore[key] = r === startRow && c === startCol ? 0 : Infinity;
      fScore[key] = r === startRow && c === startCol ? 
        manhattanDistance(r, c, endRow, endCol) : Infinity;
    }
  }
  
  while (openSet.length > 0) {
    openSet.sort((a, b) => a[0] - b[0]); // Sort by f-score
    const [, row, col] = openSet.shift()!;
    const key = `${row},${col}`;
    
    if (visited.has(key)) continue;
    visited.add(key);
    
    // For visualization
    if (grid[row][col] !== START && grid[row][col] !== END) {
      setGridVisited(row, col);
      await delay(animationSpeed);
    }
    
    if (row === endRow && col === endCol) {
      if (returnPath) {
        // Reconstruct path
        const path: [number, number][] = [];
        let current: [number, number] = [endRow, endCol];
        
        while (current[0] !== startRow || current[1] !== startCol) {
          path.unshift(current);
          const key = `${current[0]},${current[1]}`;
          current = prev[key];
        }
        
        path.unshift([startRow, startCol]);
        return path;
      }
      return [[endRow, endCol]]; // Just to indicate we found it
    }
    
    const neighbors = getNeighbors(grid, row, col, weights);
    
    for (const [newRow, newCol, weight] of neighbors) {
      const neighborKey = `${newRow},${newCol}`;
      const tentativeGScore = gScore[key] + weight;
      
      if (tentativeGScore < gScore[neighborKey]) {
        gScore[neighborKey] = tentativeGScore;
        fScore[neighborKey] = tentativeGScore + 
          manhattanDistance(newRow, newCol, endRow, endCol);
        prev[neighborKey] = [row, col];
        openSet.push([fScore[neighborKey], newRow, newCol]);
      }
    }
  }
  
  return []; // No path found
}
