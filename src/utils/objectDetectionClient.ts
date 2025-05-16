// utils/objectDetectionClient.ts
import OpenAI from 'openai';

// Helper to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

export class ObjectDetectionClient {
    private openai: OpenAI | null = null;
    private isInitialized = false;

    constructor() {
        // Only initialize in server environment
        if (!isBrowser) {
            this.initialize();
        }
    }

    private initialize() {
        try {
            // Only initialize once
            if (this.isInitialized) return;

            const apiKey = process.env.OPENAI_API_OBJECT_DETECTION_KEY;
            if (!apiKey) {
                console.warn('OPENAI_API_OBJECT_DETECTION_KEY is not set in environment variables');
                return;
            }

            this.openai = new OpenAI({ apiKey });
            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize OpenAI client for object detection:', error);
        }
    }

    getClient() {
        // For browser, return a mock client or null
        if (isBrowser) {
            console.warn('OpenAI client is not available in browser environment');
            return null;
        }

        // Lazy initialization for server environment
        if (!this.isInitialized) {
            this.initialize();
        }

        return this.openai;
    }
}
