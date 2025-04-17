"use client";
import { Survey } from "survey-react-ui";
import "survey-core/survey-core.css";
import { Model, SurveyModel } from "survey-core"; // Replace ISurvey with SurveyModel
import React, { useState } from "react";
import { SurveyJson, SurveyElement } from "@/types/Quiz";

interface SurveyQuizProps {
  surveyJson: SurveyJson;
  onComplete?: (data: Record<string, unknown>) => void;
}

export default function SurveyQuiz({ surveyJson, onComplete }: SurveyQuizProps) {
  const [score, setScore] = useState<number | null>(null);
  const [maxScore, setMaxScore] = useState<number | null>(null);
  const [results, setResults] = useState<Record<string, unknown> | null>(null);
  const survey = new Model(surveyJson);

  survey.onComplete.add((sender: SurveyModel) => {
    const data = sender.data as Record<string, unknown>; // Now TypeScript recognizes 'data'
    let correct = 0;
    let total = 0;

    // Get correct answers from survey JSON
    if (surveyJson.elements) {
      surveyJson.elements.forEach((q: SurveyElement) => {
        // Only score if correctAnswer is set
        if (q.correctAnswer !== undefined && q.correctAnswer !== null) {
          total++;
          if (data[q.name] !== undefined) {
            // For boolean, string, number
            if (
              typeof q.correctAnswer === "string" ||
              typeof q.correctAnswer === "boolean" ||
              typeof q.correctAnswer === "number"
            ) {
              if (data[q.name] === q.correctAnswer) correct++;
            } else if (Array.isArray(q.correctAnswer)) {
              // For multi-select
              if (JSON.stringify(data[q.name]) === JSON.stringify(q.correctAnswer)) correct++;
            }
          }
        }
      });
    }
    setScore(correct);
    setMaxScore(total);
    setResults(data);
    if (onComplete) onComplete(data);
  });

  return (
    <div>
      {score === null ? (
        <Survey model={survey} />
      ) : (
        <div className="text-center my-8">
          <h3 className="text-2xl font-bold mb-2">
            Your Score: {score} / {maxScore}
          </h3>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Your Answers:</h4>
            <pre className="bg-gray-100 rounded p-2 text-left text-sm overflow-x-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}