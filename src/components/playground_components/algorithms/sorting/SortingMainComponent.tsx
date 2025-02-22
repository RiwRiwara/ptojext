import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';



export default function SortingMainComponent() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [blocks, setBlocks] = useState<number[]>(generateRandomBlocks(10));
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cubesRef = useRef<THREE.Mesh[]>([]);
  const [sorting, setSorting] = useState<boolean>(false);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null); 
  const [canvasdWidth, setCanvasdWidth] = useState<number>(800);
  const [canvasdHeight, setCanvasdHeight] = useState<number>(400);
  const [speed, setSpeed] = useState<number>(0.3);



  function generateRandomBlocks(numBlocks: number): number[] {
    return Array.from({ length: numBlocks }, () => Math.floor(Math.random() * 31));
  }

  useEffect(() => {
    const scene = new THREE.Scene();
    // Use OrthographicCamera for 2D view
    const aspect = canvasdWidth / canvasdHeight; // Fixed canvas size
    const camera = new THREE.OrthographicCamera(-aspect * 5, aspect * 5, 5, -5, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    // Set smaller fixed size
    renderer.setSize(canvasdWidth, canvasdHeight);
    renderer.setClearColor(0xffffff);
    camera.position.z = 10;

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [canvasdHeight, canvasdWidth]);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Clean up old cubes
    cubesRef.current.forEach(cube => sceneRef.current?.remove(cube));
    cubesRef.current = [];

    // Create new cubes with persistent colors
    const newCubes = blocks.map((scale, index) => {
      const geometry = new THREE.BoxGeometry(1, scale * 0.1, 0.1); // Thin depth for 2D look
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(`hsl(${index * 360 / 5}, 100%, 50%)`) // Use fixed 5 for consistent colors
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = index * 1.5 - (blocks.length * 1.5 / 2);
      cube.position.y = scale * 0.05;
      sceneRef.current?.add(cube);
      return cube;
    });

    cubesRef.current = newCubes;
  }, [blocks]);

  const addBlock = () => setBlocks(prev => [...prev, Math.floor(Math.random() * 31)]);
  const deleteBlock = () => setBlocks(prev => prev.length > 0 ? prev.slice(0, -1) : prev);
  const shuffleBlocks = () => setBlocks(prev => [...prev].sort(() => Math.random() - 0.5));
  const randomizeBlocks = () => setBlocks(generateRandomBlocks(blocks.length));

  const sortBlocks = async () => {
    if (sorting || !sceneRef.current) return;
    setSorting(true);

    const newBlocks = [...blocks];
    const animations: { from: number; to: number }[] = [];

    // Bubble sort
    for (let i = 0; i < newBlocks.length; i++) {
      for (let j = 0; j < newBlocks.length - i - 1; j++) {
        if (newBlocks[j] > newBlocks[j + 1]) {
          animations.push({ from: j, to: j + 1 });
          [newBlocks[j], newBlocks[j + 1]] = [newBlocks[j + 1], newBlocks[j]];
        }
      }
    }

    // Execute animations while preserving colors
    for (const { from, to } of animations) {
      await new Promise(resolve => {
        const fromX = from * 1.5 - (blocks.length * 1.5 / 2);
        const toX = to * 1.5 - (blocks.length * 1.5 / 2);

        gsap.to(cubesRef.current[from].position, {
          x: toX,
          duration: speed,
          ease: "power1.out",
          onComplete: () => {
            gsap.to(cubesRef.current[to].position, {
              x: fromX,
              duration: speed,
              ease: "power1.out",
              onComplete: resolve
            });
            // Swap cube references only, preserving their materials
            [cubesRef.current[from], cubesRef.current[to]] = [cubesRef.current[to], cubesRef.current[from]];
          }
        });
      });
    }

    setBlocks(newBlocks);
    setSorting(false);
  };

  return (
    <div className="flex flex-col gap-4 p-4 rounded-md">

      <div className='flex flex-row justify-center w-full'>
        <div ref={mountRef} className={`w-[${canvasdWidth}px] h-[${canvasdHeight}px]`} />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button onClick={addBlock} className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 transition-colors">
          Add Block
        </button>
        <button onClick={deleteBlock} className="px-4 py-2 bg-slate-300 text-white rounded hover:bg-slate-400 transition-colors">
          Remove Block
        </button>
        <button onClick={shuffleBlocks} className="px-4 py-2 bg-sky-300 text-white rounded hover:bg-sky-400 transition-colors">
          Shuffle
        </button>
        <button onClick={randomizeBlocks} className="px-4 py-2 bg-emerald-400 text-white rounded hover:bg-emerald-500 transition-colors">
          Randomize
        </button>
        {/* chnage speed of animation */}
        <div className="flex flex-row gap-2">
          <button onClick={() => setSpeed(speed - 0.1)} className="px-4 py-2 bg-slate-300 text-white rounded hover:bg-slate-400 transition-colors">
            -
          </button>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            className="w-full"
          />
          <button onClick={() => setSpeed(speed + 0.1)} className="px-4 py-2 bg-slate-300 text-white rounded hover:bg-slate-400 transition-colors">
            +
          </button>
        </div>
        <button
          onClick={sortBlocks}
          className={`px-4 py-2 bg-red-500 text-white rounded transition-colors ${sorting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}`}
          disabled={sorting}
        >
          {sorting ? 'Sorting...' : 'Sort'}
        </button>
      </div>
    </div>
  );
}