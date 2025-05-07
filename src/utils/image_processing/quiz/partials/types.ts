import { QuizItem, QuizSettings, KernelType } from '@/components/page_components/image_enhancement/quiz_partials/types';

// Type assertion for resources to allow string indexing
export type TranslationResource = { [key: string]: string };

export type QuizTheme = 'general' | 'radiology' | 'cardiology' | 'neurology' | 'oncology';
export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface GenerateQuizOptions {
    theme: QuizTheme;
    difficulty: QuizDifficulty;
    count?: number;
}

export interface ThemeContent {
    organs: string[];
    scenarios: { titlePrefix: string; descriptionTemplate: string }[];
}

export interface DifficultyFactors {
    adjustmentCount: number;
    precision: number;
    tolerance: number;
}

export type { QuizItem, QuizSettings, KernelType };
