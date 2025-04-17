"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { HeroUIProvider } from "@heroui/react";
import SortingAlgorithms from "@/classes/sorting/SortingAlgorithms";
import PixiSortingVisualizer from "@/components/playground_components/algorithms/sorting/PixiSortingVisualizer";
import AlgorithmSelector from "@/components/playground_components/algorithms/sorting/AlgorithmSelector";
import ArrayControls from "@/components/playground_components/algorithms/sorting/ArrayControls";
import VisualizationControls from "@/components/playground_components/algorithms/sorting/VisualizationControls";
import CodeDisplay from "@/components/playground_components/algorithms/sorting/CodeDisplay";
import { AnimationStep, SortingAlgorithm } from "@/components/playground_components/algorithms/sorting/types";

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
      background: "#F9FAFB",
      defaultBar: "#6B7280",
      activeBar: "#F59E0B",
      comparingBar: "#4F46E5",
      sortedBar: "#10B981",
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
      background: "#F9FAFB",
      defaultBar: "#6B7280",
      activeBar: "#EC4899",
      comparingBar: "#7C3AED",
      sortedBar: "#10B981",
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
      background: "#F9FAFB",
      defaultBar: "#6B7280",
      activeBar: "#F97316",
      comparingBar: "#4F46E5",
      sortedBar: "#14B8A6",
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
      background: "#F9FAFB",
      defaultBar: "#6B7280",
      activeBar: "#EAB308",
      comparingBar: "#0EA5E9",
      sortedBar: "#10B981",
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
      background: "#F9FAFB",
      defaultBar: "#6B7280",
      activeBar: "#D946EF",
      comparingBar: "#4F46E5",
      sortedBar: "#10B981",
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
      background: "#F9FAFB",
      defaultBar: "#6B7280",
      activeBar: "#9333EA",
      comparingBar: "#3B82F6",
      sortedBar: "#10B981",
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
      background: "#F9FAFB",
      defaultBar: "#6B7280",
      activeBar: "#DC2626",
      comparingBar: "#7C3AED",
      sortedBar: "#10B981",
      selectBar: "#EC4899",
      setValue: "#FBBF24",
    },
  },
];

export default function SortingVisualizerPage() {
  const [selectedAlgo, setSelectedAlgo] = useState<string>("bubble-sort");
  const [currentArray, setCurrentArray] = useState<number[]>([
    10, 45, 15, 7, 20, 30, 5, 35, 25, 40,
  ]);
  const [initialArray, setInitialArray] = useState<number[]>([
    10, 45, 15, 7, 20, 30, 5, 35, 25, 40,
  ]);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [customAlgorithm, setCustomAlgorithm] = useState<string>("");
  const [currentHighlightedLine, setCurrentHighlightedLine] = useState<number>(-1);

  const selectedAlgoData = useMemo(
    () => sortingAlgorithms.find((algo) => algo.key === selectedAlgo),
    [selectedAlgo]
  );

  const codeHighlightMap = useMemo(() => {
    // Placeholder: Map animation steps to code lines (implement based on algorithm)
    const map: Record<number, number> = {};
    animationSteps.forEach((step, index) => {
      // Example mapping (customize based on algorithm)
      map[index] = Math.min(index % 10 + 1, 10); // Dummy mapping
    });
    return map;
  }, [animationSteps]);

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

  const generateRandomArray = useCallback((size: number) => {
    const newArray = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 50) + 5
    );
    setInitialArray(newArray);
    setCurrentArray(newArray);
    setCurrentStep(0);
    setIsPlaying(false);
    const sorter = new SortingAlgorithms(newArray);
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

  const resetArray = useCallback(() => {
    setCurrentArray([...initialArray]);
    setCurrentStep(0);
    setIsPlaying(false);
    const sorter = new SortingAlgorithms([...initialArray]);
    setAnimationSteps(sorter.getAnimationSteps(selectedAlgo));
  }, [initialArray, selectedAlgo]);

  const goToPrevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setCurrentHighlightedLine(codeHighlightMap[currentStep - 1] || -1);
  }, [codeHighlightMap, currentStep]);

  const goToNextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, animationSteps.length - 1));
    setCurrentHighlightedLine(codeHighlightMap[currentStep + 1] || -1);
  }, [codeHighlightMap, currentStep, animationSteps.length]);

  const handleSortingComplete = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(animationSteps.length - 1);
  }, [animationSteps.length]);

  const handleStepChange = useCallback(
    (step: number) => {
      setCurrentStep(step);
      setCurrentHighlightedLine(codeHighlightMap[step] || -1);
    },
    [codeHighlightMap]
  );

  useEffect(() => {
    const sorter = new SortingAlgorithms([...initialArray]);
    setAnimationSteps(sorter.getAnimationSteps(selectedAlgo));
  }, [selectedAlgo, initialArray]);

  return (
    <BaseLayout>
      <HeroUIProvider className="min-h-screen bg-gray-50 font-sans">
        <header className="py-6 px-4 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight text-center">
              Sorting Algorithm Visualizer
            </h1>
            <p className="mt-2 text-base text-gray-500 text-center">
              Explore and visualize sorting algorithms in real-time
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <AlgorithmSelector
            algorithms={sortingAlgorithms}
            selectedAlgo={selectedAlgo}
            onAlgoChange={handleSortChange}
            algoData={selectedAlgoData}
          />
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="mb-8 bg-white rounded-lg shadow-sm p-4 border border-gray-200 lg:col-span-2">
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
            </section>
            <CodeDisplay
              selectedAlgo={selectedAlgo}
              customAlgorithm={customAlgorithm}
              setCustomAlgorithm={setCustomAlgorithm}
              isPlaying={isPlaying}
              currentHighlightedLine={currentHighlightedLine}
            />
          </div>
        </main>
      </HeroUIProvider>
    </BaseLayout>
  );
}