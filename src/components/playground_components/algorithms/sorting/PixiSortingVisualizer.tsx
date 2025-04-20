import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { Application, Container, Graphics, Text } from 'pixi.js';
import { AnimationStep } from '@/classes/sorting/SortingAlgorithms';
import { gsap } from 'gsap';
import useResizeObserver from '@/hooks/useResizeObserver';
import { Tooltip } from '@nextui-org/tooltip';

interface PixiSortingVisualizerProps {
  blocks: number[];
  animationSteps: AnimationStep[];
  isPlaying: boolean;
  speed: number;
  currentStep?: number;
  onSortingComplete: () => void;
  onStepChange?: (step: number) => void;
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
  background: '#fafbfc', // minimal off-white
  defaultBar: '#e5e7eb', // minimal light gray
  activeBar: '#2563eb', // minimal blue accent
  comparingBar: '#64748b', // minimal muted blue-gray
  sortedBar: '#a3a3a3', // minimal mid-gray
  selectBar: '#facc15', // minimal yellow accent
  setValue: '#f87171', // minimal red accent
};

const hexToNumber = (hex?: string): number => {
  if (!hex || typeof hex !== 'string') return 0x121212;
  try {
    return parseInt(hex.replace('#', '0x'));
  } catch (error) {
    console.warn('Error parsing color:', error);
    return 0x121212;
  }
};

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
    const ratio = blocks.length <= 10 ? 0.8 : blocks.length <= 20 ? 0.7 : 0.6;
    const barWidth = Math.max((width / blocks.length) * ratio, 10);
    const spacing = Math.max((width / blocks.length) * (1 - ratio), 5);
    const maxHeight = height * 0.8;

    return { barWidth, spacing, maxHeight };
  }, [blocks.length, containerSize]);

  const createGradientTexture = (barWidth: number, barHeight: number, color: number): PIXI.Texture | null => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = barWidth;
      canvas.height = barHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const gradient = ctx.createLinearGradient(0, 0, barWidth, 0);
      const hexColor = '#' + color.toString(16).padStart(6, '0');
      gradient.addColorStop(0, hexColor);
      gradient.addColorStop(0.5, lightenColor(hexColor, 15));
      gradient.addColorStop(1, hexColor);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, barWidth, barHeight);

      return PIXI.Texture.from(canvas);
    } catch (error) {
      console.error('Error creating gradient texture:', error);
      return null;
    }
  };

  const lightenColor = (hex: string, percent: number): string => {
    let color = hex.replace('#', '');
    if (color.length === 3) {
      color = color.split('').map(c => c + c).join('');
    }
    const num = parseInt(color, 16);
    let r = (num >> 16) & 0xff;
    let g = (num >> 8) & 0xff;
    let b = num & 0xff;

    r = Math.min(255, Math.round(r + (255 - r) * (percent / 100)));
    g = Math.min(255, Math.round(g + (255 - g) * (percent / 100)));
    b = Math.min(255, Math.round(b + (255 - b) * (percent / 100)));

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  useEffect(() => {
    if (containerSize) {
      setDimensions({
        width: containerSize.width,
        height: Math.min(Math.max(containerSize.width * 0.4, 300), 500),
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
    pixiContainerRef.current.appendChild(app.view as unknown as Node);

    blocks.forEach((value, index) => {
      valueMapRef.current.set(index, value);
    });

    drawBars();

    return () => {
      app.ticker.remove(updateFPS);
      app.destroy(true, { children: true, texture: true, baseTexture: true });
      if (pixiContainerRef.current && app.view && pixiContainerRef.current.contains(app.view as unknown as Node)) {
        pixiContainerRef.current.removeChild(app.view as unknown as Node);
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

  useEffect(() => {
    if (!isPlaying && typeof currentStep === 'number' && currentStep >= 0) {
      currentStepRef.current = Math.min(currentStep, animationSteps.length - 1);
      updateBarPositions();
    }
  }, [currentStep, animationSteps.length, isPlaying]);

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

    const gridGraphics = new Graphics();
    gridGraphics.lineStyle(1, 0xeeeeee, 0.3);
    const gridLines = 5;
    for (let i = 0; i < gridLines; i++) {
      const y = dimensions.height - (i * (dimensions.height * 0.7) / (gridLines - 1)) - dimensions.height * 0.1;
      gridGraphics.moveTo(0, y);
      gridGraphics.lineTo(dimensions.width, y);
    }
    barsContainerRef.current.addChild(gridGraphics);

    const { barWidth, spacing, maxHeight } = getBarDimensions();
    const maxValue = Math.max(...blocks, 1);

    const totalWidth = barWidth * blocks.length + spacing * (blocks.length - 1);
    barsContainerRef.current.x = (dimensions.width - totalWidth) / 2;
    barsContainerRef.current.y = dimensions.height * 0.05;

    // Use valueMapRef for real-time values
    const currentArray = Array.from({ length: blocks.length }, (_, i) => valueMapRef.current.get(i) ?? 0);
    currentArray.forEach((value, index) => {
      const barHeight = Math.max((value / maxValue) * maxHeight, 5);
      const barContainer = new Container();
      barContainer.position.set(index * (barWidth + spacing) + spacing / 2, 0);
      barContainer.zIndex = index;

      const bar = new Graphics();
      // Highlight bar if it's being compared, swapped, set, or selected
      let barColor = colorScheme.defaultBar;
      let borderColor = 0x000000;
      let borderAlpha = 0;
      if (sortingStateRef.current[index] === 'sorted') {
        barColor = colorScheme.sortedBar;
      }
      if (currentStepObj) {
        if (
          (stepType === 'compare' && (index === from || index === to)) ||
          (stepType === 'swap' && (index === from || index === to))
        ) {
          borderColor = 0x2563eb; // blue
          borderAlpha = 1;
        } else if (stepType === 'set' && index === from) {
          borderColor = 0xf59e42; // orange
          borderAlpha = 1;
        } else if (stepType === 'select' && index === from) {
          borderColor = 0xfbbf24; // yellow
          borderAlpha = 1;
        }
      }
      bar.lineStyle(borderAlpha ? 4 : 0, borderColor, borderAlpha);
      bar.beginFill(hexToNumber(barColor));
      bar.drawRoundedRect(0, 0, barWidth, barHeight, Math.min(barWidth / 3, 8));
      bar.endFill();
      bar.position.set(0, dimensions.height - barHeight - 30);
      barContainer.addChild(bar);
      barsContainerRef.current?.addChild(barContainer);
      barsRef.current.push(bar);
      // Number label
      const label = new Text(value.toString(), {
        fontFamily: 'Arial',
        fontSize: Math.max(18, barWidth * 0.5),
        fontWeight: 'bold',
        fill: 0xffffff,
        align: 'center',
        stroke: 0x22223b,
        strokeThickness: 4,
        dropShadow: true,
        dropShadowColor: 0x22223b,
        dropShadowBlur: 5,
        dropShadowDistance: 0,
      });
      label.anchor.set(0.5, 0.5);
      label.position.set(barWidth / 2, barHeight / 2);
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

      let barColor = colorScheme.defaultBar;
      if (sortingStateRef.current[index] === 'sorted') {
        barColor = colorScheme.sortedBar;
      } else if (currentStep.type === 'swap' && (index === currentStep.from || index === currentStep.to)) {
        barColor = colorScheme.activeBar;
      } else if (currentStep.type === 'compare' && (index === currentStep.from || index === currentStep.to)) {
        barColor = colorScheme.comparingBar;
      } else if (currentStep.type === 'select' && index === currentStep.from) {
        barColor = colorScheme.selectBar || colorScheme.activeBar;
      } else if (currentStep.type === 'set' && index === currentStep.from) {
        barColor = colorScheme.setValue || colorScheme.activeBar;
      }

      const gradient = createGradientTexture(barWidth, barHeight, hexToNumber(barColor));
      if (gradient) {
        bar.beginTextureFill({ texture: gradient });
      } else {
        bar.beginFill(hexToNumber(barColor));
      }
      bar.drawRoundedRect(0, 0, barWidth, barHeight, Math.min(barWidth / 4, 4));
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

  const animate = useCallback(
    (timestamp: number) => {
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

      const progress = gsap.parseEase('power2.out')(Math.min(deltaTime / duration, 1));
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
          onStepChange?.(currentStepRef.current);
        } else {
          barsRef.current.forEach((_, index) => {
            sortingStateRef.current[index] = 'sorted';
          });

          updateBarPositions();

          if (barsContainerRef.current) {
            gsap.to(barsContainerRef.current.scale, {
              x: 1.05,
              y: 1.05,
              duration: 0.3,
              yoyo: true,
              repeat: 1,
              ease: 'elastic.out(1, 0.3)',
              onComplete: () => {
                barsContainerRef.current?.scale.set(1, 1);
              },
            });

            barsRef.current.forEach((bar, index) => {
              gsap.to(bar, {
                alpha: 0.5,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut',
                delay: (index * 0.05) % 0.5,
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
    },
    [animationSteps, speed, colorScheme, onSortingComplete, onStepChange, updateBarPositions]
  );

  const startSorting = useCallback(() => {
    if (isSortingRef.current || animationSteps.length === 0) return;

    isSortingRef.current = true;
    animationFrameRef.current = requestAnimationFrame(animate);

    if (barsContainerRef.current) {
      gsap.from(barsContainerRef.current.scale, {
        x: 0.95,
        y: 0.95,
        duration: 0.3,
        ease: 'back.out(1.7)',
      });
    }
  }, [animate]);

  const pauseSorting = useCallback(() => {
    isSortingRef.current = false;
    cancelAnimationFrame(animationFrameRef.current);

    if (barsContainerRef.current) {
      gsap.to(barsContainerRef.current, {
        alpha: 0.9,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
      });
    }
  }, []);

  const goToStep = useCallback(
    (step: number) => {
      if (step < 0 || step >= animationSteps.length || isSortingRef.current) return;

      valueMapRef.current.clear();
      blocks.forEach((value, index) => {
        valueMapRef.current.set(index, value);
      });

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

        if (stepData.type === 'done') {
          sortingStateRef.current[stepData.from] = 'sorted';
        }
      }

      currentStepRef.current = step;
      updateBarPositions();
    },
    [animationSteps, blocks, updateBarPositions]
  );

  useEffect(() => {
    if (!isPlaying && typeof currentStep === 'number' && animationSteps.length > 0) {
      goToStep(currentStep);
    }
  }, [currentStep, isPlaying, animationSteps.length, goToStep]);

  // Overlay tooltips for each bar
  const [barRects, setBarRects] = useState<{ left: number, width: number, value: number }[]>([]);
  useEffect(() => {
    if (!pixiContainerRef.current || !dimensions.width) return;
    // Calculate bar positions for overlay
    const { barWidth, spacing } = getBarDimensions();
    const rects = blocks.map((value, index) => {
      const left = ((dimensions.width - (barWidth * blocks.length + spacing * (blocks.length - 1))) / 2) + index * (barWidth + spacing) + spacing / 2;
      return { left, width: barWidth, value };
    });
    setBarRects(rects);
  }, [blocks, dimensions, getBarDimensions]);

  // --- Step Description Helper ---
  const currentStepObj = animationSteps[currentStepRef.current] || {};
  const { type: stepType, from, to, value } = currentStepObj;
  const stepDescription = (() => {
    switch (stepType) {
      case 'compare':
        return `Comparing index ${from} and ${to}`;
      case 'swap':
        return `Swapping index ${from} (${valueMapRef.current.get(from)}) and ${to} (${valueMapRef.current.get(to)})`;
      case 'set':
        return `Setting index ${from} to ${value}`;
      case 'select':
        return `Selecting index ${from}`;
      case 'done':
        return `Sorting complete!`;
      default:
        return `Idle`;
    }
  })();

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Step Description Banner */}
      <div className="w-full flex justify-center mb-2">
        <div className="bg-indigo-100 text-indigo-900 font-semibold rounded-lg px-4 py-2 shadow border border-indigo-200 text-center text-base md:text-lg min-h-[2.5rem]">
          {stepDescription}
        </div>
      </div>
      <div
        ref={pixiContainerRef}
        className="w-full h-full rounded-xl shadow-md overflow-hidden border border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100"
        style={{ minHeight: 320, minWidth: 320 }}
      />
      {/* Tooltip overlays for each bar */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {barRects.map((rect, idx) => (
          <div
            key={idx}
            style={{ position: 'absolute', left: rect.left, width: rect.width, height: '100%', top: 0 }}
            className="flex items-end justify-center"
          >
            <Tooltip
              content={<span className="text-xs font-medium">{rect.value}</span>}
              placement="top"
              color="primary"
              showArrow
              delay={0}
            >
              <div
                className="w-full h-full cursor-pointer"
                style={{ minHeight: 40 }}
                tabIndex={0}
                onMouseOver={e => e.currentTarget.focus()}
                onFocus={e => e.currentTarget.focus()}
                onBlur={e => e.currentTarget.blur()}
              // pointer-events auto so tooltip works
              />
            </Tooltip>
          </div>
        ))}
      </div>
      {/* Real-time Array State Visualization */}
      <div className="w-full flex flex-col items-center mt-2 mb-2">
        <div className="font-semibold text-gray-700 mb-1">Array State (Live)</div>
        <div className="flex flex-wrap gap-2 justify-center bg-gray-50 rounded-lg px-4 py-2 shadow-inner border border-gray-200">
          {Array.from({ length: blocks.length }, (_, idx) => {
            const val = valueMapRef.current.get(idx) ?? 0;
            // Highlight if involved in current step
            let highlight = false;
            if (
              (stepType === 'compare' && (idx === from || idx === to)) ||
              (stepType === 'swap' && (idx === from || idx === to)) ||
              (stepType === 'set' && idx === from) ||
              (stepType === 'select' && idx === from)
            ) highlight = true;
            return (
              <span
                key={idx}
                className={`font-mono text-base md:text-lg px-2 py-1 rounded border shadow-sm transition-all duration-200 ${highlight ? 'bg-yellow-200 text-yellow-900 border-yellow-400 scale-110' : 'bg-blue-100 text-blue-800 border-blue-200'}`}
              >
                {val}
              </span>
            );
          })}
        </div>
      </div>
      {/* Current Step Details Panel */}
      <div className="w-full flex justify-center mb-2">
        <div className="bg-white/90 border border-gray-200 rounded-lg px-4 py-2 shadow-sm flex flex-col md:flex-row gap-2 items-center text-xs md:text-sm">
          <span><b>Step:</b> {currentStepRef.current + 1} / {animationSteps.length}</span>
          {stepType && <span><b>Type:</b> {stepType}</span>}
          {typeof from !== 'undefined' && <span><b>From:</b> {from} ({valueMapRef.current.get(from)})</span>}
          {typeof to !== 'undefined' && <span><b>To:</b> {to} ({valueMapRef.current.get(to)})</span>}
          {typeof value !== 'undefined' && <span><b>Value:</b> {value}</span>}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-2 py-1 bg-white rounded-lg shadow-sm text-xs">
        <div className="flex gap-4">
          <div className="flex items-center">
            <span className="font-medium text-gray-700 mr-1">Size:</span>
            <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md">{blocks.length}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-700 mr-1">Step:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
              {currentStepRef.current + 1} / {animationSteps.length}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {fps > 0 && (
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-1 ${fps > 40 ? 'bg-green-500' : fps > 20 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
              ></div>
              <span className="text-gray-600">{fps} FPS</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-sm mr-1"
                style={{ backgroundColor: colorScheme?.comparingBar || '#a5b4fc' }}
              ></div>
              <span>Compare</span>
            </div>
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-sm mr-1"
                style={{ backgroundColor: colorScheme?.activeBar || '#60a5fa' }}
              ></div>
              <span>Active</span>
            </div>
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-sm mr-1"
                style={{ backgroundColor: colorScheme?.sortedBar || '#86efac' }}
              ></div>
              <span>Sorted</span>
            </div>
            {colorScheme?.selectBar && (
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-sm mr-1" style={{ backgroundColor: colorScheme?.selectBar }}></div>
                <span>Select</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}