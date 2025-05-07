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
import { AdjustmentValues, QuizItem, HistogramMethod } from "./types";
import ImageProcessor from "./ImageProcessor";
import AdjustmentControls from "./AdjustmentControls";
import FeedbackModal from "./FeedbackModal";
import Image from "next/image";
import { FiEye, FiEyeOff, FiArrowLeft, FiArrowRight, FiCpu, FiRefreshCw, FiGlobe, FiAward, FiInfo, FiBarChart2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { QuizGenerator, QuizTheme, QuizDifficulty, GenerateQuizOptions } from "@/utils/image_processing/quiz/ImageProcessingQuizAI";
import { useTranslation } from "react-i18next";
import i18next from "@/utils/i18n.config";

const QuizContainer: React.FC = () => {
  // Translation hook
  const { t, i18n } = useTranslation();

  // Quiz generator instance
  const quizGenerator = React.useMemo(() => new QuizGenerator(), []);

  // Quiz generation state
  const [quizMode, setQuizMode] = useState<"predefined" | "generated">("predefined");
  const [selectedTheme, setSelectedTheme] = useState<QuizTheme>("general");
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

  // Image adjustment state
  const [adjustmentValues, setAdjustmentValues] = useState<AdjustmentValues>({
    contrast: 1,
    brightness: 0,
    gamma: 1,
    histogramMethod: "equalization",
    histogramEqualization: false,
    logTransformConstant: 5,
    gammaValue: 1,
    kernelType: "smoothing",
    kernelSize: 3,
    kernelIntensity: 1,
    subtractValue: 0,
  });

  // Filter quizzes based on settings
  useEffect(() => {
    if (quizMode === "predefined") {
      const filtered = quizSettings.enableTechnicalQuizzes
        ? quizData
        : quizData.filter(quiz => !quiz.technical);
      setFilteredQuizData(filtered);
    }
  }, [quizMode]);

  // Generate new quizzes
  const generateQuizzes = async () => {
    setIsGenerating(true);

    try {
      const options: GenerateQuizOptions = {
        theme: selectedTheme,
        difficulty: selectedDifficulty,
        count: 1 // Generate just one quiz at a time
      };

      // Wait for the quiz generation to complete
      const generatedQuiz = await quizGenerator.generateQuizzes(options);

      // Update the quiz data with the generated quiz
      setFilteredQuizData(generatedQuiz);

      // Reset quiz state
      setCurrentQuizIndex(0);
      setScore(0);
      setAttempts(0);
      setShowFeedback(false);
      setFeedbackType("error");
      setQuizComplete(false);
      setShowHint(false);
      setQuizMode("generated");

      // Reset adjustment values
      setAdjustmentValues({
        contrast: 1,
        brightness: 0,
        gamma: 1,
        histogramMethod: "equalization",
        histogramEqualization: false,
        logTransformConstant: 5,
        gammaValue: 1,
        kernelType: "smoothing",
        kernelSize: 3,
        kernelIntensity: 1,
        subtractValue: 0,
      });
    } catch (error) {
      console.error("Error generating quiz:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentQuiz = filteredQuizData.length > 0 ? filteredQuizData[currentQuizIndex] : quizData[0];

  // State to track match percentage for feedback
  const [matchPercentage, setMatchPercentage] = useState<number>(0);

  const checkAnswer = () => {
    setShowFeedback(true);
    setAttempts(attempts + 1);

    // Check if the current values are within tolerance of the target values
    let correct = true;
    let closeMatch = true; // For values that are close but not exact
    let totalMatchPercentage = 0;
    let totalChecks = 0;

    // Check if the user's values are close to the target values
    Object.entries(currentQuiz.targetValues).forEach(([key, value]) => {
      if (key in adjustmentValues) {
        const userValue = adjustmentValues[key as keyof AdjustmentValues];
        totalChecks++;

        // For boolean values (like histogramEqualization)
        if (typeof value === 'boolean') {
          if (userValue === value) {
            totalMatchPercentage += 100;
          } else {
            correct = false;
            closeMatch = false;
          }
          return;
        }

        // For string values (like kernelType)
        if (typeof value === 'string') {
          if (userValue === value) {
            totalMatchPercentage += 100;
          } else {
            correct = false;
            closeMatch = false;
          }
          return;
        }

        // For numeric values with tolerance - using a nearest approach
        if (typeof value === 'number' && typeof userValue === 'number') {
          const toleranceValue = currentQuiz.tolerance ? (currentQuiz.tolerance[key as keyof typeof currentQuiz.tolerance] as number) : 0;
          const difference = Math.abs(userValue - (value as number));
          const maxDifference = Math.max((value as number) * 0.5, toleranceValue * 2); // Allow for larger range

          // Calculate how close the value is as a percentage
          const matchPercent = Math.max(0, 100 - (difference / maxDifference) * 100);
          totalMatchPercentage += matchPercent;

          if (difference > toleranceValue) {
            correct = false;

            // If it's way off, it's not even a close match
            if (difference > maxDifference) {
              closeMatch = false;
            }
          }
        }
      }
    });

    // Calculate overall match percentage
    const calculatedMatchPercentage = totalChecks > 0 ? totalMatchPercentage / totalChecks : 0;
    setMatchPercentage(calculatedMatchPercentage);

    if (correct) {
      // Perfect match - apply full score multiplier
      setScore(score + quizSettings.scoreMultiplier);
      setFeedbackType("success");
    } else if (closeMatch && calculatedMatchPercentage >= 75) {
      // Close match - apply partial score
      const partialScore = Math.ceil(quizSettings.scoreMultiplier * (calculatedMatchPercentage / 100));
      setScore(score + partialScore);
      setFeedbackType("success");
    } else {
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
      // Reset adjustments
      setAdjustmentValues({
        contrast: 1,
        brightness: 0,
        gamma: 1,
        histogramMethod: "equalization",
        histogramEqualization: false,
        logTransformConstant: 5,
        gammaValue: 1,
        kernelType: "smoothing",
        kernelSize: 3,
        kernelIntensity: 1,
        subtractValue: 0,
      });
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
      // Reset adjustments
      setAdjustmentValues({
        contrast: 1,
        brightness: 0,
        gamma: 1,
        histogramMethod: "equalization",
        histogramEqualization: false,
        logTransformConstant: 5,
        gammaValue: 1,
        kernelType: "smoothing",
        kernelSize: 3,
        kernelIntensity: 1,
        subtractValue: 0,
      });
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
    // Reset adjustments
    setAdjustmentValues({
      contrast: 1,
      brightness: 0,
      gamma: 1,
      histogramMethod: "equalization",
      histogramEqualization: false,
      logTransformConstant: 5,
      gammaValue: 1,
      kernelType: "smoothing",
      kernelSize: 3,
      kernelIntensity: 1,
      subtractValue: 0,
    });
  };

  const handleAdjustmentChange = (values: Partial<AdjustmentValues>) => {
    setAdjustmentValues((prev) => ({ ...prev, ...values }));
  };

  if (filteredQuizData.length === 0) {
    return <div className="container mx-auto px-4 py-8">Loading quiz data...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Quiz Generator Controls */}
      <Card className="p-6 mb-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{t('quizTitle')}</h2>
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
          selectedKey={quizMode}
          onSelectionChange={(key) => setQuizMode(key as "predefined" | "generated")}
          classNames={{
            tabList: "p-0 border-b-2 border-gray-200 gap-4",
            tab: "px-4 py-2 rounded-t-lg font-medium",
            tabContent: "p-4",
            cursor: "bg-blue-100 dark:bg-blue-900"
          }}
        >
          <Tab
            key="predefined"
            title={
              <div className="flex items-center gap-2">
                <FiRefreshCw className="text-gray-600" />
                <span>{t('predefinedQuizzes')}</span>
              </div>
            }
          />
          <Tab
            key="generated"
            title={
              <div className="flex items-center gap-2">
                <FiCpu className="text-blue-600" />
                <span>{t('aiGeneratedQuiz')}</span>
              </div>
            }
          />
        </Tabs>

        {quizMode === "generated" && (
          <div className="mt-4 p-4  rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('medicalSpecialty')}</label>
                <Select
                  variant="underlined"
                  color="primary"
                  selectedKeys={[selectedTheme]}
                  onChange={(e) => setSelectedTheme(e.target.value as QuizTheme)}
                  className="w-full"
                  aria-label="Select quiz theme"
                >
                  <SelectItem key="general">{t('general')}</SelectItem>
                  <SelectItem key="radiology">{t('radiology')}</SelectItem>
                  <SelectItem key="cardiology">{t('cardiology')}</SelectItem>
                  <SelectItem key="neurology">{t('neurology')}</SelectItem>
                  <SelectItem key="oncology">{t('oncology')}</SelectItem>
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

            <Button
              color="primary"
              onPress={generateQuizzes}
              className="w-full md:w-auto"
              isDisabled={isGenerating}
              startContent={isGenerating ? <Spinner size="sm" /> : <FiCpu />}
            >
              {isGenerating ? t('aiGeneratingQuiz') : t('generateNewAiQuiz')}
            </Button>
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
              <h2 className="text-2xl font-bold mb-2">{currentQuiz.title}</h2>
              <div className={`p-3 ${quizMode === "generated" ? "bg-blue-50 border-l-4 border-blue-500" : "bg-gray-50 border-l-4 border-gray-500"} rounded mb-4`}>
                <p className="text-gray-800 font-medium">
                  {quizMode === "generated" ? currentQuiz.description : t(`quiz${currentQuiz.id}Description`)}
                </p>
                {quizMode === "generated" && (
                  <div className="mt-2 flex items-center text-xs text-blue-600">
                    <FiCpu className="mr-1" /> {t('aiGeneratedFor', { specialty: t(selectedTheme), level: t(selectedDifficulty) })}
                  </div>
                )}
                {i18n.language === 'th' && quizMode === "generated" && currentQuiz.description_th && (
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <p className="text-gray-800 font-medium">{currentQuiz.description_th}</p>
                  </div>
                )}
              </div>

              {quizMode !== "generated" && (
                <>
                  <Progress
                    aria-label="Quiz progress"
                    value={((currentQuizIndex + 1) / filteredQuizData.length) * 100}
                    className="max-w-full"
                  />
                  <div className="mt-2 text-sm text-gray-600 flex justify-between items-center">
                    <span>{t('question', { current: currentQuizIndex + 1, total: filteredQuizData.length })}</span>
                    <span>{t('score', { score: score })}</span>
                    <span>{t('attempts', { current: attempts, max: quizSettings.attemptsLimit })}</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <div className="mb-4">
                <motion.div
                  key={`image-${currentQuizIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full bg-gray-100 rounded-md overflow-hidden"
                >
                  <ImageProcessor
                    imageSrc={currentQuiz.image}
                    adjustmentValues={adjustmentValues}
                  />
                </motion.div>

                {/* Hint Button */}
                {quizSettings.showHintImage && (
                  <div className="mt-4">
                    <Button
                      variant="ghost"
                      onPress={() => setShowHint(!showHint)}
                      className="flex items-center gap-2 text-sm"
                      aria-label={showHint ? "Hide hint image" : "Show hint image"}
                    >
                      {showHint ? (
                        <>
                          <FiEyeOff className="text-gray-600" /> {t('hideHintImage')}
                        </>
                      ) : (
                        <>
                          <FiEye className="text-gray-600" /> {t('showHintImage')}
                        </>
                      )}
                    </Button>

                    {/* Hint Image - Shows original image with correct enhancement values */}
                    <AnimatePresence>
                      {showHint && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 border-t pt-4 overflow-hidden"
                        >
                          <h3 className="text-md font-semibold mb-2">{t('hintImageTitle')}</h3>
                          <div className="relative w-full bg-gray-100 rounded-md overflow-hidden">
                            <ImageProcessor
                              imageSrc={currentQuiz.image}
                              adjustmentValues={currentQuiz.targetValues as AdjustmentValues}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{t('hintImageDescription')}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </Card>

            <div>
              <motion.div
                key={`controls-${currentQuizIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <AdjustmentControls
                  adjustmentValues={adjustmentValues}
                  onValuesChange={handleAdjustmentChange}
                  showAllControls={quizSettings.showAllControls}
                />
              </motion.div>

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
            userValues={adjustmentValues}
            targetValues={Object.fromEntries(
              Object.entries(currentQuiz.targetValues).filter(([_, value]) => value !== undefined)
            ) as Record<string, number | boolean | string>}
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
