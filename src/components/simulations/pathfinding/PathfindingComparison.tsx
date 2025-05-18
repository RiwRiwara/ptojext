"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FiPlay, FiGrid, FiInfo, FiBarChart2 } from 'react-icons/fi';
import Link from 'next/link';
import { ComparisonGrid, AlgorithmResult } from '@/components/simulations/pathfinding/ComparisonGrid';
import { GridControls } from '@/components/simulations/pathfinding/GridControls';

// Import types from algorithms.ts
import { Cell, Grid, AlgorithmType } from '@/components/simulations/pathfinding/algorithms';

export const PathfindingComparison = () => {
  // Grid configuration
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(30);
  const [grid, setGrid] = useState<Grid>(() =>
    Array.from({ length: rows }, () => Array(cols).fill(0))
  );

  // Cell states
  const [start, setStart] = useState<Cell>([5, 5]);
  const [end, setEnd] = useState<Cell>([15, 25]);
  
  // Algorithms to compare
  const [algorithmLeft, setAlgorithmLeft] = useState<AlgorithmType>('astar');
  const [algorithmRight, setAlgorithmRight] = useState<AlgorithmType>('dijkstra');
  
  // UI states
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(10);
  const [allowDiagonal, setAllowDiagonal] = useState(false);
  const [showVisitedCells, setShowVisitedCells] = useState(true);
  const [mazeType, setMazeType] = useState<'random' | 'maze'>('random');
  const [mazeDensity, setMazeDensity] = useState(20);
  
  // Results
  const [leftResults, setLeftResults] = useState<AlgorithmResult | null>(null);
  const [rightResults, setRightResults] = useState<AlgorithmResult | null>(null);

  // Generate a random grid or maze
  const generateMaze = useCallback(() => {
    if (isRunning) return;

    // Reset results when generating a new maze
    setLeftResults(null);
    setRightResults(null);

    const newGrid = Array.from({ length: rows }, () => Array(cols).fill(0));

    if (mazeType === 'random') {
      // Random obstacles
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Avoid placing walls at start and end positions
          if ((r === start[0] && c === start[1]) || (r === end[0] && c === end[1])) {
            continue;
          }
          
          // Random obstacles based on density
          if (Math.random() < mazeDensity / 100) {
            newGrid[r][c] = 1;
          }
        }
      }
    } else {
      // Border walls for maze
      for (let r = 0; r < rows; r++) {
        newGrid[r][0] = 1;
        newGrid[r][cols - 1] = 1;
      }
      
      for (let c = 0; c < cols; c++) {
        newGrid[0][c] = 1;
        newGrid[rows - 1][c] = 1;
      }
      
      // Simple recursive division maze algorithm
      const recursiveDivision = (
        rowStart: number, 
        rowEnd: number, 
        colStart: number, 
        colEnd: number, 
        orientation: 'horizontal' | 'vertical'
      ) => {
        if (rowEnd - rowStart < 2 || colEnd - colStart < 2) return;

        if (orientation === 'horizontal') {
          const divisionRow = Math.floor(Math.random() * (rowEnd - rowStart - 1)) + rowStart + 1;
          const passageCol = Math.floor(Math.random() * (colEnd - colStart)) + colStart;

          for (let c = colStart; c <= colEnd; c++) {
            if (c !== passageCol) newGrid[divisionRow][c] = 1;
          }

          recursiveDivision(rowStart, divisionRow, colStart, colEnd, 'vertical');
          recursiveDivision(divisionRow, rowEnd, colStart, colEnd, 'vertical');
        } else {
          const divisionCol = Math.floor(Math.random() * (colEnd - colStart - 1)) + colStart + 1;
          const passageRow = Math.floor(Math.random() * (rowEnd - rowStart)) + rowStart;

          for (let r = rowStart; r <= rowEnd; r++) {
            if (r !== passageRow) newGrid[r][divisionCol] = 1;
          }

          recursiveDivision(rowStart, rowEnd, colStart, divisionCol, 'horizontal');
          recursiveDivision(rowStart, rowEnd, divisionCol, colEnd, 'horizontal');
        }
      };

      recursiveDivision(1, rows - 2, 1, cols - 2, Math.random() < 0.5 ? 'horizontal' : 'vertical');
    }

    // Ensure start and end positions are clear
    const clearArea = (row: number, col: number, radius: number): void => {
      for (let r = Math.max(0, row - radius); r <= Math.min(rows - 1, row + radius); r++) {
        for (let c = Math.max(0, col - radius); c <= Math.min(cols - 1, col + radius); c++) {
          newGrid[r][c] = 0;
        }
      }
    };

    clearArea(start[0], start[1], 1);
    clearArea(end[0], end[1], 1);

    setGrid(newGrid);
  }, [rows, cols, start, end, mazeType, mazeDensity, isRunning]);

  // Initialize grid
  useEffect(() => {
    generateMaze();
  }, []);

  // Handle grid cell click
  const handleCellClick = (row: number, col: number, tool: 'start' | 'end' | 'wall') => {
    if (isRunning) return;

    const newGrid = [...grid];

    if (tool === 'start') {
      // Set new start position
      setStart([row, col]);
    } else if (tool === 'end') {
      // Set new end position
      setEnd([row, col]);
    } else if (tool === 'wall') {
      // Toggle wall
      newGrid[row][col] = newGrid[row][col] === 1 ? 0 : 1;
      setGrid(newGrid);
    }

    // Reset results when grid changes
    setLeftResults(null);
    setRightResults(null);
  };

  // Get algorithm display name
  const getAlgorithmDisplayName = (algorithm: AlgorithmType): string => {
    switch (algorithm) {
      case 'astar': return 'A* Algorithm';
      case 'dijkstra': return 'Dijkstra\'s Algorithm';
      case 'bfs': return 'Breadth-First Search';
      case 'dfs': return 'Depth-First Search';
      case 'greedy': return 'Greedy Best-First Search';
      default: return algorithm;
    }
  };

  // Run comparison
  const runComparison = () => {
    if (isRunning) return;
    // Reset both result sets
    setLeftResults(null);
    setRightResults(null);
    
    // Start the algorithms
    setIsRunning(true);
  };
  
  // Handle completion of left grid
  const handleLeftComplete = (result: AlgorithmResult) => {
    console.log('Left algorithm completed');
    setLeftResults(result);
    if (rightResults) {
      setIsRunning(false);
    }
  };
  
  // Handle completion of right grid
  const handleRightComplete = (result: AlgorithmResult) => {
    console.log('Right algorithm completed');
    setRightResults(result);
    if (leftResults) {
      setIsRunning(false);
    }
  };

  // Get improvement percentage
  const getImprovementPercentage = (metric: 'pathLength' | 'visitedCells' | 'executionTime'): string => {
    if (!leftResults || !rightResults) return '';

    let leftValue = 0;
    let rightValue = 0;

    switch (metric) {
      case 'pathLength':
        leftValue = leftResults.path.length;
        rightValue = rightResults.path.length;
        break;
      case 'visitedCells':
        leftValue = leftResults.visitedInOrder.length;
        rightValue = rightResults.visitedInOrder.length;
        break;
      case 'executionTime':
        leftValue = leftResults.executionTime;
        rightValue = rightResults.executionTime;
        break;
    }

    if (leftValue === 0 || rightValue === 0) return '';

    const improvement = ((leftValue - rightValue) / leftValue) * 100;
    return improvement > 0 
      ? `${improvement.toFixed(1)}% better` 
      : `${Math.abs(improvement).toFixed(1)}% worse`;
  };

  return (
    <div className="space-y-6">
      {/* Algorithm selection and controls */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FiInfo className="mr-2" />
              Compare Pathfinding Algorithms
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select two different algorithms to compare their performance on the same grid.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <Link href="/simulations/pathfinding">
              <Button variant="outline" size="sm">
                Back to Single View
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Algorithm Selection */}
          <div>
            <Label htmlFor="algorithm-left">Left Algorithm</Label>
            <Select value={algorithmLeft} onValueChange={(val: AlgorithmType) => setAlgorithmLeft(val)}>
              <SelectTrigger id="algorithm-left" className="w-full">
                <SelectValue placeholder="Select Algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="astar">A* Algorithm</SelectItem>
                <SelectItem value="dijkstra">Dijkstra s Algorithm</SelectItem>
                <SelectItem value="bfs">Breadth-First Search</SelectItem>
                <SelectItem value="dfs">Depth-First Search</SelectItem>
                <SelectItem value="greedy">Greedy Best-First Search</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Right Algorithm Selection */}
          <div>
            <Label htmlFor="algorithm-right">Right Algorithm</Label>
            <Select value={algorithmRight} onValueChange={(val: AlgorithmType) => setAlgorithmRight(val)}>
              <SelectTrigger id="algorithm-right" className="w-full">
                <SelectValue placeholder="Select Algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="astar">A* Algorithm</SelectItem>
                <SelectItem value="dijkstra">Dijkstra s Algorithm</SelectItem>
                <SelectItem value="bfs">Breadth-First Search</SelectItem>
                <SelectItem value="dfs">Depth-First Search</SelectItem>
                <SelectItem value="greedy">Greedy Best-First Search</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Shared Controls */}
        <GridControls 
          rows={rows}
          cols={cols}
          setRows={setRows}
          setCols={setCols}
          allowDiagonal={allowDiagonal}
          setAllowDiagonal={setAllowDiagonal}
          showVisitedCells={showVisitedCells}
          setShowVisitedCells={setShowVisitedCells}
          animationSpeed={animationSpeed}
          setAnimationSpeed={setAnimationSpeed}
          mazeType={mazeType}
          setMazeType={setMazeType}
          mazeDensity={mazeDensity}
          setMazeDensity={setMazeDensity}
          generateMaze={generateMaze}
          isRunning={isRunning}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={runComparison} disabled={isRunning} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <FiPlay /> Run Comparison
        </Button>
        <Button onClick={generateMaze} variant="outline" disabled={isRunning}>
          Reset Grid
        </Button>
      </div>

      {/* Grid comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left grid */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{getAlgorithmDisplayName(algorithmLeft)}</CardTitle>
          </CardHeader>
          <CardContent>
            <ComparisonGrid 
              grid={grid}
              start={start}
              end={end}
              algorithm={algorithmLeft}
              rows={rows}
              cols={cols}
              allowDiagonal={allowDiagonal}
              showVisitedCells={showVisitedCells}
              animationSpeed={animationSpeed}
              isRunning={isRunning}
              onCellClick={(row, col) => handleCellClick(row, col, 'wall')}
              onComplete={handleLeftComplete}
              gridId="left"
            />
          </CardContent>
        </Card>

        {/* Right grid */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{getAlgorithmDisplayName(algorithmRight)}</CardTitle>
          </CardHeader>
          <CardContent>
            <ComparisonGrid 
              grid={grid}
              start={start}
              end={end}
              algorithm={algorithmRight}
              rows={rows}
              cols={cols}
              allowDiagonal={allowDiagonal}
              showVisitedCells={showVisitedCells}
              animationSpeed={animationSpeed}
              isRunning={isRunning}
              onCellClick={(row, col) => handleCellClick(row, col, 'wall')}
              onComplete={handleRightComplete}
              gridId="right"
            />
          </CardContent>
        </Card>
      </div>

      {/* Comparison Results */}
      {leftResults && rightResults && (
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FiBarChart2 className="mr-2" />
              Performance Comparison
            </CardTitle>
            <CardDescription>
              Comparing the performance of {getAlgorithmDisplayName(algorithmLeft)} vs {getAlgorithmDisplayName(algorithmRight)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="text-sm text-gray-500 dark:text-gray-400">Path Length</div>
                <div className="mt-1 flex justify-between items-baseline">
                  <div className="text-lg font-semibold">{leftResults.path.length} vs {rightResults.path.length}</div>
                  <div className="text-xs text-gray-500">{getImprovementPercentage('pathLength')}</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="text-sm text-gray-500 dark:text-gray-400">Cells Visited</div>
                <div className="mt-1 flex justify-between items-baseline">
                  <div className="text-lg font-semibold">{leftResults.visitedInOrder.length} vs {rightResults.visitedInOrder.length}</div>
                  <div className="text-xs text-gray-500">{getImprovementPercentage('visitedCells')}</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="text-sm text-gray-500 dark:text-gray-400">Execution Time</div>
                <div className="mt-1 flex justify-between items-baseline">
                  <div className="text-lg font-semibold">{leftResults.executionTime.toFixed(2)}ms vs {rightResults.executionTime.toFixed(2)}ms</div>
                  <div className="text-xs text-gray-500">{getImprovementPercentage('executionTime')}</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="text-sm text-gray-500 dark:text-gray-400">Search Efficiency</div>
                <div className="mt-1 flex justify-between items-baseline">
                  <div className="text-lg font-semibold">
                    {((leftResults.path.length / leftResults.visitedInOrder.length) * 100).toFixed(1)}% vs {((rightResults.path.length / rightResults.visitedInOrder.length) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm">
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Search Efficiency</span> represents how directly the algorithm found the path (path length ÷ cells visited).
                Higher percentages indicate more efficient pathfinding.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
