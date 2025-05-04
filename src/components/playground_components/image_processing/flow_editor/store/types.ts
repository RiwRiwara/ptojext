import { Node, Edge, Connection } from '@xyflow/react';

// Base types
export type ImageData = string | null; // Base64 encoded image data

export type NodeParameter = {
  name: string;
  label: string;
  type: 'slider' | 'toggle' | 'select' | 'color';
  value: number | boolean | string;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: string }[];
  description?: string;
  defaultValue?: number | boolean | string;
};

export interface NodeProcessingData {
  inputImage: ImageData;
  outputImage: ImageData;
  isProcessing: boolean;
}

// Store slice interfaces
export interface NodesSlice {
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
  addNode: (node: Node) => void;
  updateNode: (id: string, data: Partial<Node>) => void;
  removeNode: (id: string) => void;
}

export interface EdgesSlice {
  edges: Edge[];
  setEdges: (edges: Edge[]) => void;
  addEdge: (connection: Connection) => void;
  updateEdge: (id: string, data: Partial<Edge>) => void;
  removeEdge: (id: string) => void;
}

export interface SelectionSlice {
  selectedNode: Node | null;
  setSelectedNode: (node: Node | null) => void;
}

export interface ParametersSlice {
  nodeParameters: Record<string, NodeParameter[]>;
  updateNodeParameter: (nodeId: string, paramName: string, value: number | boolean | string) => void;
  getNodeParameters: (nodeId: string) => NodeParameter[];
}

export interface ProcessingSlice {
  nodeData: Record<string, NodeProcessingData>;
  setNodeInputImage: (nodeId: string, imageData: ImageData) => void;
  setNodeOutputImage: (nodeId: string, imageData: ImageData) => void;
  getNodeInputImage: (nodeId: string) => ImageData;
  getNodeOutputImage: (nodeId: string) => ImageData;
  processNode: (nodeId: string, nodes: Node[], edges: Edge[]) => void;
  processFlow: (nodes: Node[], edges: Edge[]) => void;
}

// Combined store type
export type FlowState = NodesSlice & EdgesSlice & SelectionSlice & ParametersSlice & ProcessingSlice;
