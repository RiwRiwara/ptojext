"use client";
import { useEffect, useState, useMemo } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { Select, SelectItem } from "@heroui/select";
import { HeroUIProvider } from "@heroui/react";
import SortingAlgorithms from "@/classes/sorting/SortingAlgorithms";
import SortingMainComponent from "@/components/playground_components/algorithms/sorting/SortingMainComponent";

const sortsAlgo = [
  { key: "bubble-sort", label: "Bubble Sort" },
  { key: "merge-sort", label: "Merge Sort" },
  { key: "quick-sort", label: "Quick Sort" },
];

export default function Page() {

  const [sortedArray, setSortedArray] = useState<number[]>([]);
  const sorting = useMemo(() => new SortingAlgorithms([5, 2, 9, 1, 5, 6]), []);

  // Observer to listen for sorting changes
  sorting.addObserver(() => {
    // Update the sorted array whenever sorting is done
    setSortedArray(sorting.getArray());
  });

  // Handle sorting selection
  const handleSortChange = (value: string) => {
    let result: number[] = [];
    switch (value) {
      case "bubble-sort":
        result = sorting.sort("bubble");
        break;
      case "merge-sort":
        result = sorting.sort("merge");
        break;
      case "quick-sort":
        result = sorting.sort("quick");
        break;
      default:
        break;
    }
    setSortedArray(result); // Update UI with the sorted result
  };

  useEffect(() => {
    // Initialize the sorting object with the initial array
    sorting.sort("bubble");
  }, []);

  return (
    <BaseLayout>
      <HeroUIProvider className="flex flex-col justify-start h-screen gap-8 p-2 text-center">
        <h1 className="uppercase text-3xl font-bold mt-10">Sorting Algorithms</h1>

        <div>
          <Select
            className="max-w-xs"
            label="Select sort algorithm"
            defaultSelectedKeys={["bubble-sort"]}
            onChange={
              (value) => handleSortChange(value.target.value)
            }
          >
            {sortsAlgo.map((algo) => (
              <SelectItem key={algo.key}>{algo.label}</SelectItem>
            ))}
          </Select>
        </div>

        {/* =========================== Sorted Array Display ===========================  */}
        <SortingMainComponent />

      </HeroUIProvider>
    </BaseLayout>
  );
}
