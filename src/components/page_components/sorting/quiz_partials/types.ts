// Types for sorting algorithm quiz components
export type QuizTheme = 'bubble' | 'selection' | 'quick' | 'insertion' | 'merge';
export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface QuizItem {
  id: number;
  title: string;
  description: string;
  choice: string[]; // Choices for the quiz
  answer: string; // Correct answer
  hint: string;
  technical?: boolean; // Whether the quiz is technical or not
  // Bilingual support
  title_en?: string;
  description_en?: string;
  title_th?: string;
  description_th?: string;
}

export interface QuizSettings {
  showAllControls: boolean; // Whether to show all controls at once
  showHintAnswer: boolean; // Whether to show hint images
  enableTechnicalQuizzes: boolean; // Whether to include technical quizzes
  attemptsLimit: number; // Maximum number of attempts per quiz
  scoreMultiplier: number; // Score multiplier for correct answers
}