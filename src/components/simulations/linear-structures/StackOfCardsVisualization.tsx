"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  FiPlus,
  FiMinus,
  FiRefreshCw,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { LinearDataItem, LinearVisualizationProps } from "./types";
import { useTranslation } from "react-i18next";
export const StackOfCardsVisualization = ({
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [animatingPush, setAnimatingPush] = useState<boolean>(false);
  const [animatingPop, setAnimatingPop] = useState<boolean>(false);
  const [animationComplete, setAnimationComplete] = useState<boolean>(true);
  const [operationLog, setOperationLog] = useState<string[]>([]);
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

  // Push a card onto the stack
  const handlePush = async () => {
    if (!newValue.trim()) {
      toast.error("Please enter a value to push");
      return;
    }

    if (!animationComplete) {
      return;
    }

    const newItem: LinearDataItem = {
      id: Date.now().toString(),
      value: newValue,
      color: getRandomColor(),
    };

    setAnimationComplete(false);
    setAnimatingPush(true);
    setActiveIndex(0);

    // First add the new item with animation
    const newStack = [newItem, ...data];
    setData(newStack);

    await new Promise((resolve) =>
      setTimeout(resolve, (1.2 - animationSpeed) * 1000)
    );

    setAnimatingPush(false);
    setActiveIndex(null);
    setAnimationComplete(true);
    setNewValue("");

    // Log operation
    setOperationLog((prev) => [
      `Push: ${newItem.value} added to top of stack`,
      ...prev.slice(0, 9),
    ]);
    toast.success(`Pushed ${newItem.value} to stack`);
  };

  // Pop a card from the stack
  const handlePop = async () => {
    if (data.length === 0) {
      toast.error("Stack is empty");
      return;
    }

    if (!animationComplete) {
      return;
    }

    setAnimationComplete(false);
    setAnimatingPop(true);
    setActiveIndex(0);

    const poppedItem = data[0];

    await new Promise((resolve) =>
      setTimeout(resolve, (1.2 - animationSpeed) * 1000)
    );

    // Remove the top item after animation
    const newStack = [...data];
    newStack.shift();
    setData(newStack);

    setAnimatingPop(false);
    setActiveIndex(null);
    setAnimationComplete(true);

    // Log operation
    setOperationLog((prev) => [
      `Pop: ${poppedItem.value} removed from top of stack`,
      ...prev.slice(0, 9),
    ]);
    toast.success(`Popped ${poppedItem.value} from stack`);
  };

  // Peek at the top card
  const handlePeek = () => {
    if (data.length === 0) {
      toast.error("Stack is empty");
      return;
    }

    setActiveIndex(0);

    // Highlight for a moment
    setTimeout(() => {
      setActiveIndex(null);
    }, 1500);

    // Log operation
    setOperationLog((prev) => [
      `Peek: Current top element is ${data[0].value}`,
      ...prev.slice(0, 9),
    ]);
    toast.success(`Top element is ${data[0].value}`);
  };

  // Reset the stack
  const handleReset = () => {
    if (!animationComplete) {
      return;
    }

    setData(
      initialData || [
        { id: "1", value: "A", color: "#3b82f6" },
        { id: "2", value: "B", color: "#10b981" },
        { id: "3", value: "C", color: "#f59e0b" },
        { id: "4", value: "D", color: "#ef4444" },
      ]
    );
    setActiveIndex(null);
    setOperationLog([]);
    toast.success("Stack reset");
  };

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: -100, scale: 0.8 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.3,
      },
    }),
    exit: { opacity: 0, y: -100, scale: 0.8, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gray-50 p-6 rounded-lg border border-gray-200 flex items-center justify-center">
          <div className="relative min-h-[400px] w-full flex items-center justify-center">
            <AnimatePresence>
              {data.map((item, index) => (
                <motion.div
                  key={item.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute"
                  style={{
                    zIndex: data.length - index,
                    top: `${index * 30}px`,
                    transform:
                      activeIndex === index ? "translateY(-20px)" : "none",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <div
                    className={`w-64 h-40 rounded-lg shadow-lg flex items-center justify-center text-3xl font-bold border-4 ${
                      activeIndex === index
                        ? "border-yellow-400"
                        : "border-white"
                    }`}
                    style={{
                      backgroundColor: item.color,
                      transform: `rotate(${Math.random() * 3 - 1.5}deg)`,
                    }}
                  >
                    {item.value}
                  </div>

                  {/* Index indicator on the side */}
                  <div className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 bg-gray-200 px-2 py-1 rounded text-xs">
                    {index === 0 ? "TOP" : `Index: ${index}`}
                  </div>
                </motion.div>
              ))}

              {/* Push animation preview */}
              {animatingPush && newValue && (
                <motion.div
                  initial={{ y: -200, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.2 - animationSpeed }}
                  className="absolute"
                  style={{ zIndex: data.length + 1, top: `-20px` }}
                >
                  <div
                    className="w-64 h-40 rounded-lg shadow-lg flex items-center justify-center text-3xl font-bold border-4 border-yellow-400"
                    style={{
                      backgroundColor: getRandomColor(),
                      transform: `rotate(${Math.random() * 3 - 1.5}deg)`,
                    }}
                  >
                    {newValue}
                  </div>
                </motion.div>
              )}

              {/* Pop animation preview */}
              {animatingPop && data.length > 0 && (
                <motion.div
                  initial={{ y: 0, opacity: 1 }}
                  animate={{ y: -200, opacity: 0 }}
                  transition={{ duration: 1.2 - animationSpeed }}
                  className="absolute"
                  style={{ zIndex: data.length + 1, top: `${0}px` }}
                >
                  <div
                    className="w-64 h-40 rounded-lg shadow-lg flex items-center justify-center text-3xl font-bold border-4 border-yellow-400"
                    style={{
                      backgroundColor: data[0].color,
                      transform: `rotate(${Math.random() * 3 - 1.5}deg)`,
                    }}
                  >
                    {data[0].value}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty stack indicator */}
            {data.length === 0 && !animatingPush && (
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <p className="text-gray-400 text-xl italic">Stack is empty</p>
              </div>
            )}

            {/* Stack base */}
            <div className="absolute bottom-0 w-72 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Stack Operations</h3>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="flex-1"
                disabled={!animationComplete}
              />
              <Button
                onClick={handlePush}
                disabled={!animationComplete || !newValue.trim()}
                className="whitespace-nowrap"
              >
                <FiArrowDown className="mr-2" /> Push
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handlePop}
                disabled={!animationComplete || data.length === 0}
                variant="outline"
                className="flex-1"
              >
                <FiArrowUp className="mr-2" /> Pop
              </Button>

              <Button
                onClick={handlePeek}
                disabled={data.length === 0 || !animationComplete}
                variant="outline"
                className="flex-1"
              >
                Peek
              </Button>
            </div>

            <Button
              onClick={handleReset}
              disabled={!animationComplete}
              variant="outline"
              className="w-full"
            >
              <FiRefreshCw className="mr-2" /> Reset
            </Button>

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

            {/* Operations Log */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Operations Log</h4>
              <div className="bg-gray-50 p-2 rounded-md h-[160px] overflow-y-auto text-xs">
                {operationLog.length === 0 ? (
                  <p className="text-gray-400 italic">
                    No operations performed yet
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {operationLog.map((log, index) => (
                      <li
                        key={index}
                        className="border-b border-gray-100 pb-1 last:border-0"
                      >
                        {log}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium mb-4">{t("stack-title")}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm">{t("stack-what-title")}</h4>
              <p className="text-sm text-gray-600">{t("stack-what-desc")}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm">{t("stack-ops-title")}</h4>
              <ul className="list-disc text-sm text-gray-600 pl-5 space-y-1">
                {(t("stack-ops", { returnObjects: true }) as string[]).map(
                  (op, idx) => (
                    <li key={idx}>{op}</li>
                  )
                )}
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm">{t("stack-limit-title")}</h4>
              <ul className="list-disc text-sm text-gray-600 pl-5 space-y-1">
                {(t("stack-limit", { returnObjects: true }) as string[]).map(
                  (lim, idx) => (
                    <li key={idx}>{lim}</li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-sm">{t("stack-app-title")}</h4>
              <ul className="list-disc text-sm text-gray-600 pl-5 space-y-1">
                {(t("stack-apps", { returnObjects: true }) as string[]).map(
                  (app, idx) => (
                    <li key={idx}>{app}</li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
