"use client";

import React, { useRef, useEffect, useState } from "react";
import Matter, { 
  MouseConstraint, 
  Engine, 
  Render, 
  Runner, 
  Constraint, 
  Body, 
  Mouse, 
  World, 
  Vector,
  Bodies,
  Composite,
  Events
} from "matter-js";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { FaBrain } from "react-icons/fa";
import { FiPlay } from "react-icons/fi";

interface MatterJSRLEnvironmentProps {
  width: number;
  height: number;
  isPlaying: boolean;
  environmentType: "gridworld" | "cartpole" | "mountaincar";
  speed?: number;
  showQValues?: boolean;
  onStateUpdate?: (state:  string) => void;
  onRewardUpdate?: (reward: number) => void;
  onEpisodeUpdate?: (episode: number) => void;
}

export const MatterJSRLEnvironment: React.FC<MatterJSRLEnvironmentProps> = ({
  width = 800,
  height = 600,
  isPlaying,
  environmentType,
  speed = 1,
  showQValues = true,
  onStateUpdate,
  onRewardUpdate,
  onEpisodeUpdate
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const agentRef = useRef<Matter.Body | null>(null);
  const goalRef = useRef<Matter.Body | null>(null);
  const worldRef = useRef<Matter.World | null>(null);
  const obstaclesRef = useRef<Matter.Body[]>([]);
  
  // State for visualization
  const [episodeCount, setEpisodeCount] = useState(0);
  const [rewardTotal, setRewardTotal] = useState(0);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [qValues, setQValues] = useState<Record<string, Record<string, number>>>({});
  
  // Set up Matter.js world
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Create engine and world
    const engine = Engine.create({
      gravity: { x: 0, y: 0 } // No gravity for grid world
    });
    engineRef.current = engine;
    worldRef.current = engine.world;
    
    // Create renderer
    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "transparent",
        pixelRatio: window.devicePixelRatio || 1,
        showVelocity: true
      }
    });
    renderRef.current = render;
    
    // Create runner for physics updates
    const runner = Runner.create();
    runnerRef.current = runner;
    
    // Set up environment based on type
    if (environmentType === "gridworld") {
      setupGridWorld(engine.world, width, height);
    } else if (environmentType === "cartpole") {
      setupCartPole(engine.world, width, height);
    } else if (environmentType === "mountaincar") {
      setupMountainCar(engine.world, width, height);
    }
    
    // Add mouse control for interaction
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });
    
    World.add(engine.world, mouseConstraint);
    
    // Keep the render in sync with the canvas
    render.mouse = mouse;
    
    // Start the renderer and runner
    Render.run(render);
    Runner.run(runner, engine);
    
    // Add collision event handling
    Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        
        // Check if agent collided with goal
        if ((pair.bodyA === agentRef.current && pair.bodyB === goalRef.current) ||
            (pair.bodyA === goalRef.current && pair.bodyB === agentRef.current)) {
          // Handle goal reached
          setRewardTotal(prev => prev + 10);
          setEpisodeCount(prev => prev + 1);
          resetAgentPosition();
        }
        
        // Check if agent collided with obstacle
        if (obstaclesRef.current.some(obstacle => 
          (pair.bodyA === agentRef.current && pair.bodyB === obstacle) ||
          (pair.bodyA === obstacle && pair.bodyB === agentRef.current)
        )) {
          // Handle obstacle collision
          setRewardTotal(prev => prev - 5);
          resetAgentPosition();
        }
      }
    });
    
    // Cleanup on unmount
    return () => {
      // Stop the runner
      Runner.stop(runner);
      // Stop the renderer
      Render.stop(render);
      // Remove all objects
      World.clear(engine.world, false);
      // Remove the renderer canvas
      if (render.canvas) {
        render.canvas.remove();
      }
      // Destroy the engine
      Engine.clear(engine);
    };
  }, [width, height, environmentType]);
  
  // Handle playing/paused state
  useEffect(() => {
    if (!runnerRef.current || !engineRef.current) return;
    
    if (isPlaying) {
      // Reset if starting a new episode
      if (episodeCount === 0) {
        resetAgentPosition();
      }
      
      // Start physics simulation
      Runner.run(runnerRef.current, engineRef.current);
      
      // Start the RL agent actions
      const intervalId = setInterval(() => {
        if (agentRef.current) {
          takeRandomAction();
        }
      }, 500);
      
      return () => clearInterval(intervalId);
    } else {
      // Pause physics simulation
      Runner.stop(runnerRef.current);
    }
  }, [isPlaying, episodeCount, agentRef]);
  
  // Custom render function to show Q-values
  const renderQValues = () => {
    if (!showQValues || !renderRef.current || !worldRef.current || !agentRef.current) return;

    const context = renderRef.current.context;
    if (!context) return;

    // Draw Q-values based on environment type
    if (environmentType === 'gridworld') {
      // Draw grid cell Q-values
      for (const [stateKey, actionValues] of Object.entries(qValues)) {
        const [x, y] = stateKey.split(',').map(Number);
        const gridSize = 5;
        const cellWidth = (width - 100) / gridSize;
        const cellHeight = (height - 100) / gridSize;
        const startX = 50;
        const startY = 50;

        const centerX = startX + x * cellWidth + cellWidth / 2;
        const centerY = startY + y * cellHeight + cellHeight / 2;

        // Skip if this is an obstacle cell
        if (obstaclesRef.current.some(obs => {
          const bounds = obs.bounds;
          return x >= (bounds.min.x - startX) / cellWidth - 0.5 && 
                 x <= (bounds.max.x - startX) / cellWidth - 0.5 &&
                 y >= (bounds.min.y - startY) / cellHeight - 0.5 && 
                 y <= (bounds.max.y - startY) / cellHeight - 0.5;
        })) continue;

        // Find best action
        let bestAction = -1;
        let bestValue = -Infinity;
        for (const [action, value] of Object.entries(actionValues)) {
          if (value > bestValue) {
            bestValue = value;
            bestAction = parseInt(action);
          }
        }

        if (bestAction !== -1 && bestValue > 0) {
          // Draw arrow indicating best action
          context.save();
          context.fillStyle = 'rgba(56, 161, 105, 0.8)';
          context.beginPath();
          
          // Direction vectors
          const directions = [
            { x: 0, y: -1 }, // Up
            { x: 1, y: 0 },  // Right
            { x: 0, y: 1 },  // Down
            { x: -1, y: 0 }  // Left
          ];
          
          const dir = directions[bestAction];
          const arrowSize = Math.min(cellWidth, cellHeight) * 0.3;
          
          // Draw arrow
          context.beginPath();
          context.moveTo(centerX, centerY);
          context.lineTo(centerX + dir.x * arrowSize, centerY + dir.y * arrowSize);
          context.lineWidth = 3;
          context.strokeStyle = `rgba(56, 161, 105, ${Math.min(bestValue / 5, 1)})`;
          context.stroke();
          
          // Draw arrowhead
          const angle = Math.atan2(dir.y, dir.x);
          context.beginPath();
          context.moveTo(centerX + dir.x * arrowSize, centerY + dir.y * arrowSize);
          context.lineTo(
            centerX + dir.x * arrowSize - 10 * Math.cos(angle - Math.PI / 6),
            centerY + dir.y * arrowSize - 10 * Math.sin(angle - Math.PI / 6)
          );
          context.lineTo(
            centerX + dir.x * arrowSize - 10 * Math.cos(angle + Math.PI / 6),
            centerY + dir.y * arrowSize - 10 * Math.sin(angle + Math.PI / 6)
          );
          context.closePath();
          context.fillStyle = `rgba(56, 161, 105, ${Math.min(bestValue / 5, 1)})`;
          context.fill();
          
          // Draw value
          context.fillStyle = 'black';
          context.font = '10px Arial';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(
            bestValue.toFixed(1),
            centerX + dir.x * arrowSize / 2,
            centerY + dir.y * arrowSize / 2
          );
          
          context.restore();
        }
      }
    } else if (environmentType === 'cartpole' || environmentType === 'mountaincar') {
      // Show current state value and action preference
      const stateKey = getCurrentStateKey();
      const actionValues = qValues[stateKey] || {};
      
      // Find best action
      let bestAction = -1;
      let bestValue = -Infinity;
      for (const [action, value] of Object.entries(actionValues)) {
        if (value > bestValue) {
          bestValue = value;
          bestAction = parseInt(action);
        }
      }
      
      if (bestAction !== -1) {
        const actionNames = environmentType === 'cartpole' 
          ? ['Left', 'Right'] 
          : ['Left', 'No Action', 'Right'];
        
        context.save();
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        context.fillRect(width - 120, 10, 110, 60);
        context.fillStyle = 'black';
        context.font = '12px Arial';
        context.textAlign = 'left';
        context.fillText(`State Value: ${bestValue.toFixed(2)}`, width - 115, 30);
        context.fillText(`Best Action: ${actionNames[bestAction]}`, width - 115, 50);
        context.restore();
      }
    }
  };
  
  // Get current state as a string key
  const getCurrentStateKey = (): string => {
    if (!agentRef.current) return '';
    
    if (environmentType === 'gridworld') {
      // Discretize position to grid cells
      const gridSize = 5;
      const cellWidth = (width - 100) / gridSize;
      const cellHeight = (height - 100) / gridSize;
      const startX = 50;
      const startY = 50;
      
      const x = Math.floor((agentRef.current.position.x - startX) / cellWidth);
      const y = Math.floor((agentRef.current.position.y - startY) / cellHeight);
      
      return `${x},${y}`;
    } else if (environmentType === 'cartpole') {
      // Discretize cart position and pole angle
      const pole = worldRef.current?.bodies.find(b => b.label === 'pole');
      if (!pole) return '';
      
      const cartPos = Math.floor((agentRef.current.position.x - width/2) / 50);
      const angle = pole.angle % (2 * Math.PI);
      const normalizedAngle = angle > Math.PI ? angle - 2 * Math.PI : angle;
      const discreteAngle = Math.floor(normalizedAngle / 0.1);
      
      return `${cartPos},${discreteAngle}`;
    } else if (environmentType === 'mountaincar') {
      // Discretize position and velocity
      const pos = Math.floor((agentRef.current.position.x - width/4) / 20);
      const vel = Math.floor(agentRef.current.velocity.x * 10);
      
      return `${pos},${vel}`;
    }
    
    return '';
  };

  // Grid World setup
  const setupGridWorld = (world: Matter.World, width: number, height: number) => {
    // Clear any existing bodies
    Composite.clear(world, false);
    obstaclesRef.current = [];
    
    // Add walls
    const wallOptions = {
      isStatic: true,
      render: {
        fillStyle: '#2d3748',
        strokeStyle: '#4a5568',
        lineWidth: 1
      }
    };
    
    const wallThickness = 20;
    
    // Top wall
    World.add(world, Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, wallOptions));
    // Bottom wall
    World.add(world, Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, wallOptions));
    // Left wall
    World.add(world, Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, wallOptions));
    // Right wall
    World.add(world, Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, wallOptions));
    
    // Grid dimensions
    const gridSize = 5;
    const cellWidth = (width - 100) / gridSize;
    const cellHeight = (height - 100) / gridSize;
    const startX = 50;
    const startY = 50;
    
    // Add obstacles
    const obstaclePositions = [
      { row: 1, col: 1 },
      { row: 2, col: 3 },
      { row: 3, col: 1 },
      { row: 3, col: 4 }
    ];
    
    for (const pos of obstaclePositions) {
      const obstacle = Bodies.rectangle(
        startX + pos.col * cellWidth + cellWidth / 2,
        startY + pos.row * cellHeight + cellHeight / 2,
        cellWidth * 0.8,
        cellHeight * 0.8,
        {
          isStatic: true,
          render: {
            fillStyle: '#e53e3e',
            strokeStyle: '#c53030',
            lineWidth: 1
          },
          label: 'obstacle'
        }
      );
      
      World.add(world, obstacle);
      obstaclesRef.current.push(obstacle);
    }
    
    // Add goal
    const goal = Bodies.circle(
      startX + (gridSize - 1) * cellWidth + cellWidth / 2,
      startY + (gridSize - 1) * cellHeight + cellHeight / 2,
      Math.min(cellWidth, cellHeight) * 0.3,
      {
        isStatic: true,
        isSensor: true,
        render: {
          fillStyle: '#38a169',
          strokeStyle: '#2f855a',
          lineWidth: 1
        },
        label: 'goal'
      }
    );
    
    World.add(world, goal);
    goalRef.current = goal;
    
    // Add agent
    const agent = Bodies.circle(
      startX + cellWidth / 2,
      startY + cellHeight / 2,
      Math.min(cellWidth, cellHeight) * 0.3,
      {
        frictionAir: 0.1,
        render: {
          fillStyle: '#3182ce',
          strokeStyle: '#2b6cb0',
          lineWidth: 1,
          sprite: {
            texture: 'https://www.svgrepo.com/show/95128/brain.svg',
            xScale: 0.5,
            yScale: 0.5
          }
        },
        label: 'agent'
      }
    );
    
    World.add(world, agent);
    agentRef.current = agent;
    
    // Draw grid lines
    for (let i = 0; i <= gridSize; i++) {
      const xPos = startX + i * cellWidth;
      const yPos = startY + i * cellHeight;
      
      // Vertical lines
      const vLine = Bodies.rectangle(xPos, startY + (gridSize * cellHeight) / 2, 1, gridSize * cellHeight, {
        isStatic: true,
        isSensor: true,
        render: {
          fillStyle: 'rgba(0, 0, 0, 0.1)',
          strokeStyle: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1
        }
      });
      
      // Horizontal lines
      const hLine = Bodies.rectangle(startX + (gridSize * cellWidth) / 2, yPos, gridSize * cellWidth, 1, {
        isStatic: true,
        isSensor: true,
        render: {
          fillStyle: 'rgba(0, 0, 0, 0.1)',
          strokeStyle: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1
        }
      });
      
      World.add(world, [vLine, hLine]);
    }
    
    // Add events for visualization
    if (renderRef.current) {
      Events.on(renderRef.current, 'afterRender', () => {
        renderQValues();
      });
    }
  };
  
  // Cart Pole setup
  const setupCartPole = (world: Matter.World, width: number, height: number) => {
    // Clear any existing bodies
    Composite.clear(world, false);
    obstaclesRef.current = [];
    
    // Add floor
    const floor = Bodies.rectangle(width / 2, height - 20, width, 40, {
      isStatic: true,
      render: {
        fillStyle: '#2d3748',
        strokeStyle: '#4a5568',
        lineWidth: 1
      },
      friction: 1
    });
    
    World.add(world, floor);
    
    // Add cart
    const cart = Bodies.rectangle(width / 2, height - 60, 100, 40, {
      frictionAir: 0.02,
      friction: 0.01,
      render: {
        fillStyle: '#3182ce',
        strokeStyle: '#2b6cb0',
        lineWidth: 1
      },
      label: 'cart',
      plugin: {
        attractors: [
          (bodyA: Matter.Body, bodyB: Matter.Body) => {
            // Only apply forces to the cart
            if (bodyA.label === 'cart') {
              // Simulate random forces (this would be from the RL agent)
              if (isPlaying && Math.random() < 0.1) {
                const forceMagnitude = (Math.random() - 0.5) * 0.05;
                Body.applyForce(bodyA, bodyA.position, { x: forceMagnitude, y: 0 });
              }
            }
            return null;
          }
        ]
      }
    });
    
    World.add(world, cart);
    agentRef.current = cart;
    
    // Add pole
    const poleLength = 150;
    const pole = Bodies.rectangle(width / 2, height - 80 - poleLength / 2, 10, poleLength, {
      frictionAir: 0.01,
      collisionFilter: {
        group: -1 // Don't collide with cart
      },
      render: {
        fillStyle: '#ed8936',
        strokeStyle: '#dd6b20',
        lineWidth: 1
      },
      label: 'pole'
    });
    
    World.add(world, pole);
    
    // Add constraint between cart and pole
    const constraint = Constraint.create({
      bodyA: cart,
      bodyB: pole,
      pointA: { x: 0, y: -20 },
      pointB: { x: 0, y: poleLength / 2 },
      length: 0,
      stiffness: 0.9,
      render: {
        visible: true,
        lineWidth: 2,
        strokeStyle: '#4a5568'
      }
    });
    
    World.add(world, constraint);
    
    // Change gravity for cart pole
    if (engineRef.current) {
      engineRef.current.gravity.y = 1;
    }
  };
  
  // Reset agent position
  const resetAgentPosition = () => {
    if (agentRef.current && environmentType === "gridworld") {
      // Reset to starting position
      Body.setPosition(agentRef.current, {
        x: 50 + (width - 100) / 10, // First cell
        y: 50 + (height - 100) / 10 // First cell
      });
      
      // Reset velocity
      Body.setVelocity(agentRef.current, { x: 0, y: 0 });
    } else if (agentRef.current && environmentType === "cartpole") {
      // Reset cart to center
      Body.setPosition(agentRef.current, {
        x: width / 2,
        y: height - 60
      });
      
      // Reset velocity
      Body.setVelocity(agentRef.current, { x: 0, y: 0 });
    }
  };
  
  // Mountain Car setup
  const setupMountainCar = (world: Matter.World, width: number, height: number) => {
    // Clear any existing bodies
    Composite.clear(world, false);
    obstaclesRef.current = [];
    
    // Create mountain shape using vertices
    const mountainPoints = [];
    const startX = 0;
    const valleyX = width / 2;
    const endX = width;
    const baseY = height - 20;
    const valleyY = height - 50;
    const peakY = height - 200;
    
    // Create a curved mountain path using sine functions
    for (let x = startX; x <= endX; x += 10) {
      let y;
      if (x < valleyX) {
        // Left mountain - starts higher, drops to valley
        const progress = x / valleyX;
        y = baseY - (baseY - valleyY) * Math.sin(progress * Math.PI / 2) - 50 * Math.sin(progress * Math.PI);
      } else {
        // Right mountain - rises from valley to peak
        const progress = (x - valleyX) / (endX - valleyX);
        y = valleyY - (peakY - valleyY) * Math.sin(progress * Math.PI / 2);
      }
      mountainPoints.push({ x, y });
    }
    
    // Add final point at bottom right
    mountainPoints.push({ x: endX, y: baseY });
    
    // Add starting point at bottom left
    mountainPoints.unshift({ x: startX, y: baseY });
    
    // Create mountain terrain
    const mountain = Bodies.fromVertices(width / 2, height / 2, [mountainPoints], {
      isStatic: true,
      render: {
        fillStyle: '#2d3748',
        strokeStyle: '#4a5568',
        lineWidth: 1
      },
      friction: 0.3
    });
    
    World.add(world, mountain);
    
    // Add car (the agent)
    const car = Bodies.circle(valleyX, valleyY - 15, 15, {
      friction: 0.01,
      frictionAir: 0.0001, // Very low air friction to simulate momentum
      render: {
        fillStyle: '#3182ce',
        strokeStyle: '#2b6cb0',
        lineWidth: 1,
        sprite: {
          texture: 'https://www.svgrepo.com/show/427475/car-transportation-vehicle.svg',
          xScale: 0.5,
          yScale: 0.5
        }
      },
      label: 'agent'
    });
    
    // Add car to world
    World.add(world, car);
    agentRef.current = car;
    
    // Add goal flag at the peak
    const flag = Bodies.rectangle(endX - 50, peakY - 30, 10, 40, {
      isStatic: true,
      isSensor: true,
      render: {
        fillStyle: '#38a169',
        strokeStyle: '#2f855a',
        lineWidth: 1
      },
      label: 'goal'
    });
    
    World.add(world, flag);
    goalRef.current = flag;
    
    // Change gravity for mountain car
    if (engineRef.current) {
      engineRef.current.gravity.y = 0.5;
    }
    
    // Add events for visualization
    if (renderRef.current) {
      Events.on(renderRef.current, 'afterRender', () => {
        renderQValues();
      });
    }
  };

  // Take a random action (for demonstration)
  const takeRandomAction = () => {
    if (!agentRef.current) return;
    
    if (environmentType === "gridworld") {
      // Grid world actions: up, right, down, left
      const actions = [
        { name: "Up", vector: { x: 0, y: -2 * speed } },
        { name: "Right", vector: { x: 2 * speed, y: 0 } },
        { name: "Down", vector: { x: 0, y: 2 * speed } },
        { name: "Left", vector: { x: -2 * speed, y: 0 } }
      ];
      
      // Choose random action for now
      // In a real RL implementation, this would come from the policy
      const actionIndex = Math.floor(Math.random() * actions.length);
      const action = actions[actionIndex];
      
      // Apply force to move in that direction
      Body.applyForce(
        agentRef.current,
        agentRef.current.position,
        action.vector
      );
      
      // Update current action for display
      setCurrentAction(action.name);
      
      // Small negative reward for each step
      const stepReward = -0.1;
      setRewardTotal(prev => prev + stepReward);
      if (onRewardUpdate) onRewardUpdate(stepReward);
      
      // Update Q-values
      const stateKey = getCurrentStateKey();
      if (!qValues[stateKey]) qValues[stateKey] = {};
      if (!qValues[stateKey][actionIndex]) qValues[stateKey][actionIndex] = 0;
      
      qValues[stateKey][actionIndex] += 0.1 * stepReward;
      setQValues({...qValues});
      
    } else if (environmentType === "cartpole") {
      // Cart pole actions: move left, move right
      const actions = [
        { name: "Left", vector: { x: -0.05 * speed, y: 0 } },
        { name: "Right", vector: { x: 0.05 * speed, y: 0 } }
      ];
      
      // Choose random action for now
      const actionIndex = Math.floor(Math.random() * actions.length);
      const action = actions[actionIndex];
      
      // Apply force to move cart
      Body.applyForce(
        agentRef.current,
        agentRef.current.position,
        action.vector
      );
      
      // Update current action for display
      setCurrentAction(action.name);
      
      // Reward based on pole angle
      // This would be more sophisticated in a real implementation
      const pole = worldRef.current?.bodies.find(b => b.label === 'pole');
      if (pole) {
        const angle = pole.angle % (2 * Math.PI);
        const normalizedAngle = angle > Math.PI ? angle - 2 * Math.PI : angle;
        const reward = 1 - Math.abs(normalizedAngle) * 2;
        
        setRewardTotal(prev => prev + reward);
        if (onRewardUpdate) onRewardUpdate(reward);
        
        // Update Q-values
        const stateKey = getCurrentStateKey();
        if (!qValues[stateKey]) qValues[stateKey] = {};
        if (!qValues[stateKey][actionIndex]) qValues[stateKey][actionIndex] = 0;
        
        qValues[stateKey][actionIndex] += 0.1 * reward;
        setQValues({...qValues});
        
        // End episode if pole falls too much
        if (Math.abs(normalizedAngle) > 0.5) {
          setRewardTotal(prev => prev - 5);
          resetAgentPosition();
          setEpisodeCount(prev => {
            if (onEpisodeUpdate) onEpisodeUpdate(prev + 1);
            return prev + 1;
          });
        }
      }
    } else if (environmentType === "mountaincar") {
      // Mountain car actions: accelerate left, do nothing, accelerate right
      const actions = [
        { name: "Left", vector: { x: -0.02 * speed, y: 0 } },
        { name: "No Action", vector: { x: 0, y: 0 } },
        { name: "Right", vector: { x: 0.02 * speed, y: 0 } }
      ];
      
      // Choose random action for now
      const actionIndex = Math.floor(Math.random() * actions.length);
      const action = actions[actionIndex];
      
      // Apply force to move car
      Body.applyForce(
        agentRef.current,
        agentRef.current.position,
        action.vector
      );
      
      // Update current action for display
      setCurrentAction(action.name);
      
      // Small negative reward for each step
      const stepReward = -0.1;
      setRewardTotal(prev => prev + stepReward);
      if (onRewardUpdate) onRewardUpdate(stepReward);
      
      // Update Q-values
      const stateKey = getCurrentStateKey();
      if (!qValues[stateKey]) qValues[stateKey] = {};
      if (!qValues[stateKey][actionIndex]) qValues[stateKey][actionIndex] = 0;
      
      qValues[stateKey][actionIndex] += 0.1 * stepReward;
      setQValues({...qValues});
      
      // Check if we reached the goal (right mountain peak)
      if (goalRef.current && agentRef.current) {
        const distance = Vector.magnitude(
          Vector.sub(goalRef.current.position, agentRef.current.position)
        );
        
        if (distance < 50) {
          // Big reward for reaching the goal
          const reachGoalReward = 10;
          setRewardTotal(prev => prev + reachGoalReward);
          if (onRewardUpdate) onRewardUpdate(reachGoalReward);
          
          // Update Q-values for this state-action pair
          qValues[stateKey][actionIndex] += 0.1 * reachGoalReward;
          setQValues({...qValues});
          
          // Reset position and increment episode
          resetAgentPosition();
          setEpisodeCount(prev => {
            if (onEpisodeUpdate) onEpisodeUpdate(prev + 1);
            return prev + 1;
          });
        }
      }
    }
  };
  
  return (
    <div className="relative">
      <canvas ref={canvasRef} className="bg-white dark:bg-gray-900 rounded-lg shadow-sm" />
      
      {/* Overlay info */}
      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-md shadow-md opacity-80 hover:opacity-100 transition-opacity">
        <div className="text-sm font-medium">Episode: {episodeCount}</div>
        <div className="text-sm font-medium">Reward: {rewardTotal.toFixed(2)}</div>
        {currentAction && <div className="text-sm font-medium">Action: {currentAction}</div>}
      </div>
      
      {/* Learning indicator */}
      {isPlaying && (
        <div className="absolute top-4 left-4">
          <Badge className="bg-green-500 animate-pulse">
            <FaBrain className="mr-1" /> Learning
          </Badge>
        </div>
      )}
      
      {/* Help text overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            className="bg-black bg-opacity-50 text-white p-6 rounded-lg text-center max-w-md"
          >
            <FaBrain className="mx-auto mb-2 h-8 w-8" />
            <h3 className="text-xl font-bold mb-2">Reinforcement Learning Environment</h3>
            <p className="mb-4">Press play to watch the agent learn through trial and error.</p>
            <div className="text-sm text-gray-300">Drag elements to interact with the environment</div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
