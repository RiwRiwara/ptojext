"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import { FiPlay, FiSquare, FiCircle, FiGrid, FiEdit, FiCrosshair, FiInfo } from 'react-icons/fi';

// Types
type Cell = [number, number];
type Grid = number[][];
type VisitedCell = { cell: Cell, parent: Cell | null };

interface AlgorithmResult {
    path: Cell[];
    visitedInOrder: Cell[];
}

// Helper functions for pathfinding algorithms
const getNeighbors = (grid: Grid, row: number, col: number, allowDiagonal = false): Cell[] => {
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

const reconstructPath = (visitedCells: Map<string, VisitedCell>, endCell: Cell): Cell[] => {
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
const manhattanDistance = (a: Cell, b: Cell): number => {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};

// Euclidean distance heuristic
const euclideanDistance = (a: Cell, b: Cell): number => {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
};

// Diagonal distance heuristic
const diagonalDistance = (a: Cell, b: Cell): number => {
    return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
};

// Pathfinding algorithms
const dijkstra = (grid: Grid, start: Cell, end: Cell, allowDiagonal = false): AlgorithmResult => {
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

    // While there are unvisited nodes
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

const breadthFirstSearch = (grid: Grid, start: Cell, end: Cell, allowDiagonal = false): AlgorithmResult => {
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

const depthFirstSearch = (grid: Grid, start: Cell, end: Cell, allowDiagonal = false): AlgorithmResult => {
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
                stack.push([nRow, nCol]);
                visitedCells.set(neighborKey, { cell: [nRow, nCol], parent: [row, col] });
            }
        }
    }

    // Reconstruct path
    const path = reconstructPath(visitedCells, end);

    return { path, visitedInOrder };
};

const astar = (grid: Grid, start: Cell, end: Cell, allowDiagonal = false): AlgorithmResult => {
    const visitedInOrder: Cell[] = [];
    const visitedCells = new Map<string, VisitedCell>();
    const openSet: Cell[] = [start];
    const closedSet = new Set<string>();

    // Maps to track scores
    const gScore = new Map<string, number>(); // Cost from start to node
    const fScore = new Map<string, number>(); // gScore + heuristic

    // Initialize start scores
    const startKey = `${start[0]},${start[1]}`;
    gScore.set(startKey, 0);
    fScore.set(startKey, manhattanDistance(start, end));
    visitedCells.set(startKey, { cell: start, parent: null });

    // A* loop
    while (openSet.length > 0) {
        // Find node with lowest fScore
        let lowestIndex = 0;
        for (let i = 1; i < openSet.length; i++) {
            const key = `${openSet[i][0]},${openSet[i][1]}`;
            const lowestKey = `${openSet[lowestIndex][0]},${openSet[lowestIndex][1]}`;
            if ((fScore.get(key) || Infinity) < (fScore.get(lowestKey) || Infinity)) {
                lowestIndex = i;
            }
        }

        const current = openSet[lowestIndex];
        const [row, col] = current;
        const currentKey = `${row},${col}`;

        // Add to visited in order
        visitedInOrder.push(current);

        // Check if we reached the end
        if (row === end[0] && col === end[1]) {
            break;
        }

        // Remove current from openSet and add to closedSet
        openSet.splice(lowestIndex, 1);
        closedSet.add(currentKey);

        // Get neighbors
        const neighbors = getNeighbors(grid, row, col, allowDiagonal);

        // Process neighbors
        for (const [nRow, nCol] of neighbors) {
            const neighborKey = `${nRow},${nCol}`;

            // Skip if in closedSet
            if (closedSet.has(neighborKey)) continue;

            // Calculate tentative gScore
            const tentativeGScore = (gScore.get(currentKey) || Infinity) + 1;

            // If neighbor not in openSet, add it
            if (!openSet.some(([r, c]) => r === nRow && c === nCol)) {
                openSet.push([nRow, nCol]);
            }
            // Skip if we already have a better path
            else if (tentativeGScore >= (gScore.get(neighborKey) || Infinity)) {
                continue;
            }

            // This path is better, record it
            visitedCells.set(neighborKey, { cell: [nRow, nCol], parent: [row, col] });
            gScore.set(neighborKey, tentativeGScore);
            fScore.set(neighborKey, tentativeGScore + manhattanDistance([nRow, nCol], end));
        }
    }

    // Reconstruct path
    const path = reconstructPath(visitedCells, end);

    return { path, visitedInOrder };
};

const greedyBestFirstSearch = (grid: Grid, start: Cell, end: Cell, allowDiagonal = false): AlgorithmResult => {
    const visitedInOrder: Cell[] = [];
    const visitedCells = new Map<string, VisitedCell>();
    const openSet: Cell[] = [start];
    const visited = new Set<string>();

    // Mark start as visited
    const startKey = `${start[0]},${start[1]}`;
    visited.add(startKey);
    visitedCells.set(startKey, { cell: start, parent: null });

    // Greedy BFS loop
    while (openSet.length > 0) {
        // Find node with lowest heuristic score
        let lowestIndex = 0;
        for (let i = 1; i < openSet.length; i++) {
            if (manhattanDistance(openSet[i], end) < manhattanDistance(openSet[lowestIndex], end)) {
                lowestIndex = i;
            }
        }

        const current = openSet[lowestIndex];
        const [row, col] = current;

        // Add to visited in order
        visitedInOrder.push(current);

        // Remove from openSet
        openSet.splice(lowestIndex, 1);

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
                openSet.push([nRow, nCol]);
                visitedCells.set(neighborKey, { cell: [nRow, nCol], parent: [row, col] });
            }
        }
    }

    // Reconstruct path
    const path = reconstructPath(visitedCells, end);

    return { path, visitedInOrder };
};

export const PathfindingVisualizer = () => {
    // Grid configuration
    const [rows, setRows] = useState(20);
    const [cols, setCols] = useState(30);
    const [grid, setGrid] = useState<number[][]>(() =>
        Array.from({ length: rows }, () => Array(cols).fill(0))
    );

    // Cell states
    const [start, setStart] = useState<Cell>([5, 5]);
    const [end, setEnd] = useState<Cell>([15, 25]);
    const [path, setPath] = useState<Cell[]>([]);
    const [visitedCells, setVisitedCells] = useState<Cell[]>([]);

    // UI states
    const [tool, setTool] = useState<'start' | 'end' | 'wall' | 'weight'>('wall');
    const [algorithm, setAlgorithm] = useState('astar');
    const [isRunning, setIsRunning] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationSpeed, setAnimationSpeed] = useState(10); // Cells per frame
    const [allowDiagonal, setAllowDiagonal] = useState(false);
    const [showVisitedCells, setShowVisitedCells] = useState(true);
    const [currentAlgorithmInfo, setCurrentAlgorithmInfo] = useState('');

    // For maze generation
    const [mazeType, setMazeType] = useState('random');
    const [mazeDensity, setMazeDensity] = useState(30); // Percentage of walls

    // Algorithm descriptions
    const algorithmDescriptions = {
        dijkstra: "Dijkstra's algorithm guarantees the shortest path in graphs with non-negative edge weights.",
        astar: "A* uses a heuristic to try and find a better path more quickly than Dijkstra.",
        bfs: "Breadth-First Search guarantees the shortest path in unweighted graphs.",
        dfs: "Depth-First Search explores as far as possible along each branch before backtracking.",
        greedy: "Greedy Best-First Search always chooses the path that appears closest to the goal."
    };

    // Memoize resetGrid function to avoid dependency issues
    const resetGrid = useCallback(() => {
        if (isRunning || isAnimating) return;

        const newGrid = Array.from({ length: rows }, () => Array(cols).fill(0));
        setGrid(newGrid);
        setPath([]);
        setVisitedCells([]);
        setStart([5, 5]);
        setEnd([Math.floor(rows * 0.75), Math.floor(cols * 0.75)]);
    }, [rows, cols, isRunning, isAnimating]);

    // Reset grid when rows/cols change
    useEffect(() => {
        resetGrid();
    }, [resetGrid]);

    // Update algorithm info when algorithm changes
    useEffect(() => {
        setCurrentAlgorithmInfo(algorithmDescriptions[algorithm as keyof typeof algorithmDescriptions] || "");
    }, [algorithm, algorithmDescriptions]);

    // Handle cell click based on the current tool
    const handleCellClick = useCallback((row: number, col: number) => {
        if (isRunning || isAnimating) return;

        // Don't clear any visualizations automatically
        // Let the user explicitly reset when they want

        if (tool === 'start') {
            if (row === end[0] && col === end[1]) return; // Can't set start on end
            setStart([row, col]);
        } else if (tool === 'end') {
            if (row === start[0] && col === start[1]) return; // Can't set end on start
            setEnd([row, col]);
        } else {
            const newGrid = [...grid];
            newGrid[row][col] = tool === 'wall' ? (newGrid[row][col] === 1 ? 0 : 1) : 0;
            setGrid(newGrid);
        }
    }, [isRunning, isAnimating, tool, end, start, grid, setStart, setEnd, setGrid]);

    // Handle mouse drag to create walls
    const handleMouseEnter = useCallback((row: number, col: number, e: React.MouseEvent) => {
        if (e.buttons === 1 && tool === 'wall' && !isRunning && !isAnimating) {
            if ((row === start[0] && col === start[1]) || (row === end[0] && col === end[1])) return;

            // Don't clear any visualizations automatically
            // Preserve both path and visited cells

            const newGrid = [...grid];
            newGrid[row][col] = 1;
            setGrid(newGrid);
        }
    }, [grid, tool, isRunning, isAnimating, start, end]);

    // Run the selected algorithm with error handling
    const runAlgorithm = useCallback(() => {
        if (isRunning || isAnimating) return;
        if (!start || !end) {
            console.error('Start or end point not defined');
            return;
        }

        try {
            setIsRunning(true);
            setPath([]);
            setVisitedCells([]);

            let result: AlgorithmResult = { path: [], visitedInOrder: [] };
            console.log(`Running ${algorithm} algorithm from [${start}] to [${end}]`);

            // Validate the grid before running the algorithm
            if (!grid || !grid.length || !grid[0]) {
                throw new Error('Invalid grid structure');
            }

            // Check if start and end points are valid
            if (grid[start[0]][start[1]] === 1) {
                throw new Error('Start point is on a wall');
            }

            if (grid[end[0]][end[1]] === 1) {
                throw new Error('End point is on a wall');
            }

            // Run the selected algorithm
            switch (algorithm) {
                case 'dijkstra':
                    result = dijkstra(grid, start, end, allowDiagonal);
                    break;
                case 'astar':
                    result = astar(grid, start, end, allowDiagonal);
                    break;
                case 'bfs':
                    result = breadthFirstSearch(grid, start, end, allowDiagonal);
                    break;
                case 'dfs':
                    result = depthFirstSearch(grid, start, end, allowDiagonal);
                    break;
                case 'greedy':
                    result = greedyBestFirstSearch(grid, start, end, allowDiagonal);
                    break;
                default:
                    result = astar(grid, start, end, allowDiagonal);
            }

            // Check if path was found
            if (result.path.length === 0) {
                console.warn('No path found between start and end points');
            } else {
                console.log(`Path found with length: ${result.path.length}`);
            }

            // Animate the algorithm execution
            animateAlgorithm(result.visitedInOrder, result.path);
        } catch (error) {
            console.error('Error running algorithm:', error);
            setIsRunning(false);
            setIsAnimating(false);
        }
    }, [algorithm, grid, start, end, allowDiagonal, isRunning, isAnimating]);

    // Animate the algorithm's progress
    const animateAlgorithm = useCallback((visitedInOrder: Cell[], path: Cell[]) => {
        if (!visitedInOrder.length) {
            setIsRunning(false);
            return;
        }

        setIsAnimating(true);

        // Animate visited cells
        const visitedAnimation = (i: number) => {
            if (i >= visitedInOrder.length) {
                // After visiting all cells, animate the path
                if (path.length) {
                    const pathAnimation = (j: number) => {
                        if (j >= path.length) {
                            setIsRunning(false);
                            setIsAnimating(false);
                            return;
                        }

                        setTimeout(() => {
                            setPath(prevPath => [...prevPath, path[j]]);
                            pathAnimation(j + 1);
                        }, 30); // Slower animation for the path
                    };

                    pathAnimation(0);
                } else {
                    setIsRunning(false);
                    setIsAnimating(false);
                }
                return;
            }

            const cellsToShow = visitedInOrder.slice(i, i + animationSpeed);
            setVisitedCells(prevCells => [...prevCells, ...cellsToShow]);

            setTimeout(() => {
                visitedAnimation(i + animationSpeed);
            }, 20);
        };

        visitedAnimation(0);
    }, [animationSpeed, setPath, setVisitedCells, setIsRunning, setIsAnimating]);
    // Generate a random maze
    const generateMaze = useCallback(() => {
        if (isRunning || isAnimating) return;

        const newGrid = Array.from({ length: rows }, () => Array(cols).fill(0));
        // Clear the path when generating a new maze
        setPath([]);
        setVisitedCells([]);

        // Keep start and end positions clear
        const clearArea = (row: number, col: number, radius: number) => {
            for (let r = Math.max(0, row - radius); r <= Math.min(rows - 1, row + radius); r++) {
                for (let c = Math.max(0, col - radius); c <= Math.min(cols - 1, col + radius); c++) {
                    newGrid[r][c] = 0;
                }
            }
        };

        if (mazeType === 'random') {
            // Random walls
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (Math.random() * 100 < mazeDensity) {
                        newGrid[r][c] = 1;
                    }
                }
            }
        } else if (mazeType === 'maze') {
            // Simple recursive division maze algorithm
            // (This is a simplified version, a full maze algorithm would be more complex)
            const recursiveDivision = (rowStart: number, rowEnd: number, colStart: number, colEnd: number, orientation: 'horizontal' | 'vertical') => {
                if (rowEnd - rowStart < 2 || colEnd - colStart < 2) return;

                // Choose wall position
                const horizontal = orientation === 'horizontal';
                const wallRow = horizontal ? Math.floor(Math.random() * (rowEnd - rowStart - 1)) + rowStart + 1 : 0;
                const wallCol = horizontal ? 0 : Math.floor(Math.random() * (colEnd - colStart - 1)) + colStart + 1;

                // Choose passage position
                const passageRow = horizontal ? wallRow : Math.floor(Math.random() * (rowEnd - rowStart)) + rowStart;
                const passageCol = horizontal ? Math.floor(Math.random() * (colEnd - colStart)) + colStart : wallCol;

                // Draw wall with passage
                if (horizontal) {
                    for (let c = colStart; c <= colEnd; c++) {
                        if (c !== passageCol) newGrid[wallRow][c] = 1;
                    }
                } else {
                    for (let r = rowStart; r <= rowEnd; r++) {
                        if (r !== passageRow) newGrid[r][wallCol] = 1;
                    }
                }

                // Recursively divide subareas
                const nextOrientation = horizontal ? 'vertical' : 'horizontal';
                if (horizontal) {
                    recursiveDivision(rowStart, wallRow - 1, colStart, colEnd, nextOrientation);
                    recursiveDivision(wallRow + 1, rowEnd, colStart, colEnd, nextOrientation);
                } else {
                    recursiveDivision(rowStart, rowEnd, colStart, wallCol - 1, nextOrientation);
                    recursiveDivision(rowStart, rowEnd, wallCol + 1, colEnd, nextOrientation);
                }
            };

            // Create border walls
            for (let r = 0; r < rows; r++) {
                newGrid[r][0] = 1;
                newGrid[r][cols - 1] = 1;
            }
            for (let c = 0; c < cols; c++) {
                newGrid[0][c] = 1;
                newGrid[rows - 1][c] = 1;
            }

            // Start recursive division
            recursiveDivision(1, rows - 2, 1, cols - 2, Math.random() < 0.5 ? 'horizontal' : 'vertical');
        }

        // Ensure start and end positions are clear
        clearArea(start[0], start[1], 1);
        clearArea(end[0], end[1], 1);

        setGrid(newGrid);
        setPath([]);
        setVisitedCells([]);
    }, [rows, cols, start, end]);

    // Get cell class based on its state
    const getCellClass = useCallback((r: number, c: number, cell: number): string => {
        const isStart = start[0] === r && start[1] === c;
        const isEnd = end[0] === r && end[1] === c;
        const isVisited = showVisitedCells && visitedCells.some(([vr, vc]) => vr === r && vc === c);
        const isPath = path.some(([pr, pc]) => pr === r && pc === c);

        if (isStart) return 'bg-green-500 hover:bg-green-600 transform hover:scale-105';
        if (isEnd) return 'bg-red-500 hover:bg-red-600 transform hover:scale-105';
        if (isPath) return 'bg-blue-400 animate-pulse';
        if (isVisited) return 'bg-blue-200';
        if (cell === 1) return 'bg-gray-800 hover:bg-gray-700';

        return 'bg-white hover:bg-gray-100';
    }, [start, end, showVisitedCells, visitedCells, path]);

    return (
        <div className="space-y-6">
            {/* Algorithm selection and info */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <FiInfo className="mr-2" />
                    Current Algorithm: {algorithm === 'astar' ? 'A*' :
                        algorithm === 'bfs' ? 'Breadth-First Search' :
                            algorithm === 'dfs' ? 'Depth-First Search' :
                                algorithm === 'greedy' ? 'Greedy Best-First Search' :
                                    'Dijkstra\'s Algorithm'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{currentAlgorithmInfo}</p>
            </div>

            {/* Control panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Algorithm Controls</h3>

                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 mb-2">
                            <Select value={algorithm} onValueChange={setAlgorithm} disabled={isRunning || isAnimating}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Select Algorithm" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dijkstra">Dijkstra s Algorithm</SelectItem>
                                    <SelectItem value="astar">A* Algorithm</SelectItem>
                                    <SelectItem value="bfs">Breadth-First Search</SelectItem>
                                    <SelectItem value="dfs">Depth-First Search</SelectItem>
                                    <SelectItem value="greedy">Greedy Best-First</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="allow-diagonal"
                                    checked={allowDiagonal}
                                    onCheckedChange={setAllowDiagonal}
                                    disabled={isRunning || isAnimating}
                                />
                                <Label htmlFor="allow-diagonal">Allow Diagonal Movement</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="show-visited"
                                    checked={showVisitedCells}
                                    onCheckedChange={setShowVisitedCells}
                                />
                                <Label htmlFor="show-visited">Show Visited Cells</Label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="animation-speed">Animation Speed</Label>
                                <span className="text-sm">{animationSpeed} cells/frame</span>
                            </div>
                            <Slider
                                id="animation-speed"
                                min={1}
                                max={50}
                                step={1}
                                value={[animationSpeed]}
                                onValueChange={(value) => setAnimationSpeed(value[0])}
                                disabled={isRunning || isAnimating}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Grid Controls</h3>

                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Select value={tool} onValueChange={(value: string) => setTool(value as "end" | "start" | "wall" | "weight")} disabled={isRunning || isAnimating}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Select Tool" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="start">Set Start Point</SelectItem>
                                    <SelectItem value="end">Set End Point</SelectItem>
                                    <SelectItem value="wall">Draw Walls</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Select value={mazeType} onValueChange={setMazeType} disabled={isRunning || isAnimating}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Maze Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="random">Random Obstacles</SelectItem>
                                    <SelectItem value="maze">Maze Pattern</SelectItem>
                                </SelectContent>
                            </Select>

                            {mazeType === 'random' && (
                                <div className="w-full flex items-center gap-2 mt-2 mb-2">
                                    <Label htmlFor="maze-density" className="w-24">Density: {mazeDensity}%</Label>
                                    <Slider
                                        id="maze-density"
                                        className="flex-1"
                                        min={5}
                                        max={50}
                                        step={5}
                                        value={[mazeDensity]}
                                        onValueChange={(value) => setMazeDensity(value[0])}
                                        disabled={isRunning || isAnimating}
                                    />
                                </div>
                            )}

                            <Button onClick={generateMaze} variant="outline" disabled={isRunning || isAnimating}>
                                Generate Maze
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
                <Button onClick={runAlgorithm} disabled={isRunning || isAnimating} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                    <FiPlay /> Run Algorithm
                </Button>
                <Button onClick={resetGrid} variant="outline" disabled={isRunning || isAnimating}>
                    Reset Grid
                </Button>
            </div>

            {/* Visualization grid */}
            <div className="overflow-auto pb-4">
                <div
                    className="grid gap-0 mx-auto border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, 24px)`,
                        width: `${cols * 24}px`
                    }}
                >
                    {grid.map((row, r) =>
                        row.map((cell, c) => (
                            <motion.div
                                key={`${r}-${c}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.001 * (r + c) }}
                                className={`w-6 h-6 border border-gray-200 dark:border-gray-800 transition-colors duration-200 ${getCellClass(r, c, cell)}`}
                                onClick={() => handleCellClick(r, c)}
                                onMouseEnter={(e) => handleMouseEnter(r, c, e)}
                            >
                                {(start[0] === r && start[1] === c) && <span className="flex h-full items-center justify-center text-xs">S</span>}
                                {(end[0] === r && end[1] === c) && <span className="flex h-full items-center justify-center text-xs">E</span>}
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 mr-2"></div>
                    <span>Start</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 mr-2"></div>
                    <span>End</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-800 mr-2"></div>
                    <span>Wall</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-200 mr-2"></div>
                    <span>Visited Cell</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-400 mr-2"></div>
                    <span>Path</span>
                </div>
            </div>

            {/* Algorithm metrics */}
            {path.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Path Length:</span> {path.length} cells
                        </div>
                        <div>
                            <span className="font-medium">Cells Visited:</span> {visitedCells.length} cells
                        </div>
                        <div>
                            <span className="font-medium">Search Efficiency:</span> {((path.length / Math.max(1, visitedCells.length)) * 100).toFixed(2)}%
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};