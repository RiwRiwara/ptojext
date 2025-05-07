// Types for Pathfinding components
import { ReactNode } from 'react';

// Cell values
export const EMPTY = 0;
export const WALL = 1;
export const START = 2;
export const END = 3;
export const VISITED = 4;
export const SHORTEST_PATH = 5;
export const WEIGHTED = 6;

export type CellValue = typeof EMPTY | typeof WALL | typeof START | typeof END | typeof VISITED | typeof SHORTEST_PATH | typeof WEIGHTED;

// Grid type
export type Grid = CellValue[][];

// Algorithm key type
export type AlgorithmKey = 'bfs' | 'dfs' | 'dijkstra' | 'astar';

// Algorithm result
export interface AlgorithmResult {
  path: [number, number][];
  visited: [number, number][];
  timeMs: number;
}

// Algorithm info
export interface AlgorithmInfo {
  key: AlgorithmKey;
  label: string;
  shortLabel: string;
  desc: string;
  icon: ReactNode;
  color: string;
  speed: string;
  optimalPath: string;
  complexity: string;
  worksWithWeights: boolean;
}

// Cell mode
export type CellMode = 'wall' | 'weight' | 'start' | 'end';
