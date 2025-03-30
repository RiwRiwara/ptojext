"use client";
import { useEffect, useState, useMemo } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { HeroUIProvider, Button } from "@heroui/react";
import SortingAlgorithms from "@/classes/sorting/SortingAlgorithms";
import SortingMainComponent from "@/components/playground_components/algorithms/sorting/SortingMainComponent";

const sortingAlgorithms = [
  { key: "bubble-sort", label: "Bubble Sort", description: "A simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order." },
  { key: "merge-sort", label: "Merge Sort", description: "A divide-and-conquer algorithm that splits the array into smaller subarrays, sorts them, and then merges them back together." },
  { key: "quick-sort", label: "Quick Sort", description: "A fast divide-and-conquer algorithm that picks a pivot, partitions the array around it, and recursively sorts the subarrays." },
];

export default function Page() {
  const [selectedAlgo, setSelectedAlgo] = useState<string>("bubble-sort");
  const [sortedArray, setSortedArray] = useState<number[]>([]);
  const initialArray = [5, 2, 9, 1, 5, 6, 10 ,5 ,4 ,3 ,2 ,1];
  const sorting = useMemo(() => new SortingAlgorithms(initialArray), []);

  // Sync sorted array with SortingMainComponent updates
  const handleArrayUpdate = (newArray: number[]) => {
    sorting.arr = [...newArray];
    setSortedArray([...newArray]);
  };

  useEffect(() => {
    sorting.addObserver(() => {
      setSortedArray(sorting.getArray());
    });
    handleSortChange(selectedAlgo);
  }, [sorting]);

  // Handle algorithm selection and reset
  const handleSortChange = (value: string) => {
    setSelectedAlgo(value);
    setSortedArray([...initialArray]); // Reset to initial array
    sorting.arr = [...initialArray];   // Reset sorting instance
  };

  const selectedAlgoData = sortingAlgorithms.find((algo) => algo.key === selectedAlgo);

  return (
    <BaseLayout>
      <HeroUIProvider className="flex flex-col min-h-screen gap-8 p-6 text-gray-800">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-extrabold uppercase tracking-wide text-indigo-600">
            Sorting Algorithm Simulator
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Explore, visualize, and learn how sorting algorithms work in real-time!
          </p>
        </header>

        {/* Algorithm Selection */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            {sortingAlgorithms.map((algo) => (
              <Button
                key={algo.key}
                onClick={() => handleSortChange(algo.key)}
                className={`px-6 py-3 text-lg font-medium rounded-lg transition-colors ${selectedAlgo === algo.key
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {algo.label}
              </Button>
            ))}
          </div>
          {selectedAlgoData && (
            <p className="max-w-2xl text-center text-sm text-gray-500">
              {selectedAlgoData.description}
            </p>
          )}
        </div>

        {/* Array Display */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-lg shadow-md">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Initial Array</h3>
              <p className="mt-2 text-xl font-mono">{`[${initialArray.join(", ")}]`}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Sorted Array</h3>
              <p className="mt-2 text-xl font-mono">{`[${sortedArray.join(", ")}]`}</p>
            </div>
          </div>
        </div>

        {/* Sorting Simulation */}
        <div className="flex justify-center">
          <SortingMainComponent
            selectedAlgorithm={selectedAlgo}
            initialArray={sortedArray.length ? sortedArray : initialArray}
            onArrayUpdate={handleArrayUpdate}
          />
        </div>
      </HeroUIProvider>
    </BaseLayout>
  );
}