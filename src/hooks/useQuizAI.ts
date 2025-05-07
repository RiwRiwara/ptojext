import { useState } from 'react';
import { QuizItem, QuizSettings } from '@/components/page_components/image_enhancement/quiz_partials/types';
import { QuizGenerator } from '@/utils/image_processing/quiz/ImageProcessingQuizAI';

interface UseQuizAIProps {
  quiz: QuizItem;
  settings: QuizSettings;
}

interface UseQuizAIReturn {
  aiHint: string | null;
  isLoadingHint: boolean;
  error: string | null;
  generateAIHint: () => Promise<void>;
}

// Create a singleton instance of the quiz generator
const quizGenerator = new QuizGenerator();

export function useQuizAI({ quiz, settings }: UseQuizAIProps): UseQuizAIReturn {
  const [aiHint, setAIHint] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAIHint = async () => {
    setIsLoadingHint(true);
    setError(null);
    
    try {
      // Use the local hint generator instead of making an API call
      const hint = quizGenerator.generateHint(quiz, settings);
      
      // Add a small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setAIHint(hint);
    } catch (err: Error | unknown) {
      console.error('Error generating hint:', err);
      setError('Failed to generate hint. Please try again.');
    } finally {
      setIsLoadingHint(false);
    }
  };

  return {
    aiHint,
    isLoadingHint,
    error,
    generateAIHint,
  };
}
