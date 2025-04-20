"use client";
import BaseLayout from "@/components/layout/BaseLayout";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useTranslation } from "react-i18next";
import Matter, { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint, Body } from "matter-js";
import { useEffect, useRef } from "react";

export default function About() {
  const { t, i18n } = useTranslation("common");
  const sceneRef = useRef<HTMLDivElement>(null); // Ref for the Matter.js canvas container
  const engineRef = useRef<Engine | null>(null); // Ref for Matter.js engine
  const runnerRef = useRef<Runner | null>(null); // Ref for Matter.js runner

  const changeLanguageBox = () => {
    const nextLanguage = i18n.language === "th" ? "en" : "th";
    void i18n.changeLanguage(nextLanguage);
  };

  useEffect(() => {
    if (!sceneRef.current) return;

    // Create engine with less gravity
    const engine = Engine.create({
      gravity: { y: 0.1, x: 0 } // Very light gravity to allow floating
    });
    engineRef.current = engine;

    // Create renderer with explicit transparent settings
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: "transparent", // Ensure no black background
        wireframes: false, // No wireframes, solid shapes only
        showAngleIndicator: false, // Ensure no debug indicators
        showCollisions: false, // Ensure no collision visuals
        showVelocity: false, // Ensure no velocity visuals
      },
    });

    // Create boundaries (walls) with no visual styling (transparent)
    const boundaries = [
      Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 50, {
        isStatic: true,
        render: {
          fillStyle: "transparent", // Transparent boundaries
          visible: false // Make boundaries invisible
        }
      }), // Top
      Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 50, {
        isStatic: true,
        render: {
          fillStyle: "transparent",
          visible: false
        }
      }), // Bottom
      Bodies.rectangle(0, window.innerHeight / 2, 50, window.innerHeight, {
        isStatic: true,
        render: {
          fillStyle: "transparent",
          visible: false
        }
      }), // Left
      Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 50, window.innerHeight, {
        isStatic: true,
        render: {
          fillStyle: "transparent",
          visible: false
        }
      }), // Right
    ];

    // Create bouncing circles with less friction
    const circles = Array.from({ length: 20 }, (_, index) => {
      return Bodies.circle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        20, // Radius
        {
          restitution: 0.8, // Slightly less bouncy
          friction: 0.001, // Almost no friction
          frictionAir: 0.001, // Very low air friction
          render: {
            fillStyle: "rgba(99, 102, 241, 0.5)", // Semi-transparent indigo (no black)
          },
          label: `circle-${index}`,
        }
      );
    });

    // Add a bouncing square (distinct color)
    const square = Bodies.rectangle(
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight,
      40, 40,
      {
        restitution: 0.7,
        friction: 0.002,
        frictionAir: 0.002,
        render: {
          fillStyle: "rgba(251, 146, 60, 0.8)", // Orange
        },
        label: "special-square"
      }
    );

    // Add circles, square, and boundaries to world
    World.add(engine.world, [...circles, square, ...boundaries]);

    // Add mouse control for dragging (optional)
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false, // Ensure mouse constraint is invisible
        },
      },
    });

    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Add random forces to simulate bird-like movement
    Matter.Events.on(engine, 'beforeUpdate', () => {
      circles.forEach(circle => {
        if (Math.random() < 0.05) { // 5% chance each frame to change direction
          const forceMagnitude = 0.001;
          Body.applyForce(circle, {
            x: circle.position.x,
            y: circle.position.y
          }, {
            x: (Math.random() - 0.5) * forceMagnitude,
            y: (Math.random() - 0.5) * forceMagnitude
          });
        }
      });
    });

    // --- ENHANCEMENT: Hover to scale up balls and change cursor ---
    let lastHovered: Matter.Body | null = null;
    let lastScale = 1;
    const scaleUp = 1.4;

    function handleMouseMove(event: MouseEvent) {
      const rect = render.canvas.getBoundingClientRect();
      const mousePos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      // Find the topmost circle under the mouse
      const found = Matter.Query.point(circles, mousePos)[0] || null;
      if (found !== lastHovered) {
        // Restore previous
        if (lastHovered && lastScale !== 1) {
          Matter.Body.scale(lastHovered, 1 / lastScale, 1 / lastScale);
        }
        if (found) {
          Matter.Body.scale(found, scaleUp, scaleUp);
          render.canvas.style.cursor = "grab";
          lastScale = scaleUp;
        } else {
          render.canvas.style.cursor = "default";
          lastScale = 1;
        }
        lastHovered = found;
      }
    }
    render.canvas.addEventListener("mousemove", handleMouseMove);
    render.canvas.addEventListener("mouseleave", () => {
      if (lastHovered && lastScale !== 1) {
        Matter.Body.scale(lastHovered, 1 / lastScale, 1 / lastScale);
        lastHovered = null;
        lastScale = 1;
      }
      render.canvas.style.cursor = "default";
    });
    // --- END ENHANCEMENT ---

    // Create and run the runner
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Run the renderer
    Render.run(render);

    // Cleanup on unmount
    return () => {
      if (render && runnerRef.current) {
        Render.stop(render);
        Runner.stop(runnerRef.current);
        World.clear(engine.world, true);
        Engine.clear(engine);
        render.canvas.remove();
        if (mouseConstraint) World.remove(engine.world, mouseConstraint);
      }
      // Remove event listeners for hover
      if (render && render.canvas) {
        render.canvas.removeEventListener("mousemove", handleMouseMove);
        render.canvas.removeEventListener("mouseleave", () => {});
      }
    };
  }, []);
  return (
    <BaseLayout>
      <div ref={sceneRef} className="absolute inset-0 pointer-events-auto z-0" />
      <div className="py-12 px-4 sm:px-6 lg:px-8 relative  ">
        {/* Breadcrumb navigation */}
        <div className="max-w-3xl mx-auto mb-4">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "About Us" }
          ]} />
        </div>
        {/* Matter.js canvas container - positioned behind content */}

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-6 z-10 relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">
              {t("ABOUT_TITLE")}
            </h1>
            <button
              onClick={changeLanguageBox}
              className="mt-4 sm:mt-0 text-sm font-medium text-gray-600 hover:text-gray-800 hover:underline focus:outline-none transition-colors"
              aria-label={`Switch to ${i18n.language === "en" ? "Thai" : "English"}`}
            >
              {i18n.language === "en" ? "ไทย" : "ENG"}
            </button>
          </div>

          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed overflow-auto custom-scroll">
            {t("ABOUT_US", "Welcome to our AI Interactive Playground! Explore algorithms, data structures, and artificial intelligence with hands-on visualizations and engaging simulations. Our mission is to make complex concepts accessible and fun for everyone.")}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}