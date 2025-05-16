import { NextRequest, NextResponse } from 'next/server';
import { ObjectDetectionClient } from '@/utils/objectDetectionClient';

const MODEL = 'gpt-4o-mini';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { image } = body;
    
    // Validate input
    if (!image) {
      return NextResponse.json(
        { error: 'Missing image data' },
        { status: 400 }
      );
    }
    
    // Initialize OpenAI client (server-side only)
    const objectDetectionClient = new ObjectDetectionClient();
    const client = objectDetectionClient.getClient();
    
    if (!client) {
      return NextResponse.json(
        { error: 'OpenAI client initialization failed' },
        { status: 500 }
      );
    }
    
    // Perform object detection using GPT vision capabilities
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an AI image analysis assistant. Your task is to identify objects in the provided image and return a JSON response with the detected objects, their confidence scores, and positions if possible.'
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Identify all the objects in this image. Return the result as a JSON array of objects with the format: {"objects": [{"name": "object name", "confidence": confidence_score}]}. Focus only on the main objects.' },
            { type: 'image_url', image_url: { url: image } }
          ]
        }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1000
    });
    
    // Extract the response content
    const result = response.choices[0]?.message?.content || '{"objects": []}';
    
    try {
      // Parse the JSON result
      const parsedResult = JSON.parse(result);
      return NextResponse.json(parsedResult);
    } catch (error) {
      console.error('Error parsing GPT response:', error);
      return NextResponse.json(
        { error: 'Failed to parse object detection results', rawResponse: result },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Object detection error:', error);
    return NextResponse.json(
      { error: 'Object detection processing failed' },
      { status: 500 }
    );
  }
}
