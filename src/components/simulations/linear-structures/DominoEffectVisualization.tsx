"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { FiPlus, FiRefreshCw, FiPlay, FiEdit2 } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { LinearDataItem, LinearVisualizationProps } from "./types";
import { useTranslation } from "react-i18next";
export const DominoEffectVisualization = ({
  initialData,
}: LinearVisualizationProps) => {
  const [data, setData] = useState<LinearDataItem[]>(
    initialData || [
      { id: "1", value: "Task 1", color: "#3b82f6", label: "Initialize" },
      { id: "2", value: "Task 2", color: "#10b981", label: "Process" },
      { id: "3", value: "Task 3", color: "#f59e0b", label: "Validate" },
      { id: "4", value: "Task 4", color: "#ef4444", label: "Output" },
      { id: "5", value: "Task 5", color: "#8b5cf6", label: "Cleanup" },
    ]
  );
  const [newValue, setNewValue] = useState<string>("");
  const [newLabel, setNewLabel] = useState<string>("");
  const [animationSpeed, setAnimationSpeed] = useState<number>(0.5);
  const [currentDomino, setCurrentDomino] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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

  // Add a new domino to the sequence
  const handleAddItem = () => {
    if (!newValue.trim()) {
      toast.error("Please enter a value");
      return;
    }

    const newItem: LinearDataItem = {
      id: Date.now().toString(),
      value: newValue,
      label: newLabel || `Task ${data.length + 1}`,
      color: getRandomColor(),
    };

    setData([...data, newItem]);
    setNewValue("");
    setNewLabel("");
    toast.success("Domino added");
  };

  // Update a domino's details
  const handleUpdateItem = (index: number) => {
    if (editingIndex === null) return;

    const newData = [...data];
    newData[editingIndex] = {
      ...newData[editingIndex],
      value: newValue || newData[editingIndex].value,
      label: newLabel || newData[editingIndex].label,
    };

    setData(newData);
    setNewValue("");
    setNewLabel("");
    setEditingIndex(null);
    toast.success("Domino updated");
  };

  // Start editing a domino
  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setNewValue(data[index].value.toString());
    setNewLabel(data[index].label || "");
  };

  // Reset the dominoes
  const handleReset = () => {
    setData(
      initialData || [
        { id: "1", value: "Task 1", color: "#3b82f6", label: "Initialize" },
        { id: "2", value: "Task 2", color: "#10b981", label: "Process" },
        { id: "3", value: "Task 3", color: "#f59e0b", label: "Validate" },
        { id: "4", value: "Task 4", color: "#ef4444", label: "Output" },
        { id: "5", value: "Task 5", color: "#8b5cf6", label: "Cleanup" },
      ]
    );
    setCurrentDomino(null);
    setIsProcessing(false);
    setEditingIndex(null);
    toast.success("Dominoes reset");
  };

  // Simulate domino effect (sequential falling)
  const simulateDominoEffect = async () => {
    setIsProcessing(true);

    // Reset all dominoes
    setCurrentDomino(null);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Trigger each domino in sequence
    for (let i = 0; i < data.length; i++) {
      setCurrentDomino(i);
      // Wait for animation based on speed
      await new Promise((resolve) =>
        setTimeout(resolve, (2 - animationSpeed) * 1000)
      );
    }

    setIsProcessing(false);
    toast.success("Process completed");
  };

  // Scroll to view when data changes
  useEffect(() => {
    if (containerRef.current && data.length > 0) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [data.length]);

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium mb-4">
          Domino Effect Visualization
        </h3>

        <div
          ref={containerRef}
          className="relative min-h-[220px] overflow-x-auto"
        >
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gray-300"></div>

          <div className="flex items-end pt-4 pb-8 overflow-x-auto">
            <AnimatePresence>
              {data.map((item, index) => {
                const isFallen =
                  currentDomino !== null && index <= currentDomino;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative mx-3 first:ml-4 last:mr-8"
                  >
                    {/* Domino */}
                    <motion.div
                      animate={{
                        rotateZ: isFallen ? 90 : 0,
                        y: isFallen ? -10 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: isFallen ? 8 : 15,
                        delay: isFallen ? index * (0.2 / animationSpeed) : 0,
                      }}
                      style={{
                        backgroundColor: item.color,
                        originX: 0.5,
                        originY: 1,
                      }}
                      className="w-24 h-40 rounded-md flex flex-col items-center justify-center text-white p-2 cursor-pointer"
                      onClick={() => !isProcessing && handleStartEdit(index)}
                    >
                      <div className="text-center">
                        <div className="font-bold text-xl mb-2 px-2 py-1 bg-black bg-opacity-20 rounded">
                          {item.value.toString()}
                        </div>
                        <div className="text-sm">{item.label}</div>
                      </div>
                    </motion.div>

                    {/* Edit button */}
                    {!isProcessing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(index)}
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-70 hover:opacity-100 pt-4"
                      >
                        <FiEdit2 className="mr-1" /> Edit
                      </Button>
                    )}

                    {/* Index indicator */}
                    <div className="absolute bottom-[-24px] left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                      [{index}]
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Controls</h3>

          <div className="space-y-4">
            {editingIndex !== null ? (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">
                  Editing Domino {editingIndex}
                </h4>
                <Input
                  type="text"
                  placeholder="Enter task"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="mb-2"
                />
                <Input
                  type="text"
                  placeholder="Enter label"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="mb-2"
                />
                <div className="flex space-x-2">
                  <Button onClick={() => handleUpdateItem(editingIndex)}>
                    Update Domino
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingIndex(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="Enter task"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="mb-2"
                  disabled={isProcessing}
                />
                <Input
                  type="text"
                  placeholder="Enter label (optional)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="mb-2"
                  disabled={isProcessing}
                />
                <Button onClick={handleAddItem} disabled={isProcessing}>
                  <FiPlus className="mr-2" /> Add Domino
                </Button>
              </div>
            )}

            <div>
              <Button
                variant="outline"
                onClick={simulateDominoEffect}
                disabled={
                  isProcessing || data.length === 0 || editingIndex !== null
                }
                className="mr-2"
              >
                <FiPlay className="mr-2" />
                Trigger Effect
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
          <h3 className="text-lg font-medium mb-4">{t("domino-title")}</h3>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm">{t("domino-subtitle")}</h4>
              <p className="text-sm text-gray-600">{t("domino-sub")}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm">{t("domino-ops-title")}</h4>
              <ul className="list-disc text-sm text-gray-600 pl-5 space-y-1">
                {(t("domino-ops", { returnObjects: true }) as string[]).map(
                  (point, idx) => (
                    <li key={idx}>{point}</li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-sm">{t("domino-app-title")}</h4>
              <p className="text-sm text-gray-600">{t("domino-app-desc")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
