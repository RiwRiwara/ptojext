import { Node, Edge } from '@xyflow/react';
import type {
  BaseNodeData,
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
  ColorQuantizationNodeData,
  ResultImageNodeData,
  NodeType as ProcessingNodeType,
  NodeData as ProcessingNodeData,
  ProcessingResult as ImageProcessingResult
} from '@/types/imageProcessingTypes';

// Re-export the types from imageProcessingTypes for convenience
export type {
  BaseNodeData,
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
  ColorQuantizationNodeData,
  ResultImageNodeData
};

// Export the ProcessingResult type for use in components
export type { ImageProcessingResult as ProcessingResult };

/**
 * Numeric node data type
 */
export interface NumNodeData extends BaseNodeData {
  value: number;
}

/**
 * Sum node data type
 */
export interface SumNodeData extends BaseNodeData {
  result?: number;
}

/**
 * Type for node data based on node type
 */
export type NodeData = ProcessingNodeData | NumNodeData | SumNodeData;

/**
 * Node type discriminators
 */
export type NodeTypes = ProcessingNodeType | 'num' | 'sum';

/**
 * Type for the full node with type information
 */
export interface FlowNode extends Node {
  type: NodeTypes;
  data: NodeData;
}

/**
 * Node definitions with their specific data types
 */
export type ImageNode = Node<ImageNodeData>;
export type FilterNode = Node<FilterNodeData>;
export type AdjustNode = Node<AdjustNodeData>;
export type CropNode = Node<CropNodeData>;
export type RotateNode = Node<RotateNodeData>;
export type SplitNode = Node<SplitNodeData>;
export type DetectNode = Node<DetectNodeData>;
export type ResultImageNode = Node<ResultImageNodeData>;
export type NumNode = Node<NumNodeData>;
export type SumNode = Node<SumNodeData>;

/**
 * Edge type for data flow connections
 */
export interface FlowEdge extends Edge {
  animated?: boolean;
  style?: React.CSSProperties;
}

// Interface for FlowEdge is defined here to avoid importing cycle issues
