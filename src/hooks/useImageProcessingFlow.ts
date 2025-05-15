"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useReactFlow, Edge, Node } from '@xyflow/react';
import * as ImageProcessing from '@/lib/image-processing-utils';
import { ImageNodeData, FilterNodeData, AdjustNodeData, CropNodeData, RotateNodeData, SplitNodeData, DetectNodeData } from '@/types/imageProcessingTypes';

type ProcessingFunction = {
  image: (imageData: ImageData, nodeData: ImageNodeData) => Promise<ImageData>;
  filter: (imageData: ImageData, nodeData: FilterNodeData) => ImageData;
  adjust: (imageData: ImageData, nodeData: AdjustNodeData) => ImageData;
  crop: (imageData: ImageData, nodeData: CropNodeData) => ImageData;
  rotate: (imageData: ImageData, nodeData: RotateNodeData) => ImageData;
  split: (imageData: ImageData, nodeData: SplitNodeData) => ImageData;
  detect: (imageData: ImageData, nodeData: DetectNodeData) => ImageData;
  output: (imageData: ImageData) => ImageData;
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

    switch (nodeData.type) {
      case 'blur':
        result = ImageProcessing.applyBlur(result, nodeData.intensity || 1);
        break;
      case 'sharpen':
        result = ImageProcessing.applySharpen(result, nodeData.intensity || 1);
        break;
      case 'grayscale':
        result = ImageProcessing.applyGrayscale(result);
        break;
      case 'sepia':
        result = ImageProcessing.applySepia(result, nodeData.intensity || 1);
        break;
      case 'invert':
        result = ImageProcessing.applyInvert(result);
        break;
    }

    return result;
  },
  adjust: (imageData: ImageData, nodeData: AdjustNodeData): ImageData => {
    if (!imageData) return new ImageData(1, 1);

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
  output: (imageData: ImageData) => {
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

  // Function to process a single node with caching
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
      // Process the source node
      inputImageData = await processNode(sourceNodeId, nodes, edges, processed, newCache);
      // If we have a result in the cache, use its hash as part of our hash
      if (newCache[sourceNodeId]) {
        inputHash = newCache[sourceNodeId].hash;
      }
    }

    // Complete hash with node's own hash and input hash
    const completeHash = `${nodeId}:${nodeParamHash}:${inputHash}`;

    // Type assertion for the processing function
    const processingFunction = processingFunctions[node.type as keyof ProcessingFunction] as (
      imageData: ImageData | null,
      nodeData: Record<string, unknown>
    ) => Promise<ImageData> | ImageData;

    // Check if we have this result in cache
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

  // Process the entire flow with optimizations
  const processFlow = useCallback(async () => {
    if (processing) return; // Prevent multiple concurrent processing
    setProcessing(true);

    try {
      const nodes = getNodes();
      const edges = getEdges();
      const processed: Record<string, ImageData> = {};
      const results: ProcessingResult = {};
      const newCache: Record<string, { imageData: ImageData; hash: string }> = {};

      // Find nodes that need processing (start at outputs and work backwards)
      const outputNodes = nodes.filter(node => node.type === 'output');

      // Process in a web worker or with setTimeout for UI responsiveness
      await new Promise(resolve => setTimeout(resolve, 0));

      // Process each output node and all its dependencies
      for (const outputNode of outputNodes) {
        const result = await processNode(outputNode.id, nodes, edges, processed, newCache);

        if (result) {
          // Convert ImageData to URL with controlled quality
          results[outputNode.id] = ImageProcessing.imageDataToUrl(result);

          // Update the node data to display the processed image
          setNodes(currentNodes =>
            currentNodes.map(node =>
              node.id === outputNode.id
                ? { ...node, data: { ...node.data, imageUrl: results[outputNode.id] } }
                : node
            )
          );
        }
      }

      // Update visible intermediate nodes' images
      for (const nodeId in processed) {
        if (processed[nodeId]) {
          results[nodeId] = ImageProcessing.imageDataToUrl(processed[nodeId]);

          // Update node display 
          setNodes(currentNodes =>
            currentNodes.map(node =>
              node.id === nodeId && (node.type === 'image' || node.type === 'filter' || node.type === 'adjust')
                ? { ...node, data: { ...node.data, imageUrl: results[nodeId] } }
                : node
            )
          );
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
  }, [getNodes, getEdges, processNode, setNodes, processing, setProcessedImages, setProcessedCache, ImageProcessing ]);

  return {
    processedImages,
    processing,
    processFlow,
    processingQuality,
    setProcessingQuality
  };
}
