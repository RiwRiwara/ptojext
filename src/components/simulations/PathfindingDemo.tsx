"use client";
import React, { useState, useEffect, useRef } from "react";
import Matter from "matter-js";


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

const Cell: React.FC<CellProps & { highlight?: boolean }> = ({ value, onClick, highlight }) => (
  <div
    className={`w-6 h-6 border border-gray-200 cursor-pointer transition-colors duration-200 ${cellColors[value as keyof typeof cellColors]}${highlight ? ' ring-2 ring-yellow-400' : ''}`}
    onClick={onClick}
    style={{ boxShadow: highlight ? '0 0 8px 2px #fde047' : undefined }}
  />
);

const ALGORITHMS = [
  { key: 'bfs', label: 'Breadth-First Search (BFS)', desc: 'BFS explores neighbors level by level, guaranteeing the shortest path in unweighted graphs.' },
  { key: 'dfs', label: 'Depth-First Search (DFS)', desc: 'DFS explores as far as possible along each branch before backtracking. Not guaranteed to find the shortest path.' },
  { key: 'dijkstra', label: "Dijkstra's Algorithm", desc: 'Dijkstra finds the shortest path by expanding the lowest-cost node first. Works for weighted graphs.' },
  { key: 'astar', label: 'A* (A-star)', desc: 'A* uses a heuristic to guide the search, often faster than Dijkstra for many problems.' },
];

const PathfindingDemo: React.FC = () => {
  const [grid, setGrid] = useState(() => createGrid(GRID_SIZE));
  const [mode, setMode] = useState<'wall' | 'start' | 'end'>('wall');
  const [running, setRunning] = useState(false);
  const [found, setFound] = useState(false);
  const [highlighted, setHighlighted] = useState<{r:number,c:number}|null>(null);
  const [algorithm, setAlgorithm] = useState<'dfs' | 'dijkstra' | 'astar'>('dfs');
  const [agentPath, setAgentPath] = useState<[number, number][] | null>(null);
  const [agentAnimating, setAgentAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const agentBodyRef = useRef<Matter.Body | null>(null);

  // Setup Matter.js engine and renderer
  useEffect(() => {
    const width = 360;
    const height = 360;
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    if (canvasRef.current) {
      const render = Matter.Render.create({
        engine,
        element: canvasRef.current.parentElement!,
        canvas: canvasRef.current,
        options: {
          width,
          height,
          wireframes: false,
          background: "#f9fafb",
        },
      });
      Matter.Render.run(render);
      renderRef.current = render;
    }
    return () => {
      if (renderRef.current) Matter.Render.stop(renderRef.current);
      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world, false);
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, []);

  // Sync grid to Matter.js world
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    const world = engine.world;
    Matter.World.clear(world, false);
    // Draw grid cells as static rectangles
    const cellSize = 360 / GRID_SIZE;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        let color = '#fff';
        if (grid[r][c] === WALL) color = '#374151';
        else if (grid[r][c] === START) color = '#4ade80';
        else if (grid[r][c] === END) color = '#f87171';
        else if (grid[r][c] === PATH) color = '#fde047';
        else if (grid[r][c] === VISITED) color = '#bfdbfe';
        const body = Matter.Bodies.rectangle(
          c * cellSize + cellSize / 2,
          r * cellSize + cellSize / 2,
          cellSize - 2,
          cellSize - 2,
          {
            isStatic: true,
            render: {
              fillStyle: color,
              strokeStyle: '#e5e7eb',
              lineWidth: 1,
            },
          }
        );
        Matter.World.add(world, body);
      }
    }
    // Add agent body if animating
    if (agentPath && agentPath.length > 0 && agentAnimating) {
      const [startR, startC] = agentPath[0];
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
      Matter.World.add(world, agent);
    }
    // Add a second object (square) at a random position
    if (!agentAnimating) {
      // Only add square when not animating agent
      const square = Matter.Bodies.rectangle(
        Math.random() * 360,
        Math.random() * 360,
        cellSize * 0.8,
        cellSize * 0.8,
        {
          isStatic: false,
          frictionAir: 0.15,
          restitution: 0.6,
          render: {
            fillStyle: '#fb923c', // Orange
            strokeStyle: '#ea580c',
            lineWidth: 2,
          },
          label: 'demo-square'
        }
      );
      Matter.World.add(world, square);
    }
  }, [grid, agentPath, agentAnimating]);

  // Handle cell click
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

  // BFS implementation (existing)
  const bfs = async () => {
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
      setHighlighted({r, c});
      await new Promise(res => setTimeout(res, 25));
    }
    setHighlighted(null);
    if (foundPath) {
      for (const [r, c] of foundPath) {
        if (newGrid[r][c] !== END) newGrid[r][c] = PATH;
        setGrid(cloneGrid(newGrid));
        setHighlighted({r, c});
        await new Promise(res => setTimeout(res, 35));
      }
      setHighlighted(null);
      setFound(true);
    }
    setRunning(false);
  };

  // DFS implementation
  const dfs = async (returnPath = false): Promise<[number, number][] | null | void> => {
    setRunning(true);
    setFound(false);
    const dirs = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
    ];
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
    const newGrid = cloneGrid(grid);
    let foundPath: [number, number][] | null = null;
    async function dfsVisit(r: number, c: number, path: [number, number][]): Promise<boolean> {
      if (r === end[0] && c === end[1]) {
        foundPath = [...path];
        return true;
      }
      visited[r][c] = true;
      if (grid[r][c] !== START && grid[r][c] !== END) newGrid[r][c] = VISITED;
      setGrid(cloneGrid(newGrid));
      setHighlighted({r, c});
      await new Promise(res => setTimeout(res, 25));
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (
          nr >= 0 && nr < GRID_SIZE &&
          nc >= 0 && nc < GRID_SIZE &&
          !visited[nr][nc] &&
          (grid[nr][nc] === EMPTY || grid[nr][nc] === END)
        ) {
          if (await dfsVisit(nr, nc, [...path, [nr, nc]])) return true;
        }
      }
      return false;
    }
    await dfsVisit(start[0], start[1], []);
    setHighlighted(null);
    if (foundPath) {
      if (returnPath) return foundPath;
      for (const [r, c] of foundPath as [number, number][]) {
        if (newGrid[r][c] !== END) newGrid[r][c] = PATH;
        setGrid(cloneGrid(newGrid));
        setHighlighted({r, c});
        await new Promise(res => setTimeout(res, 35));
      }
      setHighlighted(null);
      setFound(true);
    }
    setRunning(false);
    return null;
  };

  // Algorithm dispatcher
  // Animate agent along the found path
  const animateAgent = async (path: [number, number][]) => {
    setAgentAnimating(true);
    const engine = engineRef.current;
    if (!engine || !agentBodyRef.current) return;
    const cellSize = 360 / GRID_SIZE;
    for (let i = 1; i < path.length; ++i) {
      const [r, c] = path[i];
      const x = c * cellSize + cellSize / 2;
      const y = r * cellSize + cellSize / 2;
      Matter.Body.setPosition(agentBodyRef.current, { x, y });
      await new Promise(res => setTimeout(res, 120));
    }
    setAgentAnimating(false);
  };

  const findPath = async () => {
    let foundPath: [number, number][] | null = null;
    if (algorithm === 'dfs') foundPath = (await dfs(true)) as [number, number][] | null;
    else if (algorithm === 'dijkstra') foundPath = (await dijkstra(true)) as [number, number][] | null;
    else if (algorithm === 'astar') foundPath = (await astar(true)) as [number, number][] | null;
    if (foundPath && foundPath.length > 1) {
      setAgentPath(foundPath);
      setTimeout(() => animateAgent(foundPath), 400);
    } else {
      setAgentPath(null);
    }
  };

  // Dijkstra's Algorithm
  const dijkstra = async (returnPath = false): Promise<[number, number][] | null | void> => {
    setRunning(true);
    setFound(false);
    const queue: [number, number, number][] = [];
    const cost: number[][] = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(Infinity));
    const prev: (null | [number, number])[][] = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(null));
    let start: [number, number] = [1, 1];
    let end: [number, number] = [GRID_SIZE-2, GRID_SIZE-2];
    for (let r = 0; r < GRID_SIZE; r++) for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === START) start = [r, c];
      if (grid[r][c] === END) end = [r, c];
    }
    cost[start[0]][start[1]] = 0;
    queue.push([start[0], start[1], 0]);
    const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
    let foundPath = false;
    while (queue.length > 0) {
      queue.sort((a,b)=>a[2]-b[2]);
      const [r, c, d] = queue.shift()!;
      if (grid[r][c] === END) { foundPath = true; break; }
      if (grid[r][c] !== START && grid[r][c] !== END) {
        setGrid(g => {
          const ng = cloneGrid(g);
          ng[r][c] = VISITED;
          return ng;
        });
        await new Promise(res => setTimeout(res, 20));
      }
      for (const [dr, dc] of dirs) {
        const nr = r+dr, nc = c+dc;
        if (nr < 0 || nc < 0 || nr >= GRID_SIZE || nc >= GRID_SIZE) continue;
        if (grid[nr][nc] === WALL) continue;
        if (cost[nr][nc] > cost[r][c] + 1) {
          cost[nr][nc] = cost[r][c] + 1;
          prev[nr][nc] = [r, c];
          queue.push([nr, nc, cost[nr][nc]]);
        }
      }
    }
    if (foundPath) {
      const path: [number, number][] = [];
      let cur: [number, number] | null = end;
      while (cur && (cur[0] !== start[0] || cur[1] !== start[1])) {
        path.push(cur);
        cur = prev[cur[0]][cur[1]];
      }
      path.push(start);
      path.reverse();
      for (const [r, c] of path) {
        if (grid[r][c] !== START && grid[r][c] !== END) {
          setGrid(g => {
            const ng = cloneGrid(g);
            ng[r][c] = PATH;
            return ng;
          });
          await new Promise(res => setTimeout(res, 35));
        }
      }
      setHighlighted(null);
      setFound(true);
    }
    setRunning(false);
  };

  // A* Algorithm
  const astar = async (returnPath = false): Promise<[number, number][] | null | void> => {
    setRunning(true);
    setFound(false);
    const open: [number, number, number, number][] = [];
    const cost: number[][] = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(Infinity));
    const prev: (null | [number, number])[][] = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(null));
    let start: [number, number] = [1, 1];
    let end: [number, number] = [GRID_SIZE-2, GRID_SIZE-2];
    for (let r = 0; r < GRID_SIZE; r++) for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === START) start = [r, c];
      if (grid[r][c] === END) end = [r, c];
    }
    function heuristic(a: [number, number], b: [number, number]) {
      return Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]);
    }
    cost[start[0]][start[1]] = 0;
    open.push([start[0], start[1], 0, heuristic(start, end)]);
    const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
    let foundPath = false;
    while (open.length > 0) {
      open.sort((a,b)=>a[2]+a[3]-b[2]-b[3]);
      const [r, c, g, h] = open.shift()!;
      if (grid[r][c] === END) { foundPath = true; break; }
      if (grid[r][c] !== START && grid[r][c] !== END) {
        setGrid(g => {
          const ng = cloneGrid(g);
          ng[r][c] = VISITED;
          return ng;
        });
        await new Promise(res => setTimeout(res, 20));
      }
      for (const [dr, dc] of dirs) {
        const nr = r+dr, nc = c+dc;
        if (nr < 0 || nc < 0 || nr >= GRID_SIZE || nc >= GRID_SIZE) continue;
        if (grid[nr][nc] === WALL) continue;
        const ng = g+1;
        if (cost[nr][nc] > ng) {
          cost[nr][nc] = ng;
          prev[nr][nc] = [r, c];
          open.push([nr, nc, ng, heuristic([nr, nc], end)]);
        }
      }
    }
    if (foundPath) {
      const path: [number, number][] = [];
      let cur: [number, number] | null = end;
      while (cur && (cur[0] !== start[0] || cur[1] !== start[1])) {
        path.push(cur);
        cur = prev[cur[0]][cur[1]];
      }
      path.push(start);
      path.reverse();
      for (const [r, c] of path) {
        if (grid[r][c] !== START && grid[r][c] !== END) {
          setGrid(g => {
            const ng = cloneGrid(g);
            ng[r][c] = PATH;
            return ng;
          });
          await new Promise(res => setTimeout(res, 35));
        }
      }
      setHighlighted(null);
      setFound(true);
    }
    setRunning(false);
  };

  // Remove agent from Matter.js world
  const removeAgent = () => {
    const engine = engineRef.current;
    if (engine && agentBodyRef.current) {
      Matter.World.remove(engine.world, agentBodyRef.current);
      agentBodyRef.current = null;
    }
    setAgentPath(null);
    setAgentAnimating(false);
  };

  // Random Walls
  const randomWalls = () => {
    setGrid(g => {
      const ng = cloneGrid(g);
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (ng[r][c] !== START && ng[r][c] !== END) {
            ng[r][c] = Math.random() < 0.25 ? WALL : EMPTY;
          }
        }
      }
      return ng;
    });
    setFound(false);
    setRunning(false);
    removeAgent();
  };


  const resetGrid = () => {
    setGrid(createGrid(GRID_SIZE));
    setFound(false);
    setRunning(false);
    removeAgent();
  };


  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="w-full max-w-2xl flex flex-col items-center rounded-2xl shadow-xl bg-white/95 px-6 py-8">
        <h1 className="text-3xl font-extrabold mb-2 text-blue-800 text-center">Pathfinding Algorithms Playground</h1>
        <p className="mb-5 text-gray-600 max-w-xl text-center text-lg">
          Visualize and compare popular pathfinding algorithms. Place walls, set start/end, then watch the agent find a path!
        </p>
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 mb-5">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-medium">Algorithm:</span>
            {ALGORITHMS.map(a => (
              <button
                key={a.key}
                className={`px-3 py-1 rounded-lg border text-sm font-semibold transition-colors duration-150 ${algorithm === a.key ? 'bg-blue-200 border-blue-400 text-blue-900' : 'bg-white border-gray-200 hover:bg-blue-50'}`}
                onClick={() => setAlgorithm(a.key as "dfs" | "dijkstra" | "astar")}
                disabled={running}
              >
                {a.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 rounded-lg bg-green-500 text-white font-bold shadow hover:bg-green-600 transition" onClick={findPath} disabled={running}>Start</button>
            <button className="px-4 py-1.5 rounded-lg bg-gray-200 text-gray-700 font-bold shadow hover:bg-gray-300 transition" onClick={resetGrid} disabled={running}>Reset</button>
            <button className="px-4 py-1.5 rounded-lg bg-yellow-400 text-yellow-900 font-bold shadow hover:bg-yellow-500 transition" onClick={randomWalls} disabled={running}>Random Walls</button>
          </div>
        </div>
        <div className="mb-3 w-full max-w-xl mx-auto text-center p-2 rounded bg-blue-50 border border-blue-100 text-blue-900 text-sm">
          {ALGORITHMS.find(a => a.key === algorithm)?.desc}
        </div>
        <div className="flex flex-wrap gap-4 justify-center items-center mb-4">
          <Legend color="#4ade80" label="Start" />
          <Legend color="#f87171" label="End" />
          <Legend color="#374151" label="Wall" />
          <Legend color="#fde047" label="Path" />
          <Legend color="#bfdbfe" label="Visited" />
          <Legend color="#2563eb" label="Agent" circle />
        </div>
        <div className="inline-block shadow-lg rounded-xl bg-white/90 p-4 border border-blue-100">
          <canvas
            ref={canvasRef}
            width={360}
            height={360}
            style={{ display: 'block', background: '#f9fafb', borderRadius: 12, boxShadow: '0 4px 24px 0 #93c5fd22' }}
          />
        </div>
        <div className="w-full flex flex-col items-center mt-4">
          {found && <div className="text-green-600 font-semibold">Path found!</div>}
          {!found && !running && <div className="text-gray-600">Try to find a path from <span className="font-semibold text-green-600">green</span> to <span className="font-semibold text-red-600">red</span>.</div>}
        </div>
      </div>
    </div>
  );
};

// Legend component (for UI clarity)
const Legend: React.FC<{ color: string; label: string; circle?: boolean }> = ({ color, label, circle }) => (
  <span className="flex items-center gap-1 text-sm">
    {circle ? (
      <span style={{ background: color, borderRadius: '50%', width: 16, height: 16, display: 'inline-block', border: '2px solid #d1d5db' }} />
    ) : (
      <span style={{ background: color, width: 16, height: 16, display: 'inline-block', borderRadius: 4, border: '2px solid #d1d5db' }} />
    )}
    {label}
  </span>
);

export default PathfindingDemo;
