"use client";
import React, { useEffect, useRef, useState } from "react";
import { Engine, Render, Runner, Body, Composites, MouseConstraint, Mouse, Composite, Bodies, Common } from "matter-js";

const ClothSimulation = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(Engine.create());
  const renderRef = useRef(null);
  const runnerRef = useRef(Runner.create());
  const [size, setSize] = useState({ width: 380, height: 300 });

  useEffect(() => {
    const engine = engineRef.current;
    const world = engine.world;

    // Function to update canvas size
    const updateSize = () => {
      if (sceneRef.current) {
        setSize({
          width: sceneRef.current.offsetWidth,
          height: sceneRef.current.offsetHeight,
        });
      }
    };

    // Create renderer with dynamic size
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: size.width,
        height: size.height,
      },
    });

    renderRef.current = render;

    Render.run(render);

    // Create runner
    const runner = runnerRef.current;
    Runner.run(runner, engine);

    // Create cloth
    const cloth = createCloth(200, 200, 20, 12, 5, 5, false, 8);
    for (let i = 0; i < 20; i++) {
      cloth.bodies[i].isStatic = true;
    }

    Composite.add(world, [
      cloth,
      Bodies.circle(300, 500, 80, { isStatic: true, render: { fillStyle: '#060a19' } }),
      Bodies.rectangle(500, 480, 80, 80, { isStatic: true, render: { fillStyle: '#060a19' } }),
      Bodies.rectangle(400, 609, 800, 50, { isStatic: true }),
    ]);

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.98,
        render: {
          visible: false,
        },
      },
    });

    Composite.add(world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    // Fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 },
    });

    // Resize listener
    window.addEventListener('resize', updateSize);

    // Cleanup function
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(world);
      Engine.clear(engine);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
      window.removeEventListener('resize', updateSize);
    };
  }, [size]);

  // Function to create the cloth (same as in your original code)
  const createCloth = (xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius) => {
    const particleOptions = {
      inertia: Infinity,
      friction: 0.00001,
      collisionFilter: { group: Body.nextGroup(true) },
      render: { visible: false },
    };
    const constraintOptions = {
      stiffness: 0.06,
      render: { type: 'line', anchors: false },
    };

    const cloth = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, (x, y) => {
      return Bodies.circle(x, y, particleRadius, particleOptions);
    });

    Composites.mesh(cloth, columns, rows, crossBrace, constraintOptions);

    cloth.label = 'Cloth Body';

    return cloth;
  };

  return (
    <div ref={sceneRef} style={{ width: "full", height: "100%" }} />
  );
};

export default ClothSimulation;
