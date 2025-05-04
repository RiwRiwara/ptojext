"use client";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import SortingAlgorithms from "@/classes/sorting/SortingAlgorithms";
import PixiSortingVisualizer from "@/components/playground_components/algorithms/sorting/PixiSortingVisualizer";
import AlgorithmSelector from "@/components/playground_components/algorithms/sorting/AlgorithmSelector";
import ArrayControls from "@/components/playground_components/algorithms/sorting/ArrayControls";
import VisualizationControls from "@/components/playground_components/algorithms/sorting/VisualizationControls";
import CodeDisplay from "@/components/playground_components/algorithms/sorting/CodeDisplay";
import { AnimationStep, SortingAlgorithm } from "@/components/playground_components/algorithms/sorting/types";
import Breadcrumb from "@/components/common/Breadcrumb";
import { motion } from "framer-motion";
import { FaInfoCircle, FaLightbulb, FaRegClock, FaMemory, FaCode, FaChalkboardTeacher } from "react-icons/fa";
import BottomComponent from "@/components/page_components/landing_page/BottomComponent";

const sortingAlgorithms: SortingAlgorithm[] = [
  {
    key: "bubble-sort",
    label: "Bubble Sort",
    description:
      "A simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
    complexity: {
      time: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
      space: "O(1)",
    },
    colorScheme: {
      background: "#F8FBFD",
      defaultBar: "#94a3b8",
      activeBar: "#83AFC9",
      comparingBar: "#60a5fa",
      sortedBar: "#10b981",
    },
  },
  {
    key: "selection-sort",
    label: "Selection Sort",
    description:
      "Selection sort repeatedly finds the minimum element from the unsorted part of the array and places it at the beginning.",
    complexity: {
      time: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
      space: "O(1)",
    },
    colorScheme: {
      background: "#F8FBFD",
      defaultBar: "#94a3b8",
      activeBar: "#6da5c0",
      comparingBar: "#83AFC9",
      sortedBar: "#10b981",
    },
  },
  {
    key: "insertion-sort",
    label: "Insertion Sort",
    description:
      "Insertion sort builds the sorted array one item at a time, inserting each element into its correct position.",
    complexity: {
      time: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
      space: "O(1)",
    },
    colorScheme: {
      background: "#F8FBFD",
      defaultBar: "#94a3b8",
      activeBar: "#83AFC9",
      comparingBar: "#93c5da",
      sortedBar: "#10b981",
    },
  },
  {
    key: "merge-sort",
    label: "Merge Sort",
    description:
      "A divide-and-conquer algorithm that splits the array into smaller subarrays, sorts them, and merges them back together.",
    complexity: {
      time: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
      space: "O(n)",
    },
    colorScheme: {
      background: "#F8FBFD",
      defaultBar: "#94a3b8",
      activeBar: "#83AFC9",
      comparingBar: "#38bdf8",
      sortedBar: "#10b981",
    },
  },
  {
    key: "quick-sort",
    label: "Quick Sort",
    description:
      "A fast divide-and-conquer algorithm that picks a pivot, partitions the array, and recursively sorts the subarrays.",
    complexity: {
      time: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
      space: "O(log n)",
    },
    colorScheme: {
      background: "#F8FBFD",
      defaultBar: "#94a3b8",
      activeBar: "#83AFC9",
      comparingBar: "#64748b",
      sortedBar: "#10b981",
    },
  },
];

export default function SortingVisualizerPage() {
  // State for array and visualization
  const [currentArray, setCurrentArray] = useState<number[]>([]);
  const [initialArray, setInitialArray] = useState<number[]>([10, 5, 8, 3, 1, 6, 12, 4, 15]);
  const [selectedAlgo, setSelectedAlgo] = useState<string>("bubble-sort");
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(4);
  const [customAlgorithm, setCustomAlgorithm] = useState<string>("");
  const [showTips, setShowTips] = useState<boolean>(true);
  const [customArrayInput, setCustomArrayInput] = useState<string>("");
  const [inputError, setInputError] = useState<string>("");
  const [showStats, setShowStats] = useState<boolean>(true);
  const [showExplanation, setShowExplanation] = useState<boolean>(true);
  const [showCode, setShowCode] = useState<boolean>(true);
  const [algorithmStats, setAlgorithmStats] = useState({
    swaps: 0,
    comparisons: 0,
    runtime: 0, // in ms
  });
  const [currentHighlightedLine, setCurrentHighlightedLine] = useState<number>(-1);

  // Animation interval reference
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get the selected algorithm data
  const selectedAlgoData = useMemo(
    () => sortingAlgorithms.find((algo) => algo.key === selectedAlgo),
    [selectedAlgo]
  );

  // Code highlighting map
  const codeHighlightMap = useMemo(() => {
    return {
      compare: 1,
      swap: 2,
      select: 3,
      set: 4,
      done: 5,
    };
  }, []);

  // Initialize array
  useEffect(() => {
    randomizeArray();
  }, []);

  // Update current array when initial array changes
  useEffect(() => {
    setCurrentArray([...initialArray]);
  }, [initialArray]);

  // Handle algorithm selection
  const handleAlgorithmSelect = useCallback((key: string) => {
    setSelectedAlgo(key);
    setCurrentStep(0);
    setIsPlaying(false);
    setCurrentHighlightedLine(-1);
  }, []);

  // Handle array size change
  const handleArraySizeChange = useCallback((size: number) => {
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    setInitialArray(newArray);
    setCurrentStep(0);
    setIsPlaying(false);
    setCurrentHighlightedLine(-1);
  }, []);

  // Randomize array
  const randomizeArray = useCallback(() => {
    const size = initialArray.length;
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    setInitialArray(newArray);
    setCurrentStep(0);
    setIsPlaying(false);
    setCurrentHighlightedLine(-1);
  }, [initialArray.length]);

  // Reset array to initial state
  const resetArray = useCallback(() => {
    setCurrentArray([...initialArray]);
    setCurrentStep(0);
    setIsPlaying(false);
    setCurrentHighlightedLine(-1);
  }, [initialArray]);

  // Handle custom array input
  const handleCustomArraySubmit = useCallback((input: string) => {
    try {
      const parsedArray = JSON.parse(`[${input}]`);
      if (!Array.isArray(parsedArray) || parsedArray.some(item => typeof item !== 'number')) {
        setInputError("Invalid input. Please enter comma-separated numbers.");
        return;
      }
      setInitialArray(parsedArray);
      setInputError("");
    } catch (error) {
      setInputError("Invalid input. Please enter comma-separated numbers.");
    }
  }, []);

  // Go to previous step
  const goToPrevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  // Go to next step
  const goToNextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, animationSteps.length - 1));
  }, [animationSteps.length]);

  // Update animation steps when algorithm changes
  useEffect(() => {
    const sorter = new SortingAlgorithms([...currentArray]);
    setAnimationSteps(sorter.getAnimationSteps(selectedAlgo));
    setCurrentStep(0);
  }, [selectedAlgo, currentArray]);

  // Handle sorting completion
  const handleSortingComplete = useCallback(() => {
    console.log("Sorting completed!");
    setIsPlaying(false);
    setCurrentStep(animationSteps.length - 1);

    // Update algorithm stats
    const swaps = animationSteps.filter(step => step.type === 'swap').length;
    const comparisons = animationSteps.filter(step => step.type === 'compare').length;
    const runtime = Math.round((animationSteps.length / speed) * 100); // Simulated runtime in ms

    setAlgorithmStats({
      swaps,
      comparisons,
      runtime
    });
  }, [animationSteps, speed]);

  // Handle bar click to start sorting from a specific position
  const handleBarClick = useCallback((index: number) => {
    if (isPlaying) return;

    // Reset animation state
    setCurrentStep(0);
    setIsPlaying(false);
    setCurrentHighlightedLine(-1);

    // Run the sorting algorithm with a small delay to allow state updates
    setTimeout(() => {
      // Get animation steps for the selected algorithm
      const sorter = new SortingAlgorithms([...initialArray]);
      const steps = sorter.getAnimationSteps(selectedAlgo);
      setAnimationSteps(steps);

      // Set the current step to the first step that involves the clicked index
      const targetStep = steps.findIndex(step =>
        step.from === index || step.to === index
      );

      if (targetStep !== -1) {
        setCurrentStep(Math.max(0, targetStep));
        const stepType = steps[targetStep]?.type as keyof typeof codeHighlightMap;
        if (stepType && stepType in codeHighlightMap) {
          setCurrentHighlightedLine(codeHighlightMap[stepType]);
        }
      }

      // Start the animation
      setIsPlaying(true);
    }, 100);
  }, [initialArray, selectedAlgo, isPlaying, codeHighlightMap]);

  // Effect to update code highlighting when animation step changes
  useEffect(() => {
    if (currentStep >= animationSteps.length && animationSteps.length > 0) {
      handleSortingComplete();
      return;
    }

    if (currentStep < animationSteps.length && animationSteps.length > 0) {
      const stepType = animationSteps[currentStep]?.type;
      if (stepType && stepType in codeHighlightMap) {
        // Use type assertion to safely access the code highlight map
        const lineNumber = codeHighlightMap[stepType as keyof typeof codeHighlightMap];
        setCurrentHighlightedLine(lineNumber);
      }
    }
  }, [codeHighlightMap, currentStep, animationSteps, handleSortingComplete]);

  const handleStepChange = useCallback(
    (step: number) => {
      setCurrentStep(step);
      if (step < animationSteps.length) {
        const stepType = animationSteps[step]?.type as keyof typeof codeHighlightMap;
        if (stepType && stepType in codeHighlightMap) {
          setCurrentHighlightedLine(codeHighlightMap[stepType]);
        }
      }
    },
    [animationSteps, codeHighlightMap]
  );

  useEffect(() => {
    const sorter = new SortingAlgorithms([...initialArray]);
    setAnimationSteps(sorter.getAnimationSteps(selectedAlgo));
  }, [selectedAlgo, initialArray]);

  // Animation playback effect
  useEffect(() => {
    if (isPlaying) {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }

      animationIntervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= animationSteps.length - 1) {
            clearInterval(animationIntervalRef.current!);
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [isPlaying, animationSteps, speed]);

  return (
    <BaseLayout>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Playground", href: "/playground" },
              { label: "Algorithms", href: "/playground/algorithms" },
              { label: "Sorting", href: "/playground/algorithms/sorting" },
            ]}
          />

          <div className="mt-8 mb-8 ml-1 md:ml-0">
            <h1 className="text-3xl font-bold text-[#83AFC9] mb-2 mt-4">Sorting Algorithm Visualizer</h1>
            <p className="text-gray-600">
              Visualize and understand how different sorting algorithms work step by step.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Algorithm selection and controls */}
            <div className="lg:col-span-1 space-y-6">
              <AlgorithmSelector
                algorithms={sortingAlgorithms}
                selectedAlgo={selectedAlgo}
                onAlgoChange={handleAlgorithmSelect}
              />

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FaChalkboardTeacher className="text-[#83AFC9]" />
                  <h3 className="text-lg font-medium text-gray-700">Array Controls</h3>
                </div>

                <ArrayControls
                  arraySize={initialArray.length}
                  onArraySizeChange={handleArraySizeChange}
                  onRandomize={randomizeArray}
                  onCustomArray={handleCustomArraySubmit}
                  customArrayInput={customArrayInput}
                  setCustomArrayInput={setCustomArrayInput}
                  inputError={inputError}
                />
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FaRegClock className="text-[#83AFC9]" />
                  <h3 className="text-lg font-medium text-gray-700">Visualization Controls</h3>
                </div>

                <VisualizationControls
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  currentStep={currentStep}
                  totalSteps={animationSteps.length}
                  speed={speed}
                  setSpeed={setSpeed}
                  showCode={true}
                  setShowCode={setShowCode}
                  onReset={resetArray}
                  onPrevStep={goToPrevStep}
                  onNextStep={goToNextStep}
                />
              </div>

              {selectedAlgoData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FaInfoCircle className="text-[#83AFC9]" />
                    <h3 className="text-lg font-medium text-gray-700">Complexity Analysis</h3>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700 text-sm mb-2 flex items-center gap-2">
                      <FaRegClock className="text-[#83AFC9]" /> <span>Time Complexity</span>
                    </h4>
                    <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                      <div className="bg-white p-2 rounded-md border border-gray-200">
                        <span className="text-gray-500 block">Best Case</span>
                        <span className="font-mono font-medium text-base">{selectedAlgoData?.complexity.time.best}</span>
                      </div>
                      <div className="bg-white p-2 rounded-md border border-gray-200">
                        <span className="text-gray-500 block">Average</span>
                        <span className="font-mono font-medium text-base">{selectedAlgoData?.complexity.time.average}</span>
                      </div>
                      <div className="bg-white p-2 rounded-md border border-gray-200">
                        <span className="text-gray-500 block">Worst Case</span>
                        <span className="font-mono font-medium text-base">{selectedAlgoData?.complexity.time.worst}</span>
                      </div>
                    </div>

                    <h4 className="font-medium text-gray-700 text-sm mb-2 flex items-center gap-2">
                      <FaMemory className="text-[#83AFC9]" /> <span>Space Complexity</span>
                    </h4>
                    <div className="bg-white p-2 rounded border border-gray-200 text-xs mb-3">
                      <span className="font-mono font-medium text-base">{selectedAlgoData?.complexity.space}</span>
                    </div>

                    <h4 className="font-medium text-gray-700 text-sm mb-2 flex items-center gap-2">
                      <FaLightbulb className="text-[#83AFC9]" /> <span>Best Used When</span>
                    </h4>
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      {selectedAlgo === 'bubble-sort' && (
                        <>
                          <li>Educational purposes - easy to understand</li>
                          <li>Small datasets</li>
                          <li>Array is already almost sorted</li>
                        </>
                      )}
                      {selectedAlgo === 'insertion-sort' && (
                        <>
                          <li>Small datasets</li>
                          <li>Array is already partially sorted</li>
                          <li>Memory usage is a concern</li>
                        </>
                      )}
                      {selectedAlgo === 'selection-sort' && (
                        <>
                          <li>Small datasets</li>
                          <li>Minimizing swaps is important</li>
                          <li>Memory usage is a concern</li>
                        </>
                      )}
                      {selectedAlgo === 'merge-sort' && (
                        <>
                          <li>Large datasets</li>
                          <li>Stable sorting is required</li>
                          <li>Predictable performance is needed</li>
                        </>
                      )}
                      {selectedAlgo === 'quick-sort' && (
                        <>
                          <li>Average case performance matters</li>
                          <li>In-place sorting is preferred</li>
                          <li>Not concerned about worst-case scenarios</li>
                        </>
                      )}
                      {selectedAlgo === 'heap-sort' && (
                        <>
                          <li>Guaranteed O(n log n) is required</li>
                          <li>In-place sorting is preferred</li>
                          <li>Maximum/minimum values needed quickly</li>
                        </>
                      )}
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right column - Visualization and code */}
            <div className="lg:col-span-2 space-y-6">
              {/* Visualization area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step explanation */}
                {showExplanation && currentStep < animationSteps.length && (
                  <div className="mb-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-sm">
                    <div className="flex items-start">
                      <FaInfoCircle className="text-[#83AFC9] mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <strong>Step {currentStep + 1} :</strong> {' '}
                        {animationSteps[currentStep]?.type === 'compare' && 'Comparing elements'}
                        {animationSteps[currentStep]?.type === 'swap' && 'Swapping elements'}
                        {animationSteps[currentStep]?.type === 'select' && 'Selecting element'}
                        {animationSteps[currentStep]?.type === 'set' && 'Setting value'}
                        {' '}
                        {typeof animationSteps[currentStep]?.from !== 'undefined' && `at index ${animationSteps[currentStep].from}`}
                        {typeof animationSteps[currentStep]?.to !== 'undefined' && ` and index ${animationSteps[currentStep].to}`}
                      </div>
                    </div>
                  </div>
                )}

                <PixiSortingVisualizer
                  blocks={currentArray}
                  animationSteps={animationSteps}
                  isPlaying={isPlaying}
                  speed={speed}
                  currentStep={currentStep}
                  onStepChange={handleStepChange}
                  onSortingComplete={handleSortingComplete}
                  onBarClick={handleBarClick}
                  colorScheme={selectedAlgoData?.colorScheme}
                />
              </motion.div>

              {/* Code display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <FaCode className="text-[#83AFC9]" />
                  <h3 className="text-lg font-medium text-gray-700">Algorithm Code</h3>
                </div>

                <CodeDisplay
                  selectedAlgo={selectedAlgo}
                  customAlgorithm={customAlgorithm}
                  setCustomAlgorithm={setCustomAlgorithm}
                  isPlaying={isPlaying}
                  currentHighlightedLine={currentHighlightedLine}
                />
              </motion.div>
            </div>
          </div>

        </main>
        <BottomComponent />
      </div>
    </BaseLayout>
  );
}
