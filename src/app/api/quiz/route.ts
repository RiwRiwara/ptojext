import { NextRequest, NextResponse } from 'next/server';
import { OpenAIQuizClient } from '@/utils/openaiClient';
import { 
  createQuizPrompt, 
  selectAdjustments, 
  getDifficultyFactors, 
  generateTargetValues,
  generateHintForQuiz
} from '@/utils/image_processing/quiz/partials/quizGenerator';
import { getThaiTitle, getThaiDescription } from '@/utils/image_processing/quiz/partials/translations';
import { getImageForTheme } from '@/utils/image_processing/quiz/partials/themeContent';
import { QuizTheme, QuizDifficulty } from '@/utils/image_processing/quiz/partials/types';

const MODEL = 'gpt-4o-mini';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { theme, difficulty, id } = body;
    
    // Validate input
    if (!theme || !difficulty || !id) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Initialize OpenAI client (server-side only)
    const openaiClient = new OpenAIQuizClient();
    const client = openaiClient.getClient();
    
    if (!client) {
      return NextResponse.json(
        { error: 'OpenAI client initialization failed' },
        { status: 500 }
      );
    }
    
    // Generate quiz content
    const adjustments = selectAdjustments(difficulty as QuizDifficulty);
    const prompt = createQuizPrompt(theme as QuizTheme, difficulty as QuizDifficulty, adjustments);
    
    // Call OpenAI API
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });
    
    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: 'No content in OpenAI response' },
        { status: 500 }
      );
    }
    
    // Parse the response
    let parsedData;
    try {
      // First try direct JSON parsing
      parsedData = JSON.parse(content.trim());
    } catch (e) {
      // If direct parsing fails, try to extract JSON from markdown or text
      const jsonRegex = /{[\s\S]*}/;
      const match = content.match(jsonRegex);
      if (!match) {
        return NextResponse.json(
          { error: 'No valid JSON found in response' },
          { status: 500 }
        );
      }
      try {
        parsedData = JSON.parse(match[0]);
      } catch (jsonError) {
        return NextResponse.json(
          { error: 'Failed to parse extracted JSON' },
          { status: 500 }
        );
      }
    }
    
    // Process the parsed data into a proper quiz item
    const complexityFactors = getDifficultyFactors(difficulty as QuizDifficulty);
    const { targetValues, tolerance } = generateTargetValues(adjustments, complexityFactors);
    
    // Create a properly formatted quiz item
    const title_en = parsedData.title_en || `${(theme as string).charAt(0).toUpperCase() + (theme as string).slice(1)} Image Enhancement Quiz`;
    const description_en = parsedData.description_en || 'Adjust the image to enhance the visibility of important features.';
    const title_th = parsedData.title_th || getThaiTitle(theme as QuizTheme, title_en);
    const description_th = parsedData.description_th || getThaiDescription(description_en);
    
    const hint = generateHintForQuiz(adjustments, targetValues, theme as QuizTheme);
    const technical = adjustments.some((adj: string) => 
      ['histogramEqualization', 'kernelType', 'subtractValue'].includes(adj)
    );
    const image = getImageForTheme(theme as QuizTheme, id as number);
    
    // Return the formatted quiz item
    const quizItem = {
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
      description_th
    };
    
    return NextResponse.json(quizItem);
    
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}
