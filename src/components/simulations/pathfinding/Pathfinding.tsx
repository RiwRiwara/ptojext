"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Matter from "matter-js";
import { motion } from "framer-motion";
import { IoGrid } from "react-icons/io5";
import { HiLightningBolt } from "react-icons/hi";
import toast from "react-hot-toast";

// Import components
import ControlPanel from "./ControlPanel";
import GridComponent from "./GridComponent";
import AlgorithmInfo from "./AlgorithmInfo";

// Import types and constants
import { 
  Grid, 
  CellValue, 
  AlgorithmKey, 
  AlgorithmResult, 
  CellMode,
  EMPTY,
  WALL,
  START,
  END,
  VISITED,
  SHORTEST_PATH,
  WEIGHTED
} from "./types";

// Import algorithms
import { 
  ALGORITHMS, 
  delay, 
  bfs, 
  dfs, 
  dijkstra, 
  astar 
} from "./algorithms";

// Constants
const GRID_SIZES = [8, 12, 16, 20, 24];
const DEFAULT_GRID_SIZE = 16;
const DEFAULT_CELL_SIZE = 400 / DEFAULT_GRID_SIZE; // 400px grid

const Pathfinding: React.FC = () => {
  // Grid state
  const [grid, setGrid] = useState<Grid>(() => createGrid(DEFAULT_GRID_SIZE));
  const [gridSize, setGridSize] = useState<number>(DEFAULT_GRID_SIZE);
  const [cellSize, setCellSize] = useState<number>(DEFAULT_CELL_SIZE);
  
  // Algorithm state
  const [algorithm, setAlgorithm] = useState<AlgorithmKey>('bfs');
  const [running, setRunning] = useState<boolean>(false);
  const [found, setFound] = useState<boolean>(false);
  
  // Cell interaction state
  const [mode, setMode] = useState<CellMode>('wall');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [highlightedCell, setHighlightedCell] = useState<[number, number] | null>(null);
  const [weightValue, setWeightValue] = useState<number>(5);
  const [weights, setWeights] = useState<Record<string, number>>({});
  
  // Agent and animation state
  const [agentPath, setAgentPath] = useState<[number, number][]>([]);
  const [agentAnimating, setAgentAnimating] = useState<boolean>(false);
  const agentBodyRef = useRef<Matter.Body | null>(null);
  
  // Comparison mode state
  const [compareModeActive, setCompareModeActive] = useState<boolean>(false);
  const [algorithmResults, setAlgorithmResults] = useState<Record<string, AlgorithmResult>>({});
  const [comparingCells, setComparingCells] = useState<[number, number][]>([]);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<Record<AlgorithmKey, boolean>>({ 
    bfs: true, 
    dfs: true, 
    dijkstra: true, 
    astar: true 
  });
  
  // UI state
  const [showAlgorithmInfo, setShowAlgorithmInfo] = useState<boolean>(false);
  
  // Matter.js refs
  const engineRef = useRef<Matter.Engine | null>(null);
  const rendererRef = useRef<Matter.Render | null>(null);
  const worldRef = useRef<Matter.World | null>(null);
  
  // Helper function to create a new grid
  function createGrid(size: number): Grid {
    const grid: Grid = Array(size)
      .fill(null)
      .map(() => Array(size).fill(EMPTY));
    const quarter = Math.floor(size / 4);
    grid[quarter][quarter] = START;
    grid[size - quarter - 1][size - quarter - 1] = END;
    return grid;
  }
  
  // Clone grid helper
  function cloneGrid(grid: Grid): Grid {
    return grid.map(row => [...row]);
  }
  
  // Update cell size when grid size changes
  useEffect(() => {
    setCellSize(400 / gridSize);
  }, [gridSize]);
  
  // Set up Matter.js physics
  useEffect(() => {
    // Clean up previous engine
    if (engineRef.current) {
      Matter.Engine.clear(engineRef.current);
      engineRef.current = null;
    }
    
    if (rendererRef.current?.canvas) {
      Matter.Render.stop(rendererRef.current);
      rendererRef.current.canvas.remove();
      rendererRef.current = null;
    }
    
    // Create a new engine
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    worldRef.current = engine.world;
    
    // Set up the renderer
    const render = Matter.Render.create({
      element: document.getElementById('canvas-container') || undefined,
      engine: engine,
      options: {
        width: 400,
        height: 400,
        wireframes: false,
        background: 'transparent',
      }
    });
    rendererRef.current = render;
    
    // Add walls based on the grid
    const walls: Matter.Body[] = [];
    grid.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        if (cell === WALL) {
          const wall = Matter.Bodies.rectangle(
            colIdx * cellSize + cellSize / 2,
            rowIdx * cellSize + cellSize / 2,
            cellSize,
            cellSize,
            {
              isStatic: true,
              render: {
                fillStyle: '#1f2937',
              }
            }
          );
          walls.push(wall);
        }
      });
    });
    Matter.World.add(engine.world, walls);
    
    // Add boundaries
    const boundaryOptions = {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'transparent',
      }
    };
    
    const boundaries = [
      // Top
      Matter.Bodies.rectangle(200, -10, 420, 20, boundaryOptions),
      // Bottom
      Matter.Bodies.rectangle(200, 410, 420, 20, boundaryOptions),
      // Left
      Matter.Bodies.rectangle(-10, 200, 20, 420, boundaryOptions),
      // Right
      Matter.Bodies.rectangle(410, 200, 20, 420, boundaryOptions),
    ];
    
    Matter.World.add(engine.world, boundaries);
    
    // Run the engine and renderer
    Matter.Runner.run(engine);
    Matter.Render.run(render);
    
    // Cleanup function
    return () => {
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
        engineRef.current = null;
      }
      
      if (rendererRef.current?.canvas) {
        Matter.Render.stop(rendererRef.current);
        rendererRef.current.canvas.remove();
        rendererRef.current = null;
      }
    };
  }, [grid, cellSize]);
  
  // Handle grid resizing
  useEffect(() => {
    resetGrid();
  }, [gridSize]);
  
  // Helper function to remove agent from physics world
  const removeAgent = () => {
    if (agentBodyRef.current && worldRef.current) {
      Matter.World.remove(worldRef.current, agentBodyRef.current);
      agentBodyRef.current = null;
    }
  };

  // Reset grid function
  const resetGrid = () => {
    if (running) return;
    setGrid(createGrid(gridSize));
    setFound(false);
    setRunning(false);
    setAgentPath([]);
    setAgentAnimating(false);
    setAlgorithmResults({});
    removeAgent();
    setComparingCells([]);
    setHighlightedCell(null);
    setWeights({});
  };
  
  // Generate random walls
  const randomWalls = () => {
    if (running) return;
    
    const newGrid = createGrid(gridSize);
    const wallPercentage = 0.25; // 25% of cells will be walls
    
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Don't place walls on start or end
        if (newGrid[r][c] === START || newGrid[r][c] === END) continue;
        
        if (Math.random() < wallPercentage) {
          newGrid[r][c] = WALL;
        }
      }
    }
    
    setGrid(newGrid);
    setFound(false);
    setAgentPath([]);
    setAgentAnimating(false);
  };
  
  // Find path using the selected algorithm
  const findPath = async () => {
    if (running) return;
    
    // Find start and end positions
    let startCoords: [number, number] | null = null;
    let endCoords: [number, number] | null = null;
    
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c] === START) startCoords = [r, c];
        if (grid[r][c] === END) endCoords = [r, c];
      }
    }
    
    if (!startCoords || !endCoords) {
      toast.error("Please place both start and end points on the grid");
      return;
    }
    
    // Clear any previous path
    const newGrid = cloneGrid(grid);
    for (let r = 0; r < newGrid.length; r++) {
      for (let c = 0; c < newGrid[0].length; c++) {
        if (newGrid[r][c] === VISITED || newGrid[r][c] === SHORTEST_PATH) {
          newGrid[r][c] = EMPTY;
        }
      }
    }
    setGrid(newGrid);
    setAgentPath([]);
    
    // Set cell as visited
    const setGridVisited = (r: number, c: number) => {
      setGrid(prevGrid => {
        const newGrid = cloneGrid(prevGrid);
        if (newGrid[r][c] !== START && newGrid[r][c] !== END) {
          newGrid[r][c] = VISITED;
        }
        return newGrid;
      });
    };
    
    // Run the selected algorithm
    setRunning(true);
    setFound(false);
    let path: [number, number][] = [];
    
    try {
      if (algorithm === 'bfs') {
        path = await bfs(newGrid, startCoords, endCoords, weights, setGridVisited, true);
      } else if (algorithm === 'dfs') {
        path = await dfs(newGrid, startCoords, endCoords, weights, setGridVisited, true);
      } else if (algorithm === 'dijkstra') {
        path = await dijkstra(newGrid, startCoords, endCoords, weights, setGridVisited, true);
      } else if (algorithm === 'astar') {
        path = await astar(newGrid, startCoords, endCoords, weights, setGridVisited, true);
      }
      
      if (path.length > 0) {
        // Visualize the path
        setFound(true);
        
        // Animate the path
        const pathGrid = cloneGrid(grid);
        for (const [r, c] of path) {
          if (pathGrid[r][c] !== START && pathGrid[r][c] !== END) {
            await delay(30);
            pathGrid[r][c] = SHORTEST_PATH;
            setGrid(cloneGrid(pathGrid));
          }
        }
        
        // Store path for agent animation
        setAgentPath(path);
        
        // Animate agent movement
        if (path.length > 1 && worldRef.current) {
          setAgentAnimating(true);
          
          // Remove any existing agent
          if (agentBodyRef.current) {
            Matter.World.remove(worldRef.current, agentBodyRef.current);
          }
          
          // Create a new agent at the start position
          const [startR, startC] = path[0];
          const agent = Matter.Bodies.circle(
            startC * cellSize + cellSize / 2,
            startR * cellSize + cellSize / 2,
            cellSize * 0.3,
            {
              isStatic: false,
              frictionAir: 0.2,
              render: {
                fillStyle: '#2563eb',
                strokeStyle: '#1e40af',
                lineWidth: 2,
              },
            }
          );
          agentBodyRef.current = agent;
          Matter.World.add(worldRef.current, agent);
          
          // Move agent along the path
          for (let i = 1; i < path.length; i++) {
            if (!agentBodyRef.current) break;
            
            const [r, c] = path[i];
            const targetX = c * cellSize + cellSize / 2;
            const targetY = r * cellSize + cellSize / 2;
            
            // Calculate vector to target
            const currentPos = agentBodyRef.current.position;
            const force = {
              x: (targetX - currentPos.x) * 0.001,
              y: (targetY - currentPos.y) * 0.001,
            };
            
            // Apply force to move towards target
            Matter.Body.applyForce(agentBodyRef.current, currentPos, force);
            
            // Wait until agent is close to target
            await new Promise<void>(resolve => {
              const checkPosition = () => {
                if (!agentBodyRef.current) {
                  resolve();
                  return;
                }
                
                const pos = agentBodyRef.current.position;
                const distance = Math.sqrt(
                  Math.pow(pos.x - targetX, 2) + Math.pow(pos.y - targetY, 2)
                );
                
                if (distance < cellSize * 0.5) {
                  resolve();
                } else {
                  requestAnimationFrame(checkPosition);
                }
              };
              checkPosition();
            });
          }
          
          setAgentAnimating(false);
        }
      } else {
        toast.error("No path found!");
      }
    } catch (error) {
      console.error("Error in pathfinding:", error);
      toast.error("An error occurred during pathfinding");
    } finally {
      setRunning(false);
    }
  };
  
  // Run comparison mode
  const runComparisonMode = async () => {
    if (running) return;
    
    // Find start and end positions
    let startCoords: [number, number] | null = null;
    let endCoords: [number, number] | null = null;
    
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c] === START) startCoords = [r, c];
        if (grid[r][c] === END) endCoords = [r, c];
      }
    }
    
    if (!startCoords || !endCoords) {
      toast.error("Please place both start and end points on the grid");
      return;
    }
    
    // Clear any previous path
    const newGrid = cloneGrid(grid);
    for (let r = 0; r < newGrid.length; r++) {
      for (let c = 0; c < newGrid[0].length; c++) {
        if (newGrid[r][c] === VISITED || newGrid[r][c] === SHORTEST_PATH) {
          newGrid[r][c] = EMPTY;
        }
      }
    }
    setGrid(newGrid);
    setAgentPath([]);
    
    // Reset results
    setAlgorithmResults({});
    
    // Run each algorithm and time it
    setRunning(true);
    
    for (const algo of ALGORITHMS.filter(a => selectedAlgorithms[a.key])) {
      // Function to track visited cells without updating UI
      const visitedCells: [number, number][] = [];
      const trackVisited = (r: number, c: number) => {
        visitedCells.push([r, c]);
      };
      
      const startTime = performance.now();
      let path: [number, number][] = [];
      
      try {
        if (algo.key === 'bfs') {
          path = await bfs(newGrid, startCoords, endCoords, weights, trackVisited, true, 0);
        } else if (algo.key === 'dfs') {
          path = await dfs(newGrid, startCoords, endCoords, weights, trackVisited, true, 0);
        } else if (algo.key === 'dijkstra') {
          path = await dijkstra(newGrid, startCoords, endCoords, weights, trackVisited, true, 0);
        } else if (algo.key === 'astar') {
          path = await astar(newGrid, startCoords, endCoords, weights, trackVisited, true, 0);
        }
        
        const endTime = performance.now();
        const timeMs = endTime - startTime;
        
        setAlgorithmResults(prev => ({
          ...prev,
          [algo.key]: {
            path,
            visited: visitedCells,
            timeMs,
          },
        }));
      } catch (error) {
        console.error(`Error in ${algo.key}:`, error);
      }
    }
    
    setRunning(false);
    setFound(true);
    
    // Display results
    const results = Object.entries(algorithmResults).map(([key, result]) => ({
      algorithm: key,
      pathLength: result.path.length,
      visitedCount: result.visited.length,
      timeMs: result.timeMs,
    }));
    
    if (results.length > 0) {
      // Sort by path length (optimal path first)
      results.sort((a, b) => a.pathLength - b.pathLength);
      const fastestAlgo = results.reduce((a, b) => (a.timeMs < b.timeMs ? a : b));
      const mostEfficientAlgo = results.reduce((a, b) => (a.visitedCount < b.visitedCount ? a : b));
      
      toast.success(
        <div>
          <p className="font-bold">Results:</p>
          <p>Shortest path: {results[0].algorithm.toUpperCase()} ({results[0].pathLength} cells)</p>
          <p>Fastest: {fastestAlgo.algorithm.toUpperCase()} ({fastestAlgo.timeMs.toFixed(2)}ms)</p>
          <p>Most efficient: {mostEfficientAlgo.algorithm.toUpperCase()} ({mostEfficientAlgo.visitedCount} cells visited)</p>
        </div>,
        { duration: 5000 }
      );
    }
  };
  
  // Handle cell click
  const handleCellClick = (rowIdx: number, colIdx: number, isDragging: boolean = false) => {
    if (running) return;
    const newGrid = cloneGrid(grid);
    const currentCell = newGrid[rowIdx][colIdx];
    
    // Handle different modes
    if (mode === 'wall') {
      // Toggle wall
      if (currentCell === WALL) {
        newGrid[rowIdx][colIdx] = EMPTY;
      } else if (currentCell === EMPTY || currentCell === VISITED || currentCell === SHORTEST_PATH) {
        newGrid[rowIdx][colIdx] = WALL;
      }
    } else if (mode === 'weight' && !isDragging) {
      // Set weighted cell
      if (currentCell === WEIGHTED) {
        newGrid[rowIdx][colIdx] = EMPTY;
        setWeights(prev => {
          const newWeights = { ...prev };
          delete newWeights[`${rowIdx},${colIdx}`];
          return newWeights;
        });
      } else if (currentCell === EMPTY || currentCell === VISITED || currentCell === SHORTEST_PATH) {
        newGrid[rowIdx][colIdx] = WEIGHTED;
        setWeights(prev => ({
          ...prev,
          [`${rowIdx},${colIdx}`]: weightValue,
        }));
      }
    } else if (mode === 'start' && !isDragging) {
      // Set new start point
      // Remove old start first
      for (let r = 0; r < newGrid.length; r++) {
        for (let c = 0; c < newGrid[0].length; c++) {
          if (newGrid[r][c] === START) {
            newGrid[r][c] = EMPTY;
          }
        }
      }
      
      // Set new start if not on END
      if (currentCell !== END) {
        newGrid[rowIdx][colIdx] = START;
      }
    } else if (mode === 'end' && !isDragging) {
      // Set new end point
      // Remove old end first
      for (let r = 0; r < newGrid.length; r++) {
        for (let c = 0; c < newGrid[0].length; c++) {
          if (newGrid[r][c] === END) {
            newGrid[r][c] = EMPTY;
          }
        }
      }
      
      // Set new end if not on START
      if (currentCell !== START) {
        newGrid[rowIdx][colIdx] = END;
      }
    }
    
    setGrid(newGrid);
    setFound(false);
    setAgentAnimating(false);
    
    // Update physics world if adding/removing wall
    if (mode === 'wall' && worldRef.current) {
      const world = worldRef.current;
      
      // Remove all existing walls
      const walls = world.bodies.filter((body) => {
        const isWall = body.label === 'Rectangle Body' && body.isStatic;
        return isWall && body.position.x >= 0 && body.position.x <= 400 && body.position.y >= 0 && body.position.y <= 400;
      });
      
      Matter.World.remove(world, walls);
      
      // Add all walls based on updated grid
      const newWalls: Matter.Body[] = [];
      newGrid.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell === WALL) {
            const wall = Matter.Bodies.rectangle(
              c * cellSize + cellSize / 2,
              r * cellSize + cellSize / 2,
              cellSize,
              cellSize,
              {
                isStatic: true,
                render: {
                  fillStyle: '#1f2937',
                }
              }
            );
            newWalls.push(wall);
          }
        });
      });
      
      Matter.World.add(world, newWalls);
    }
  };
  
  // Track mouse hover
  const handleMouseEnter = (rowIdx: number, colIdx: number) => {
    setHighlightedCell([rowIdx, colIdx]);
    
    if (isDragging && mode === 'wall') {
      handleCellClick(rowIdx, colIdx, true);
    }
    
    // In comparison mode, show path for algorithm on hover
    if (compareModeActive && !running && Object.keys(algorithmResults).length > 0) {
      const result = algorithmResults[algorithm];
      if (result?.path) {
        setComparingCells(result.path);
      }
    }
  };
  
  // Component to render the grid
  const GridComponentMemo = useMemo(() => {
    return (
      <GridComponent
        grid={grid}
        cellSize={cellSize}
        handleCellClick={handleCellClick}
        setIsDragging={setIsDragging}
        isDragging={isDragging}
        highlightedCell={highlightedCell}
        comparingCells={comparingCells}
        weights={weights}
        world={worldRef.current}
        agentPath={agentPath}
        agentBodyRef={agentBodyRef}
        agentAnimating={agentAnimating}
      />
    );
  }, [grid, cellSize, highlightedCell, isDragging, comparingCells, weights, agentPath, agentAnimating]);
  
  return (
    <div className="flex flex-col items-center rounded-2xl shadow-xl bg-white/95 px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-extrabold mb-2 text-primary-800 text-center">Pathfinding Algorithms Playground</h1>
      <p className="mb-5 text-gray-600 text-center text-lg">
        Visualize and compare popular pathfinding algorithms. Place walls, set start/end, then watch the agent find a path!
      </p>

      {/* Controls */}
      <ControlPanel
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        mode={mode}
        setMode={setMode}
        weightValue={weightValue}
        setWeightValue={setWeightValue}
        algorithms={ALGORITHMS}
        running={running}
        gridSize={gridSize}
        setGridSize={setGridSize}
        gridSizes={GRID_SIZES}
        findPath={findPath}
        resetGrid={resetGrid}
        randomWalls={randomWalls}
        compareModeActive={compareModeActive}
        setCompareModeActive={setCompareModeActive}
        runComparisonMode={runComparisonMode}
        algorithmResults={algorithmResults}
        selectedAlgorithms={selectedAlgorithms}
        setSelectedAlgorithms={setSelectedAlgorithms}
      />

      {/* Algorithm info */}
      <AlgorithmInfo
        algorithm={algorithm}
        algorithms={ALGORITHMS}
        showAlgorithmInfo={showAlgorithmInfo}
        setShowAlgorithmInfo={setShowAlgorithmInfo}
      />

      {/* Grid display */}
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <div className="py-2 px-4 bg-slate-50 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <IoGrid className="text-slate-500" />
              <span className="font-medium text-sm text-slate-700">Grid Visualization</span>
            </div>
            <span className="inline-flex items-center border border-slate-300 px-2.5 py-0.5 rounded-full text-xs font-medium text-slate-600">
              {gridSize}×{gridSize}
            </span>
          </div>
        </div>
        <div id="canvas-container" className="p-4 bg-white">
          {GridComponentMemo}
        </div>
      </div>

      {/* Status display */}
      <div className="w-full flex flex-col items-center mt-4">
        {found && !running &&
          <span className="inline-flex items-center bg-emerald-100 text-emerald-800 text-sm py-1 px-3 rounded-full">
            <HiLightningBolt className="mr-1" /> Path found!
          </span>
        }
        {running &&
          <span className="inline-flex items-center bg-slate-100 text-slate-800 text-sm py-1 px-3 rounded-full animate-pulse">
            Finding path...
          </span>
        }
        {!found && !running &&
          <div className="text-slate-600 text-sm">
            Try to find a path from <span className="font-semibold text-emerald-600">start</span> to <span className="font-semibold text-rose-600">end</span>.
          </div>
        }
      </div>

      {/* Comparison results */}
      {compareModeActive && Object.keys(algorithmResults).length > 0 && (
        <div className="mt-6 w-full">
          <h3 className="font-semibold text-lg mb-2">Comparison Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(algorithmResults).map(([key, result]) => {
              const algoInfo = ALGORITHMS.find(a => a.key === key);
              return (
                <div key={key} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow transition-shadow duration-200">
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center">
                    <div className="mr-2">{algoInfo?.icon}</div>
                    <div className="font-medium text-gray-800">{algoInfo?.label}</div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded p-3 text-center">
                        <div className="text-xs text-gray-500 mb-1">Path Length</div>
                        <div className="text-lg font-semibold text-primary-600">{result.path.length}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3 text-center">
                        <div className="text-xs text-gray-500 mb-1">Cells Visited</div>
                        <div className="text-lg font-semibold text-amber-600">{result.visited.length}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3 text-center col-span-2">
                        <div className="text-xs text-gray-500 mb-1">Execution Time</div>
                        <div className="text-lg font-semibold text-emerald-600">{result.timeMs.toFixed(2)} ms</div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      <div className="flex justify-between items-center">
                        <span>Complexity:</span>
                        <span className="font-medium text-gray-700">{algoInfo?.complexity}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span>Optimal Path:</span>
                        <span className="font-medium text-gray-700">{algoInfo?.optimalPath}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pathfinding;
