"use client";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import SearchAlgorithms from "@/classes/search/SearchAlgorithms";
import SearchVisualizer from "@/components/playground_components/algorithms/search/SearchVisualizer";
import AlgorithmSelector from "@/components/playground_components/algorithms/search/AlgorithmSelector";
import ArrayControls from "@/components/playground_components/algorithms/search/ArrayControls";
import VisualizationControls from "@/components/playground_components/algorithms/search/VisualizationControls";
import CodeDisplay from "@/components/playground_components/algorithms/search/CodeDisplay";
import {
  AnimationStep,
  SearchAlgorithm,
} from "@/components/playground_components/algorithms/search/types";
import Breadcrumb from "@/components/common/Breadcrumb";
import { motion } from "framer-motion";
import {
  FaEye,
  FaInfoCircle,
  FaLightbulb,
  FaRegClock,
  FaMemory,
  FaCode,
  FaChalkboardTeacher,
} from "react-icons/fa";

const searchAlgorithms: SearchAlgorithm[] = [
  {
    key: "linear-search",
    label: "Linear Search",
    description:
      "A simple search algorithm that checks each element of the array until it finds the target or reaches the end.",
    complexity: {
      time: { best: "O(1)", average: "O(n)", worst: "O(n)" },
      space: "O(1)",
    },
    colorScheme: {
      background: "#F8FBFD",
      defaultElement: "#94a3b8",
      activeElement: "#315971",
      comparingElement: "#2e02d8",
      foundElement: "#10b981",
    },
    requiresSorted: false,
  },
  {
    key: "binary-search",
    label: "Binary Search",
    description:
      "An efficient search algorithm that works on sorted arrays by repeatedly dividing the search interval in half.",
    complexity: {
      time: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
      space: "O(1)",
    },
    colorScheme: {
      background: "#F8FBFD",
      defaultElement: "#94a3b8",
      activeElement: "#315971",
      comparingElement: "#2e02d8",
      foundElement: "#10b981",
      lowBound: "#c4b5fd",
      highBound: "#f472b6",
    },
    requiresSorted: true,
  },
  {
    key: "jump-search",
    label: "Jump Search",
    description:
      "A search algorithm that works on sorted arrays by jumping ahead by fixed steps and then using linear search.",
    complexity: {
      time: { best: "O(1)", average: "O(√n)", worst: "O(√n)" },
      space: "O(1)",
    },
    colorScheme: {
      background: "#F8FBFD",
      defaultElement: "#94a3b8",
      activeElement: "#315971",
      comparingElement: "#2e02d8",
      foundElement: "#10b981",
    },
    requiresSorted: true,
  },
  {
    key: "interpolation-search",
    label: "Interpolation Search",
    description:
      "An improved variant of binary search that works on uniformly distributed sorted arrays using position estimation.",
    complexity: {
      time: { best: "O(1)", average: "O(log log n)", worst: "O(n)" },
      space: "O(1)",
    },
    colorScheme: {
      background: "#F8FBFD",
      defaultElement: "#94a3b8",
      activeElement: "#315971",
      comparingElement: "#2e02d8",
      foundElement: "#10b981",
    },
    requiresSorted: true,
  },
];

export default function SearchVisualizerPage() {
  // State for array and visualization
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(20);
  const [target, setTarget] = useState<number>(0);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [selectedAlgo, setSelectedAlgo] = useState<string>("");
  const [steps, setSteps] = useState<AnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(5);
  const [currentHighlightedLine, setCurrentHighlightedLine] = useState<
    string | null
  >(null);

  // Animation interval reference
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get the selected algorithm data
  const selectedAlgoData = useMemo(() => {
    return searchAlgorithms.find((algo) => algo.key === selectedAlgo);
  }, [selectedAlgo]);

  // Generate a new array
  const generateArray = useCallback(() => {
    const newArray: number[] = [];
    const max = 99;

    for (let i = 0; i < arraySize; i++) {
      newArray.push(Math.floor(Math.random() * max) + 1);
    }

    if (isSorted) {
      newArray.sort((a, b) => a - b);
    }

    // Set a random target from the array or a random number
    const randomIndex = Math.floor(Math.random() * newArray.length);
    const randomTarget =
      Math.random() < 0.7
        ? newArray[randomIndex]
        : Math.floor(Math.random() * max) + 1;

    setArray(newArray);
    setTarget(randomTarget);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setCurrentHighlightedLine(null);
  }, [arraySize, isSorted]);

  // Initialize array on component mount
  useEffect(() => {
    generateArray();
  }, [generateArray]);

  // Handle array size change
  const handleArraySizeChange = (size: number) => {
    setArraySize(size);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setCurrentHighlightedLine(null);

    // Generate new array with the new size
    const newArray: number[] = [];
    const max = 99;

    for (let i = 0; i < size; i++) {
      newArray.push(Math.floor(Math.random() * max) + 1);
    }

    if (isSorted) {
      newArray.sort((a, b) => a - b);
    }

    setArray(newArray);
  };

  // Handle target value change
  const handleTargetChange = (value: number) => {
    setTarget(value);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setCurrentHighlightedLine(null);
  };

  // Handle search when user clicks on an array element
  const handleSearch = (value: number) => {
    // Set the clicked value as the target
    setTarget(value);

    // Reset animation state
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setCurrentHighlightedLine(null);

    // Run the search algorithm with a small delay to allow state updates
    setTimeout(() => {
      // Run the search algorithm
      let result;

      switch (selectedAlgo) {
        case "linear-search":
          result = SearchAlgorithms.linearSearch(array, value);
          break;
        case "binary-search":
          result = SearchAlgorithms.binarySearch(array, value);
          break;
        case "jump-search":
          result = SearchAlgorithms.jumpSearch(array, value);
          break;
        case "interpolation-search":
          result = SearchAlgorithms.interpolationSearch(array, value);
          break;
        default:
          // If no algorithm is selected, default to linear search
          result = SearchAlgorithms.linearSearch(array, value);
          setSelectedAlgo("linear-search");
      }

      setSteps(result.steps);
      setCurrentStep(0);
      setCurrentHighlightedLine(result.steps[0]?.type || null);

      // Start the animation
      setIsPlaying(true);
    }, 100);
  };

  // Handle search target
  const handleSearchTarget = () => {
    if (!selectedAlgo) return;

    // Reset the current steps and visualization
    handleReset();

    // Generate the search steps for the current array and target value
    let searchSteps;
    switch (selectedAlgo) {
      case "linear-search":
        searchSteps = SearchAlgorithms.linearSearch(array, target).steps;
        break;
      case "binary-search":
        searchSteps = SearchAlgorithms.binarySearch(array, target).steps;
        break;
      case "jump-search":
        searchSteps = SearchAlgorithms.jumpSearch(array, target).steps;
        break;
      case "interpolation-search":
        searchSteps = SearchAlgorithms.interpolationSearch(array, target).steps;
        break;
      default:
        searchSteps = SearchAlgorithms.linearSearch(array, target).steps;
    }
    setSteps(searchSteps);
    setCurrentStep(0);
    setCurrentHighlightedLine(searchSteps[0]?.type || null);
    setIsPlaying(true);
  };

  // Toggle sorted/unsorted array
  const handleToggleSorted = () => {
    if (selectedAlgoData?.requiresSorted && !isSorted) {
      // If the selected algorithm requires a sorted array, force it to be sorted
      return;
    }

    const newIsSorted = !isSorted;
    setIsSorted(newIsSorted);

    // Update the array based on the new sorted state
    const newArray = [...array];
    if (newIsSorted) {
      newArray.sort((a, b) => a - b);
    } else {
      // Shuffle the array if unsorted
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
    }

    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setCurrentHighlightedLine(null);
  };

  // Handle algorithm selection
  const handleSelectAlgorithm = (key: string) => {
    setSelectedAlgo(key);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setCurrentHighlightedLine(null);

    // If the selected algorithm requires a sorted array, make sure the array is sorted
    const algoData = searchAlgorithms.find((algo) => algo.key === key);
    if (algoData?.requiresSorted && !isSorted) {
      setIsSorted(true);
      const sortedArray = [...array].sort((a, b) => a - b);
      setArray(sortedArray);
    }
  };

  // Run the selected search algorithm
  const runSearchAlgorithm = useCallback(() => {
    if (!selectedAlgo || array.length === 0) return;

    let result;

    switch (selectedAlgo) {
      case "linear-search":
        result = SearchAlgorithms.linearSearch(array, target);
        break;
      case "binary-search":
        result = SearchAlgorithms.binarySearch(array, target);
        break;
      case "jump-search":
        result = SearchAlgorithms.jumpSearch(array, target);
        break;
      case "interpolation-search":
        result = SearchAlgorithms.interpolationSearch(array, target);
        break;
      default:
        result = { steps: [], result: -1 };
    }

    setSteps(result.steps);
    setCurrentStep(0);
    setCurrentHighlightedLine(result.steps[0]?.type || null);
  }, [selectedAlgo, array, target]);

  // Play animation
  const handlePlay = () => {
    if (steps.length === 0) {
      runSearchAlgorithm();
    }

    setIsPlaying(true);
  };

  // Pause animation
  const handlePause = () => {
    setIsPlaying(false);
  };

  // Step forward in animation
  const handleStepForward = () => {
    if (steps.length === 0) {
      runSearchAlgorithm();
      return;
    }

    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setCurrentHighlightedLine(steps[nextStep].type);
    }
  };

  // Step backward in animation
  const handleStepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setCurrentHighlightedLine(steps[prevStep].type);
    }
  };

  // Reset animation
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setCurrentHighlightedLine(steps[0]?.type || null);
  };

  // Animation loop
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      // Clear any existing interval
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }

      // Set up new interval
      animationIntervalRef.current = setInterval(() => {
        setCurrentStep((prevStep) => {
          if (prevStep < steps.length - 1) {
            const nextStep = prevStep + 1;
            setCurrentHighlightedLine(steps[nextStep].type);
            return nextStep;
          } else {
            // Stop playing when we reach the end
            setIsPlaying(false);
            return prevStep;
          }
        });
      }, 1000 / speed); // Adjust speed based on the speed setting
    }

    // Clean up interval on unmount or when playing stops
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [isPlaying, steps, speed]);

  return (
    <BaseLayout>
      <div className="py-4 bg-white rounded-md">
        <main className="container mx-auto px-4 py-0">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Playground", href: "" },
              { label: "Algorithms", href: "" },
              { label: "Search", href: "" },
            ]}
          />

          <div className="mt-8 mb-8 ml-1 md:ml-0">
            <h1 className="text-3xl font-bold text-[#83AFC9] mb-2 mt-4">
              Search Algorithm Visualizer
            </h1>
            <p className="text-gray-600">
              Visualize and understand how different search algorithms work step
              by step.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
              {/* Visualization area */}
              <div className="w-full md:w-[60%]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border rounded-lg shadow-md p-4 min-h-[970px]"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FaEye className="text-[#83AFC9]" />
                    <h3 className="text-base md:text-lg font-medium text-gray-700">
                      Algorithm Visualization
                    </h3>
                  </div>

                  <AlgorithmSelector
                    algorithms={searchAlgorithms}
                    selectedAlgo={selectedAlgo}
                    onSelectAlgorithm={handleSelectAlgorithm}
                  />

                  <ArrayControls
                    arraySize={arraySize}
                    onArraySizeChange={handleArraySizeChange}
                    onGenerateArray={generateArray}
                    target={target}
                    onTargetChange={handleTargetChange}
                    isSorted={isSorted}
                    onToggleSorted={handleToggleSorted}
                    selectedAlgo={selectedAlgo}
                    requiresSorted={selectedAlgoData?.requiresSorted || false}
                    onSearch={handleSearchTarget}
                  />

                  <div className="flex justify-end">
                    <VisualizationControls
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onStepForward={handleStepForward}
                    onStepBackward={handleStepBackward}
                    onReset={handleReset}
                    isPlaying={isPlaying}
                    speed={speed}
                    onSpeedChange={setSpeed}
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    />
                  </div>

                  <SearchVisualizer
                    array={array}
                    target={target}
                    steps={steps}
                    currentStep={currentStep}
                    colorScheme={
                      selectedAlgoData?.colorScheme ||
                      searchAlgorithms[0].colorScheme
                    }
                    speed={speed}
                    isPlaying={isPlaying}
                    isSorted={isSorted}
                    onSearch={handleSearch}
                  />
                </motion.div>
              </div>

              {/* Code display */}
              <div className="w-full md:w-[40%]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white border rounded-lg shadow-md p-4 h-[970px]"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FaCode className="text-[#83AFC9]" />
                    <h3 className="text-base md:text-lg font-medium text-gray-700">
                      Algorithm Code
                    </h3>
                  </div>

                  <CodeDisplay
                    selectedAlgo={selectedAlgo}
                    currentHighlightedLine={currentHighlightedLine}
                  />
                </motion.div>
              </div>
            </div>

            {selectedAlgoData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border rounded-lg shadow-md p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FaInfoCircle className="text-[#83AFC9]" />
                    <h3 className="text-lg font-medium text-gray-700">Complexity Analysis</h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{selectedAlgoData.description}</p>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-700 text-sm mb-2 flex items-center gap-2">
                      <FaRegClock className="text-[#83AFC9]" /> <span>Time Complexity</span>
                    </h4>
                    <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                      <div className="bg-white p-2 rounded border border-gray-200">
                        <span className="text-gray-500 block">Best Case</span>
                        <span className="font-mono font-medium text-base">{selectedAlgoData.complexity.time.best}</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-gray-200">
                        <span className="text-gray-500 block">Average</span>
                        <span className="font-mono font-medium text-base">{selectedAlgoData.complexity.time.average}</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-gray-200">
                        <span className="text-gray-500 block">Worst Case</span>
                        <span className="font-mono font-medium text-base">{selectedAlgoData.complexity.time.worst}</span>
                      </div>
                    </div>

                    <h4 className="font-medium text-gray-700 text-sm mb-2 flex items-center gap-2">
                      <FaMemory className="text-[#83AFC9]" /> <span>Space Complexity</span>
                    </h4>
                    <div className="bg-white p-2 rounded border border-gray-200 text-xs mb-3">
                      <span className="font-mono font-medium text-base">{selectedAlgoData.complexity.space}</span>
                    </div>

                    <h4 className="font-medium text-gray-700 text-sm mb-2 flex items-center gap-2">
                      <FaLightbulb className="text-[#83AFC9]" /> <span>Best Used When</span>
                    </h4>
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      {selectedAlgo === 'linear-search' && (
                        <>
                          <li>The array is unsorted</li>
                          <li>The array is small</li>
                          <li>Simplicity is preferred over efficiency</li>
                          <li>You need to find all occurrences of an element</li>
                        </>
                      )}
                      {selectedAlgo === 'binary-search' && (
                        <>
                          <li>The array is sorted</li>
                          <li>The array is large</li>
                          <li>Efficiency is important</li>
                          <li>You need to find a single occurrence quickly</li>
                        </>
                      )}
                      {selectedAlgo === 'jump-search' && (
                        <>
                          <li>The array is sorted</li>
                          <li>Binary search is too complex for the use case</li>
                          <li>You need better performance than linear search</li>
                          <li>The array is medium to large sized</li>
                        </>
                      )}
                      {selectedAlgo === 'interpolation-search' && (
                        <>
                          <li>The array is sorted</li>
                          <li>Elements are uniformly distributed</li>
                          <li>You need better average performance than binary search</li>
                          <li>The array is large</li>
                        </>
                      )}
                    </ul>
                  </div>
                </motion.div>
            )}
          </div>
        </main>
      </div>
    </BaseLayout>
  );
}
