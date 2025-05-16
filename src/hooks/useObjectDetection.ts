"use client";
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface DetectedObject {
  name: string;
  confidence: number;
}

interface ObjectDetectionResult {
  objects: DetectedObject[];
}

export const useObjectDetection = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);

  const detectObjects = async (imageUrl: string) => {
    if (!imageUrl) {
      toast.error('No image provided for object detection');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/object-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageUrl }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to detect objects');
      }
      
      const data = await response.json() as ObjectDetectionResult;
      setDetectedObjects(data.objects || []);
      
      return data.objects;
    } catch (error) {
      console.error('Object detection error:', error);
      toast.error('Failed to analyze image: ' + (error instanceof Error ? error.message : 'Unknown error'));
      return [];
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    detectObjects,
    detectedObjects,
    isProcessing,
  };
};
