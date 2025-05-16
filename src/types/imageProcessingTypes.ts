/**
 * Image Processing Node Types
 * This file contains type definitions for all image processing node data structures
 */

/**
 * Base node data type that all node data types extend
 */
export interface BaseNodeData {
  [key: string]: unknown;
}

/**
 * Image node data type - represents source image nodes
 */
export interface ImageNodeData extends BaseNodeData {
  imageUrl?: string;
  title?: string;
}

/**
 * Blur algorithm options
 */
export type BlurAlgorithm = 'gaussian' | 'box' | 'stack' | 'motion' | 'motion';

/**
 * Filter node data type with different filter operations
 */
export interface FilterNodeData extends BaseNodeData {
  type: 'blur' | 'sharpen' | 'grayscale' | 'sepia' | 'invert';
  intensity?: number;
  blurAlgorithm?: BlurAlgorithm;
  kernelSize?: number;
  sigma?: number;
  angle?: number; // For motion blur
  title?: string;
}

/**
 * Adjust node data type for color adjustments
 */
export interface AdjustNodeData extends BaseNodeData {
  brightness: number;
  contrast: number;
  saturation: number;
}

/**
 * Crop node data type for image cropping operations
 */
export interface CropNodeData extends BaseNodeData {
  x: number;
  y: number;
  width: number;
  title?: string;
  height: number;
}

/**
 * Rotate node data type for image rotation
 */
export interface RotateNodeData extends BaseNodeData {
  angle: number;
  title?: string;
}

/**
 * Split node data type for channel splitting
 */
export interface SplitNodeData extends BaseNodeData {
  channel?: 'red' | 'green' | 'blue';
  title?: string;
}

/**
 * Object detection node data type for AI detection
 */
export interface DetectNodeData extends BaseNodeData {
  sensitivity: number;
  title?: string;
  detectedObjects?: DetectedObject[];
}

/**
 * Result image node data type for final processed image
 */
export interface ResultImageNodeData extends BaseNodeData {
  imageUrl?: string;
  title?: string;
}

/**
 * Type for processed results from image processing operations
 */
export interface ProcessingResult {
  [nodeId: string]: string; // nodeId -> processed image URL
}

/**
 * Node type discriminators
 */
export type NodeType =
  | 'image'
  | 'filter'
  | 'adjust'
  | 'crop'
  | 'rotate'
  | 'split'
  | 'detect'
  | 'threshold'
  | 'edge_detection'
  | 'noise_reduction'
  | 'histogram_equalization'
  | 'color_quantization'
  | 'result_image'   // Renamed from 'output'
  | 'num'
  | 'sum';

/**
 * Threshold node data type for binary thresholding
 */
export interface ThresholdNodeData extends BaseNodeData {
  threshold: number; // 0-255
  inverted: boolean; // Whether to invert the result
  title?: string;
}

/**
 * Edge Detection node data type
 */
export interface DetectedObject {
  name: string;
  confidence: number;
}

export interface EdgeDetectionNodeData extends BaseNodeData {
  algorithm: 'sobel' | 'canny' | 'prewitt' | 'roberts';
  threshold?: number; // For canny edge detection
  title?: string;
}

/**
 * Noise Reduction node data type
 */
export interface NoiseReductionNodeData extends BaseNodeData {
  algorithm: 'median' | 'gaussian' | 'bilateral';
  intensity: number; // 0-100
  title?: string;
}

/**
 * Histogram Equalization node data type
 */
export interface HistogramEqualizationNodeData extends BaseNodeData {
  mode: 'global' | 'adaptive';
  clipLimit?: number; // For adaptive histogram equalization
  title?: string;
}

/**
 * Color Quantization node data type
 */
export interface ColorQuantizationNodeData extends BaseNodeData {
  colors: number; // Number of colors to reduce to
  dithering: boolean; // Whether to apply dithering
  title?: string;
}

/**
 * Union type for all node data types
 */
export type NodeData =
  | ImageNodeData
  | FilterNodeData
  | AdjustNodeData
  | CropNodeData
  | RotateNodeData
  | SplitNodeData
  | DetectNodeData
  | ThresholdNodeData
  | EdgeDetectionNodeData
  | NoiseReductionNodeData
  | HistogramEqualizationNodeData
  | ColorQuantizationNodeData
  | ResultImageNodeData;
