import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { Application, Container, Graphics, Text } from 'pixi.js';
import { AnimationStep } from '@/classes/sorting/SortingAlgorithms';
import { gsap } from 'gsap';
import useResizeObserver from '@/hooks/useResizeObserver';

interface PixiSortingVisualizerProps {
  blocks: number[];
  animationSteps: AnimationStep[];
  isPlaying: boolean;
  speed: number;
  currentStep?: number; // Current step for manual navigation
  onSortingComplete: () => void;
  onStepChange?: (step: number) => void; // Callback when step changes
  colorScheme?: {
    background: string;
    defaultBar: string;
    activeBar: string;
    comparingBar: string;
    sortedBar: string;
    selectBar?: string;
    setValue?: string;
  };
}

const defaultColorScheme = {
  background: '#121212',
  defaultBar: '#4a5568',
  activeBar: '#ed8936',
  comparingBar: '#4299e1',
  sortedBar: '#48bb78',
  selectBar: '#805AD5',
  setValue: '#F56565',
};

const hexToNumber = (hex: string) => parseInt(hex.replace('#', '0x'));

export default function PixiSortingVisualizer({
  blocks,
  animationSteps,
  isPlaying,
  speed,
  currentStep = 0,
  onSortingComplete,
  onStepChange,
  colorScheme = defaultColorScheme,
}: PixiSortingVisualizerProps) {
  const pixiContainerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const barsContainerRef = useRef<PIXI.Container | null>(null);
  const barsRef = useRef<PIXI.Graphics[]>([]);
  const labelsRef = useRef<PIXI.Text[]>([]);
  const valueMapRef = useRef<Map<number, number>>(new Map());

  const currentStepRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const isSortingRef = useRef<boolean>(false);
  const lastTimestampRef = useRef<number>(0);
  const animationProgressRef = useRef<number>(0);
  const sortingStateRef = useRef<{ [key: number]: string }>({});

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerSize = useResizeObserver(pixiContainerRef);
  const [fps, setFps] = useState<number>(0);

  const getBarDimensions = useCallback(() => {
    if (!containerSize) {
      return { barWidth: 0, spacing: 0, maxHeight: 0 };
    }

    const width = containerSize.width;
    const height = containerSize.height;
    const barWidth = Math.max((width / blocks.length) * 0.7, 10);
    const spacing = Math.max((width / blocks.length) * 0.3, 5);
    const maxHeight = height * 0.85;

    return { barWidth, spacing, maxHeight };
  }, [blocks.length, containerSize]);

  useEffect(() => {
    if (containerSize) {
      setDimensions({
        width: containerSize.width,
        height: Math.min(containerSize.width * 0.5, 500),
      });
    }
  }, [containerSize]);

  useEffect(() => {
    if (!pixiContainerRef.current || dimensions.width === 0) return;

    const app = new Application({
      width: dimensions.width,
      height: dimensions.height,
      backgroundColor: hexToNumber(colorScheme.background),
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    const barsContainer = new Container();
    barsContainer.sortableChildren = true;
    app.stage.addChild(barsContainer);
    barsContainerRef.current = barsContainer;
    appRef.current = app;

    let frameCount = 0;
    let lastTime = performance.now();
    const updateFPS = () => {
      const now = performance.now();
      frameCount++;
      if (now - lastTime > 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
    };

    app.ticker.add(updateFPS);
    pixiContainerRef.current.appendChild(app.view);

    blocks.forEach((value, index) => {
      valueMapRef.current.set(index, value);
    });

    drawBars();

    return () => {
      app.ticker.remove(updateFPS);
      app.destroy(true, { children: true, texture: true, baseTexture: true });
      if (pixiContainerRef.current && app.view && pixiContainerRef.current.contains(app.view)) {
        pixiContainerRef.current.removeChild(app.view);
      }
      appRef.current = null;
      barsContainerRef.current = null;
      barsRef.current = [];
      labelsRef.current = [];
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [dimensions]);

  useEffect(() => {
    resetAnimation();
    valueMapRef.current.clear();
    blocks.forEach((value, index) => {
      valueMapRef.current.set(index, value);
    });
    drawBars();
  }, [blocks]);

  useEffect(() => {
    if (appRef.current && dimensions.width > 0) {
      appRef.current.renderer.resize(dimensions.width, dimensions.height);
      drawBars();
    }
  }, [dimensions]);

  // Control current step externally (for manual step navigation)
  useEffect(() => {
    if (!isPlaying && typeof currentStep === 'number' && currentStep >= 0) {
      // Only update if not playing
      currentStepRef.current = Math.min(currentStep, animationSteps.length - 1);
      updateBarPositions();
    }
  }, [currentStep, animationSteps.length, isPlaying]);

  // Control play/pause state
  useEffect(() => {
    if (isPlaying && !isSortingRef.current) {
      startSorting();
    } else {
      pauseSorting();
    }
    return () => pauseSorting();
  }, [isPlaying, speed]);

  const resetAnimation = () => {
    currentStepRef.current = 0;
    animationProgressRef.current = 0;
    lastTimestampRef.current = 0;
    isSortingRef.current = false;
    sortingStateRef.current = {};
    valueMapRef.current.clear();
    blocks.forEach((value, index) => {
      valueMapRef.current.set(index, value);
    });
  };

  const drawBars = useCallback(() => {
    if (!appRef.current || !barsContainerRef.current || !dimensions.width) return;

    barsContainerRef.current.removeChildren();
    barsRef.current = [];
    labelsRef.current = [];

    const { barWidth, spacing, maxHeight } = getBarDimensions();
    const maxValue = Math.max(...blocks, 1);

    blocks.forEach((value, index) => {
      const barHeight = Math.max((value / maxValue) * maxHeight, 5);
      const barContainer = new Container();
      barContainer.position.set(index * (barWidth + spacing) + spacing / 2, 0);
      barContainer.zIndex = index;

      const bar = new Graphics();
      bar.beginFill(hexToNumber(sortingStateRef.current[index] === 'sorted'
        ? colorScheme.sortedBar
        : colorScheme.defaultBar));
      bar.drawRect(0, 0, barWidth, barHeight);
      bar.endFill();
      bar.position.set(0, dimensions.height - barHeight - 30);

      barContainer.addChild(bar);
      barsContainerRef.current.addChild(barContainer);
      barsRef.current.push(bar);

      const label = new Text(value.toString(), {
        fontFamily: 'Arial',
        fontSize: Math.max(12, barWidth * 0.3),
        fill: '#ffffff',
        align: 'center',
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowDistance: 1,
      });

      label.anchor.set(0.5, 0);
      label.position.set(barWidth / 2, barHeight + 5);
      barContainer.addChild(label);
      labelsRef.current.push(label);
    });
  }, [blocks, dimensions, colorScheme]);

  const updateBarPositions = useCallback(() => {
    if (!barsContainerRef.current || !appRef.current) return;

    const { barWidth, spacing, maxHeight } = getBarDimensions();
    const maxValue = Math.max(...blocks, 1);

    const currentStep = animationSteps[currentStepRef.current];
    if (!currentStep) return;

    barsRef.current.forEach((bar, index) => {
      const value = valueMapRef.current.get(index) || 0;
      const barHeight = Math.max((value / maxValue) * maxHeight, 5);
      bar.clear();
      let fillColor = colorScheme.defaultBar;

      if (sortingStateRef.current[index] === 'sorted') {
        fillColor = colorScheme.sortedBar;
      } else if (currentStep.type === 'compare' && (index === currentStep.from || index === currentStep.to)) {
        fillColor = colorScheme.comparingBar;
      } else if (currentStep.type === 'swap' && (index === currentStep.from || index === currentStep.to)) {
        fillColor = colorScheme.activeBar;
      } else if (currentStep.type === 'set' && index === currentStep.from) {
        fillColor = colorScheme.setValue;
      }

      bar.beginFill(hexToNumber(fillColor));
      bar.drawRect(0, 0, barWidth, barHeight);
      bar.endFill();
      bar.position.y = dimensions.height - barHeight - 30;

      const label = labelsRef.current[index];
      if (label) {
        label.text = value.toString();
        label.position.set(barWidth / 2, barHeight + 5);
      }

      bar.parent.position.x = index * (barWidth + spacing) + spacing / 2;
    });
  }, [blocks, dimensions, colorScheme, animationSteps]);

  const animate = useCallback((timestamp: number) => {
    if (!isSortingRef.current || !appRef.current) return;

    if (!lastTimestampRef.current) {
      lastTimestampRef.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    const deltaTime = timestamp - lastTimestampRef.current;
    const baseDuration = 800 / speed;
    let duration = baseDuration;

    const currentStep = animationSteps[currentStepRef.current];
    if (currentStep) {
      switch (currentStep.type) {
        case 'compare':
          duration = baseDuration * 0.5;
          break;
        case 'swap':
          duration = baseDuration * 1.2;
          break;
        case 'set':
          duration = baseDuration * 0.8;
          break;
        default:
          duration = baseDuration;
      }
    }

    // Use GSAP's easing for a more natural animation feel
    const progress = gsap.parseEase("power2.out")(Math.min(deltaTime / duration, 1));
    animationProgressRef.current = Math.min(animationProgressRef.current + progress, 1);

    if (animationProgressRef.current >= 1) {
      animationProgressRef.current = 0;

      if (currentStep) {
        if (currentStep.type === 'set' && typeof currentStep.value !== 'undefined') {
          valueMapRef.current.set(currentStep.from, currentStep.value);
        } else if (currentStep.type === 'swap' || !currentStep.type) {
          const { from, to } = currentStep;
          const fromValue = valueMapRef.current.get(from);
          const toValue = valueMapRef.current.get(to);

          if (typeof fromValue !== 'undefined' && typeof toValue !== 'undefined') {
            valueMapRef.current.set(from, toValue);
            valueMapRef.current.set(to, fromValue);
          }
        }
      }

      if (currentStepRef.current < animationSteps.length - 1) {
        currentStepRef.current++;
        // Notify parent component about step change
        onStepChange?.(currentStepRef.current);
      } else {
        barsRef.current.forEach((_, index) => {
          sortingStateRef.current[index] = 'sorted';
        });

        updateBarPositions();

        // Add a celebratory animation for completion
        if (barsContainerRef.current) {
          // Use GSAP for a bouncy celebratory animation
          gsap.to(barsContainerRef.current.scale, {
            x: 1.05,
            y: 1.05,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: "elastic.out(1, 0.3)",
            onComplete: () => {
              barsContainerRef.current?.scale.set(1, 1);
            }
          });
          
          // Add a subtle flash effect on the bars
          barsRef.current.forEach((bar, index) => {
            gsap.to(bar, {
              alpha: 0.5,
              duration: 0.2,
              yoyo: true,
              repeat: 1,
              ease: "power2.inOut",
              delay: index * 0.05 % 0.5 // Staggered effect with a wrap
            });
          });
        }

        isSortingRef.current = false;
        onSortingComplete();
        return;
      }
    }

    updateBarPositions();
    lastTimestampRef.current = timestamp;
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [animationSteps, speed, colorScheme, onSortingComplete, onStepChange, updateBarPositions]);

  const startSorting = useCallback(() => {
    if (isSortingRef.current || animationSteps.length === 0) return;

    isSortingRef.current = true;
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Add a subtle start animation
    if (barsContainerRef.current) {
      gsap.from(barsContainerRef.current.scale, {
        x: 0.95,
        y: 0.95,
        duration: 0.3,
        ease: "back.out(1.7)"
      });
    }
  }, [animate]);

  const pauseSorting = useCallback(() => {
    isSortingRef.current = false;
    cancelAnimationFrame(animationFrameRef.current);
    
    // Add a subtle pause animation
    if (barsContainerRef.current) {
      gsap.to(barsContainerRef.current, {
        alpha: 0.9,
        duration: 0.2,
        yoyo: true,
        repeat: 1
      });
    }
  }, []);
  
  // Function to manually move to a specific step (for external control)
  const goToStep = useCallback((step: number) => {
    if (step < 0 || step >= animationSteps.length || isSortingRef.current) return;
    
    // Reset the value map to match original blocks
    valueMapRef.current.clear();
    blocks.forEach((value, index) => {
      valueMapRef.current.set(index, value);
    });
    
    // Apply all steps up to the target step
    for (let i = 0; i <= step; i++) {
      const stepData = animationSteps[i];
      if (!stepData) continue;
      
      if (stepData.type === 'set' && typeof stepData.value !== 'undefined') {
        valueMapRef.current.set(stepData.from, stepData.value);
      } else if (stepData.type === 'swap' || !stepData.type) {
        const { from, to } = stepData;
        const fromValue = valueMapRef.current.get(from);
        const toValue = valueMapRef.current.get(to);
        if (typeof fromValue !== 'undefined' && typeof toValue !== 'undefined') {
          valueMapRef.current.set(from, toValue);
          valueMapRef.current.set(to, fromValue);
        }
      }
      
      // Mark sorted states
      if (stepData.type === 'done') {
        sortingStateRef.current[stepData.from] = 'sorted';
      }
    }
    
    // Update current step
    currentStepRef.current = step;
    updateBarPositions();
  }, [animationSteps, blocks, updateBarPositions]);

  // Effect to apply external step control
  useEffect(() => {
    if (!isPlaying && typeof currentStep === 'number' && animationSteps.length > 0) {
      goToStep(currentStep);
    }
  }, [currentStep, isPlaying, animationSteps.length, goToStep]);
  
  return (
    <div className="relative w-full h-full">
      <div
        ref={pixiContainerRef}
        className="w-full h-full rounded-lg shadow-lg overflow-hidden"
      />
      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
        {/* Array info */}
        <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          Array Size: {blocks.length}
        </div>
        
        {/* FPS counter */}
        {fps > 0 && (
          <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {fps} FPS
          </div>
        )}
      </div>
    </div>
  );
}