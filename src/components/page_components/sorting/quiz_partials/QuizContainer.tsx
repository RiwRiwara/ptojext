"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Select, SelectItem } from "@heroui/select";
import { Tabs, Tab } from "@heroui/tabs";
import { Spinner } from "@heroui/spinner";
import { Badge } from "@heroui/badge";
import { Tooltip } from "@heroui/tooltip";
import { quizData, quizSettings } from "./quizData";
import { QuizItem, QuizTheme, QuizDifficulty } from "./types";
import ImageProcessor from "./ImageProcessor";
// import AdjustmentControls from "./AdjustmentControls";
import FeedbackModal from "./FeedbackModal";
import Image from "next/image";
import { FiEye, FiEyeOff, FiArrowLeft, FiArrowRight, FiCpu, FiCode, FiRefreshCw, FiGlobe, FiCoffee, FiAward, FiInfo, FiBarChart2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import i18next from "@/utils/i18n.config";

const QuizContainer: React.FC = () => {
  // Translation hook
  const { t, i18n } = useTranslation();


  // Quiz generation state
  const [quizMode, setQuizMode] = useState<"analysis" | "coding">("analysis");
  const [selectedTheme, setSelectedTheme] = useState<QuizTheme>("bubble");
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuizDifficulty>("beginner");
  const [isGenerating, setIsGenerating] = useState(false);

  // Interface state
  const [activeSection, setActiveSection] = useState<"quiz" | "settings">("quiz");

  // Language toggle function
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'th' : 'en';
    i18n.changeLanguage(newLang);
  };

  // Filter quizzes based on settings
  const [filteredQuizData, setFilteredQuizData] = useState<QuizItem[]>([]);

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"success" | "error">("error");
  const [quizComplete, setQuizComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [userResponse, setUserResponse] = useState<string>("");

  // Filter quizzes based on settings
  useEffect(() => {
    if (quizMode === "analysis") {
      const filtered = quizSettings.enableTechnicalQuizzes
        ? quizData
        : quizData.filter(quiz => !quiz.technical);
      setFilteredQuizData(filtered);
    }
  }, [quizMode]);

  const currentQuiz = filteredQuizData.length > 0 ? filteredQuizData[currentQuizIndex] : quizData[0];
  const [correctAnswer, setCorrectAnswer] = useState<string>(currentQuiz.answer || "");

  // State to track match percentage for feedback
  const [matchPercentage, setMatchPercentage] = useState<number>(0);

  const checkAnswer = () => {
    setShowFeedback(true);
    setAttempts(attempts + 1);

    let correct = true;
    let totalMatchPercentage = 0;
    const totalChecks = 0;

    // Check if the user's response matches the correct answer
    if (userResponse.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
      totalMatchPercentage += 100; // Full score for correct answer
    } else {
      correct = false;
    }

    // Calculate overall match percentage
    const calculatedMatchPercentage = totalChecks > 0 ? totalMatchPercentage / totalChecks : 0;
    setMatchPercentage(calculatedMatchPercentage);

    if (correct) {
      setScore(score + quizSettings.scoreMultiplier);
      setFeedbackType("success");
    }
    else {
      setFeedbackType("error");

      // Check if max attempts reached
      if (attempts + 1 >= quizSettings.attemptsLimit) {
        setTimeout(() => {
          nextQuiz();
        }, 2000);
      }
    }

    setShowFeedback(true);
  };

  const nextQuiz = () => {
    setShowFeedback(false);
    if (currentQuizIndex < filteredQuizData.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setAttempts(0);
      setShowFeedback(false);
      setFeedbackType("error");
      setShowHint(false);
      setUserResponse("");
    } else {
      setQuizComplete(true);
    }
  };

  const previousQuiz = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
      setAttempts(0);
      setShowFeedback(false);
      setFeedbackType("error");
      setShowHint(false);
      setUserResponse("");
    }
  };

  const restartQuiz = () => {
    setCurrentQuizIndex(0);
    setScore(0);
    setAttempts(0);
    setShowFeedback(false);
    setFeedbackType("error");
    setQuizComplete(false);
    setShowHint(false);
    setUserResponse("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Quiz Generator Controls */}
      <Card className="p-6 mb-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Sorting Algorithms Quiz</h2>
          <Button
            variant="ghost"
            onPress={toggleLanguage}
            className="flex items-center gap-2 text-sm"
            aria-label="Toggle language"
          >
            <FiGlobe className="text-gray-600" /> {i18n.language === 'en' ? 'TH' : 'EN'}
          </Button>
        </div>

        <Tabs
          variant="bordered"
          fullWidth
          aria-label="Quiz Mode"
          color="primary"
          selectedKey={quizMode}
          onSelectionChange={(key: string) => setQuizMode(key as "analysis" | "coding")}
          classNames={{
            tabList: "p-0 border-b-2 border-gray-200 gap-0 md:gap-4",
            tab: "px-4 py-2 rounded-t-lg font-medium",
          }}
        >
          <Tab
            key="analysis"
            title={
              <div className="flex items-center gap-2">
                <FiCoffee className="text-gray-600" />
                <span className="hidden sm:inline">{t('Complexity Analysis')}</span>
                <span className="sm:hidden">Analysis</span>
              </div>
            }
          />
          <Tab
            key="coding"
            title={
              <div className="flex items-center gap-2">
                <FiCode className="text-blue-600" />
                <span className="hidden sm:inline">{t('Coding Quiz')}</span>
                <span className="sm:hidden">Coding</span>
              </div>
            }
          />
        </Tabs>

        {quizMode === "coding" && (
          <div className="mt-4 p-4  rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('Sorting Types')}</label>
                <Select
                  variant="underlined"
                  color="primary"
                  selectedKeys={[selectedTheme]}
                  onChange={(e) => setSelectedTheme(e.target.value as QuizTheme)}
                  className="w-full"
                  aria-label="Select quiz theme"
                >
                  <SelectItem key="bubble">{t('Bubble Sort')}</SelectItem>
                  <SelectItem key="selection">{t('Selection Sort')}</SelectItem>
                  <SelectItem key="quick">{t('Quick Sort')}</SelectItem>
                  <SelectItem key="insertion">{t('Insertion Sort')}</SelectItem>
                  <SelectItem key="merge">{t('Merge Sort')}</SelectItem>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('challengeLevel')}</label>
                <Select
                  variant="underlined"
                  color="primary"
                  selectedKeys={[selectedDifficulty]}
                  onChange={(e) => setSelectedDifficulty(e.target.value as QuizDifficulty)}
                  className="w-full"
                  aria-label="Select quiz difficulty"
                >
                  <SelectItem key="beginner">{t('beginner')}</SelectItem>
                  <SelectItem key="intermediate">{t('intermediate')}</SelectItem>
                  <SelectItem key="advanced">{t('advanced')}</SelectItem>
                </Select>
              </div>
            </div>
          </div>
        )}
      </Card>

      {!quizComplete && filteredQuizData.length > 0 ? (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuizIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100"
            >
              <h2 className="text-lg md:text-2xl font-bold mb-2">{currentQuiz.title}</h2>
              <div className={`p-3 ${quizMode === "analysis" ? "bg-blue-50 border-l-4 border-blue-500" : "bg-gray-50 border-l-4 border-gray-500"} rounded mb-4`}>
                <p className="text-sm md:text-base text-gray-800 font-medium">
                  {quizMode === "analysis" ? currentQuiz.description : t(`quiz${currentQuiz.id}Description`)}
                </p>
                {quizMode === "coding" && (
                  <div className="mt-2 flex items-center text-xs text-blue-600">
                    <FiCpu className="mr-1" /> {t('coding', { specialty: t(selectedTheme), level: t(selectedDifficulty) })}
                  </div>
                )}
                {i18n.language === 'th' && quizMode === "coding" && currentQuiz.description_th && (
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <p className="text-gray-800 font-medium">{currentQuiz.description_th}</p>
                  </div>
                )}
              </div>

              {quizMode !== "coding" && (
                <>
                  <Progress
                    aria-label="Quiz progress"
                    value={((currentQuizIndex + 1) / filteredQuizData.length) * 100}
                    className="max-w-full"
                  />
                  <div className="mt-2 text-sm text-gray-600 flex justify-between items-center">
                    <span className="text-xs md:text-sm">{t('question', { current: currentQuizIndex + 1, total: filteredQuizData.length })}</span>
                    <span className="text-xs md:text-sm">{t('score', { score: score })}</span>
                    <span className="text-xs md:text-sm">{t('attempts', { current: attempts, max: quizSettings.attemptsLimit })}</span>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-4">
                    <Button
                      variant="ghost"
                      onPress={previousQuiz}
                      className="flex items-center gap-1"
                      isDisabled={currentQuizIndex === 0}
                      aria-label="Previous quiz"
                    >
                      <FiArrowLeft /> {t('previous')}
                    </Button>
                    <Button
                      variant="ghost"
                      onPress={nextQuiz}
                      className="flex items-center gap-1"
                      isDisabled={currentQuizIndex === filteredQuizData.length - 1}
                      aria-label="Next quiz"
                    >
                      {t('next')} <FiArrowRight />
                    </Button>
                  </div>
                </>
              )}


            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-1 gap-6">
            <Card className="p-4">
              <div className="mb-4">
                <motion.div
                  key={`${currentQuizIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full rounded-md overflow-hidden"
                >
                  {quizMode !== "coding" && currentQuiz.choice.map((choice, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="radio"
                        id={`choice-${index}`}
                        name="quiz-choice"
                        value={choice}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        onChange={(e) => setUserResponse(e.target.value)}
                      />
                      <label htmlFor={`choice-${index}`} className="text-sm text-gray-700">{choice}</label>
                    </div>
                  ))}
                </motion.div>

                {/* Hint Button */}
                {quizSettings.showHintAnswer && (
                  <div className="mt-4">
                    <Button
                      variant="ghost"
                      onPress={() => setShowHint(!showHint)}
                      className="flex items-center gap-2 text-sm"
                      aria-label={showHint ? "Hide hint" : "Show hint"}
                    >
                      {showHint ? (
                        <>
                          <FiEyeOff className="text-gray-600" /> {t('Hide Hint')}
                        </>
                      ) : (
                        <>
                          <FiEye className="text-gray-600" /> {t('Show Hint')}
                        </>
                      )}
                    </Button>

                    {/* Hint Answer - Shows a main concept of algorithm */}
                    <AnimatePresence>
                      {showHint && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 border-t pt-4 overflow-hidden"
                        >
                          <p className="text-xs text-gray-500 mt-1">{currentQuiz.hint}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </Card>

            <div>
              <div className="mt-6 flex flex-col space-y-4">
                <Button
                  color="primary"
                  onPress={checkAnswer}
                  className="w-full"
                  size="lg"
                  startContent={<FiBarChart2 />}
                  aria-label="Check answer"
                  disabled={attempts >= quizSettings.attemptsLimit && feedbackType === "error"}
                >
                  {t('checkAnswer')}
                </Button>
                <Card className="mt-4 shadow-sm border-none bg-gradient-to-r from-primary-50 to-primary-100">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary-200 p-2 rounded-full">
                        <FiAward className="text-primary text-lg" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700">{t('currentScore')}</span>
                        <span className="text-xs text-gray-500">{attempts > 0 ? t('attemptsUsed', { count: attempts }) : t('noAttempts')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold text-primary">{score}</span>
                      <span className="text-sm text-gray-500">/ 100</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          <FeedbackModal
            isOpen={showFeedback}
            onClose={() => setShowFeedback(false)}
            type={feedbackType}
            hint={currentQuiz.hint || ''}
            attempts={attempts}
            maxAttempts={quizSettings.attemptsLimit}
            onNext={nextQuiz}
            userValues={userResponse}
            targetValues={correctAnswer}
            matchPercentage={matchPercentage}
            currentQuiz={currentQuiz}
            quizSettings={quizSettings}
          />
        </>
      ) : (
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('quizComplete')}</h2>
          <p className="text-xl mb-6">
            {t('finalScore', { score, total: filteredQuizData.length * quizSettings.scoreMultiplier })}
          </p>
          <Button
            color="primary"
            className="w-full bg-[#83AFC9]"
            onPress={restartQuiz}
            aria-label="Restart quiz"
          >
            {t('restartQuiz')}
          </Button>
        </Card>
      )}
    </div>
  );
};

export default QuizContainer;
