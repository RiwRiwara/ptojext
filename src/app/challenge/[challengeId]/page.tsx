"use client";
import React from "react";
import quizzes from "@/data/quizzes";
import SurveyQuiz from "@/components/challenge/SurveyQuiz";
import { useParams } from "next/navigation";
import { Quiz } from "@/types/Quiz";

const ChallengePage: React.FC = () => {
  const params = useParams();
  const challengeId = params?.challengeId as string;
  const quiz = quizzes.find((q: Quiz) => q.id === challengeId);

  if (!quiz) return <div className="p-8">Challenge not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">{quiz.title}</h2>
      <SurveyQuiz surveyJson={quiz.survey} onComplete={data => {
        // handle results, scoring, save progress, etc.
        console.log("Quiz completed! Data:", data);
      }} />
    </div>
  );
};

export default ChallengePage;
