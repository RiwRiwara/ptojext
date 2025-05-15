export interface QuizCodeItem {
    id: number;
    title: string;
    description: string;
    code: string; // Code snippet for the quiz
    answer: string;
    technical?: boolean;
    hint: string;
    // Bilingual support
    title_en?: string;
    description_en?: string;
    title_th?: string;
    description_th?: string;
}

export interface QuizCodeSettings {
    showHintAnswer: boolean; // Whether to show hint images
    enableTechnicalQuizzes: boolean; // Whether to include technical quizzes
    attemptsLimit: number; // Maximum number of attempts per quiz
    scoreMultiplier: number; // Score multiplier for correct answers
}