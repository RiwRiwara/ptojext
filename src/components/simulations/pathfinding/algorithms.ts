// Types
export type Cell = [number, number];
export type Grid = number[][];
export type VisitedCell = { cell: Cell, parent: Cell | null };
export type AlgorithmType = 'dijkstra' | 'astar' | 'bfs' | 'dfs' | 'greedy';

export interface AlgorithmResult {
  path: Cell[];
  visitedInOrder: Cell[];
}

// Helper functions for pathfinding algorithms
export const getNeighbors = (grid: Grid, row: number, col: number, allowDiagonal = false): Cell[] => {
  // Defensive checks
  if (!grid || !grid.length || !grid[0]) {
    console.error('Invalid grid in getNeighbors');
    return [];
  }

  const rows = grid.length;
  const cols = grid[0].length;
  const neighbors: Cell[] = [];

  // Ensure row and col are within bounds
  if (row < 0 || row >= rows || col < 0 || col >= cols) {
    console.warn(`Out of bounds coordinates: [${row}, ${col}]`);
    return [];
  }

  // Cardinal directions (up, right, down, left)
  const cardinalDirections: Cell[] = [
    [-1, 0],  // up
    [0, 1],   // right
    [1, 0],   // down
    [0, -1]   // left
  ];

  // Diagonal directions
  const diagonalDirections: Cell[] = [
    [-1, -1], // up-left
    [-1, 1],  // up-right
    [1, 1],   // down-right
    [1, -1]   // down-left
  ];

  // Start with cardinal directions
  let directions = [...cardinalDirections];

  // Add diagonal directions if allowed
  if (allowDiagonal) {
    directions = [...directions, ...diagonalDirections];
  }

  // Check all possible directions
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    // Check if the new coordinates are valid
    if (
      newRow >= 0 &&
      newRow < rows &&
      newCol >= 0 &&
      newCol < cols
    ) {
      // Check if the cell is not a wall (value 1)
      if (grid[newRow][newCol] !== 1) {
        neighbors.push([newRow, newCol]);
      }
    }
  }

  return neighbors;
};

export const reconstructPath = (visitedCells: Map<string, VisitedCell>, endCell: Cell): Cell[] => {
  const path: Cell[] = [];
  let current: Cell | null = endCell;

  // Work backwards from end to start
  while (current) {
    path.unshift(current); // Add to beginning of path
    const key = `${current[0]},${current[1]}`;
    const cell = visitedCells.get(key);
    current = cell?.parent || null;
  }

  return path;
};

// Manhattan distance heuristic
export const manhattanDistance = (a: Cell, b: Cell): number => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};

// Euclidean distance heuristic
export const euclideanDistance = (a: Cell, b: Cell): number => {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
};

// Diagonal distance heuristic
export const diagonalDistance = (a: Cell, b: Cell): number => {
  return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
};

// Pathfinding algorithms
export const dijkstra = (grid: Grid, start: Cell, end: Cell, allowDiagonal = false): AlgorithmResult => {
  const visitedInOrder: Cell[] = [];
  const visitedCells = new Map<string, VisitedCell>();
  const distances = new Map<string, number>();
  const unvisited = new Set<string>();

  // Initialize distances
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const key = `${row},${col}`;
      distances.set(key, Infinity);
      unvisited.add(key);
    }
  }

  // Set start distance to 0
  const startKey = `${start[0]},${start[1]}`;
  distances.set(startKey, 0);
  visitedCells.set(startKey, { cell: start, parent: null });

  while (unvisited.size > 0) {
    let currentKey = "";
    let minDistance = Infinity;

    // Find the unvisited node with the smallest distance
    for (const key of unvisited) {
      const distance = distances.get(key) || Infinity;
      if (distance < minDistance) {
        minDistance = distance;
        currentKey = key;
      }
    }

    // If no path is possible or we've reached the end
    if (minDistance === Infinity || currentKey === `${end[0]},${end[1]}`) break;

    // Remove from unvisited
    unvisited.delete(currentKey);

    // Get current node coordinates
    const [row, col] = currentKey.split(',').map(Number);
    visitedInOrder.push([row, col]);

    // Get neighbors
    const neighbors = getNeighbors(grid, row, col, allowDiagonal);

    // Update distances to neighbors
    for (const [nRow, nCol] of neighbors) {
      const neighborKey = `${nRow},${nCol}`;
      const currentDistance = distances.get(currentKey) || Infinity;
      const newDistance = currentDistance + 1; // Assuming all edges have weight 1

      if (newDistance < (distances.get(neighborKey) || Infinity)) {
        distances.set(neighborKey, newDistance);
        visitedCells.set(neighborKey, { cell: [nRow, nCol], parent: [row, col] });
      }
    }
  }

  // Reconstruct path
  const path = reconstructPath(visitedCells, end);

  return { path, visitedInOrder };
};

export const breadthFirstSearch = (grid: Grid, start: Cell, end: Cell, allowDiagonal = false): AlgorithmResult => {
  const visitedInOrder: Cell[] = [];
  const visitedCells = new Map<string, VisitedCell>();
  const queue: Cell[] = [start];
  const visited = new Set<string>();

  // Mark start as visited
  visited.add(`${start[0]},${start[1]}`);
  visitedCells.set(`${start[0]},${start[1]}`, { cell: start, parent: null });

  // BFS loop
  while (queue.length > 0) {
    const current = queue.shift()!;
    const [row, col] = current;

    // Add to visited in order
    visitedInOrder.push(current);

    // Check if we reached the end
    if (row === end[0] && col === end[1]) {
      break;
    }

    // Get neighbors
    const neighbors = getNeighbors(grid, row, col, allowDiagonal);

    // Process neighbors
    for (const [nRow, nCol] of neighbors) {
      const neighborKey = `${nRow},${nCol}`;

      if (!visited.has(neighborKey)) {
        visited.add(neighborKey);
        queue.push([nRow, nCol]);
        visitedCells.set(neighborKey, { cell: [nRow, nCol], parent: [row, col] });
      }
    }
  }

  // Reconstruct path
  const path = reconstructPath(visitedCells, end);

  return { path, visitedInOrder };
};

export const depthFirstSearch = (grid: Grid, start: Cell, end: Cell, allowDiagonal = false): AlgorithmResult => {
  const visitedInOrder: Cell[] = [];
  const visitedCells = new Map<string, VisitedCell>();
  const stack: Cell[] = [start];
  const visited = new Set<string>();

  // Mark start as visited
  visited.add(`${start[0]},${start[1]}`);
  visitedCells.set(`${start[0]},${start[1]}`, { cell: start, parent: null });

  // DFS loop
  while (stack.length > 0) {
    const current = stack.pop()!;
    const [row, col] = current;
    const currentKey = `${row},${col}`;

    // Add to visited in order if not already visited in this iteration
    if (!visitedInOrder.some(([vr, vc]) => vr === row && vc === col)) {
      visitedInOrder.push(current);
    }

    // Check if we reached the end
    if (row === end[0] && col === end[1]) {
      break;
    }

    // Get neighbors
    const neighbors = getNeighbors(grid, row, col, allowDiagonal);

    // Process neighbors in reverse order (to match typical DFS behavior)
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const [nRow, nCol] = neighbors[i];
      const neighborKey = `${nRow},${nCol}`;

      if (!visited.has(neighborKey)) {
        visited.add(neighborKey);
        stack.push([nRow, nCol]);
        visitedCells.set(neighborKey, { cell: [nRow, nCol], parent: [row, col] });
      }
    }
  }

  // Reconstruct path
  const path = reconstructPath(visitedCells, end);

  return { path, visitedInOrder };
};

export const astar = (grid: Grid, start: Cell, end: Cell, allowDiagonal = false): AlgorithmResult => {
  const visitedInOrder: Cell[] = [];
  const visitedCells = new Map<string, VisitedCell>();
  const gScore = new Map<string, number>(); // Cost from start to current node
  const fScore = new Map<string, number>(); // Estimated total cost (g + h)
  const openSet = new Set<string>();
  const closedSet = new Set<string>();

  // Initialize scores
  const startKey = `${start[0]},${start[1]}`;
  gScore.set(startKey, 0);
  fScore.set(startKey, manhattanDistance(start, end));
  openSet.add(startKey);
  visitedCells.set(startKey, { cell: start, parent: null });

  while (openSet.size > 0) {
    // Find node with lowest fScore
    let currentKey = "";
    let lowestFScore = Infinity;

    for (const key of openSet) {
      const score = fScore.get(key) || Infinity;
      if (score < lowestFScore) {
        lowestFScore = score;
        currentKey = key;
      }
    }

    // Get current node
    const [row, col] = currentKey.split(',').map(Number);
    const current: Cell = [row, col];

    // Check if we reached the end
    if (row === end[0] && col === end[1]) {
      visitedInOrder.push(current);
      break;
    }

    // Move from open to closed
    openSet.delete(currentKey);
    closedSet.add(currentKey);
    visitedInOrder.push(current);

    // Get neighbors
    const neighbors = getNeighbors(grid, row, col, allowDiagonal);

    // Process neighbors
    for (const [nRow, nCol] of neighbors) {
      const neighborKey = `${nRow},${nCol}`;

      // Skip if already evaluated
      if (closedSet.has(neighborKey)) continue;

      // Calculate tentative gScore
      const tentativeGScore = (gScore.get(currentKey) || 0) + 1;

      // Add to open set if not there
      if (!openSet.has(neighborKey)) {
        openSet.add(neighborKey);
      } else if (tentativeGScore >= (gScore.get(neighborKey) || Infinity)) {
        // Not a better path
        continue;
      }

      // Best path so far, record it
      visitedCells.set(neighborKey, { cell: [nRow, nCol], parent: [row, col] });
      gScore.set(neighborKey, tentativeGScore);
      fScore.set(neighborKey, tentativeGScore + manhattanDistance([nRow, nCol], end));
    }
  }

  // Reconstruct path
  const path = reconstructPath(visitedCells, end);

  return { path, visitedInOrder };
};

export const greedyBestFirstSearch = (grid: Grid, start: Cell, end: Cell, allowDiagonal = false): AlgorithmResult => {
  const visitedInOrder: Cell[] = [];
  const visitedCells = new Map<string, VisitedCell>();
  const openSet = new Set<string>();
  const closedSet = new Set<string>();
  const hScore = new Map<string, number>(); // Heuristic only (no path cost)

  // Initialize
  const startKey = `${start[0]},${start[1]}`;
  hScore.set(startKey, manhattanDistance(start, end));
  openSet.add(startKey);
  visitedCells.set(startKey, { cell: start, parent: null });

  while (openSet.size > 0) {
    // Find node with lowest hScore
    let currentKey = "";
    let lowestHScore = Infinity;

    for (const key of openSet) {
      const score = hScore.get(key) || Infinity;
      if (score < lowestHScore) {
        lowestHScore = score;
        currentKey = key;
      }
    }

    // Get current node
    const [row, col] = currentKey.split(',').map(Number);
    const current: Cell = [row, col];

    // Check if we reached the end
    if (row === end[0] && col === end[1]) {
      visitedInOrder.push(current);
      break;
    }

    // Move from open to closed
    openSet.delete(currentKey);
    closedSet.add(currentKey);
    visitedInOrder.push(current);

    // Get neighbors
    const neighbors = getNeighbors(grid, row, col, allowDiagonal);

    // Process neighbors
    for (const [nRow, nCol] of neighbors) {
      const neighborKey = `${nRow},${nCol}`;

      // Skip if already evaluated
      if (closedSet.has(neighborKey)) continue;

      // Add to open set if not there
      if (!openSet.has(neighborKey)) {
        openSet.add(neighborKey);
        hScore.set(neighborKey, manhattanDistance([nRow, nCol], end));
        visitedCells.set(neighborKey, { cell: [nRow, nCol], parent: [row, col] });
      }
    }
  }

  // Reconstruct path
  const path = reconstructPath(visitedCells, end);

  return { path, visitedInOrder };
};
