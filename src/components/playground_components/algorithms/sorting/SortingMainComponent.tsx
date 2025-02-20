import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

export default function SortingMainComponent() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [blocks, setBlocks] = useState<number[]>(generateRandomBlocks(5));
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [cubes, setCubes] = useState<THREE.Mesh[]>([]);
  const [sorting, setSorting] = useState<boolean>(false);

  function generateRandomBlocks(numBlocks: number): number[] {
    return Array.from({ length: numBlocks }, () => Math.floor(Math.random() * 31));
  }

  useEffect(() => {
    const newScene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff); // White background

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    setScene(newScene);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(newScene, camera);
    };

    animate();

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (scene) {
      // Clear old cubes
      cubes.forEach(cube => scene.remove(cube));
      const newCubes = blocks.map((scale, index) => {
        const geometry = new THREE.BoxGeometry(1, scale * 0.1, 1);
        const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(`hsl(${index * 360 / blocks.length}, 100%, 50%)`) });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = index * 1.5 - (blocks.length * 1.5 / 2);
        scene.add(cube);
        return cube;
      });
      setCubes(newCubes);
    }
  }, [blocks, scene, cubes]);

  const addBlock = () => {
    setBlocks([...blocks, Math.floor(Math.random() * 31)]);
  };

  const deleteBlock = () => {
    if (blocks.length > 0) {
      setBlocks(blocks.slice(0, -1));
    }
  };

  const shuffleBlocks = () => {
    setBlocks([...blocks].sort(() => Math.random() - 0.5));
  };

  const randomizeBlocks = () => {
    setBlocks(generateRandomBlocks(blocks.length));
  };

  const sortBlocks = async () => {
    if (sorting) return;
    setSorting(true);

    const sortedBlocks = [...blocks].sort((a, b) => a - b);
    const animations = [];

    for (let i = 0; i < blocks.length; i++) {
      for (let j = 0; j < blocks.length - i - 1; j++) {
        if (blocks[j] > blocks[j + 1]) {
          animations.push({ from: j, to: j + 1 });
          [blocks[j], blocks[j + 1]] = [blocks[j + 1], blocks[j]];
        }
      }
    }

    for (const anim of animations) {
      await new Promise(resolve => {
        const fromX = anim.from * 1.5 - (blocks.length * 1.5 / 2);
        const toX = anim.to * 1.5 - (blocks.length * 1.5 / 2);
        gsap.to(cubes[anim.from].position, {
          x: toX,
          duration: 0.3,
          ease: "power1.out",
          onComplete: () => {
            gsap.to(cubes[anim.to].position, {
              x: fromX,
              duration: 0.3,
              ease: "power1.out",
              onComplete: resolve
            });
            [cubes[anim.from], cubes[anim.to]] = [cubes[anim.to], cubes[anim.from]];
          }
        });
      });
    }

    setBlocks(sortedBlocks);
    setSorting(false);
  };

  return (
    <div className='p-4 rounded-md flex flex-col gap-4'>
      <div ref={mountRef} className="" />
      <div className="flex justify-center gap-2">
        <button onClick={addBlock} className="px-4 py-2 bg-slate-500 text-white rounded">+</button>
        <button onClick={deleteBlock} className="px-4 py-2 bg-slate-300 text-white rounded">-</button>
        <button onClick={shuffleBlocks} className="px-4 py-2 bg-sky-300 text-white rounded">Shuffle</button>
        <button onClick={randomizeBlocks} className="px-4 py-2 bg-emerald-400 text-white rounded">Randomize</button>
        <button 
          onClick={sortBlocks} 
          className="px-4 py-2 bg-red-500 text-white rounded"
          disabled={sorting}
        >
          {sorting ? 'Sorting...' : 'Sort'}
        </button>
      </div>
    </div>
  );
}