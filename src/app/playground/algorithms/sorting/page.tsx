"use client";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { HeroUIProvider } from "@heroui/react";
import SortingAlgorithms from "@/classes/sorting/SortingAlgorithms";
import PixiSortingVisualizer from "@/components/playground_components/algorithms/sorting/PixiSortingVisualizer";
import AlgorithmSelector from "@/components/playground_components/algorithms/sorting/AlgorithmSelector";
import ArrayControls from "@/components/playground_components/algorithms/sorting/ArrayControls";
import VisualizationControls from "@/components/playground_components/algorithms/sorting/VisualizationControls";
import CodeDisplay from "@/components/playground_components/algorithms/sorting/CodeDisplay";
import { AnimationStep, SortingAlgorithm } from "@/components/playground_components/algorithms/sorting/types";
import Breadcrumb from "@/components/common/Breadcrumb";
import { motion } from "framer-motion";
import { FaInfoCircle, FaLightbulb, FaRegClock, FaCode, FaChalkboardTeacher } from "react-icons/fa";

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
  {
    key: "heap-sort",
    label: "Heap Sort",
    description:
      "A comparison-based sorting algorithm that uses a binary heap data structure to build a max-heap and then repeatedly extracts the maximum element.",
    complexity: {
      time: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
      space: "O(1)",
    },
    colorScheme: {
      background: "#F8FBFD",
      defaultBar: "#94a3b8",
      activeBar: "#83AFC9",
      comparingBar: "#0ea5e9",
      sortedBar: "#10b981",
    },
  },
  {
    key: "shell-sort",
    label: "Shell Sort",
    description:
      "An extension of insertion sort that allows the exchange of items that are far apart, gradually reducing the gap between elements to be compared.",
    complexity: {
      time: { best: "O(n log n)", average: "O(n log² n)", worst: "O(n²)" },
      space: "O(1)",
    },
    colorScheme: {
      background: "#F9FAFB",
      defaultBar: "#6B7280",
      activeBar: "#2563EB",
      comparingBar: "#F59E0B",
      sortedBar: "#10B981",
    },
  },
  {
    key: "custom-algorithm",
    label: "Custom Algorithm",
    description:
      "Design and implement your own sorting algorithm to visualize its execution and performance.",
    complexity: {
      time: { best: "N/A", average: "N/A", worst: "N/A" },
      space: "N/A",
    },
    colorScheme: {
      background: "#F8FBFD",
      defaultBar: "#94a3b8",
      activeBar: "#83AFC9",
      comparingBar: "#60a5fa",
      sortedBar: "#10b981",
      selectBar: "#7dd3fc",
      setValue: "#c4b5fd",
    },
  },
];

export default function SortingVisualizerPage() {
  const [selectedAlgo, setSelectedAlgo] = useState<string>("bubble-sort");
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [currentArray, setCurrentArray] = useState<number[]>([]);
  const [initialArray, setInitialArray] = useState<number[]>([10, 5, 8, 3, 1, 6, 12, 4, 15]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(4);
  const [currentStep, setCurrentStep] = useState<number>(0);
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

  const selectedAlgoData = useMemo(
    () => sortingAlgorithms.find((algo) => algo.key === selectedAlgo),
    [selectedAlgo]
  );

  // Define the type for animation step types to ensure proper TypeScript type checking
  type AnimationStepType = 'compare' | 'swap' | 'select' | 'set';
  
  const codeHighlightMap = useMemo<Record<AnimationStepType, number>>(
    () => ({
      compare: 2,
      swap: 4,
      select: 3,
      set: 5,
    }),
    []
  );

  const handleSortChange = useCallback(
    (algoKey: string) => {
      setSelectedAlgo(algoKey);
      setIsPlaying(false);
      setCurrentStep(0);
      setCurrentHighlightedLine(-1);
      setCurrentArray([...initialArray]);
      const sorter = new SortingAlgorithms([...initialArray]);
      const steps =
        algoKey === "custom-algorithm"
          ? [] // Handle custom algorithm steps
          : sorter.getAnimationSteps(algoKey);
      setAnimationSteps(steps);
    },
    [initialArray]
  );

  const resetArray = useCallback(() => {
    setCurrentArray([...initialArray]);
    setCurrentStep(0);
    setIsPlaying(false);
    const sorter = new SortingAlgorithms([...initialArray]);
    setAnimationSteps(sorter.getAnimationSteps(selectedAlgo));
  }, [initialArray, selectedAlgo]);

  const generateRandomArray = useCallback(() => {
    const size = Math.floor(Math.random() * 15) + 5; // Random size between 5 and 20
    const arr = [];
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * 100) + 1); // Random values between 1 and 100
    }
    setCurrentArray([...arr]);
    setInitialArray([...arr]);
    setCurrentStep(0);
    
    // Reset algorithm stats
    setAlgorithmStats({
      swaps: 0,
      comparisons: 0,
      runtime: 0
    });
    
    // Generate animation steps for the new array
    const sorter = new SortingAlgorithms([...arr]);
    setAnimationSteps(sorter.getAnimationSteps(selectedAlgo));
  }, [selectedAlgo]);

  const shuffleArray = useCallback(() => {
    const shuffled = [...currentArray].sort(() => Math.random() - 0.5);
    setInitialArray(shuffled);
    setCurrentArray(shuffled);
    setCurrentStep(0);
    setIsPlaying(false);
    const sorter = new SortingAlgorithms(shuffled);
    setAnimationSteps(sorter.getAnimationSteps(selectedAlgo));
  }, [currentArray, selectedAlgo]);

  const sortAscending = useCallback(() => {
    const sorted = [...currentArray].sort((a, b) => a - b);
    setInitialArray(sorted);
    setCurrentArray(sorted);
    setCurrentStep(0);
    setIsPlaying(false);
    const sorter = new SortingAlgorithms(sorted);
    setAnimationSteps(sorter.getAnimationSteps(selectedAlgo));
  }, [currentArray, selectedAlgo]);

  const sortDescending = useCallback(() => {
    const sorted = [...currentArray].sort((a, b) => b - a);
    setInitialArray(sorted);
    setCurrentArray(sorted);
    setCurrentStep(0);
    setIsPlaying(false);
    const sorter = new SortingAlgorithms(sorted);
    setAnimationSteps(sorter.getAnimationSteps(selectedAlgo));
  }, [currentArray, selectedAlgo]);

  const addElement = useCallback(() => {
    const newValue = Math.floor(Math.random() * 50) + 5;
    const newArray = [...currentArray, newValue];
    setInitialArray(newArray);
    setCurrentArray(newArray);
    setCurrentStep(0);
    setIsPlaying(false);
    const sorter = new SortingAlgorithms(newArray);
    setAnimationSteps(sorter.getAnimationSteps(selectedAlgo));
  }, [currentArray, selectedAlgo]);

  const removeElement = useCallback(() => {
    const newArray = currentArray.slice(0, -1);
    setInitialArray(newArray);
    setCurrentArray(newArray);
    setCurrentStep(0);
    setIsPlaying(false);
    const sorter = new SortingAlgorithms(newArray);
    setAnimationSteps(sorter.getAnimationSteps(selectedAlgo));
  }, [currentArray, selectedAlgo]);

  // Initialize array and animation steps on component mount
  useEffect(() => {
    setCurrentArray([...initialArray]);
    const sorter = new SortingAlgorithms([...initialArray]);
    setAnimationSteps(sorter.getAnimationSteps(selectedAlgo));
  }, []);
  
  // Navigation functions
  const goToPrevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToNextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, animationSteps.length - 1));
  }, [animationSteps.length]);
  
  // Update animation steps when algorithm changes
  useEffect(() => {
    const sorter = new SortingAlgorithms([...currentArray]);
    setAnimationSteps(sorter.getAnimationSteps(selectedAlgo));
    setCurrentStep(0);
  }, [selectedAlgo, currentArray]);


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
        const stepType = animationSteps[step]?.type as AnimationStepType;
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

  return (
    <BaseLayout>
      <div className="container mx-auto flex flex-col justify-start h-screen gap-6 p-2 pt-6 mb-10">
        <div className="max-w-3xl mx-auto mb-2">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "Algorithms", href: "/playground/algorithms" },
            { label: "Sorting" }
          ]} />
        </div>
        <header className="py-6 px-4 bg-gradient-to-r from-[#83AFC9]/10 to-[#83AFC9]/30 shadow-sm rounded-lg border border-[#83AFC9]/20">
          <div className="max-w-7xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-[#83AFC9] to-[#6da5c0]"
            >
              Sorting Algorithm Visualizer
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-2 text-base text-gray-600 text-center"
            >
              Explore, compare and understand sorting algorithms in real-time
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4 flex flex-wrap justify-center gap-3 text-sm"
            >
              <div className="inline-flex items-center px-3 py-1 bg-white/70 rounded-full shadow-sm">
                <FaRegClock className="mr-1 text-[#83AFC9]" /> 
                <span>Visual learning</span>
              </div>
              <div className="inline-flex items-center px-3 py-1 bg-white/70 rounded-full shadow-sm">
                <FaCode className="mr-1 text-[#83AFC9]" /> 
                <span>Code walkthrough</span>
              </div>
              <div className="inline-flex items-center px-3 py-1 bg-white/70 rounded-full shadow-sm">
                <FaChalkboardTeacher className="mr-1 text-[#83AFC9]" /> 
                <span>Step-by-step explanation</span>
              </div>
            </motion.div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-2 md:px-4 py-6 flex flex-col gap-6">
          {/* Learning Tips and Explanations */}
          {showTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="bg-[#83AFC9]/10 rounded-lg p-4 border border-[#83AFC9]/30"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FaLightbulb className="text-[#83AFC9] text-xl" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-800">Learning Tips:</h3>
                  <ul className="mt-1 text-sm text-gray-600 list-disc pl-5 space-y-1">
                    <li>Watch how <strong>{selectedAlgoData?.label}</strong> sorts the array step by step</li>
                    <li>Compare the theoretical time complexity ({selectedAlgoData?.complexity.time.average}) with actual performance</li>
                    <li>Use the step controls to move forward and backward through the algorithm</li>
                    <li>Try different array sizes and patterns to see how the algorithm behaves</li>
                  </ul>
                </div>
                <button 
                  onClick={() => setShowTips(false)}
                  className="ml-auto text-gray-400 hover:text-gray-600"
                  aria-label="Close tips"
                >
                  &times;
                </button>
              </div>
            </motion.div>
          )}
          
          {/* Algorithm Selector */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-[#83AFC9]/20 hover:shadow-md transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-4 text-center text-[#83AFC9]">Select Sorting Algorithm</h2>
            <AlgorithmSelector
              algorithms={sortingAlgorithms}
              selectedAlgo={selectedAlgo}
              onAlgoChange={handleSortChange}
              algoData={selectedAlgoData}
            />
          </motion.div>

          {/* Array Controls */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-[#83AFC9]/20 hover:shadow-md transition-shadow duration-300"
          >
            <h2 className="text-xl font-medium mb-3 text-center text-[#83AFC9]">Array Controls</h2>
            <ArrayControls
              currentArray={currentArray}
              isPlaying={isPlaying}
              onGenerateRandom={generateRandomArray}
              onShuffle={shuffleArray}
              onSortAscending={sortAscending}
              onSortDescending={sortDescending}
              onAddElement={addElement}
              onRemoveElement={removeElement}
            />
            
            {/* Custom Array Input */}
            <div className="mt-4 p-4 bg-[#83AFC9]/5 rounded-lg border border-[#83AFC9]/20">
              <h3 className="text-sm font-medium mb-2 text-gray-700">Custom Array Input</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={customArrayInput}
                    onChange={(e) => {
                      setCustomArrayInput(e.target.value);
                      setInputError("");
                    }}
                    placeholder="Enter numbers separated by commas (e.g., 5,12,8,23)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#83AFC9] text-sm"
                  />
                  {inputError && (
                    <p className="text-red-500 text-xs mt-1">{inputError}</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (!customArrayInput.trim()) {
                      setInputError("Please enter some numbers");
                      return;
                    }
                    
                    try {
                      const values = customArrayInput
                        .split(',')
                        .map((num: string) => {
                          const parsed = parseInt(num.trim(), 10);
                          if (isNaN(parsed)) throw new Error('Invalid input');
                          return parsed;
                        });
                      
                      if (values.length < 2) {
                        setInputError("Please enter at least 2 numbers");
                        return;
                      }
                      
                      // Success: update arrays and reset visualization
                      setInitialArray(values);
                      setCurrentArray([...values]);
                      setCurrentStep(0);
                      setIsPlaying(false);
                      
                      // Generate new animation steps
                      const sorter = new SortingAlgorithms([...values]);
                      setAnimationSteps(sorter.getAnimationSteps(selectedAlgo));
                      
                      // Clear input error if any
                      setInputError("");
                    } catch (error) {
                      setInputError("Please enter valid numbers separated by commas");
                    }
                  }}
                  className="px-4 py-2 bg-[#83AFC9] text-white rounded-md hover:bg-[#6da5c0] transition-colors duration-200 text-sm font-medium"
                >
                  Apply Custom Array
                </button>
              </div>
            </div>
            
            {/* Array Representation */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg overflow-x-auto">
              <div className="flex flex-wrap gap-1 justify-center">
                {currentArray.map((value, index) => (
                  <div 
                    key={index} 
                    className="w-8 h-8 flex items-center justify-center rounded-md text-xs font-mono bg-white border border-[#83AFC9]/30 shadow-sm"
                    style={{
                      backgroundColor: index === currentStep ? 'rgba(131, 175, 201, 0.2)' : 'white'
                    }}
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Visualization and Code */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.section 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-[#83AFC9]/20 lg:col-span-2 mb-4 flex flex-col hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#83AFC9]">Sorting Visualization</h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowStats(!showStats)} 
                    className={`px-2 py-1 text-xs rounded-md ${showStats ? 'bg-[#83AFC9] text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {showStats ? 'Hide Stats' : 'Show Stats'}
                  </button>
                  <button 
                    onClick={() => setShowExplanation(!showExplanation)} 
                    className={`px-2 py-1 text-xs rounded-md ${showExplanation ? 'bg-[#83AFC9] text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                  </button>
                </div>
              </div>
              
              {/* Stats panel */}
              {showStats && (
                <div className="mb-4 p-3 bg-[#83AFC9]/5 rounded-lg border border-[#83AFC9]/20 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm">
                      <span className="text-gray-500 text-xs">Comparisons</span>
                      <span className="text-[#83AFC9] font-bold">{algorithmStats.comparisons}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm">
                      <span className="text-gray-500 text-xs">Swaps</span>
                      <span className="text-[#83AFC9] font-bold">{algorithmStats.swaps}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-sm">
                      <span className="text-gray-500 text-xs">Runtime</span>
                      <span className="text-[#83AFC9] font-bold">{algorithmStats.runtime}ms</span>
                    </div>
                  </div>
                </div>
              )}
              
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
              
              {/* Step explanation */}
              {showExplanation && currentStep < animationSteps.length && (
                <div className="my-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-sm">
                  <div className="flex items-start">
                    <FaInfoCircle className="text-[#83AFC9] mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <strong>Step {currentStep + 1}:</strong> {' '}
                      {animationSteps[currentStep].type === 'compare' && 'Comparing elements'}
                      {animationSteps[currentStep].type === 'swap' && 'Swapping elements'}
                      {animationSteps[currentStep].type === 'select' && 'Selecting element'}
                      {animationSteps[currentStep].type === 'set' && 'Setting value'}
                      {' '}
                      {typeof animationSteps[currentStep].from !== 'undefined' && `at index ${animationSteps[currentStep].from}`}
                      {typeof animationSteps[currentStep].to !== 'undefined' && ` and index ${animationSteps[currentStep].to}`}
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
                colorScheme={selectedAlgoData?.colorScheme}
              />
            </motion.section>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-[#83AFC9]/20 hover:shadow-md transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-4 text-center text-[#83AFC9]">Algorithm Code</h2>
              <CodeDisplay
                selectedAlgo={selectedAlgo}
                customAlgorithm={customAlgorithm}
                setCustomAlgorithm={setCustomAlgorithm}
                isPlaying={isPlaying}
                currentHighlightedLine={currentHighlightedLine}
              />
              
              {/* Algorithm summary */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-1">Time Complexity</h3>
                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="bg-white p-2 rounded border border-gray-200">
                    <span className="text-gray-500 block">Best Case</span>
                    <span className="font-mono font-medium">{selectedAlgoData?.complexity.time.best}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-gray-200">
                    <span className="text-gray-500 block">Average</span>
                    <span className="font-mono font-medium">{selectedAlgoData?.complexity.time.average}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-gray-200">
                    <span className="text-gray-500 block">Worst Case</span>
                    <span className="font-mono font-medium">{selectedAlgoData?.complexity.time.worst}</span>
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-700 mb-1">Space Complexity</h3>
                <div className="bg-white p-2 rounded border border-gray-200 text-xs">
                  <span className="font-mono font-medium">{selectedAlgoData?.complexity.space}</span>
                </div>
                
                <h3 className="font-medium text-gray-700 mt-3 mb-1">Best Used When</h3>
                <ul className="list-disc pl-5 text-xs text-gray-600">
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
          </div>

        </main>
      </div>
    </BaseLayout>
  );
}