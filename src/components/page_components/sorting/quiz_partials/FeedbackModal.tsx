"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { QuizItem, QuizSettings } from "./types";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
  hint: string;
  attempts: number;
  maxAttempts: number;
  onNext: () => void;
  userValues?: string;
  targetValues?: string;
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
  currentQuiz,
}) => {
  const isSuccess = type === "success";
  const isLastAttempt = attempts >= maxAttempts;
  const isCorrectAnswer = (userValues === targetValues);

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
          {isSuccess ? (isCorrectAnswer ? "Perfect Answer!" : "Not Quite Right"): "Try Again!"}
        </ModalHeader>
        <ModalBody>
          {isSuccess ? (
            <>
              <p className="text-green-700 mb-3">
                {isCorrectAnswer
                  ? "You got it right! Keep up the great work!"
                  : `Almost there! Try to think about the concept of ${currentQuiz.title}.`}
              </p>

              {userValues && targetValues && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-2">Your response</h4>
                  <div className="space-y-1 text-sm">
                    {userValues && targetValues && (
                      <div className="flex justify-between">
                        <span className="capitalize">Answer</span>
                        <span className="text-blue-600">{formatValue(userValues)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="mb-2">Keep trying! Here is a hint:</p>
              <p className="p-3 bg-blue-50 rounded-md text-blue-800">{hint}</p>

              {userValues && targetValues && attempts > 1 && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-1 text-sm">Tips:</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {userValues && targetValues && (
                      <p>Try to think about the {currentQuiz.title} concept.</p>
                    )}
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
