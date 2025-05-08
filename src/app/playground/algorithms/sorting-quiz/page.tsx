"use client";
import React from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import Breadcrumb from "@/components/common/Breadcrumb";
import QuizContainer from "@/components/page_components/sorting/quiz_partials/QuizContainer";

const SortingQuizPage: React.FC = () => {
  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Playground", href: "/playground" },
            { label: "Algorithms", href: "/playground/algorithms" },
            { label: "Quiz", href: "/playground/algorithms/sorting-quiz" },
          ]}
        />

        <h1 className="text-3xl font-bold mt-6 mb-8">Sorting Algorithms Quiz</h1>
        <p>
          This quiz is designed to test your understanding of sorting algorithm concepts and techniques. If you need any help, please refer to the
          <a
            className="text-primary-500 hover:underline mx-2 text-lg font-semibold"
            href="/playground/algorithms/sorting">Sorting Algorithms</a> page.
        </p>
        <QuizContainer />
      </div>
    </BaseLayout>
  );
};

export default SortingQuizPage;
