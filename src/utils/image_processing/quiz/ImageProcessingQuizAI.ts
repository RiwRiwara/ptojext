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
    private readonly openai: OpenAI;

    constructor() {
        try {
            const openaiClient = new OpenAIQuizClient();
            this.openai = openaiClient.getClient();
        } catch (error) {
            console.error('Error initializing OpenAI client:', error);
            this.openai = new OpenAI({
                apiKey: '',
                dangerouslyAllowBrowser: true,
            });
        }
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
     * Generates a single quiz using OpenAI with bilingual support.
     */
    private async generateSingleQuizWithAI(theme: QuizTheme, difficulty: QuizDifficulty, id: number): Promise<QuizItem> {
        const adjustments = selectAdjustments(difficulty);
        const prompt = createQuizPrompt(theme, difficulty, adjustments);

        const response = await this.openai.chat.completions.create({
            model: MODEL, // Updated to a more recent model
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 500,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No content in OpenAI response');
        }

        let jsonMatch;
        try {
            jsonMatch = JSON.parse(content.trim());
        } catch (e) {
            const jsonRegex = /{[\s\S]*}/;
            const match = content.match(jsonRegex);
            if (!match) {
                throw new Error('No valid JSON found in response');
            }
            jsonMatch = JSON.parse(match[0]);
        }

        const complexityFactors = getDifficultyFactors(difficulty);
        const { targetValues, tolerance } = generateTargetValues(adjustments, complexityFactors);

        const title_en = jsonMatch.title_en || `${theme.charAt(0).toUpperCase() + theme.slice(1)} Image Enhancement Quiz`;
        const description_en = jsonMatch.description_en || 'Adjust the image to enhance the visibility of important features.';
        const title_th = jsonMatch.title_th || getThaiTitle(theme, title_en);
        const description_th = jsonMatch.description_th || getThaiDescription(description_en);

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
