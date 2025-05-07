"use client";
import React from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import Breadcrumb from "@/components/common/Breadcrumb";
import QuizContainer from "@/components/page_components/image_enhancement/quiz_partials/QuizContainer";

const ImageEnhancementQuizPage: React.FC = () => {
  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Simulations", href: "/simu" },
            { label: "Image Enhancement", href: "/simu/image_enhancement" },
            { label: "Quiz", href: "/simu/image_enhancement/quiz" },
          ]}
        />
        
        <h1 className="text-3xl font-bold mt-6 mb-8">Image Enhancement Quiz</h1>
        
        <QuizContainer />
      </div>
    </BaseLayout>
  );
};

export default ImageEnhancementQuizPage;
