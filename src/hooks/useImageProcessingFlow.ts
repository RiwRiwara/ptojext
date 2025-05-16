"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useReactFlow, Edge, Node } from '@xyflow/react';
import * as ImageProcessing from '@/lib/image-processing-utils';
import { 
  ImageNodeData, 
  FilterNodeData, 
  AdjustNodeData, 
  CropNodeData, 
  RotateNodeData, 
  SplitNodeData, 
  DetectNodeData,
  ThresholdNodeData,
  EdgeDetectionNodeData,
  NoiseReductionNodeData,
  HistogramEqualizationNodeData,
  ColorQuantizationNodeData
} from '@/types/imageProcessingTypes';

type ProcessingFunction = {
  image: (imageData: ImageData, nodeData: ImageNodeData) => Promise<ImageData>;
  filter: (imageData: ImageData, nodeData: FilterNodeData) => ImageData;
  adjust: (imageData: ImageData, nodeData: AdjustNodeData) => ImageData;
  crop: (imageData: ImageData, nodeData: CropNodeData) => ImageData;
  rotate: (imageData: ImageData, nodeData: RotateNodeData) => ImageData;
  split: (imageData: ImageData, nodeData: SplitNodeData) => ImageData;
  detect: (imageData: ImageData, nodeData: DetectNodeData) => ImageData;
  threshold: (imageData: ImageData, nodeData: ThresholdNodeData) => ImageData;
  edge_detection: (imageData: ImageData, nodeData: EdgeDetectionNodeData) => ImageData;
  noise_reduction: (imageData: ImageData, nodeData: NoiseReductionNodeData) => ImageData;
  histogram_equalization: (imageData: ImageData, nodeData: HistogramEqualizationNodeData) => ImageData;
  color_quantization: (imageData: ImageData, nodeData: ColorQuantizationNodeData) => ImageData;
  result_image: (imageData: ImageData) => ImageData; // Renamed from output
};

const processingFunctions: ProcessingFunction = {
  image: async (imageData: ImageData, nodeData: ImageNodeData) => {
    if (!imageData && nodeData.imageUrl) {
      try {
        return await ImageProcessing.loadImage(nodeData.imageUrl);
      } catch (error) {
        console.error("Failed to load image:", error);
        return new ImageData(1, 1);
      }
    }
    return imageData;
  },
  filter: (imageData: ImageData, nodeData: FilterNodeData): ImageData => {
    if (!imageData) return new ImageData(1, 1);

    let result = imageData;
    console.log(nodeData);

    switch (nodeData.type) {
      case 'blur':
        // Get the blur algorithm or default to 'gaussian'
        const blurAlgorithm = nodeData.blurAlgorithm || 'gaussian';
        // Calculate intensity based on kernel size and algorithm
        // We'll adapt our existing applyBlur function for different algorithms
        let blurIntensity = 1;

        // Customize blur intensity based on kernel size and algorithm
        if (typeof nodeData.kernelSize === 'number') {
          switch(blurAlgorithm) {
            case 'gaussian':
              // For gaussian, factor in sigma if available
              const sigma = typeof nodeData.sigma === 'number' ? nodeData.sigma : 2;
              blurIntensity = nodeData.kernelSize * (sigma / 2);
              break;
            case 'box':
              blurIntensity = nodeData.kernelSize * 0.8;
              break;
            case 'stack':
              blurIntensity = nodeData.kernelSize * 1.2;
              break;
            case 'motion':
              // For motion blur, factor in the angle
              blurIntensity = nodeData.kernelSize * 0.9;
              // Note: Our current implementation can't factor in angle
              // but we're acknowledging it's set in the UI
              break;
          }
        }
        
        // Use our existing applyBlur with the calculated intensity
        result = ImageProcessing.applyBlur(result, blurIntensity);
        break;
        
      case 'sharpen':
        // Use strength parameter if available
        const strength = typeof nodeData.strength === 'number' ? nodeData.strength : 1;
        result = ImageProcessing.applySharpen(result, strength);
        break;
        
      case 'grayscale':
        // Apply basic grayscale first
        result = ImageProcessing.applyGrayscale(result);
        
        // Then adjust intensity if specified
        if (typeof nodeData.intensity === 'number' && nodeData.intensity < 100) {
          // If intensity is less than 100%, blend back with original
          const factor = nodeData.intensity / 100;
          const originalData = new Uint8ClampedArray(imageData.data);
          const resultData = result.data;
          
          for (let i = 0; i < resultData.length; i += 4) {
            resultData[i] = resultData[i] * factor + originalData[i] * (1 - factor);
            resultData[i + 1] = resultData[i + 1] * factor + originalData[i + 1] * (1 - factor);
            resultData[i + 2] = resultData[i + 2] * factor + originalData[i + 2] * (1 - factor);
          }
        }
        break;
        
      case 'sepia':
        // Use intensity parameter if available
        const sepiaIntensity = typeof nodeData.intensity === 'number' ? nodeData.intensity : 100;
        result = ImageProcessing.applySepia(result, sepiaIntensity);
        break;
        
      case 'invert':
        // Apply basic invert
        result = ImageProcessing.applyInvert(result);
        
        // Then adjust opacity if specified
        if (typeof nodeData.opacity === 'number' && nodeData.opacity < 100) {
          // If opacity is less than 100%, blend back with original
          const factor = nodeData.opacity / 100;
          const originalData = new Uint8ClampedArray(imageData.data);
          const resultData = result.data;
          
          for (let i = 0; i < resultData.length; i += 4) {
            resultData[i] = resultData[i] * factor + originalData[i] * (1 - factor);
            resultData[i + 1] = resultData[i + 1] * factor + originalData[i + 1] * (1 - factor);
            resultData[i + 2] = resultData[i + 2] * factor + originalData[i + 2] * (1 - factor);
          }
        }
        break;
    }

    return result;
  },
  adjust: (imageData: ImageData, nodeData: AdjustNodeData): ImageData => {
    if (!imageData) return new ImageData(1, 1);
    console.log(nodeData);

    let result = imageData;

    // Apply brightness and contrast
    result = ImageProcessing.applyBrightnessContrast(
      result,
      nodeData.brightness,
      nodeData.contrast
    );

    // Apply saturation
    result = ImageProcessing.applySaturation(result, nodeData.saturation);

    return result;
  },
  crop: (imageData: ImageData, nodeData: CropNodeData): ImageData => {
    if (!imageData) return new ImageData(1, 1);

    return ImageProcessing.applyCrop(
      imageData,
      nodeData.x,
      nodeData.y,
      nodeData.width,
      nodeData.height
    );
  },
  rotate: (imageData: ImageData, nodeData: RotateNodeData): ImageData => {
    if (!imageData) return new ImageData(1, 1);

    return ImageProcessing.applyRotate(imageData, nodeData.angle);
  },
  split: (imageData: ImageData, nodeData: SplitNodeData): ImageData => {
    if (!imageData) return new ImageData(1, 1);

    const channel = nodeData.channel || 'red';
    return ImageProcessing.splitChannels(imageData, channel);
  },
  detect: (imageData: ImageData, nodeData: DetectNodeData): ImageData => {
    if (!imageData) return new ImageData(1, 1);

    const result = ImageProcessing.detectObjects(imageData, nodeData.sensitivity);
    return result.imageData;
  },
  threshold: (imageData: ImageData, nodeData: ThresholdNodeData): ImageData => {
    if (!imageData) return new ImageData(1, 1);
    console.log(nodeData);

    // Apply threshold filter with threshold value and inversion flag
    return ImageProcessing.applyThreshold(
      imageData,
      nodeData.threshold,
      nodeData.inverted
    );
  },

  edge_detection: (imageData: ImageData, nodeData: EdgeDetectionNodeData): ImageData => {
    if (!imageData) return new ImageData(1, 1);
    console.log(nodeData);

    // Apply edge detection with selected algorithm and threshold
    return ImageProcessing.applyEdgeDetection(
      imageData,
      nodeData.algorithm,
      nodeData.threshold
    );
  },

  noise_reduction: (imageData: ImageData, nodeData: NoiseReductionNodeData): ImageData => {
    if (!imageData) return new ImageData(1, 1);
    console.log(nodeData);

    // Apply noise reduction with selected algorithm and intensity
    return ImageProcessing.applyNoiseReduction(
      imageData,
      nodeData.algorithm,
      nodeData.intensity
    );
  },

  histogram_equalization: (imageData: ImageData, nodeData: HistogramEqualizationNodeData): ImageData => {
    if (!imageData) return new ImageData(1, 1);
    console.log(nodeData);

    // Apply histogram equalization with selected mode and clip limit
    return ImageProcessing.applyHistogramEqualization(
      imageData,
      nodeData.mode,
      nodeData.clipLimit
    );
  },

  color_quantization: (imageData: ImageData, nodeData: ColorQuantizationNodeData): ImageData => {
    if (!imageData) return new ImageData(1, 1);
    console.log(nodeData);

    // Apply color quantization with number of colors and dithering flag
    return ImageProcessing.applyColorQuantization(
      imageData,
      nodeData.colors,
      nodeData.dithering
    );
  },

  result_image: (imageData: ImageData) => {
    return imageData;
  }
};

export interface ProcessingResult {
  [nodeId: string]: string; // nodeId -> processed image URL
}

export function useImageProcessingFlow() {
  const { getNodes, getEdges, setNodes } = useReactFlow();
  const [processedImages, setProcessedImages] = useState<ProcessingResult>({});
  const [processing, setProcessing] = useState(false);
  const [processingQuality, setProcessingQuality] = useState<'low' | 'medium' | 'high'>('medium');

  // Cache for processed nodes to avoid recomputing
  const [processedCache, setProcessedCache] = useState<Record<string, {
    imageData: ImageData;
    hash: string; // Hash of inputs/parameters
  }>>({});

  // Calculate a hash for node parameters to detect changes
  const getNodeParamsHash = useCallback((node: Node) => {
    return JSON.stringify(node.data);
  }, []);

  // Generate a resize factor based on quality setting
  const getQualityFactor = useCallback(() => {
    switch (processingQuality) {
      case 'low': return 0.5; // Process at 50% of original size
      case 'medium': return 0.75; // Process at 75% of original size
      case 'high': return 1.0; // Process at original size
      default: return 0.75;
    }
  }, [processingQuality]);

  // Helper to resize images for faster processing
  const resizeForProcessing = useCallback((imageData: ImageData): ImageData => {
    const factor = getQualityFactor();
    if (factor === 1.0) return imageData; // No resize needed

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Calculate new dimensions
    const newWidth = Math.ceil(imageData.width * factor);
    const newHeight = Math.ceil(imageData.height * factor);

    // Set canvas size and draw the resized image
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Create a temporary canvas to hold the original image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = imageData.width;
    tempCanvas.height = imageData.height;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.putImageData(imageData, 0, 0);

    // Draw resized version on our canvas
    ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);

    return ctx.getImageData(0, 0, newWidth, newHeight);
  }, [getQualityFactor]);

  // Function to process a single node with enhanced caching and stability
  const processNode = useCallback(async (
    nodeId: string,
    nodes: Node[],
    edges: Edge[],
    processed: Record<string, ImageData>,
    newCache: Record<string, { imageData: ImageData; hash: string }>
  ): Promise<ImageData | null> => {
    // If already processed in this run, return the result
    if (processed[nodeId]) {
      return processed[nodeId];
    }

    // Find the node
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !node.type) return null;

    // Calculate a hash of inputs + parameters to check cache
    const nodeParamHash = getNodeParamsHash(node);

    // Find incoming edges
    const incomingEdges = edges.filter(e => e.target === nodeId);
    let inputImageData: ImageData | null = null;
    let inputHash = '';

    // Process incoming connections first
    if (incomingEdges.length > 0) {
      // Get the source node from the first edge (for now we just use the first input)
      const sourceNodeId = incomingEdges[0].source;
      
      // First check if we already have this source node in the processed cache
      // This prevents unnecessary reprocessing of the same node
      if (processed[sourceNodeId]) {
        inputImageData = processed[sourceNodeId];
        if (newCache[sourceNodeId]) {
          inputHash = newCache[sourceNodeId].hash;
        }
      } else {
        // Process the source node if not already processed
        inputImageData = await processNode(sourceNodeId, nodes, edges, processed, newCache);
        // If we have a result in the cache, use its hash as part of our hash
        if (newCache[sourceNodeId]) {
          inputHash = newCache[sourceNodeId].hash;
        }
      }
    }

    // Complete hash with node's own hash and input hash
    const completeHash = `${nodeId}:${nodeParamHash}:${inputHash}`;

    // Type assertion for the processing function
    const processingFunction = processingFunctions[node.type as keyof ProcessingFunction] as (
      imageData: ImageData | null,
      nodeData: Record<string, unknown>
    ) => Promise<ImageData> | ImageData;

    // Enhanced cache checking with more stable identity comparison
    if (processedCache[nodeId] && processedCache[nodeId].hash === completeHash) {
      // We can reuse the cached result
      processed[nodeId] = processedCache[nodeId].imageData;
      newCache[nodeId] = processedCache[nodeId];
      return processed[nodeId];
    }

    // No cache hit, need to process
    if (!processingFunction) return null;

    try {
      // For efficiency, resize input image before processing
      let resizedInput = inputImageData;
      if (inputImageData && node.type !== 'image') { // Don't resize source images
        resizedInput = resizeForProcessing(inputImageData);
      }

      // Process with potentially resized input
      const result = await processingFunction(resizedInput!, node.data);

      if (result) {
        processed[nodeId] = result;
        // Cache the result with its hash
        newCache[nodeId] = { imageData: result, hash: completeHash };
        return result;
      }
      return null;
    } catch (error) {
      console.error(`Error processing node ${nodeId}:`, error);
      return null;
    }
  }, [getNodeParamsHash, processedCache, resizeForProcessing]);

  // Time tracking for throttling image processing
  const lastProcessTime = useRef(0);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Process the entire flow with optimizations and throttling
  const processFlow = useCallback(async () => {
    // Clear any pending processing timeout
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }

    // Throttle processing to prevent excessive updates
    const now = Date.now();
    const timeSinceLastProcess = now - lastProcessTime.current;
    
    if (processing) {
      // If already processing, schedule for later
      processingTimeoutRef.current = setTimeout(() => processFlow(), 300);
      return;
    }
    
    // Throttle to max once per 150ms for performance
    if (timeSinceLastProcess < 150) {
      processingTimeoutRef.current = setTimeout(() => processFlow(), 150 - timeSinceLastProcess);
      return;
    }
    
    // Start processing and update timestamp
    lastProcessTime.current = now;
    setProcessing(true);

    try {
      const nodes = getNodes();
      const edges = getEdges();
      const processed: Record<string, ImageData> = {};
      const results: ProcessingResult = {};
      const newCache: Record<string, { imageData: ImageData; hash: string }> = {};

      // Find nodes that need processing (start at result image nodes and work backwards)
      const resultImageNodes = nodes.filter(node => node.type === 'result_image');
      
      // Process each result image node and all its dependencies
      for (const resultImageNode of resultImageNodes) {
        const result = await processNode(resultImageNode.id, nodes, edges, processed, newCache);

        if (result) {
          // Convert ImageData to URL with controlled quality
          results[resultImageNode.id] = ImageProcessing.imageDataToUrl(result);
          
          // Build a batch update for nodes to prevent multiple re-renders
          const nodesToUpdate: Node[] = [];
          
          // Add result node to update batch
          nodesToUpdate.push({
            ...nodes.find(n => n.id === resultImageNode.id)!,
            data: {
              ...nodes.find(n => n.id === resultImageNode.id)!.data,
              imageUrl: results[resultImageNode.id]
            }
          });
          
          // Add intermediary nodes to the batch update
          for (const nodeId in processed) {
            if (processed[nodeId] && nodeId !== resultImageNode.id) {
              const node = nodes.find(n => n.id === nodeId);
              if (node && (node.type === 'image' || node.type === 'filter' || node.type === 'adjust')) {
                results[nodeId] = ImageProcessing.imageDataToUrl(processed[nodeId]);
                nodesToUpdate.push({
                  ...node,
                  data: {
                    ...node.data,
                    imageUrl: results[nodeId]
                  }
                });
              }
            }
          }
          
          // Apply all updates in a single operation to reduce re-renders
          setNodes(currentNodes => {
            const nodeMap = new Map(currentNodes.map(node => [node.id, node]));
            nodesToUpdate.forEach(updatedNode => {
              nodeMap.set(updatedNode.id, updatedNode);
            });
            return Array.from(nodeMap.values());
          });
        }
      }

      // Update processed images
      setProcessedImages(results);

      // Update cache for next processing cycle
      setProcessedCache(newCache);
    } catch (error) {
      console.error("Error processing flow:", error);
    } finally {
      setProcessing(false);
    }
  }, [getNodes, getEdges, processNode, setNodes, processing, setProcessedImages, setProcessedCache]);

  return {
    processedImages,
    processing,
    processFlow,
    processingQuality,
    setProcessingQuality
  };
}
