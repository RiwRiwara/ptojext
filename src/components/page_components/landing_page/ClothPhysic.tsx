"use client";
import { motion, AnimationControls } from "framer-motion";
import '@/utils/i18n.config';
import { useTranslation } from "react-i18next";
import { useRef, useEffect, useState, useCallback } from "react";
import { VscRepoForcePush } from "react-icons/vsc";
import { CgRedo } from "react-icons/cg";
import { FaScrewdriver } from "react-icons/fa";

import Matter, { MouseConstraint, Engine, Render, Runner, Constraint, Body, Mouse, World, Vector } from "matter-js";

interface ClothPhysicProps {
  controls: AnimationControls;
}

export default function ClothPhysic({ controls }: ClothPhysicProps) {
  const { t } = useTranslation('common');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gravity, setGravity] = useState<boolean>(true);
  const [isCutting, setIsCutting] = useState<boolean>(false);
  const engineRef = useRef<Engine | null>(null);
  const runnerRef = useRef<Runner | null>(null);
  const renderRef = useRef<Render | null>(null);
  const constraintsRef = useRef<Constraint[]>([]);
  const mouseConstraintRef = useRef<MouseConstraint | null>(null);
  const particlesRef = useRef<Body[][]>([]);

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    pageLoad: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const setupClothSimulation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width: number = 1200;
    const height: number = 800;
    canvas.width = width;
    canvas.height = height;

    const engine: Engine = Matter.Engine.create();
    engineRef.current = engine;

    const render: Render = Matter.Render.create({
      canvas,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "transparent",
        pixelRatio: 1,
      },
    });
    renderRef.current = render;

    const group: number = Matter.Body.nextGroup(true);
    const particleOptions = () => ({
      friction: 0.0001,
      collisionFilter: { group },
      render: { visible: false, fillStyle: "black" },
    });

    const clothWidth: number = 1100;
    const clothHeight: number = 700;
    // Further increase particle size to reduce particle count
    const particleSize: number = 48; // Increased from 36 to 48
    const rows: number = Math.floor(clothHeight / particleSize);
    const cols: number = Math.floor(clothWidth / particleSize);
    const particles: Body[][] = [];
    particlesRef.current = particles;

    for (let y = 0; y < rows; y++) {
      particles[y] = [];
      for (let x = 0; x < cols; x++) {
        const particle: Body = Matter.Bodies.circle(
          (width - clothWidth) / 2 + x * particleSize,
          (height - clothHeight) / 2 + y * particleSize,
          particleSize / 2,
          particleOptions()
        );
        particles[y][x] = particle;
        if (y === 0) {
          Matter.Body.setStatic(particle, true);
        }
      }
    }

    const constraints: Constraint[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (x < cols - 1) {
          constraints.push(
            Matter.Constraint.create({
              bodyA: particles[y][x],
              bodyB: particles[y][x + 1],
              length: particleSize,
              stiffness: 0.98, // Increased stiffness for smoother motion
              render: { strokeStyle: "black" },
            })
          );
        }
        if (y < rows - 1) {
          constraints.push(
            Matter.Constraint.create({
              bodyA: particles[y][x],
              bodyB: particles[y + 1][x],
              length: particleSize,
              stiffness: 0.98,
              render: { strokeStyle: "black" },
            })
          );
        }
      }
    }
    constraintsRef.current = constraints;

    Matter.World.add(engine.world, [...particles.flat(), ...constraints]);

    const mouse: Mouse = Matter.Mouse.create(canvas);
    const mouseConstraint: MouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    mouseConstraintRef.current = mouseConstraint;
    Matter.World.add(engine.world, mouseConstraint);

    // Add mouse move event listener for cutting
    const handleMouseMove = () => {
      if (isCutting && mouseConstraint.mouse.position) {
        cutCloth(mouseConstraint.mouse.position);
      }
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    const runner: Runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isCutting]);

  useEffect(() => {
    const cleanup = setupClothSimulation();

    return () => {
      if (renderRef.current) Matter.Render.stop(renderRef.current);
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
      renderRef.current = null;
      if (cleanup) cleanup();
    };
  }, [setupClothSimulation]);

  const toggleGravity = (): void => {
    if (engineRef.current) {
      engineRef.current.gravity.y = gravity ? 0 : 1;
      setGravity(!gravity);
    }
  };

  const resetSimulation = (): void => {
    if (renderRef.current) Matter.Render.stop(renderRef.current);
    if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
    if (engineRef.current) Matter.Engine.clear(engineRef.current);
    setupClothSimulation();
  };

  const applyWind = (): void => {
    const engine = engineRef.current;
    const particles = particlesRef.current;
    if (engine && particles.length > 0) {
      const force = 0.02;
      for (const row of particles) {
        for (const particle of row) {
          Matter.Body.applyForce(particle, particle.position, { x: force, y: 0 });
        }
      }
    }
  };

  const dropBall = (): void => {
    const canvas = canvasRef.current;
    const engine = engineRef.current;
    if (canvas && engine) {
      const ball: Body = Matter.Bodies.circle(
        canvas.width / 2,
        80,
        28,
        {
          friction: 0.0001,
          collisionFilter: { group: Matter.Body.nextGroup(true) },
          render: { visible: true, fillStyle: "black" },
        }
      );
      Matter.World.add(engine.world, ball);
      Matter.Body.setMass(ball, 16);
    }
  };

  const cutCloth = (mousePosition: Vector): void => {
    const engine = engineRef.current;
    const constraints = constraintsRef.current;
    if (!engine) return;

    const cutRadius = 50; // Radius around mouse to detect constraints
    const constraintsToRemove: Constraint[] = [];

    constraints.forEach((constraint) => {
      const bodyA = constraint.bodyA;
      const bodyB = constraint.bodyB;
      if (bodyA && bodyB) {
        const midPoint = {
          x: (bodyA.position.x + bodyB.position.x) / 2,
          y: (bodyA.position.y + bodyB.position.y) / 2,
        };
        const distance = Vector.magnitude(Vector.sub(midPoint, mousePosition));
        if (distance < cutRadius) {
          constraintsToRemove.push(constraint);
        }
      }
    });

    constraintsToRemove.forEach((constraint) => {
      Matter.World.remove(engine.world, constraint);
      constraintsRef.current = constraintsRef.current.filter(c => c !== constraint);
    });
  };

  const toggleCutting = (): void => {
    setIsCutting(!isCutting);
  };

  return (
    <section className="flex flex-col items-center justify-center bg-white">
      <motion.div
        initial="hidden"
        variants={fadeInVariants}
        animate={controls ? controls : "pageLoad"}
      >
      </motion.div>
      <motion.div
        className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-sm rounded-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <canvas
            ref={canvasRef}
            className="bg-white w-64 h-64 md:w-[540px] md:h-[300px] block"
          />
        </div>
        <div className="flex gap-2 bg-gray-100 p-2 rounded-full shadow-sm flex-wrap justify-center">
          <button
            onClick={toggleGravity}
            className={`p-2 rounded-full transition-colors ${gravity ? "bg-indigo-500 text-white" : "bg-gray-300 text-gray-700"} hover:bg-indigo-600 hover:text-white focus:outline-none relative group`}
            title={gravity ? "Disable Gravity" : "Enable Gravity"}
          >
            <VscRepoForcePush size={20} />
            <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              {gravity ? "Disable Gravity" : "Enable Gravity"}
            </span>
          </button>
          <button
            onClick={applyWind}
            className="p-2 rounded-full bg-blue-300 text-blue-900 hover:bg-blue-500 hover:text-white focus:outline-none relative group"
            title="Apply Wind"
          >
            <span role="img" aria-label="Wind">💨</span>
            <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              Apply Wind
            </span>
          </button>
          <button
            onClick={dropBall}
            className="p-2 rounded-full bg-orange-200 text-orange-900 hover:bg-orange-400 hover:text-white focus:outline-none relative group"
            title="Drop Ball"
          >
            <span role="img" aria-label="Drop Ball">⚽</span>
            <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              Drop Ball
            </span>
          </button>
          <button
            onClick={toggleCutting}
            className={`p-2 rounded-full transition-colors ${isCutting ? "bg-red-500 text-white" : "bg-gray-300 text-gray-700"} hover:bg-red-600 hover:text-white focus:outline-none relative group`}
            title={isCutting ? "Disable Cutting" : "Enable Cutting"}
          >
            <FaScrewdriver size={20} />
            <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              {isCutting ? "Disable Cutting" : "Enable Cutting"}
            </span>
          </button>
          <button
            onClick={resetSimulation}
            className="p-2 rounded-full bg-gray-300 text-gray-700 hover:bg-green-500 hover:text-white focus:outline-none relative group"
            title="Reset Simulation"
          >
            <CgRedo size={20} />
            <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              Reset Simulation
            </span>
          </button>
        </div>
      </motion.div>
    </section>
  );
}