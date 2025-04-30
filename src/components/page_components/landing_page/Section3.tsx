"use client";
import { motion, AnimationControls } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { FiRefreshCw, FiInfo } from "react-icons/fi";
import { Tooltip } from "react-tooltip";

class PriorityQueue<T> {
  private items: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number) {
    this.compare = compare;
  }

  push(item: T) {
    this.items.push(item);
    this.items.sort(this.compare);
  }

  pop(): T | undefined {
    return this.items.shift();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  clear() {
    this.items = [];
  }

  some(predicate: (item: T) => boolean): boolean {
    return this.items.some(predicate);
  }
}

interface Section3Props {
  controls: AnimationControls;
}

export default function Section3({ controls }: Section3Props) {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const aStarCanvasRef = useRef<HTMLDivElement>(null);
  const dijkstraCanvasRef = useRef<HTMLDivElement>(null);
  const [speed, setSpeed] = useState<number>(40);
  const [wallDensity, setWallDensity] = useState<number>(30);
  const [cellSizeValue, setCellSizeValue] = useState<number>(20);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [algorithmStats, setAlgorithmStats] = useState({
    aStar: { pathLength: 0, nodesVisited: 0, executionTime: 0 },
    dijkstra: { pathLength: 0, nodesVisited: 0, executionTime: 0 },
  });
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const cols = 20;
  const rows = 20;
  const cellSize = cellSizeValue;
  const start = { x: 0, y: 0 };
  const end = { x: cols - 1, y: rows - 1 };

  const isPathPossible = (grid: number[][]) => {
    // Check if a path exists using BFS
    const queue: { x: number; y: number }[] = [{ ...start }];
    const visited = new Set<string>();
    visited.add(`${start.x},${start.y}`);

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.x === end.x && current.y === end.y) {
        return true; // Path found
      }

      const neighbors = [
        { x: current.x + 1, y: current.y },
        { x: current.x - 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x, y: current.y - 1 }
      ];

      for (const neighbor of neighbors) {
        const key = `${neighbor.x},${neighbor.y}`;
        if (
          neighbor.x >= 0 &&
          neighbor.x < cols &&
          neighbor.y >= 0 &&
          neighbor.y < rows &&
          grid[neighbor.y][neighbor.x] === 0 &&
          !visited.has(key)
        ) {
          visited.add(key);
          queue.push(neighbor);
        }
      }
    }

    return false; // No path found
  };

  const generateGrid = () => {
    let grid: number[][];
    let pathExists = false;

    // Keep generating grids until we find one with a valid path
    do {
      grid = Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(0));

      // Generate walls randomly based on wall density
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if ((i === start.y && j === start.x) || (i === end.y && j === end.x)) continue;
          if (Math.random() < wallDensity / 100) grid[i][j] = 1;
        }
      }

      pathExists = isPathPossible(grid);
    } while (!pathExists);

    return grid;
  };

  const setupAStar = useCallback(
    (container: HTMLDivElement) => {
      const app = new PIXI.Application({
        width: cols * cellSize,
        height: rows * cellSize,
        backgroundColor: 0xedf2f7,
      });
      container.appendChild(app.view as HTMLCanvasElement);

      const grid = generateGrid();
      const openSet = new PriorityQueue<{ x: number; y: number; f: number }>(
        (a, b) => a.f - b.f
      );
      const closedSet: Set<string> = new Set();
      const cameFrom: Map<string, { x: number; y: number }> = new Map();
      const gScore: Map<string, number> = new Map();
      const fScore: Map<string, number> = new Map();
      let path: { x: number; y: number }[] = [];
      let finished = false;
      let nodesVisited = 0;
      let animationFrameId: number;

      const cells: PIXI.Graphics[][] = Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(null));
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const cell = new PIXI.Graphics();
          cell.beginFill(0xfcfcfc);
          cell.drawRect(0, 0, cellSize, cellSize);
          cell.endFill();
          cell.lineStyle(1, 0xe2e8f0);
          cell.drawRect(0, 0, cellSize, cellSize);
          cell.position.set(j * cellSize, i * cellSize);
          app.stage.addChild(cell);
          cells[i][j] = cell;
        }
      }

      const statsContainer = new PIXI.Container();
      const statsBackground = new PIXI.Graphics();
      statsBackground.beginFill(0x000000, 0.5);
      statsBackground.drawRect(0, 0, 120, 20);
      statsBackground.endFill();
      statsContainer.addChild(statsBackground);

      const statsText = new PIXI.Text(`Nodes Visited: ${nodesVisited}`, {
        fontFamily: "Arial",
        fontSize: 14,
        fill: 0xffffff,
        stroke: 0x000000,
        strokeThickness: 2,
      });
      statsText.position.set(5, 2);
      statsContainer.addChild(statsText);
      statsContainer.position.set(5, app.screen.height - 25);
      app.stage.addChild(statsContainer);

      const heuristic = (a: { x: number; y: number }, b: { x: number; y: number }) => {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
      };

      let startTime = 0;

      const initialize = () => {
        openSet.clear();
        closedSet.clear();
        cameFrom.clear();
        gScore.clear();
        fScore.clear();
        path = [];
        finished = false;
        nodesVisited = 0;
        startTime = performance.now();

        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            gScore.set(`${j},${i}`, Infinity);
            fScore.set(`${j},${i}`, Infinity);
            cells[i][j].clear();
            cells[i][j].beginFill(0xfcfcfc);
            cells[i][j].drawRect(0, 0, cellSize, cellSize);
            cells[i][j].endFill();
            cells[i][j].lineStyle(1, 0xe2e8f0);
            cells[i][j].drawRect(0, 0, cellSize, cellSize);
            cells[i][j].alpha = 1;
          }
        }

        gScore.set(`${start.x},${start.y}`, 0);
        fScore.set(`${start.x},${start.y}`, heuristic(start, end));
        openSet.push({ x: start.x, y: start.y, f: fScore.get(`${start.x},${start.y}`)! });

        cells[start.y][start.x].tint = 0x68d391;
        cells[end.y][end.x].tint = 0xf687b3;
        statsText.text = `Nodes Visited: ${nodesVisited}`;
      };

      const draw = () => {
        if (finished || openSet.isEmpty()) {
          path.forEach(({ x, y }, index) => {
            setTimeout(() => {
              cells[y][x].tint = 0x4c51bf;
              cells[y][x].alpha = 0;
              PIXI.Ticker.shared.addOnce(() => {
                gsap.to(cells[y][x], { alpha: 1, duration: 0.2 });
              });
            }, index * 50);
          });

          setTimeout(() => {
            initialize();
            animationFrameId = requestAnimationFrame(draw);
          }, 2000);
          return;
        }

        const current = openSet.pop();
        if (!current) return;

        nodesVisited++;
        const { x, y } = current;
        closedSet.add(`${x},${y}`);

        if (x === end.x && y === end.y) {
          finished = true;
          path = reconstructPath(cameFrom, current);
        } else {
          const neighbors = [
            { x: x + 1, y },
            { x: x - 1, y },
            { x, y: y + 1 },
            { x, y: y - 1 },
          ];

          for (const neighbor of neighbors) {
            if (
              neighbor.x < 0 ||
              neighbor.x >= cols ||
              neighbor.y < 0 ||
              neighbor.y >= rows ||
              grid[neighbor.y][neighbor.x] === 1 ||
              closedSet.has(`${neighbor.x},${neighbor.y}`)
            ) {
              continue;
            }

            const tentativeGScore = gScore.get(`${x},${y}`)! + 1;
            if (tentativeGScore < gScore.get(`${neighbor.x},${neighbor.y}`)!) {
              cameFrom.set(`${neighbor.x},${neighbor.y}`, { x, y });
              gScore.set(`${neighbor.x},${neighbor.y}`, tentativeGScore);
              fScore.set(
                `${neighbor.x},${neighbor.y}`,
                tentativeGScore + heuristic(neighbor, end)
              );
              openSet.push({
                x: neighbor.x,
                y: neighbor.y,
                f: fScore.get(`${neighbor.x},${neighbor.y}`)!,
              });
            }
          }
        }

        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            const cell = cells[i][j];
            let targetColor: number;
            if (grid[i][j] === 1) targetColor = 0x2d3748;
            else if (i === start.y && j === start.x) targetColor = 0x68d391;
            else if (i === end.y && j === end.x) targetColor = 0xf687b3;
            else if (closedSet.has(`${j},${i}`)) targetColor = 0xbee3f8;
            else if (openSet.some((node) => node.x === j && node.y === i))
              targetColor = 0xb794f4;
            else targetColor = 0xedf2f7;

            if (cell.tint !== targetColor) {
              cell.alpha = 0;
              cell.tint = targetColor;
              PIXI.Ticker.shared.addOnce(() => {
                gsap.to(cell, { alpha: 1, duration: 0.3 });
              });
            }
          }
        }

        statsText.text = `Nodes Visited: ${nodesVisited}`;

        setTimeout(() => {
          animationFrameId = requestAnimationFrame(draw);
        }, speed);
      };

      const reconstructPath = (
        cameFrom: Map<string, { x: number; y: number }>,
        current: { x: number; y: number }
      ) => {
        const path = [current];
        let currentKey = `${current.x},${current.y}`;
        while (cameFrom.has(currentKey)) {
          const next = cameFrom.get(currentKey)!;
          path.push(next);
          currentKey = `${next.x},${next.y}`;
        }
        return path.reverse();
      };

      initialize();
      animationFrameId = requestAnimationFrame(draw);

      return () => {
        cancelAnimationFrame(animationFrameId);
        app.destroy(true);
      };
    },
    [speed, cols, rows, cellSize, start, end]
  );

  const setupDijkstra = useCallback(
    (container: HTMLDivElement) => {
      const app = new PIXI.Application({
        width: cols * cellSize,
        height: rows * cellSize,
        backgroundColor: 0xedf2f7,
      });
      container.appendChild(app.view as HTMLCanvasElement);

      const grid = generateGrid();
      const openSet = new PriorityQueue<{ x: number; y: number; dist: number }>(
        (a, b) => a.dist - b.dist
      );
      const closedSet: Set<string> = new Set();
      const cameFrom: Map<string, { x: number; y: number }> = new Map();
      const dist: Map<string, number> = new Map();
      let path: { x: number; y: number }[] = [];
      let finished = false;
      let nodesVisited = 0;
      let animationFrameId: number;

      const cells: PIXI.Graphics[][] = Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(null));
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const cell = new PIXI.Graphics();
          cell.beginFill(0xfcfcfc);
          cell.drawRect(0, 0, cellSize, cellSize);
          cell.endFill();
          cell.lineStyle(1, 0xe2e8f0);
          cell.drawRect(0, 0, cellSize, cellSize);
          cell.position.set(j * cellSize, i * cellSize);
          app.stage.addChild(cell);
          cells[i][j] = cell;
        }
      }

      const statsContainer = new PIXI.Container();
      const statsBackground = new PIXI.Graphics();
      statsBackground.beginFill(0x000000, 0.5);
      statsBackground.drawRect(0, 0, 120, 20);
      statsBackground.endFill();
      statsContainer.addChild(statsBackground);

      const statsText = new PIXI.Text(`Nodes Visited: ${nodesVisited}`, {
        fontFamily: "Arial",
        fontSize: 14,
        fill: 0xffffff,
        stroke: 0x000000,
        strokeThickness: 2,
      });
      statsText.position.set(5, 2);
      statsContainer.addChild(statsText);
      statsContainer.position.set(5, app.screen.height - 25);
      app.stage.addChild(statsContainer);

      const initialize = () => {
        openSet.clear();
        closedSet.clear();
        cameFrom.clear();
        dist.clear();
        path = [];
        finished = false;
        nodesVisited = 0;

        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            dist.set(`${j},${i}`, Infinity);
            cells[i][j].clear();
            cells[i][j].beginFill(0xfcfcfc);
            cells[i][j].drawRect(0, 0, cellSize, cellSize);
            cells[i][j].endFill();
            cells[i][j].lineStyle(1, 0xe2e8f0);
            cells[i][j].drawRect(0, 0, cellSize, cellSize);
            cells[i][j].alpha = 1;
          }
        }

        dist.set(`${start.x},${start.y}`, 0);
        openSet.push({ x: start.x, y: start.y, dist: 0 });

        cells[start.y][start.x].tint = 0x68d391;
        cells[end.y][end.x].tint = 0xf687b3;
        statsText.text = `Nodes Visited: ${nodesVisited}`;
      };

      const draw = () => {
        if (finished || openSet.isEmpty()) {
          path.forEach(({ x, y }, index) => {
            setTimeout(() => {
              cells[y][x].tint = 0x4c51bf;
              cells[y][x].alpha = 0;
              PIXI.Ticker.shared.addOnce(() => {
                gsap.to(cells[y][x], { alpha: 1, duration: 0.2 });
              });
            }, index * 50);
          });

          setTimeout(() => {
            initialize();
            animationFrameId = requestAnimationFrame(draw);
          }, 2000);
          return;
        }

        const current = openSet.pop();
        if (!current) return;

        nodesVisited++;
        const { x, y } = current;
        closedSet.add(`${x},${y}`);

        if (x === end.x && y === end.y) {
          finished = true;
          path = reconstructPath(cameFrom, current);
        } else {
          const neighbors = [
            { x: x + 1, y },
            { x: x - 1, y },
            { x, y: y + 1 },
            { x, y: y - 1 },
          ];

          for (const neighbor of neighbors) {
            if (
              neighbor.x < 0 ||
              neighbor.x >= cols ||
              neighbor.y < 0 ||
              neighbor.y >= rows ||
              grid[neighbor.y][neighbor.x] === 1 ||
              closedSet.has(`${neighbor.x},${neighbor.y}`)
            ) {
              continue;
            }

            const tentativeDist = dist.get(`${x},${y}`)! + 1;
            if (tentativeDist < dist.get(`${neighbor.x},${neighbor.y}`)!) {
              cameFrom.set(`${neighbor.x},${neighbor.y}`, { x, y });
              dist.set(`${neighbor.x},${neighbor.y}`, tentativeDist);
              openSet.push({
                x: neighbor.x,
                y: neighbor.y,
                dist: tentativeDist,
              });
            }
          }
        }

        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            const cell = cells[i][j];
            let targetColor: number;
            if (grid[i][j] === 1) targetColor = 0x2d3748;
            else if (i === start.y && j === start.x) targetColor = 0x68d391;
            else if (i === end.y && j === end.x) targetColor = 0xf687b3;
            else if (closedSet.has(`${j},${i}`)) targetColor = 0xbee3f8;
            else if (openSet.some((node) => node.x === j && node.y === i))
              targetColor = 0xb794f4;
            else targetColor = 0xedf2f7;

            if (cell.tint !== targetColor) {
              cell.alpha = 0;
              cell.tint = targetColor;
              PIXI.Ticker.shared.addOnce(() => {
                gsap.to(cell, { alpha: 1, duration: 0.3 });
              });
            }
          }
        }

        statsText.text = `Nodes Visited: ${nodesVisited}`;

        setTimeout(() => {
          animationFrameId = requestAnimationFrame(draw);
        }, speed);
      };

      const reconstructPath = (
        cameFrom: Map<string, { x: number; y: number }>,
        current: { x: number; y: number }
      ) => {
        const path = [current];
        let currentKey = `${current.x},${current.y}`;
        while (cameFrom.has(currentKey)) {
          const next = cameFrom.get(currentKey)!;
          path.push(next);
          currentKey = `${next.x},${next.y}`;
        }
        return path.reverse();
      };

      initialize();
      animationFrameId = requestAnimationFrame(draw);

      return () => {
        cancelAnimationFrame(animationFrameId);
        app.destroy(true);
      };
    },
    [speed, cols, rows, cellSize, start, end]
  );

  useEffect(() => {
    const aStarContainer = aStarCanvasRef.current!;
    const dijkstraContainer = dijkstraCanvasRef.current!;

    // Clean existing canvases
    while (aStarContainer.firstChild) {
      aStarContainer.removeChild(aStarContainer.firstChild);
    }
    while (dijkstraContainer.firstChild) {
      dijkstraContainer.removeChild(dijkstraContainer.firstChild);
    }

    const aStarCleanup = setupAStar(aStarContainer);
    const dijkstraCleanup = setupDijkstra(dijkstraContainer);

    return () => {
      aStarCleanup();
      dijkstraCleanup();
    };
  }, [setupAStar, setupDijkstra, speed, refreshTrigger, cellSizeValue]);

  return (
    <section className="flex flex-col items-center justify-center py-16 px-4 md:mt-28 ">
      <motion.div
        className="text-center mb-8"
        initial="hidden"
        animate={controls}
        variants={fadeInVariants}
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#83AFC9] to-blue-900 mb-4"
        >
          Pathfinder Versus: A* vs. Dijkstra
        </motion.h1>
        <p className="text-md md:text-lg text-gray-600 max-w-3xl mx-auto font-medium">
          Visualize and compare these two popular pathfinding algorithms in real-time.
          Watch how they explore the grid differently to find the optimal path.
        </p>
      </motion.div>



      <motion.div
        className="w-full max-w-6xl p-6 bg-white rounded-xl shadow-lg flex flex-col gap-8"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Visualization Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg mb-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Animation Speed</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="10"
                max="200"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-xs text-gray-500 w-12 text-right">{speed}ms</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Wall Density</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="10"
                max="40"
                value={wallDensity}
                onChange={(e) => setWallDensity(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-xs text-gray-500 w-12 text-right">{wallDensity}%</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Cell Size</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="15"
                max="25"
                value={cellSizeValue}
                onChange={(e) => setCellSizeValue(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-xs text-gray-500 w-12 text-right">{cellSizeValue}px</span>
            </div>
          </div>
        </div>

        {/* New Grid Button */}
        <div className="flex justify-center mb-2">
          <button
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <FiRefreshCw className="animate-spin-slow" />
            Generate New Grid
          </button>
        </div>

        {/* Visualization Grids */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-3">
              <h3 className="text-xl font-semibold text-indigo-700 tracking-tight">
                A* Algorithm
              </h3>
              <span className="text-sm px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full">Uses heuristics</span>
            </div>
            <div ref={aStarCanvasRef} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"></div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-3">
              <h3 className="text-xl font-semibold text-purple-700 tracking-tight">
                Dijkstra Algorithm
              </h3>
              <span className="text-sm px-2 py-1 bg-purple-50 text-purple-700 rounded-full">Uniform cost search</span>
            </div>
            <div ref={dijkstraCanvasRef} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"></div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 mt-4 p-3 bg-gray-50 rounded-lg">
          <span className="flex items-center px-2 py-1 bg-white rounded-md shadow-sm">
            <span className="w-4 h-4 bg-[#68d391] inline-block mr-2 rounded-sm"></span>
            <span className="text-xs font-medium">Start</span>
          </span>
          <span className="flex items-center px-2 py-1 bg-white rounded-md shadow-sm">
            <span className="w-4 h-4 bg-[#f687b3] inline-block mr-2 rounded-sm"></span>
            <span className="text-xs font-medium">End</span>
          </span>
          <span className="flex items-center px-2 py-1 bg-white rounded-md shadow-sm">
            <span className="w-4 h-4 bg-[#2d3748] inline-block mr-2 rounded-sm"></span>
            <span className="text-xs font-medium">Wall</span>
          </span>
          <span className="flex items-center px-2 py-1 bg-white rounded-md shadow-sm">
            <span className="w-4 h-4 bg-[#bee3f8] inline-block mr-2 rounded-sm"></span>
            <span className="text-xs font-medium">Visited</span>
          </span>
          <span className="flex items-center px-2 py-1 bg-white rounded-md shadow-sm">
            <span className="w-4 h-4 bg-[#b794f4] inline-block mr-2 rounded-sm"></span>
            <span className="text-xs font-medium">Frontier</span>
          </span>
          <span className="flex items-center px-2 py-1 bg-white rounded-md shadow-sm">
            <span className="w-4 h-4 bg-[#4c51bf] inline-block mr-2 rounded-sm"></span>
            <span className="text-xs font-medium">Path</span>
          </span>
        </div>
      </motion.div>
    </section>
  );
}