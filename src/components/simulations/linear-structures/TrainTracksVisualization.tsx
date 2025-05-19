"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { FiPlus, FiMinus, FiRefreshCw, FiArrowRight } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { LinearDataItem, LinearVisualizationProps } from "./types";
import { useTranslation } from "react-i18next";
export const TrainTracksVisualization = ({
  initialData,
}: LinearVisualizationProps) => {
  const [data, setData] = useState<LinearDataItem[]>(
    initialData || [
      { id: "1", value: "A", color: "#3b82f6" },
      { id: "2", value: "B", color: "#10b981" },
      { id: "3", value: "C", color: "#f59e0b" },
      { id: "4", value: "D", color: "#ef4444" },
    ]
  );
  const [newValue, setNewValue] = useState<string>("");
  const [animationSpeed, setAnimationSpeed] = useState<number>(0.5);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [trainPosition, setTrainPosition] = useState<number>(0);
  const { t } = useTranslation("linearDataStructurePageTranslations");
  // Generate a random color for new items
  const getRandomColor = () => {
    const colors = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#ec4899",
      "#14b8a6",
      "#f43f5e",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Add a new train car to the end
  const handleAddItem = () => {
    if (!newValue.trim()) {
      toast.error("Please enter a value");
      return;
    }

    const newItem: LinearDataItem = {
      id: Date.now().toString(),
      value: newValue,
      color: getRandomColor(),
    };

    setData([...data, newItem]);
    setNewValue("");
    toast.success("Train car added");
  };

  // Remove a train car
  const handleRemoveItem = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
    toast.success("Train car removed");
  };

  // Reset the train
  const handleReset = () => {
    setData(
      initialData || [
        { id: "1", value: "A", color: "#3b82f6" },
        { id: "2", value: "B", color: "#10b981" },
        { id: "3", value: "C", color: "#f59e0b" },
        { id: "4", value: "D", color: "#ef4444" },
      ]
    );
    setHighlightedIndex(null);
    setTrainPosition(0);
    toast.success("Train reset");
  };

  // Simulate train movement
  const simulateTrainMovement = async () => {
    setIsProcessing(true);

    // Animate through the train cars
    for (let i = 0; i < data.length; i++) {
      setHighlightedIndex(i);
      setTrainPosition(i);
      // Wait for animation time based on speed
      await new Promise((resolve) =>
        setTimeout(resolve, (1.5 - animationSpeed) * 1000)
      );
    }

    // Reset position
    await new Promise((resolve) => setTimeout(resolve, 500));
    setHighlightedIndex(null);
    setTrainPosition(0);
    setIsProcessing(false);
    toast.success("Train journey complete");
  };

  return (
    <div className="space-y-8 ">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Train Tracks Visualization</h3>

        <div className="relative min-h-[200px] overflow-x-auto">
          {/* Train tracks */}
          <div className="absolute bottom-10 left-0 right-0 h-4 bg-gray-300 flex items-center">
            {Array.from({ length: Math.max(20, data.length * 3) }).map(
              (_, i) => (
                <div key={i} className="h-2 w-4 bg-gray-500 mx-4"></div>
              )
            )}
          </div>

          {/* Train engine */}
          <motion.div
            className="absolute bottom-14 left-0 flex items-center "
            animate={{ x: trainPosition * 120 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="w-24 h-16 bg-gray-800 rounded-lg relative">
                <div className="absolute top-4 left-2 w-4 h-4 bg-yellow-400 rounded-full"></div>
                <div className="absolute bottom-0 left-6 w-12 h-4 bg-gray-700"></div>
              </div>
              <div className="absolute top-2 right-0 w-6 h-8 bg-gray-600 rounded-t-lg"></div>
            </div>
          </motion.div>

          {/* Train cars */}
          <div className="flex items-end pt-12 pb-20 overflow-x-auto">
            <div className="w-32"></div> {/* Space for engine */}
            <AnimatePresence>
              {data.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: highlightedIndex === index ? 1.05 : 1,
                    boxShadow:
                      highlightedIndex === index
                        ? "0 0 0 3px rgba(59, 130, 246, 0.5)"
                        : "none",
                  }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="relative mx-4"
                >
                  {/* Train car */}
                  <div
                    className="w-20 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl relative"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.value}

                    {/* Connectors */}
                    <div className="absolute -left-4 top-1/2 w-4 h-2 bg-gray-600 transform -translate-y-1/2"></div>
                    <div className="absolute -right-4 top-1/2 w-4 h-2 bg-gray-600 transform -translate-y-1/2"></div>

                    {/* Wheels */}
                    <div className="absolute -bottom-3 left-3 w-6 h-6 rounded-full bg-gray-700 border-2 border-gray-500"></div>
                    <div className="absolute -bottom-3 right-3 w-6 h-6 rounded-full bg-gray-700 border-2 border-gray-500"></div>
                  </div>

                  {/* Index indicator */}
                  <div className="absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                    [{index}]
                  </div>

                  {/* Remove button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                    className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 opacity-50 hover:opacity-100"
                    disabled={isProcessing}
                  >
                    <FiMinus className="mr-1" /> Remove
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Controls</h3>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddItem} disabled={isProcessing}>
                <FiPlus className="mr-2" /> Add Car
              </Button>
            </div>

            <div>
              <Button
                variant="outline"
                onClick={simulateTrainMovement}
                disabled={isProcessing || data.length === 0}
                className="mr-2"
              >
                <FiArrowRight className="mr-2" />
                Start Train
              </Button>

              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isProcessing}
              >
                <FiRefreshCw className="mr-2" />
                Reset
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Train Speed: {animationSpeed.toFixed(1)}x
              </label>
              <Slider
                value={[animationSpeed]}
                min={0.1}
                max={1}
                step={0.1}
                onValueChange={(values) => setAnimationSpeed(values[0])}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">{t("train-title")}</h3>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm">{t("train-subtitle")}</h4>
              <p className="text-sm text-gray-600">{t("train-sub")}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm">{t("train-ops-title")}</h4>
              <ul className="list-disc text-sm text-gray-600 pl-5 space-y-1">
                {(Array.isArray(t("train-ops", { returnObjects: true }))
                  ? (t("train-ops", { returnObjects: true }) as string[])
                  : []
                ).map((op: string, idx: number) => (
                  <li key={idx}>{op}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-sm">{t("train-app-title")}</h4>
              <p className="text-sm text-gray-600">{t("train-app-desc")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
