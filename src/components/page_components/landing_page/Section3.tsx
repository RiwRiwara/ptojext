"use client";
import { motion, AnimationControls } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";

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

  const cols = 20;
  const rows = 20;
  const cellSize = 20;
  const start = { x: 0, y: 0 };
  const end = { x: cols - 1, y: rows - 1 };

  const generateGrid = () => {
    const grid = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(0));
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if ((i === start.y && j === start.x) || (i === end.y && j === end.x)) continue;
        if (Math.random() < 0.3) grid[i][j] = 1;
      }
    }
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
          cell.beginFill(0xedf2f7);
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

      const initialize = () => {
        openSet.clear();
        closedSet.clear();
        cameFrom.clear();
        gScore.clear();
        fScore.clear();
        path = [];
        finished = false;
        nodesVisited = 0;

        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            gScore.set(`${j},${i}`, Infinity);
            fScore.set(`${j},${i}`, Infinity);
            cells[i][j].clear();
            cells[i][j].beginFill(0xedf2f7);
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
          cell.beginFill(0xedf2f7);
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
            cells[i][j].beginFill(0xedf2f7);
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

    const aStarCleanup = setupAStar(aStarContainer);
    const dijkstraCleanup = setupDijkstra(dijkstraContainer);

    return () => {
      aStarCleanup();
      dijkstraCleanup();
    };
  }, [setupAStar, setupDijkstra, speed]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-16 px-4 md:mt-28 bg-white">
      <motion.div
        className="text-center mb-12"
        initial="hidden"
        animate={controls}
        variants={fadeInVariants}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Pathfinder Versus: A* vs. Dijkstra
        </h2>
        <p className="text-md md:text-lg text-gray-600 max-w-3xl mx-auto font-medium">
          Visualize A* and Dijkstra{'\'s'} algorithms in action. Green marks the start, pink the end, gray represents walls, and indigo traces the optimal path.
        </p>
      </motion.div>
      <motion.div
        className="w-fit md:w-full max-w-6xl p-8 flex flex-col gap-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <div className="flex flex-col items-center min-w-[420px]">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 tracking-tight">A* Algorithm</h3>
            <div ref={aStarCanvasRef} className="border border-gray-200 rounded-lg bg-[#f8f9fa] transition-all duration-300"></div>
          </div>
          <div className="flex flex-col items-center min-w-[420px]">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 tracking-tight">Dijkstra Algorithm</h3>
            <div ref={dijkstraCanvasRef} className="border border-gray-200 rounded-lg bg-[#f8f9fa] transition-all duration-300"></div>
          </div>
        </div>
        <div className="text-xs text-gray-600 text-center font-medium mt-2">
          Minimal Pathfinding Demo: A* vs. Dijkstra
        </div>
      </motion.div>
    </section>
  );
}