// lib/openaiClient.ts
import OpenAI from 'openai';

export class OpenAIQuizClient {
    private openai: OpenAI;

    constructor() {
        const apiKey = process.env.OPENAI_API_QUIZ_KEY || process.env.NEXT_PUBLIC_OPENAI_API_QUIZ_KEY;
        if (!apiKey) {
            throw new Error('OPENAI_API_QUIZ_KEY is not set in environment variables');
        }
        this.openai = new OpenAI({
            apiKey,
            dangerouslyAllowBrowser: true // Allow usage in browser environment
        });
    }

    getClient() {
        return this.openai;
    }
}
