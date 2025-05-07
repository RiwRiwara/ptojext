// Types for image enhancement quiz components
export type AdjustmentMethod = 'basic' | 'histogram' | 'smoothing' | 'subtraction';
export type KernelType = 'smoothing' | 'sharpening' | 'edge-detection';
export type HistogramMethod = 'equalization' | 'gamma' | 'log';

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
    histogramMethod?: HistogramMethod;
    histogramEqualization?: boolean;
    logTransformConstant?: number;
    gammaValue?: number;
    kernelType?: KernelType;
    kernelSize?: number;
    kernelIntensity?: number; // Intensity value for sharpening and edge detection
    subtractValue?: number;
    [key: string]: number | boolean | string | KernelType | HistogramMethod | undefined;
  };
  tolerance?: {
    contrast?: number;
    brightness?: number;
    gamma?: number;
    logTransformConstant?: number;
    gammaValue?: number;
    kernelIntensity?: number;
    subtractValue?: number;
    [key: string]: number | boolean | string | KernelType | HistogramMethod | undefined;
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
  histogramMethod: HistogramMethod;
  histogramEqualization: boolean;
  logTransformConstant: number;
  gammaValue: number;
  kernelType: KernelType;
  kernelSize: number;
  kernelIntensity: number;
  subtractValue: number;
}
