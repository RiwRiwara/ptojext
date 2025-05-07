// Types for image enhancement quiz components
export type AdjustmentMethod = 'basic' | 'histogram' | 'smoothing' | 'subtraction';
export type KernelType = 'smoothing' | 'sharpening' | 'edge-detection';

export interface QuizItem {
  id: number;
  title: string;
  description: string;
  image: string;
  hintImage?: string; // Optional hint image path
  technical?: boolean; // Whether this is a technical quiz
  targetValues: {
    contrast?: number;
    brightness?: number;
    gamma?: number;
    histogramEqualization?: boolean;
    kernelType?: KernelType;
    kernelSize?: number;
    subtractValue?: number;
    [key: string]: number | boolean | string | KernelType | undefined;
  };
  tolerance?: {
    contrast?: number;
    brightness?: number;
    gamma?: number;
    subtractValue?: number;
    [key: string]: number | boolean | string | KernelType | undefined;
  };
  hint?: string;
  // Bilingual support
  title_en?: string;
  description_en?: string;
  title_th?: string;
  description_th?: string;
}

export interface QuizSettings {
  showAllControls: boolean; // Whether to show all controls at once
  showHintImage: boolean; // Whether to show hint images
  enableTechnicalQuizzes: boolean; // Whether to include technical quizzes
  attemptsLimit: number; // Maximum number of attempts per quiz
  scoreMultiplier: number; // Score multiplier for correct answers
}

export interface AdjustmentValues {
  contrast: number;
  brightness: number;
  gamma: number;
  histogramEqualization: boolean;
  kernelType: KernelType;
  kernelSize: number;
  subtractValue: number;
}
