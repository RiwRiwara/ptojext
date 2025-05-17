import { Button } from "@heroui/react";
import { SortingAlgorithm } from "./types";

interface AlgorithmSelectorProps {
  algorithms: SortingAlgorithm[];
  selectedAlgo: string;
  onAlgoChange: (algoKey: string) => void;
  algoData?: SortingAlgorithm;
}

export default function AlgorithmSelector({
  algorithms,
  selectedAlgo,
  onAlgoChange,
  algoData,
}: AlgorithmSelectorProps) {
  return (
    <section className="mb-4">
      {/* <h2 className="text-base lg:text-lg font-semibold text-gray-800 mb-4">
        Select Algorithm
      </h2> */}
      <div className="flex flex-col md:flex-row gap-3">
        {algorithms.map((algo) => (
          <Button
            key={algo.key}
            onClick={() => onAlgoChange(algo.key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              selectedAlgo === algo.key
                ? "bg-[#83AFC9] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
            }`}
          >
            {algo.label}
          </Button>
        ))}

        {/* {algorithms.map((algo) => (
            <p className="text-sm">{selectedAlgo === algo.key && (<span>{algo.description}</span>)}</p>
        ))} */}
      </div>
      {algoData && (
        <div className="mt-6 bg-gray-50 p-4 rounded-md">
          <p className="text-gray-600 text-sm">{algoData.description}</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-700">Time Complexity</h4>
              <ul className="mt-2 space-y-1">
                <li className="text-green-600">
                  Best: {algoData.complexity.time.best}
                </li>
                <li className="text-amber-600">
                  Average: {algoData.complexity.time.average}
                </li>
                <li className="text-red-600">
                  Worst: {algoData.complexity.time.worst}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Space Complexity</h4>
              <p className="mt-2 text-blue-600">{algoData.complexity.space}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
