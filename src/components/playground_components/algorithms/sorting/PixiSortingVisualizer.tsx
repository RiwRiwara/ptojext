import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Application, Container, Graphics, Text } from 'pixi.js';

// Define animation step interface
type AnimationStep = { from: number; to: number };

interface PixiSortingVisualizerProps {
  blocks: number[];
  animationSteps: AnimationStep[];
  isPlaying: boolean;
  speed: number;
  onSortingComplete: () => void;
  colorScheme?: {
    background: string;
    defaultBar: string;
    activeBar: string;
    comparingBar: string;
    sortedBar: string;
  };
}

const defaultColorScheme = {
  background: '#121212',
  defaultBar: '#4a5568',
  activeBar: '#ed8936',
  comparingBar: '#4299e1',
  sortedBar: '#48bb78',
};

// Utility function to convert HEX to number for PIXI
const hexToNumber = (hex: string) => parseInt(hex.replace('#', '0x'));

export default function PixiSortingVisualizer({
  blocks,
  animationSteps,
  isPlaying,
  speed,
  onSortingComplete,
  colorScheme = defaultColorScheme,
}: PixiSortingVisualizerProps) {
  const pixiContainerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const barsRef = useRef<PIXI.Graphics[]>([]);
  const labelsRef = useRef<PIXI.Text[]>([]);
  
  // Animation state
  const currentStepRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const isSortingRef = useRef<boolean>(false);
  const lastTimestampRef = useRef<number>(0);
  const animationProgressRef = useRef<number>(0);
  const sortingStateRef = useRef<{[key: number]: string}>({});
  
  // Canvas dimensions
  const width = 800;
  const height = 400;
  
  const [fps, setFps] = useState<number>(0);
  
  // Setup PIXI application
  useEffect(() => {
    if (!pixiContainerRef.current) return;
    
    // Create PIXI Application
    const app = new Application({
      width,
      height,
      backgroundColor: hexToNumber(colorScheme.background),
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    
    // Simple FPS counter
    let frameCount = 0;
    let lastTime = performance.now();
    const updateFPS = () => {
      const now = performance.now();
      frameCount++;
      
      // Update FPS every second
      if (now - lastTime > 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
    };
    
    app.ticker.add(updateFPS);
    
    pixiContainerRef.current.appendChild(app.view as unknown as Node);
    appRef.current = app;
    
    // Initial drawing of bars
    drawBars();
    
    return () => {
      app.destroy(true, true);
      if (pixiContainerRef.current && pixiContainerRef.current.contains(app.view as unknown as Node)) {
        pixiContainerRef.current.removeChild(app.view as unknown as Node);
      }
      appRef.current = null;
      barsRef.current = [];
      labelsRef.current = [];
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);
  
  // Redraw when blocks change
  useEffect(() => {
    resetAnimation();
    drawBars();
  }, [blocks]);
  
  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      startSorting();
    } else {
      pauseSorting();
    }
    
    return () => {
      pauseSorting();
    };
  }, [isPlaying, speed]);
  
  const resetAnimation = () => {
    currentStepRef.current = 0;
    animationProgressRef.current = 0;
    lastTimestampRef.current = 0;
    isSortingRef.current = false;
    sortingStateRef.current = {};
  };
  
  const drawBars = () => {
    if (!appRef.current) return;
    
    // Clear existing graphics
    barsRef.current.forEach(bar => {
      if (bar.parent) bar.parent.removeChild(bar);
    });
    
    labelsRef.current.forEach(label => {
      if (label.parent) label.parent.removeChild(label);
    });
    
    barsRef.current = [];
    labelsRef.current = [];
    
    // Calculate bar dimensions
    const maxValue = Math.max(...blocks, 1);
    const barWidth = (width / blocks.length) * 0.8;
    const spacing = (width / blocks.length) * 0.2;
    
    // Create bars and labels
    blocks.forEach((value, index) => {
      const barHeight = (value / maxValue) * (height * 0.7);
      
      // Create bar
      const bar = new Graphics();
      bar.beginFill(hexToNumber(colorScheme.defaultBar));
      bar.drawRoundedRect(
        index * (barWidth + spacing) + spacing/2,
        height - barHeight - 30,
        barWidth,
        barHeight,
        barWidth * 0.2  // rounded corners
      );
      bar.endFill();
      
      // Create label
      const label = new Text(value.toString(), {
        fontFamily: 'Arial',
        fontSize: 14,
        fill: 0xffffff,
        align: 'center',
      });
      label.anchor.set(0.5, 1);
      label.position.set(
        index * (barWidth + spacing) + spacing/2 + barWidth/2,
        height - barHeight - 35
      );
      
      appRef.current?.stage.addChild(bar);
      appRef.current?.stage.addChild(label);
      
      barsRef.current.push(bar);
      labelsRef.current.push(label);
    });
  };
  
  const updateBarPositions = () => {
    if (!appRef.current) return;
    
    const maxValue = Math.max(...blocks, 1);
    const barWidth = (width / blocks.length) * 0.8;
    const spacing = (width / blocks.length) * 0.2;
    
    // Create a copy of the array to represent current state
    const currentArray = [...blocks];
    
    // Apply all completed steps to get current state
    for (let i = 0; i < currentStepRef.current; i++) {
      const step = animationSteps[i];
      [currentArray[step.from], currentArray[step.to]] = 
        [currentArray[step.to], currentArray[step.from]];
    }
    
    // Current step being animated
    const currentStep = animationSteps[currentStepRef.current];
    
    // Update positions and colors
    barsRef.current.forEach((bar, index) => {
      let targetIndex = index;
      
      // If this is part of the current animation step
      if (currentStep && (index === currentStep.from || index === currentStep.to)) {
        // Calculate interpolated position
        const otherIndex = index === currentStep.from ? currentStep.to : currentStep.from;
        const progress = animationProgressRef.current;
        
        // Linear interpolation between original and target positions
        const startX = index * (barWidth + spacing) + spacing/2;
        const endX = otherIndex * (barWidth + spacing) + spacing/2;
        const newX = startX + (endX - startX) * progress;
        
        bar.x = newX - (index * (barWidth + spacing) + spacing/2);
        
        // Set color to active for bars being swapped
        bar.tint = hexToNumber(colorScheme.activeBar);
        
        // Update label position
        if (labelsRef.current[index]) {
          const label = labelsRef.current[index];
          label.x = newX + barWidth/2;
        }
      } else {
        // Static bars - just check if they should be colored as sorted
        bar.x = 0; // Reset any animations
        
        // Set color based on state
        if (sortingStateRef.current[index] === 'sorted') {
          bar.tint = hexToNumber(colorScheme.sortedBar);
        } else if (sortingStateRef.current[index] === 'comparing') {
          bar.tint = hexToNumber(colorScheme.comparingBar);
        } else {
          bar.tint = hexToNumber(colorScheme.defaultBar);
        }
      }
    });
  };
  
  const animate = (timestamp: number) => {
    if (!isSortingRef.current || !appRef.current) return;
    
    // Initialize last timestamp if needed
    if (!lastTimestampRef.current) {
      lastTimestampRef.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }
    
    // Calculate progress
    const deltaTime = timestamp - lastTimestampRef.current;
    const duration = 500 / speed; // Animation duration adjusted by speed
    
    animationProgressRef.current += deltaTime / duration;
    
    // Check if current step animation is complete
    if (animationProgressRef.current >= 1) {
      // Apply the step and move to next
      animationProgressRef.current = 0;
      
      if (currentStepRef.current < animationSteps.length - 1) {
        // Move to next step
        currentStepRef.current++;
        
        // Mark bars that are in final position
        if (currentStepRef.current >= animationSteps.length - blocks.length) {
          // In the final steps, start marking sorted bars
          for (let i = 0; i < blocks.length; i++) {
            // Check if this bar is involved in any future swaps
            let isSorted = true;
            for (let j = currentStepRef.current; j < animationSteps.length; j++) {
              if (animationSteps[j].from === i || animationSteps[j].to === i) {
                isSorted = false;
                break;
              }
            }
            if (isSorted) {
              sortingStateRef.current[i] = 'sorted';
            }
          }
        }
      } else {
        // All done - mark all as sorted
        for (let i = 0; i < blocks.length; i++) {
          sortingStateRef.current[i] = 'sorted';
        }
        
        // Final update to show all sorted
        updateBarPositions();
        
        // Sorting complete
        isSortingRef.current = false;
        onSortingComplete();
        return;
      }
    }
    
    // Update visuals based on current animation state
    updateBarPositions();
    
    // Continue animation loop
    lastTimestampRef.current = timestamp;
    animationFrameRef.current = requestAnimationFrame(animate);
  };
  
  const startSorting = () => {
    if (isSortingRef.current || animationSteps.length === 0) return;
    
    isSortingRef.current = true;
    animationFrameRef.current = requestAnimationFrame(animate);
  };
  
  const pauseSorting = () => {
    isSortingRef.current = false;
    cancelAnimationFrame(animationFrameRef.current);
  };
  
  return (
    <div className="relative">
      <div ref={pixiContainerRef} className="pixi-container rounded-lg shadow-lg overflow-hidden" />
      {fps > 0 && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          {fps} FPS
        </div>
      )}
    </div>
  );
}
