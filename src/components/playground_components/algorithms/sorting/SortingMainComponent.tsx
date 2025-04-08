import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaMinus, FaRedo, FaPlay, FaCode } from "react-icons/fa";
import { BiShuffle } from "react-icons/bi";
import SortingAlgorithms from "@/classes/sorting/SortingAlgorithms";

type AnimationStep = { from: number; to: number };
type AnimationState = {
  position: number;
  value: number;
  color: string;
};

interface SortingMainComponentProps {
  selectedAlgorithm: string;
  initialArray: number[];
  onArrayUpdate?: (newArray: number[]) => void;
}

export default function SortingMainComponent({
  selectedAlgorithm,
  initialArray,
  onArrayUpdate,
}: SortingMainComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [blocks, setBlocks] = useState<number[]>(initialArray);
  const [sorting, setSorting] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [showCode, setShowCode] = useState<boolean>(false);
  const sorterRef = useRef<SortingAlgorithms | null>(null);
  const animationStepsRef = useRef<AnimationStep[]>([]);
  const animationStateRef = useRef<AnimationState[]>([]);
  const isSortingRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number>(0);
  const currentStepRef = useRef<number>(0);
  const animationProgressRef = useRef<number>(0);
  const lastTimestampRef = useRef<number>(0);
  const canvasWidth = 800;
  const canvasHeight = 400;

  const algorithm = selectedAlgorithm.replace("-sort", "");

  // Reset animation state function
  const resetAnimation = () => {
    setSorting(false);
    isSortingRef.current = false;
    currentStepRef.current = 0;
    animationProgressRef.current = 0;
    lastTimestampRef.current = 0;
    animationStepsRef.current = [];
    animationStateRef.current = blocks.map((value, index) => ({
      position: index,
      value,
      color: "hsl(0, 0%, 50%)",
    }));
    sorterRef.current = new SortingAlgorithms([...blocks]);
  };

  // Initialize sorter and animation state
  useEffect(() => {
    resetAnimation();
  }, [initialArray]);

  // Canvas rendering and animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const blockWidth = canvasWidth / blocks.length - 5;
    const maxHeight = Math.max(...blocks, 1);

    const render = (timestamp: number) => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      animationStateRef.current.forEach((state) => {
        const x = state.position * (blockWidth + 5);
        const height = (state.value / maxHeight) * (canvasHeight - 20);
        const y = canvasHeight - height;

        ctx.fillStyle = state.color;
        ctx.fillRect(x, y, blockWidth, height);
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(state.value.toString(), x + blockWidth / 2, y - 5);
      });

      if (isSortingRef.current) {
        animate(timestamp);
      }
      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [blocks]);

  // Handle speed change during sorting
  useEffect(() => {
    if (sorting) {
      resetAnimation();
      playSorting();
    }
  }, [speed]);

  const updateBlocks = (newBlocks: number[]) => {
    setBlocks(newBlocks);
    resetAnimation();
    onArrayUpdate?.(newBlocks);
  };

  const animate = (timestamp: number) => {
    if (currentStepRef.current >= animationStepsRef.current.length) {
      setSorting(false);
      isSortingRef.current = false;
      animationStateRef.current = animationStateRef.current.map((state) => ({
        ...state,
        color: "hsl(0, 0%, 50%)",
      }));
      return;
    }

    const step = animationStepsRef.current[currentStepRef.current];
    const duration = 500 / speed;
    const deltaTime = timestamp - (lastTimestampRef.current || timestamp);
    animationProgressRef.current += deltaTime / duration;
    lastTimestampRef.current = timestamp;

    if (
      step.from >= animationStateRef.current.length ||
      step.to >= animationStateRef.current.length ||
      step.from < 0 ||
      step.to < 0
    ) {
      currentStepRef.current++;
      animationProgressRef.current = 0;
      return;
    }

    const fromState = animationStateRef.current[step.from];
    const toState = animationStateRef.current[step.to];

    if (animationProgressRef.current >= 1) {
      animationStateRef.current[step.from] = {
        ...toState,
        position: step.from,
        color: "hsl(0, 0%, 50%)",
      };
      animationStateRef.current[step.to] = {
        ...fromState,
        position: step.to,
        color: "hsl(0, 0%, 50%)",
      };
      animationProgressRef.current = 0;
      currentStepRef.current++;
    } else {
      fromState.color = "hsl(120, 50%, 50%)";
      toState.color = "hsl(0, 50%, 50%)";
      const startPosFrom = step.from;
      const startPosTo = step.to;
      fromState.position =
        startPosFrom + (step.to - step.from) * animationProgressRef.current;
      toState.position =
        startPosTo + (step.from - step.to) * animationProgressRef.current;
    }
  };

  const playSorting = () => {
    if (!sorterRef.current) return;

    if (sorting) {
      resetAnimation();
    }

    setSorting(true);
    isSortingRef.current = true;
    currentStepRef.current = 0;
    animationProgressRef.current = 0;
    lastTimestampRef.current = 0;

    const steps = sorterRef.current.sort(algorithm, true) as AnimationStep[];
    animationStepsRef.current = steps;

    if (steps.length === 0) {
      setSorting(false);
      isSortingRef.current = false;
    }
  };

  const getAlgorithmCode = () => {
    switch (algorithm) {
      case "bubble":
        return `public bubbleSort(returnSteps: boolean = false): number[] | AnimationStep[] {
  const arr = this.cloneArray();
  const steps: AnimationStep[] = [];
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        this.swap(arr, j, j + 1, steps);
      }
    }
  }
  return returnSteps ? steps : arr;
}`;
      default:
        return "Code not available for this algorithm.";
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6g">
      <div className="flex flex-row justify-center w-full">
        <canvas
          ref={canvasRef}
          className=""
          style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => updateBlocks([...blocks, Math.floor(Math.random() * 31)])}
          className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all shadow-md"
          title="Add Block"
          disabled={sorting}
        >
          <FaPlus />
        </button>
        <button
          onClick={() => updateBlocks(blocks.length > 0 ? blocks.slice(0, -1) : blocks)}
          className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all shadow-md"
          title="Remove Block"
          disabled={sorting}
        >
          <FaMinus />
        </button>
        <button
          onClick={() => updateBlocks([...blocks].sort(() => Math.random() - 0.5))}
          className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all shadow-md"
          title="Shuffle"
          disabled={sorting}
        >
          <BiShuffle />
        </button>
        <button
          onClick={() =>
            updateBlocks(
              Array.from({ length: blocks.length }, () =>
                Math.floor(Math.random() * 31)
              )
            )
          }
          className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all shadow-md"
          title="Randomize"
          disabled={sorting}
        >
          <FaRedo />
        </button>

        <div className="flex items-center gap-2 bg-gray-200 p-2 rounded-lg shadow-inner">
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="px-2 py-1 bg-gray-300 text-gray-800 rounded-lg focus:outline-none"
          >
            <option value={0.1}>0.5x</option>
            <option value={0.5}>1x</option>
            <option value={1}>2x</option>
            <option value={2}>3x</option>
            <option value={5}>5x</option>
          </select>
        </div>

        <button
          onClick={playSorting}
          className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all shadow-md"
          title="Play"
        >
          <FaPlay />
        </button>

        <button
          onClick={() => setShowCode(!showCode)}
          className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all shadow-md"
          title="Show Code"
        >
          <FaCode />
        </button>
      </div>

    </div>
  );
}