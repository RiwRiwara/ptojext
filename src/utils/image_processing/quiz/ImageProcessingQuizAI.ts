import OpenAI from 'openai';
import { OpenAIQuizClient } from '@/utils/openaiClient';

import {
    QuizItem,
    QuizSettings,
    QuizTheme,
    QuizDifficulty,
    GenerateQuizOptions
} from './partials/types';

import {
    getDifficultyFactors,
    selectAdjustments,
    generateTargetValues,
    createQuizPrompt,
    getPrimaryAdjustment,
    getSpecificHint,
    getContextHint,
    generateHintForQuiz,
    validateQuizItem
} from './partials/quizGenerator';

import { themeContent, getImageForTheme } from './partials/themeContent';
import { getThaiTitle, getThaiDescription } from './partials/translations';

const MODEL = 'gpt-4o-mini';

export class QuizGenerator {
    private predefinedQuizzes: QuizItem[] = [];
    private availableThemes: QuizTheme[] = ['general', 'radiology', 'cardiology', 'neurology', 'oncology'];
    private availableDifficulties: QuizDifficulty[] = ['beginner', 'intermediate', 'advanced'];
    // Flag to track if API requests are failing and we need to use fallback data
    private useLocalFallback = false;

    constructor() {
        // Initialize predefined quizzes for fallback
        this.loadPredefinedQuizzes();
        
        // Check if we're in a development environment
        if (process.env.NODE_ENV === 'development') {
            console.info('Running in development environment');
        }
    }
    
    /**
     * Load predefined quizzes for fallback
     */
    private loadPredefinedQuizzes() {
        // This could load from a local JSON file or define some basic quizzes
        // For now, we'll just use an empty array and generate them on demand
    }

    /**
     * Generates a set of quiz items based on theme and difficulty.
     */
    async generateQuizzes(options: GenerateQuizOptions): Promise<QuizItem[]> {
        const { theme, difficulty, count = 5 } = options;
        const quizzes: QuizItem[] = [];

        for (let i = 0; i < count; i++) {
            quizzes.push(await this.generateSingleQuiz(theme, difficulty, i + 1));
        }

        return quizzes;
    }

    /**
     * Generates a single quiz item, attempting to use OpenAI first and falling back to local generation.
     */
    private async generateSingleQuiz(theme: QuizTheme, difficulty: QuizDifficulty, id: number): Promise<QuizItem> {
        try {
            return await this.generateSingleQuizWithAI(theme, difficulty, id);
        } catch (error) {
            console.warn('Falling back to local quiz generation:', error);
            return this.fallbackGenerateSingleQuiz(theme, difficulty, id);
        }
    }

    /**
     * Generates a single quiz using the API route to OpenAI
     */
    private async generateSingleQuizWithAI(theme: QuizTheme, difficulty: QuizDifficulty, id: number): Promise<QuizItem> {
        try {
            // Use the API route instead of calling OpenAI directly
            const response = await fetch('/api/quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    theme,
                    difficulty,
                    id,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API route error:', errorData.error || response.statusText);
                throw new Error(`API request failed: ${response.status}`);
            }

            const quizItem = await response.json();
            return quizItem;
        } catch (error) {
            console.error('Error in API quiz generation:', error);
            // Fall back to local generation
            return this.fallbackGenerateSingleQuiz(theme, difficulty, id);
        }
    }

    /**
     * Fallback method to generate a single quiz item locally with bilingual support.
     */
    private fallbackGenerateSingleQuiz(theme: QuizTheme, difficulty: QuizDifficulty, id: number): QuizItem {
        const themeData = themeContent[theme];
        const complexityFactors = getDifficultyFactors(difficulty);
        const scenario = themeData.scenarios[Math.floor(Math.random() * themeData.scenarios.length)];
        const adjustments = selectAdjustments(difficulty);
        const selectedOrgan = themeData.organs[Math.floor(Math.random() * themeData.organs.length)];

        const { targetValues, tolerance } = generateTargetValues(adjustments, complexityFactors);

        const title_en = `${scenario.titlePrefix} ${selectedOrgan}`;
        let description_en = scenario.descriptionTemplate;
        description_en = description_en.replace('[ORGAN]', selectedOrgan);

        const primaryAdjustment = getPrimaryAdjustment(adjustments);
        let adjustmentType = '';
        switch (primaryAdjustment) {
            case 'contrast':
                adjustmentType = 'contrast';
                break;
            case 'brightness':
                adjustmentType = 'brightness';
                break;
            case 'gamma':
                adjustmentType = 'gamma correction';
                break;
            case 'histogramEqualization':
                adjustmentType = 'histogram equalization';
                break;
            case 'kernelType':
                adjustmentType = targetValues.kernelType === 'smoothing' ? 'smoothing filters' : targetValues.kernelType === 'sharpening' ? 'sharpening filters' : 'edge detection';
                break;
            case 'subtractValue':
                adjustmentType = 'image subtraction';
                break;
        }
        description_en = description_en.replace('[ADJUSTMENT]', adjustmentType);

        const title_th = getThaiTitle(theme, title_en);
        const description_th = getThaiDescription(description_en);

        const hint = generateHintForQuiz(adjustments, targetValues, theme);
        const technical = adjustments.some((adj) =>
            ['histogramEqualization', 'kernelType', 'subtractValue'].includes(adj)
        );
        const image = getImageForTheme(theme, id);

        return {
            id,
            title: title_en,
            description: description_en,
            image,
            technical,
            targetValues,
            tolerance,
            hint,
            title_en,
            description_en,
            title_th,
            description_th,
        };
    }

    /**
     * Generates a context-aware hint for a quiz item based on its target values.
     */
    generateHint(quiz: QuizItem, _settings: QuizSettings): string {
        if (!validateQuizItem(quiz)) {
            return 'Unable to generate a hint for this quiz item.';
        }

        const targetValues = quiz.targetValues;
        const adjustmentTypes = Object.keys(targetValues);
        const primaryAdjustment = getPrimaryAdjustment(adjustmentTypes);
        const specificHint = getSpecificHint(primaryAdjustment, targetValues);
        const contextHint = getContextHint(quiz.title, quiz.description);

        return `${specificHint} ${contextHint}`;
    }
}

// Re-export types for convenience
export type { QuizTheme, QuizDifficulty, GenerateQuizOptions };
