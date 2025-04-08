"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { HeroUIProvider, Button } from "@heroui/react";
import SortingAlgorithms from "@/classes/sorting/SortingAlgorithms";
import PixiSortingVisualizer from "@/components/playground_components/algorithms/sorting/PixiSortingVisualizer";
import { FaPlay, FaPause, FaRedo, FaRandom } from "react-icons/fa";
import { MdSpeed } from "react-icons/md";
import { HiPlus, HiMinus } from "react-icons/hi";
import { RiSortAsc, RiSortDesc } from "react-icons/ri";
import { PiShuffleBold } from "react-icons/pi";
import { IoMdInformationCircleOutline } from "react-icons/io";

// Algorithm definitions with improved descriptions and complexity information
const sortingAlgorithms = [
  { 
    key: "bubble-sort", 
    label: "Bubble Sort", 
    description: "A simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
    complexity: {
      time: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
      space: "O(1)"
    },
    colorScheme: {
      background: "#111827", // gray-900
      defaultBar: "#4B5563", // gray-600
      activeBar: "#F59E0B", // amber-500
      comparingBar: "#3B82F6", // blue-500
      sortedBar: "#10B981", // emerald-500
    }
  },
  { 
    key: "selection-sort", 
    label: "Selection Sort", 
    description: "Selection sort works by repeatedly finding the minimum element from the unsorted part of the array and putting it at the beginning.",
    complexity: {
      time: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
      space: "O(1)"
    },
    colorScheme: {
      background: "#111827", // gray-900
      defaultBar: "#4B5563", // gray-600
      activeBar: "#EC4899", // pink-500
      comparingBar: "#8B5CF6", // violet-500
      sortedBar: "#34D399", // emerald-400
    }
  },
  { 
    key: "insertion-sort", 
    label: "Insertion Sort", 
    description: "Insertion sort builds the final sorted array one item at a time, taking each element and inserting it into its correct position.",
    complexity: {
      time: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
      space: "O(1)"
    },
    colorScheme: {
      background: "#111827", // gray-900 
      defaultBar: "#4B5563", // gray-600
      activeBar: "#F97316", // orange-500
      comparingBar: "#6366F1", // indigo-500
      sortedBar: "#14B8A6", // teal-500
    }
  },
  { 
    key: "merge-sort", 
    label: "Merge Sort", 
    description: "A divide-and-conquer algorithm that splits the array into smaller subarrays, sorts them, and then merges them back together.", 
    complexity: {
      time: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
      space: "O(n)"
    },
    colorScheme: {
      background: "#111827", // gray-900
      defaultBar: "#4B5563", // gray-600
      activeBar: "#EAB308", // yellow-500
      comparingBar: "#0EA5E9", // sky-500 
      sortedBar: "#22C55E", // green-500
    }
  },
  { 
    key: "quick-sort", 
    label: "Quick Sort", 
    description: "A fast divide-and-conquer algorithm that picks a pivot, partitions the array around it, and recursively sorts the subarrays.",
    complexity: {
      time: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
      space: "O(log n)"
    },
    colorScheme: {
      background: "#111827", // gray-900
      defaultBar: "#4B5563", // gray-600
      activeBar: "#D946EF", // fuchsia-500
      comparingBar: "#2563EB", // blue-600
      sortedBar: "#059669", // emerald-600
    }
  },
];

export default function Page() {
  // Array and algorithm state
  const [selectedAlgo, setSelectedAlgo] = useState<string>("bubble-sort");
  const [currentArray, setCurrentArray] = useState<number[]>([10, 45, 15, 7, 20, 30, 5, 35, 25, 40]);
  const [initialArray, setInitialArray] = useState<number[]>([10, 45, 15, 7, 20, 30, 5, 35, 25, 40]);
  const [animationSteps, setAnimationSteps] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [showComplexity, setShowComplexity] = useState<boolean>(false);
  
  // Create sorting algorithm instance
  const sorting = useMemo(() => new SortingAlgorithms(initialArray), [initialArray]);
  
  // Get current algorithm key (strip '-sort')
  const algorithmKey = selectedAlgo.replace('-sort', '');
  
  // Find the selected algorithm data
  const selectedAlgoData = sortingAlgorithms.find((algo) => algo.key === selectedAlgo);
  
  // Generate animation steps when algorithm changes
  useEffect(() => {
    resetArray();
  }, [selectedAlgo]);
  
  // Reset sorting algorithm and initial array
  const resetArray = useCallback(() => {
    setIsPlaying(false);
    if (sorting) {
      sorting.arr = [...initialArray];
      try {
        const steps = sorting.sort(algorithmKey, true) as any[];
        setAnimationSteps(steps);
        setCurrentArray([...initialArray]);
      } catch (error) {
        console.error("Error generating animation steps:", error);
      }
    }
  }, [initialArray, sorting, algorithmKey]);
  
  // Generate random array of specified size
  const generateRandomArray = (size: number, min: number = 5, max: number = 50) => {
    const newArray = Array.from({ length: size }, () => 
      Math.floor(Math.random() * (max - min + 1)) + min
    );
    setInitialArray(newArray);
    setCurrentArray(newArray);
    
    if (sorting) {
      sorting.arr = [...newArray];
      try {
        const steps = sorting.sort(algorithmKey, true) as any[];
        setAnimationSteps(steps);
      } catch (error) {
        console.error("Error generating animation steps:", error);
      }
    }
  };
  
  // Sort the array in ascending order
  const sortAscending = () => {
    const sorted = [...initialArray].sort((a, b) => a - b);
    setInitialArray(sorted);
    setCurrentArray(sorted);
    
    if (sorting) {
      sorting.arr = [...sorted];
      try {
        const steps = sorting.sort(algorithmKey, true) as any[];
        setAnimationSteps(steps);
      } catch (error) {
        console.error("Error generating animation steps:", error);
      }
    }
  };
  
  // Sort the array in descending order
  const sortDescending = () => {
    const sorted = [...initialArray].sort((a, b) => b - a);
    setInitialArray(sorted);
    setCurrentArray(sorted);
    
    if (sorting) {
      sorting.arr = [...sorted];
      try {
        const steps = sorting.sort(algorithmKey, true) as any[];
        setAnimationSteps(steps);
      } catch (error) {
        console.error("Error generating animation steps:", error);
      }
    }
  };
  
  // Shuffle the current array
  const shuffleArray = () => {
    const shuffled = [...initialArray]
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
      
    setInitialArray(shuffled);
    setCurrentArray(shuffled);
    
    if (sorting) {
      sorting.arr = [...shuffled];
      try {
        const steps = sorting.sort(algorithmKey, true) as any[];
        setAnimationSteps(steps);
      } catch (error) {
        console.error("Error generating animation steps:", error);
      }
    }
  };
  
  // Add a random element to the array
  const addElement = () => {
    if (initialArray.length >= 20) return; // Limit array size
    const newElement = Math.floor(Math.random() * 46) + 5; // Random value between 5-50
    const newArray = [...initialArray, newElement];
    setInitialArray(newArray);
    setCurrentArray(newArray);
    
    if (sorting) {
      sorting.arr = [...newArray];
      try {
        const steps = sorting.sort(algorithmKey, true) as any[];
        setAnimationSteps(steps);
      } catch (error) {
        console.error("Error generating animation steps:", error);
      }
    }
  };
  
  // Remove the last element from the array
  const removeElement = () => {
    if (initialArray.length <= 3) return; // Maintain minimum array size
    const newArray = initialArray.slice(0, -1);
    setInitialArray(newArray);
    setCurrentArray(newArray);
    
    if (sorting) {
      sorting.arr = [...newArray];
      try {
        const steps = sorting.sort(algorithmKey, true) as any[];
        setAnimationSteps(steps);
      } catch (error) {
        console.error("Error generating animation steps:", error);
      }
    }
  };
  
  // Handle algorithm selection
  const handleSortChange = (value: string) => {
    setSelectedAlgo(value);
    setIsPlaying(false);
  };
  
  // Handle sorting completion
  const handleSortingComplete = () => {
    setIsPlaying(false);
  };

  return (
    <BaseLayout>
      <HeroUIProvider className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        {/* Header with gradient background */}
        <header className="py-8 px-4 text-white">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-2">
              Sorting Algorithm Visualizer
            </h1>
            <p className="text-lg text-center text-blue-100">
              Explore, visualize, and understand how sorting algorithms work in real-time
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Algorithm Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3 dark:text-gray-300">Choose an Algorithm</h2>
            <div className="flex flex-wrap gap-2">
              {sortingAlgorithms.map((algo) => (
                <Button
                  key={algo.key}
                  onClick={() => handleSortChange(algo.key)}
                  className={`px-4 py-2 font-medium rounded-lg transition-all duration-200 ${
                    selectedAlgo === algo.key
                      ? "bg-indigo-600 text-white shadow-lg transform scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {algo.label}
                </Button>
              ))}
            </div>
            
            {/* Algorithm Description & Complexity */}
            {selectedAlgoData && (
              <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="flex items-start justify-between">
                  <p className="text-gray-600 dark:text-gray-300 flex-1">
                    {selectedAlgoData.description}
                  </p>
                  <button 
                    onClick={() => setShowComplexity(!showComplexity)}
                    className="ml-4 text-indigo-600 dark:text-indigo-400 flex items-center gap-1"
                  >
                    <IoMdInformationCircleOutline size={20} />
                    <span className="text-sm">
                      {showComplexity ? "Hide Complexity" : "Show Complexity"}
                    </span>
                  </button>
                </div>
                
                {showComplexity && (
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300">Time Complexity</h4>
                      <ul className="mt-1 space-y-1">
                        <li className="text-green-600 dark:text-green-400">
                          Best: {selectedAlgoData.complexity.time.best}
                        </li>
                        <li className="text-yellow-600 dark:text-yellow-400">
                          Average: {selectedAlgoData.complexity.time.average}
                        </li>
                        <li className="text-red-600 dark:text-red-400">
                          Worst: {selectedAlgoData.complexity.time.worst}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300">Space Complexity</h4>
                      <p className="mt-1 text-blue-600 dark:text-blue-400">
                        {selectedAlgoData.complexity.space}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Array Control Panel */}
          <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3 dark:text-gray-300">Array Controls</h2>
            
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => generateRandomArray(10)}
                className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                disabled={isPlaying}
              >
                <FaRandom />
                <span>Generate Random</span>
              </Button>
              
              <Button
                onClick={shuffleArray}
                className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={isPlaying}
              >
                <PiShuffleBold />
                <span>Shuffle</span>
              </Button>
              
              <Button
                onClick={sortAscending}
                className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                disabled={isPlaying}
              >
                <RiSortAsc />
                <span>Sort Ascending</span>
              </Button>
              
              <Button
                onClick={sortDescending}
                className="flex items-center gap-1 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                disabled={isPlaying}
              >
                <RiSortDesc />
                <span>Sort Descending</span>
              </Button>
              
              <Button
                onClick={addElement}
                className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                disabled={isPlaying || initialArray.length >= 20}
              >
                <HiPlus />
                <span>Add Element</span>
              </Button>
              
              <Button
                onClick={removeElement}
                className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={isPlaying || initialArray.length <= 3}
              >
                <HiMinus />
                <span>Remove Element</span>
              </Button>
            </div>
            
            {/* Current Array Display */}
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Current Array</h3>
              <p className="font-mono text-sm break-all">
                [{currentArray.join(', ')}]
              </p>
            </div>
          </div>
          
          {/* Visualization Controls */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg shadow-md transition-colors ${
                isPlaying 
                  ? "bg-orange-600 hover:bg-orange-700 text-white" 
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </Button>
            
            <Button
              onClick={resetArray}
              className="flex items-center gap-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md transition-colors"
              disabled={isPlaying}
            >
              <FaRedo />
              <span>Reset</span>
            </Button>
            
            <div className="flex items-center gap-2 min-w-[200px]">
              <MdSpeed className="text-gray-600 dark:text-gray-300" />
              <div className="flex-1">
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300 w-10 text-right">
                {speed.toFixed(1)}x
              </span>
            </div>
          </div>
          
          {/* Visualization Canvas */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg overflow-hidden">
            <PixiSortingVisualizer
              blocks={currentArray}
              animationSteps={animationSteps}
              isPlaying={isPlaying}
              speed={speed}
              onSortingComplete={handleSortingComplete}
              colorScheme={selectedAlgoData?.colorScheme}
            />
          </div>
          
          {/* Algorithm Details */}
          <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2 dark:text-gray-300">How It Works</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {selectedAlgoData?.key === "bubble-sort" && (
                "Bubble Sort compares adjacent elements and swaps them if they're in the wrong order. This process repeats until the array is sorted. The visualization shows elements being compared and swapped in each pass through the array."
              )}
              {selectedAlgoData?.key === "selection-sort" && (
                "Selection Sort divides the array into a sorted and unsorted region. It repeatedly finds the minimum element from the unsorted region and moves it to the end of the sorted region. The visualization shows the current minimum element being found and moved."
              )}
              {selectedAlgoData?.key === "insertion-sort" && (
                "Insertion Sort builds the sorted array one item at a time. It takes each element from the unsorted part and inserts it into its correct position in the sorted part. The visualization shows each element being inserted into its proper position."
              )}
              {selectedAlgoData?.key === "merge-sort" && (
                "Merge Sort divides the array into smaller parts, sorts them, and then merges them back together. This recursive divide-and-conquer approach results in an efficiently sorted array. The visualization shows the division and merging process."
              )}
              {selectedAlgoData?.key === "quick-sort" && (
                "Quick Sort selects a 'pivot' element and partitions the array into elements less than the pivot and elements greater than the pivot. It then recursively sorts the sub-arrays. The visualization shows the partitioning process and pivot selection."
              )}
            </p>
          </div>
        </main>
      </HeroUIProvider>
    </BaseLayout>
  );
}