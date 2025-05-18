"use client";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import SortingAlgorithms from "@/classes/sorting/SortingAlgorithms";
import PixiSortingVisualizer from "@/components/playground_components/algorithms/sorting/PixiSortingVisualizer";
import AlgorithmSelector from "@/components/playground_components/algorithms/sorting/AlgorithmSelector";
import ArrayControls from "@/components/playground_components/algorithms/sorting/ArrayControls";
import VisualizationControls from "@/components/playground_components/algorithms/sorting/VisualizationControls";
import CodeDisplay from "@/components/playground_components/algorithms/sorting/CodeDisplay";
import {
  AnimationStep,
  SortingAlgorithm,
} from "@/components/playground_components/algorithms/sorting/types";
import Breadcrumb from "@/components/common/Breadcrumb";
import { motion } from "framer-motion";
import {
  FaInfoCircle,
  FaLightbulb,
  FaRegClock,
  FaMemory,
  FaCode,
  FaEye,
  // FaChalkboardTeacher,
} from "react-icons/fa";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/drawer";
import { Button } from "@nextui-org/button";
import { useTranslation } from "react-i18next";

export default function SortingVisualizerPage() {
  const { t } = useTranslation("sortingPageTranslations");
  const sortingAlgorithms: SortingAlgorithm[] = [
    {
      key: "bubble-sort",
      label: "Bubble Sort",
      description: t("desc-bubble-sort"),
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
      description: t("desc-selection-sort"),
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
      description: t("desc-insertion-sort"),
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
      description: t("desc-merge-sort"),
      complexity: {
        time: {
          best: "O(n log n)",
          average: "O(n log n)",
          worst: "O(n log n)",
        },
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
      description: t("desc-quick-sort"),
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
  // State for array and visualization
  const [currentArray, setCurrentArray] = useState<number[]>([]);
  const [initialArray, setInitialArray] = useState<number[]>([
    10, 5, 8, 3, 1, 6, 12, 4, 15,
  ]);
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
  const [currentHighlightedLine, setCurrentHighlightedLine] =
    useState<number>(-1);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const newArray = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 100) + 1
    );
    setInitialArray(newArray);
    setCurrentStep(0);
    setIsPlaying(false);
    setCurrentHighlightedLine(-1);
  }, []);

  // Randomize array
  const randomizeArray = useCallback(() => {
    const size = initialArray.length;
    const newArray = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 100) + 1
    );
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
      if (
        !Array.isArray(parsedArray) ||
        parsedArray.some((item) => typeof item !== "number")
      ) {
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
    const swaps = animationSteps.filter((step) => step.type === "swap").length;
    const comparisons = animationSteps.filter(
      (step) => step.type === "compare"
    ).length;
    const runtime = Math.round((animationSteps.length / speed) * 100); // Simulated runtime in ms

    setAlgorithmStats({
      swaps,
      comparisons,
      runtime,
    });
  }, [animationSteps, speed]);

  // Handle bar click to start sorting from a specific position
  const handleBarClick = useCallback(
    (index: number) => {
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
        const targetStep = steps.findIndex(
          (step) => step.from === index || step.to === index
        );

        if (targetStep !== -1) {
          setCurrentStep(Math.max(0, targetStep));
          const stepType = steps[targetStep]
            ?.type as keyof typeof codeHighlightMap;
          if (stepType && stepType in codeHighlightMap) {
            setCurrentHighlightedLine(codeHighlightMap[stepType]);
          }
        }

        // Start the animation
        setIsPlaying(true);
      }, 100);
    },
    [initialArray, selectedAlgo, isPlaying, codeHighlightMap]
  );

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
        const lineNumber =
          codeHighlightMap[stepType as keyof typeof codeHighlightMap];
        setCurrentHighlightedLine(lineNumber);
      }
    }
  }, [codeHighlightMap, currentStep, animationSteps, handleSortingComplete]);

  const handleStepChange = useCallback(
    (step: number) => {
      setCurrentStep(step);
      if (step < animationSteps.length) {
        const stepType = animationSteps[step]
          ?.type as keyof typeof codeHighlightMap;
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
      <div className="py-4 bg-white rounded-md">
        <main className="container mx-auto px-4 py-0">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Playground", href: "" },
              { label: "Algorithms", href: "" },
              { label: "Sorting", href: "/playground/algorithms/sorting" },
            ]}
          />

          <div className="mt-4 mb-8 ml-1 md:ml-0">
            <h1 className="text-3xl font-bold text-[#83AFC9] mb-2 mt-4">
              {t("sorting-title")}
            </h1>
            <p className="text-gray-600">{t("sorting-subtitle")}</p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
              <div className="w-full md:w-[60%]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border rounded-lg shadow-md p-4 min-h-[900px]"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FaEye className="text-[#83AFC9]" />
                    <h3 className="text-base md:text-lg font-medium text-gray-700">
                      {t("algo-visual")}
                    </h3>
                  </div>

                  <AlgorithmSelector
                    algorithms={sortingAlgorithms}
                    selectedAlgo={selectedAlgo}
                    onAlgoChange={handleAlgorithmSelect}
                  />

                  <ArrayControls
                    arraySize={initialArray.length}
                    onArraySizeChange={handleArraySizeChange}
                    onRandomize={randomizeArray}
                    onCustomArray={handleCustomArraySubmit}
                    customArrayInput={customArrayInput}
                    setCustomArrayInput={setCustomArrayInput}
                    inputError={inputError}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {showExplanation && currentStep < animationSteps.length && (
                      <div className="mb-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm">
                        <div className="flex items-start">
                          <div>
                            <strong>
                              {t("step", { number: currentStep + 1 })}
                            </strong>{" "}
                            {animationSteps[currentStep]?.type === "compare" &&
                              t("step-compare")}
                            {animationSteps[currentStep]?.type === "swap" &&
                              t("step-swap")}
                            {animationSteps[currentStep]?.type === "select" &&
                              t("step-select")}
                            {animationSteps[currentStep]?.type === "set" &&
                              t("step-set")}{" "}
                            {typeof animationSteps[currentStep]?.from !==
                              "undefined" &&
                              t("step-from", {
                                index: animationSteps[currentStep].from,
                              })}
                            {typeof animationSteps[currentStep]?.to !==
                              "undefined" &&
                              t("step-to", {
                                index: animationSteps[currentStep].to,
                              })}
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
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
                  </div>

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
              </div>

              <div className="w-full md:w-[40%]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white border rounded-lg shadow-md p-4 h-[900px]"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FaCode className="text-[#83AFC9]" />
                    <h3 className="text-base md:text-lg font-medium text-gray-700">
                      {t("algo-code")}
                    </h3>
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

            {selectedAlgoData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white rounded-lg border shadow-md p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <FaInfoCircle className="text-[#83AFC9]" />
                  <h3 className="text-lg font-medium text-gray-700">
                    {t("complexity-title")}
                  </h3>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 text-sm mb-2 flex items-center gap-2">
                    <FaRegClock className="text-[#83AFC9]" />
                    <span>{t("complexity-time")}</span>
                  </h4>
                  <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                    <div className="bg-white p-2 rounded-md border border-gray-200">
                      <span className="text-gray-500 block">
                        {t("complexity-best")}
                      </span>
                      <span className="font-mono font-medium text-base">
                        {selectedAlgoData?.complexity.time.best}
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded-md border border-gray-200">
                      <span className="text-gray-500 block">
                        {t("complexity-average")}
                      </span>
                      <span className="font-mono font-medium text-base">
                        {selectedAlgoData?.complexity.time.average}
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded-md border border-gray-200">
                      <span className="text-gray-500 block">
                        {t("complexity-worst")}
                      </span>
                      <span className="font-mono font-medium text-base">
                        {selectedAlgoData?.complexity.time.worst}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-medium text-gray-700 text-sm mb-2 flex items-center gap-2">
                    <FaMemory className="text-[#83AFC9]" />
                    <span>{t("complexity-space")}</span>
                  </h4>
                  <div className="bg-white p-2 rounded border border-gray-200 text-xs mb-3">
                    <span className="font-mono font-medium text-base">
                      {selectedAlgoData?.complexity.space}
                    </span>
                  </div>

                  <h4 className="font-medium text-gray-700 text-sm mb-2 flex items-center gap-2">
                    <FaLightbulb className="text-[#83AFC9]" />
                    <span>{t("complexity-usage")}</span>
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {[0, 1, 2].map((i) =>
                      selectedAlgo === "bubble-sort" ? (
                        <li key={i}>{t(`bubble-usage.${i}`)}</li>
                      ) : selectedAlgo === "insertion-sort" ? (
                        <li key={i}>{t(`insertion-usage.${i}`)}</li>
                      ) : selectedAlgo === "selection-sort" ? (
                        <li key={i}>{t(`selection-usage.${i}`)}</li>
                      ) : selectedAlgo === "merge-sort" ? (
                        <li key={i}>{t(`merge-usage.${i}`)}</li>
                      ) : selectedAlgo === "quick-sort" ? (
                        <li key={i}>{t(`quick-usage.${i}`)}</li>
                      ) : selectedAlgo === "heap-sort" ? (
                        <li key={i + 1}>{t(`heap-usage-${i + 1}`)}</li>
                      ) : null
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
