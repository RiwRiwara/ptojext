import { 
    QuizItem, 
    QuizSettings, 
    QuizTheme, 
    QuizDifficulty, 
    DifficultyFactors, 
    KernelType 
} from './types';
import { hintTemplates, contextTemplates } from './hintTemplates';
import { themeContent, getImageForTheme } from './themeContent';
import { getThaiTitle, getThaiDescription, extractKeywords } from './translations';

/**
 * Utility functions for quiz generation
 */

/**
 * Gets difficulty-specific factors for quiz generation
 */
export function getDifficultyFactors(difficulty: QuizDifficulty): DifficultyFactors {
    return {
        beginner: { adjustmentCount: 1, precision: 0.1, tolerance: 0.2 },
        intermediate: { adjustmentCount: 2, precision: 0.05, tolerance: 0.15 },
        advanced: { adjustmentCount: 3, precision: 0.01, tolerance: 0.1 },
    }[difficulty];
}

/**
 * Selects which adjustments to include based on difficulty
 */
export function selectAdjustments(difficulty: QuizDifficulty): string[] {
    const allAdjustments = ['contrast', 'brightness', 'gamma', 'histogramEqualization', 'kernelType', 'subtractValue'];
    const factors = getDifficultyFactors(difficulty);
    const shuffled = [...allAdjustments].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, factors.adjustmentCount);
}

/**
 * Gets a random number in a range with specified precision
 */
export function getRandomInRange(min: number, max: number, precision: number): number {
    const value = Math.random() * (max - min) + min;
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
}

/**
 * Generates target values and tolerances for the selected adjustments
 */
export function generateTargetValues(
    adjustments: string[],
    complexityFactors: DifficultyFactors
): { targetValues: Record<string, number | boolean | string | KernelType | undefined>; tolerance: Record<string, number> } {
    const targetValues: Record<string, number | boolean | string | KernelType | undefined> = {};
    const tolerance: Record<string, number> = {};

    adjustments.forEach((adjustment) => {
        switch (adjustment) {
            case 'contrast':
                targetValues.contrast = getRandomInRange(0.8, 2.5, complexityFactors.precision);
                tolerance.contrast = complexityFactors.tolerance * 0.3;
                break;
            case 'brightness':
                targetValues.brightness = getRandomInRange(-30, 30, 1);
                tolerance.brightness = complexityFactors.tolerance * 10;
                break;
            case 'gamma':
                targetValues.gamma = getRandomInRange(0.8, 2.2, complexityFactors.precision);
                tolerance.gamma = complexityFactors.tolerance * 0.2;
                break;
            case 'histogramEqualization':
                targetValues.histogramEqualization = true;
                break;
            case 'kernelType':
                const kernelTypes: KernelType[] = ['smoothing', 'sharpening', 'edge-detection'];
                targetValues.kernelType = kernelTypes[Math.floor(Math.random() * kernelTypes.length)];
                if (targetValues.kernelType === 'smoothing') {
                    targetValues.kernelSize = Math.random() > 0.5 ? 3 : 5;
                }
                break;
            case 'subtractValue':
                targetValues.subtractValue = getRandomInRange(50, 100, 1);
                tolerance.subtractValue = complexityFactors.tolerance * 15;
                break;
        }
    });

    return { targetValues, tolerance };
}

/**
 * Creates a prompt for OpenAI to generate quiz content in both English and Thai
 */
export function createQuizPrompt(theme: QuizTheme, difficulty: QuizDifficulty, adjustments: string[]): string {
    const themeData = themeContent[theme];
    const adjustmentText = adjustments.join(', ');
    const organ = themeData.organs[Math.floor(Math.random() * themeData.organs.length)];
    const scenario = themeData.scenarios[Math.floor(Math.random() * themeData.scenarios.length)];

    return `
Generate a JSON object with bilingual content for a medical imaging quiz. Include the following fields:
- title_en: English title
- description_en: English description
- title_th: Thai title
- description_th: Thai description

Theme: ${theme}
Difficulty: ${difficulty}
Adjustments to focus on: ${adjustmentText}
Organ/Structure: ${organ}
Scenario context: ${scenario.titlePrefix}

The titles should be concise, specific to the theme, and include the organ/structure.
The descriptions should instruct the user to apply the specified adjustments to enhance the image, tailored to the theme and difficulty.
Ensure the content is professional and relevant to medical imaging.
The Thai translation should be natural and use appropriate medical terminology.

Example output:
{
  "title_en": "Enhance Chest X-ray",
  "description_en": "Adjust the contrast to improve the visibility of lung structures in this chest X-ray.",
  "title_th": "ปรับปรุงภาพเอกซเรย์ทรวงอก",
  "description_th": "ปรับความคมชัดเพื่อปรับปรุงการมองเห็นโครงสร้างปอดในภาพเอกซเรย์ทรวงอกนี้"
}
`;
}

/**
 * Determines the primary adjustment to focus on for the hint
 */
export function getPrimaryAdjustment(adjustments: string[]): string {
    const priorityOrder = [
        'histogramEqualization',
        'kernelType',
        'subtractValue',
        'contrast',
        'brightness',
        'gamma',
    ];

    for (const adjustment of priorityOrder) {
        if (adjustments.includes(adjustment)) {
            return adjustment;
        }
    }

    return adjustments[0] || 'contrast';
}

/**
 * Generates a specific hint based on the primary adjustment type
 */
export function getSpecificHint(adjustmentType: string, targetValues: Record<string, number | boolean | string | KernelType | undefined>): string {
    if (adjustmentType === 'kernelType' && targetValues.kernelType) {
        const kernelType = targetValues.kernelType as keyof typeof hintTemplates.kernelType;
        const templates = hintTemplates.kernelType[kernelType];
        if (templates) {
            return templates[Math.floor(Math.random() * templates.length)];
        }
    }

    const templates = hintTemplates[adjustmentType as keyof typeof hintTemplates];
    if (Array.isArray(templates)) {
        return templates[Math.floor(Math.random() * templates.length)];
    }

    return 'Try adjusting different parameters to enhance the visibility of important features.';
}

/**
 * Generates a context hint based on the quiz title and description
 */
export function getContextHint(title: string, description: string): string {
    const keywords = extractKeywords(title + ' ' + description);

    for (const keyword of keywords) {
        const key = Object.keys(contextTemplates).find((k) => keyword.toLowerCase().includes(k));
        if (key) {
            const templates = contextTemplates[key];
            return templates[Math.floor(Math.random() * templates.length)];
        }
    }

    return 'Focus on making the relevant medical features as clear as possible for accurate diagnosis.';
}

/**
 * Generates a specific hint for a quiz based on its adjustments and target values
 */
export function generateHintForQuiz(adjustments: string[], targetValues: Record<string, number | boolean | string | KernelType | undefined>, theme: QuizTheme): string {
    const primaryAdjustment = getPrimaryAdjustment(adjustments);
    const specificHint = getSpecificHint(primaryAdjustment, targetValues);

    let contextHint = '';
    switch (theme) {
        case 'radiology':
            contextHint = 'Focus on bone density and structural alignment.';
            break;
        case 'cardiology':
            contextHint = 'Pay attention to vessel boundaries and chamber definition.';
            break;
        case 'neurology':
            contextHint = 'Look for subtle differences in tissue density within the brain structures.';
            break;
        case 'oncology':
            contextHint = 'Focus on identifying boundaries between normal and abnormal tissue.';
            break;
        default:
            contextHint = 'Look for important anatomical structures and any abnormalities.';
    }

    return `${specificHint} ${contextHint}`;
}

/**
 * Validates if a quiz item matches the expected shape
 */
export function validateQuizItem(item: unknown): item is QuizItem {
    if (!item || typeof item !== 'object') {
        return false;
    }
    
    // Use type assertion after basic check
    const quizItem = item as Record<string, unknown>;
    
    return (
        typeof quizItem.id === 'number' &&
        typeof quizItem.title === 'string' &&
        typeof quizItem.description === 'string' &&
        typeof quizItem.image === 'string' &&
        typeof quizItem.targetValues === 'object' &&
        quizItem.targetValues !== null
    );
}
