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
export const LinearTimelineVisualization = ({
  initialData,
}: LinearVisualizationProps) => {
  const [data, setData] = useState<LinearDataItem[]>(
    initialData || [
      { id: "1", value: "A", color: "#3b82f6" },
      { id: "2", value: "B", color: "#10b981" },
      { id: "3", value: "C", color: "#f59e0b" },
      { id: "4", value: "D", color: "#ef4444" },
      { id: "5", value: "E", color: "#8b5cf6" },
    ]
  );
  const [newValue, setNewValue] = useState<string>("");
  const [animationSpeed, setAnimationSpeed] = useState<number>(0.5);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
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

  // Add a new item to the end of the timeline
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
    toast.success("Item added");
  };

  // Remove an item from the timeline
  const handleRemoveItem = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
    toast.success("Item removed");
  };

  // Reset the timeline to initial state
  const handleReset = () => {
    setData(
      initialData || [
        { id: "1", value: "A", color: "#3b82f6" },
        { id: "2", value: "B", color: "#10b981" },
        { id: "3", value: "C", color: "#f59e0b" },
        { id: "4", value: "D", color: "#ef4444" },
        { id: "5", value: "E", color: "#8b5cf6" },
      ]
    );
    setHighlightedIndex(null);
    toast.success("Timeline reset");
  };

  // Simulate a traversal through the timeline
  const simulateTraversal = async () => {
    setIsProcessing(true);

    // Loop through each item with a delay
    for (let i = 0; i < data.length; i++) {
      setHighlightedIndex(i);
      // Wait for animation time based on speed
      await new Promise((resolve) =>
        setTimeout(resolve, (1.5 - animationSpeed) * 1000)
      );
    }

    // Reset highlight after traversal
    setHighlightedIndex(null);
    setIsProcessing(false);
    toast.success("Traversal complete");
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Timeline Visualization</h3>

        <div className="relative flex items-center justify-center min-h-[160px]">
          <AnimatePresence>
            <div className="relative flex items-center justify-start w-full overflow-x-auto pb-6">
              {data.map((item, index) => (
                <div key={item.id} className="flex flex-col items-center mx-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: highlightedIndex === index ? 1.1 : 1,
                      boxShadow:
                        highlightedIndex === index
                          ? "0 0 0 3px rgba(59, 130, 246, 0.5)"
                          : "none",
                    }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.value}
                  </motion.div>

                  {/* Index indicator */}
                  <div className="text-xs text-gray-500">[{index}]</div>

                  {/* Arrow between nodes (except for the last one) */}
                  {index < data.length - 1 && (
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        repeat: highlightedIndex === index ? Infinity : 0,
                        duration: 0.8,
                      }}
                      className="absolute top-8 left-[calc(100%+10px)] transform -translate-y-1/2"
                    >
                      <FiArrowRight className="text-gray-400 text-xl" />
                    </motion.div>
                  )}

                  {/* Remove button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                    className="mt-2 opacity-50 hover:opacity-100"
                    disabled={isProcessing}
                  >
                    <FiMinus className="mr-1" /> Remove
                  </Button>
                </div>
              ))}
            </div>
          </AnimatePresence>
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
                <FiPlus className="mr-2" /> Add Item
              </Button>
            </div>

            <div>
              <Button
                variant="outline"
                onClick={simulateTraversal}
                disabled={isProcessing || data.length === 0}
                className="mr-2"
              >
                <FiArrowRight className="mr-2" />
                Traverse
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
                Animation Speed: {animationSpeed.toFixed(1)}x
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
          <h3 className="text-lg font-medium mb-4">Timeline Information</h3>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm">{t("timeline-title")}</h4>
              <p className="text-sm text-gray-600">{t("timeline-sub")}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm">{t("timeline-ops-title")}</h4>
              <ul className="list-disc text-sm text-gray-600 pl-5 space-y-1">
                {(Array.isArray(t("timeline-ops", { returnObjects: true }))
                  ? (t("timeline-ops", { returnObjects: true }) as string[])
                  : []
                ).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-sm">{t("timeline-app-title")}</h4>
              <p className="text-sm text-gray-600">{t("timeline-app-desc")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
