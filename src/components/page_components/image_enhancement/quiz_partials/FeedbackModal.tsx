"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Spinner } from "@heroui/spinner";
import { AdjustmentValues, QuizItem, QuizSettings } from "./types";
import { useQuizAI } from "@/hooks/useQuizAI";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw, FiCpu } from "react-icons/fi";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
  hint: string;
  attempts: number;
  maxAttempts: number;
  onNext: () => void;
  userValues?: AdjustmentValues;
  targetValues?: Record<string, number | boolean | string>;
  matchPercentage: number;
  currentQuiz: QuizItem;
  quizSettings: QuizSettings;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  type,
  hint,
  attempts,
  maxAttempts,
  onNext,
  userValues,
  targetValues,
  matchPercentage,
  currentQuiz,
  quizSettings,
}) => {
  const isSuccess = type === "success";
  const isLastAttempt = attempts >= maxAttempts;
  const isCloseMatch = matchPercentage >= 75 && matchPercentage < 100;
  const [showAIHint, setShowAIHint] = useState(false);

  // Use the AI hook
  const { aiHint, isLoadingHint, error, generateAIHint } = useQuizAI({
    quiz: currentQuiz,
    settings: quizSettings,
  });

  // Reset AI hint state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowAIHint(false);
    }
  }, [isOpen]);

  // Format a value for display
  const formatValue = (value: number | boolean | string): string => {
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "string") {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    if (typeof value === "number") {
      // Format numbers with up to 2 decimal places
      return value.toFixed(Math.abs(value) < 10 ? 2 : 0);
    }
    return String(value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className={isSuccess ? "text-green-600" : "text-red-600"}>
          {isSuccess ? (isCloseMatch ? "Close Match!" : "Perfect Match!") : "Not Quite Right"}
        </ModalHeader>
        <ModalBody>
          {isSuccess ? (
            <>
              <p className="text-green-700 mb-3">
                {isCloseMatch
                  ? `You got close enough! (${Math.round(matchPercentage)}% match)`
                  : "You successfully identified the anomaly!"}
              </p>

              {userValues && targetValues && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-2">Your values vs. Target values:</h4>
                  <div className="space-y-1 text-sm">
                    {Object.entries(targetValues).map(([key, targetValue]) => {
                      if (key in userValues) {
                        const userValue = userValues[key as keyof AdjustmentValues];
                        return (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span>
                              <span className="text-blue-600">{formatValue(userValue)}</span>
                              <span className="mx-1">vs</span>
                              <span className="text-green-600">{formatValue(targetValue)}</span>
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="mb-2">Keep trying! Here is a hint:</p>
              <p className="p-3 bg-blue-50 rounded-md text-blue-800">{hint}</p>
              
              {/* AI Hint Button */}
              <div className="mt-4">
                <Button 
                  variant="ghost"
                  onPress={() => {
                    if (!aiHint) {
                      generateAIHint();
                    }
                    setShowAIHint(!showAIHint);
                  }}
                  className="flex items-center gap-2 text-sm"
                  startContent={<FiCpu className="text-blue-600" />}
                  endContent={isLoadingHint && <Spinner size="sm" />}
                >
                  {showAIHint 
                    ? "Hide Advanced Hint" 
                    : aiHint 
                      ? "Show Advanced Hint" 
                      : "Get Advanced Hint"}
                </Button>
                
                <AnimatePresence>
                  {showAIHint && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 overflow-hidden"
                    >
                      {isLoadingHint ? (
                        <div className="p-4 bg-gray-50 rounded-md flex items-center justify-center">
                          <Spinner size="md" />
                          <span className="ml-2">Generating advanced hint...</span>
                        </div>
                      ) : error ? (
                        <div className="p-3 bg-red-50 rounded-md text-red-800">
                          <p className="font-semibold">Error generating advanced hint:</p>
                          <p>{error}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 flex items-center gap-1"
                            onPress={generateAIHint}
                            startContent={<FiRefreshCw />}
                          >
                            Try again
                          </Button>
                        </div>
                      ) : aiHint ? (
                        <div className="p-4 bg-purple-50 rounded-md border border-purple-100">
                          <h4 className="text-sm font-semibold text-purple-800 mb-2">Advanced Hint:</h4>
                          <p className="text-purple-900">{aiHint}</p>
                        </div>
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {userValues && targetValues && attempts > 1 && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-1 text-sm">Adjustment tips:</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {Object.entries(targetValues).map(([key, targetValue]) => {
                      if (key in userValues) {
                        const userValue = userValues[key as keyof AdjustmentValues];
                        if (typeof targetValue === 'number' && typeof userValue === 'number') {
                          const direction = userValue < targetValue ? 'increase' : 'decrease';
                          return (
                            <li key={key}>
                              Try to {direction} the {key.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}
                            </li>
                          );
                        }
                      }
                      return null;
                    })}
                  </ul>
                </div>
              )}

              {isLastAttempt && (
                <p className="mt-4 text-orange-600 font-semibold">
                  You have used all your attempts. Click continue to move to the next challenge.
                </p>
              )}
              <p className="mt-2 text-sm text-gray-600">
                Attempts: {attempts}/{maxAttempts}
              </p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {isSuccess || isLastAttempt ? (
            <Button color="primary" onPress={onNext}>
              Continue
            </Button>
          ) : (
            <Button color="primary" onPress={onClose}>
              Try Again
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FeedbackModal;
