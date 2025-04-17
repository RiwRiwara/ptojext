// ./src/types/Quiz.ts
export interface SurveyElement {
    type: string;
    name: string;
    title: string;
    choices?: (string | number)[];
    correctAnswer?: string | number | boolean | string[] | number[] | null; // <-- add null
}

export interface SurveyJson {
    elements?: SurveyElement[];
    [key: string]: unknown;
}

export interface Quiz {
    id: string;
    title: string;
    topic: string;
    difficulty: string;
    survey: SurveyJson;
}