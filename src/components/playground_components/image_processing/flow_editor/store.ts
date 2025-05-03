import { create } from 'zustand';
import { Node, Edge, Connection } from '@xyflow/react';
import { persist } from 'zustand/middleware';
import { createSelectors } from './utils';

// Type definitions
export type ImageData = string | null; // Base64 encoded image data

// Define allowed node types
export type NodeType = 'imageInput' | 'cameraInput' | 'imageProcess' | 'imageOutput' | 'blur' | 'grayscale' |
  'brightness' | 'contrast' | 'saturation' | 'edgeDetection' | 'sharpen' | 'sobelOperator' |
  'invert' | 'sepia' | 'colorize' | string; // Include string to allow for future node types

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

interface NodeProcessingData {
  inputImage: ImageData;
  outputImage: ImageData;
  isProcessing: boolean;
}

// Store slice interfaces
interface NodesSlice {
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
  addNode: (node: Node) => void;
  updateNode: (id: string, data: Partial<Node>) => void;
  removeNode: (id: string) => void;
}

interface EdgesSlice {
  edges: Edge[];
  setEdges: (edges: Edge[]) => void;
  addEdge: (connection: Connection) => void;
  updateEdge: (id: string, data: Partial<Edge>) => void;
  removeEdge: (id: string) => void;
}

interface SelectionSlice {
  selectedNode: Node | null;
  setSelectedNode: (node: Node | null) => void;
}

interface ParametersSlice {
  nodeParameters: Record<NodeType, NodeParameter[]>;
  updateNodeParameter: (nodeId: string, paramName: string, value: number | boolean | string) => void;
  getNodeParameters: (nodeId: string) => NodeParameter[];
}

interface ProcessingSlice {
  nodeData: Record<string, NodeProcessingData>;
  setNodeInputImage: (nodeId: string, imageData: ImageData) => void;
  setNodeOutputImage: (nodeId: string, imageData: ImageData) => void;
  getNodeInputImage: (nodeId: string) => ImageData;
  getNodeOutputImage: (nodeId: string) => ImageData;
  processNode: (nodeId: string, nodes: Node[], edges: Edge[]) => void;
  processFlow: (nodes: Node[], edges: Edge[]) => void;
}

// Combined store type
type FlowState = NodesSlice & EdgesSlice & SelectionSlice & ParametersSlice & ProcessingSlice;
export type { FlowState };

// Create the store with proper initialization
const useFlowStoreBase = create<FlowState>()(
  persist(
    (set, get) => ({
      // Nodes slice - ensure proper array initialization
      nodes: [] as Node[],
      setNodes: (nodes) => set({ nodes: Array.isArray(nodes) ? nodes : [] }),
      addNode: (node) => set((state) => ({ nodes: Array.isArray(state.nodes) ? [...state.nodes, node] : [node] })),
      updateNode: (id, data) => set((state) => {
        if (!Array.isArray(state.nodes)) return { nodes: [] as Node[] };
        return {
          nodes: state.nodes.map(node =>
            node.id === id ? { ...node, ...data } : node
          )
        };
      }),
      removeNode: (id) => set((state) => {
        if (!Array.isArray(state.nodes)) return { nodes: [] as Node[] };
        return {
          nodes: state.nodes.filter(node => node.id !== id)
        };
      }),

      // Edges slice - ensure proper array initialization
      edges: [] as Edge[],
      setEdges: (edges) => set({ edges: Array.isArray(edges) ? edges : [] }),
      addEdge: (connection) => {
        set((state) => {
          if (!Array.isArray(state.edges)) {
            state.edges = [];
          }

          const newEdge = { id: `e-${connection.source}-${connection.target}`, ...connection };
          const newEdges = [...state.edges, newEdge];

          // First add the edge so it appears immediately
          return { edges: newEdges };
        });

        // Then immediately update the target node with the source node's output
        // This makes the output update in realtime when connecting nodes
        const { setNodeInputImage, getNodeOutputImage, processFlow, nodes, edges } = get();

        if (connection.source && connection.target) {
          // Get the current output of the source node
          const sourceOutput = getNodeOutputImage(connection.source);

          if (sourceOutput) {
            // Set the input of the target node to the source output
            setNodeInputImage(connection.target, sourceOutput);

            // Process the target node immediately
            get().processNode(connection.target, nodes, edges);

            // Then process the entire flow to propagate changes downstream
            setTimeout(() => {
              processFlow(nodes, edges);
            }, 50);
          }
        }
      },
      updateEdge: (id, data) => set((state) => {
        if (!Array.isArray(state.edges)) return { edges: [] as Edge[] };
        return {
          edges: state.edges.map(edge =>
            edge.id === id ? { ...edge, ...data } : edge
          )
        };
      }),

      // Remove an edge and re-process the flow
      removeEdge: (id) => set((state) => {
        if (!Array.isArray(state.edges)) return { edges: [] as Edge[] };

        // Remove the edge with the matching ID
        const newEdges = state.edges.filter(edge => edge.id !== id);

        // Re-process the flow after removing the edge
        setTimeout(() => {
          get().processFlow(get().nodes, newEdges);
        }, 50);

        return { edges: newEdges };
      }),

      // Selection slice
      selectedNode: null,
      setSelectedNode: (node) => set({ selectedNode: node }),

      // Parameters slice
      nodeParameters: {
        // Default parameters for different node types
        cameraInput: [
          { name: 'autoCapture', label: 'Auto Capture', type: 'toggle', value: false, description: 'Automatically capture an image every few seconds' },
          { name: 'mirrorImage', label: 'Mirror Image', type: 'toggle', value: true, description: 'Mirror the camera image horizontally' },
        ],
        blur: [
          { name: 'radius', label: 'Blur Radius', type: 'slider', value: 5, min: 1, max: 20, step: 1, description: 'Controls the blur intensity' },
        ],
        brightness: [
          { name: 'level', label: 'Brightness Level', type: 'slider', value: 1, min: 0, max: 2, step: 0.1, description: 'Adjusts image brightness' },
        ],
        contrast: [
          { name: 'level', label: 'Contrast Level', type: 'slider', value: 1, min: 0, max: 2, step: 0.1, description: 'Adjusts image contrast' },
        ],
        grayscale: [
          { name: 'intensity', label: 'Grayscale Intensity', type: 'slider', value: 1.0, min: 0, max: 1, step: 0.01, description: 'Controls the intensity of the grayscale effect' },
        ],
        edgeDetection: [
          { name: 'threshold', label: 'Edge Threshold', type: 'slider', value: 50, min: 0, max: 100, step: 1, description: 'Controls edge detection sensitivity' },
        ],
        hueRotate: [
          { name: 'degrees', label: 'Hue Rotation', type: 'slider', value: 0, min: 0, max: 360, step: 1, description: 'Rotates the hue of the image' },
        ],
        invert: [
          { name: 'enabled', label: 'Invert Colors', type: 'toggle', value: true, description: 'Invert all colors in the image' },
        ],
        sepia: [
          { name: 'intensity', label: 'Sepia Intensity', type: 'slider', value: 1, min: 0, max: 1, step: 0.1, description: 'Controls the sepia effect intensity' },
        ],
        saturation: [
          { name: 'level', label: 'Saturation Level', type: 'slider', value: 1, min: 0, max: 2, step: 0.1, description: 'Adjusts color saturation' },
        ],
        sharpen: [
          { name: 'intensity', label: 'Sharpen Intensity', type: 'slider', value: 0.5, min: 0, max: 1, step: 0.1, description: 'Controls the sharpening effect' },
        ],
        noise: [
          { name: 'amount', label: 'Noise Amount', type: 'slider', value: 0.2, min: 0, max: 1, step: 0.05, description: 'Adds noise to the image' },
        ],
        pixelate: [
          { name: 'size', label: 'Pixel Size', type: 'slider', value: 8, min: 2, max: 32, step: 1, description: 'Controls the size of pixels' },
        ],
        colorize: [
          { name: 'color', label: 'Color Tint', type: 'color', value: '#83AFC9', description: 'Apply a color tint to the image' },
        ],
      },
      updateNodeParameter: (nodeId, paramName, value) => {
        set((state) => {
          // Get the node type from its ID to find the correct parameters
          const node = state.nodes.find(n => n.id === nodeId);
          if (!node || !node.data || !node.data.type) return state;

          // Ensure nodeType is cast as NodeType
          const nodeType = node.data.type as NodeType;
          const params = { ...state.nodeParameters };

          // Find and update the parameter
          if (params[nodeType]) {
            params[nodeType] = params[nodeType].map((param: NodeParameter) =>
              param.name === paramName ? { ...param, value } : param
            );
          }

          // Process the node with the updated parameter
          setTimeout(() => {
            get().processNode(nodeId, state.nodes, state.edges);
          }, 100);

          return { nodeParameters: params };
        });
      },
      getNodeParameters: (nodeId) => {
        const state = get();
        const node = state.nodes.find(n => n.id === nodeId);
        if (!node || !node.data || !node.data.type) return [];

        // Ensure nodeType is cast as NodeType
        const nodeType = node.data.type as NodeType;
        return state.nodeParameters[nodeType] || [];
      },

      // Processing slice
      nodeData: {},
      setNodeInputImage: (nodeId, imageData) => {
        set((state) => ({
          nodeData: {
            ...state.nodeData,
            [nodeId]: {
              ...(state.nodeData[nodeId] || {}),
              inputImage: imageData
            }
          }
        }));

        // Process the node with the new input image
        setTimeout(() => {
          get().processNode(nodeId, get().nodes, get().edges);
        }, 100);
      },
      setNodeOutputImage: (nodeId, imageData) => {
        set((state) => ({
          nodeData: {
            ...state.nodeData,
            [nodeId]: {
              ...(state.nodeData[nodeId] || {}),
              outputImage: imageData
            }
          }
        }));
      },
      getNodeInputImage: (nodeId) => {
        const state = get();
        return state.nodeData[nodeId]?.inputImage || null;
      },
      getNodeOutputImage: (nodeId) => {
        const state = get();
        return state.nodeData[nodeId]?.outputImage || null;
      },
      processNode: (nodeId, nodes, edges) => {
        const state = get();

        // Set processing state to true
        set((state) => ({
          nodeData: {
            ...state.nodeData,
            [nodeId]: {
              ...(state.nodeData[nodeId] || {}),
              isProcessing: true
            }
          }
        }));

        // Process the image based on node type
        const params = state.getNodeParameters(nodeId);
        const inputImage = state.getNodeInputImage(nodeId);

        // Process the node asynchronously
        const processAsync = async () => {
          try {
            let outputImage = inputImage;

            // Skip processing if no input image
            if (!inputImage) {
              set((state) => ({
                nodeData: {
                  ...state.nodeData,
                  [nodeId]: {
                    ...(state.nodeData[nodeId] || {}),
                    outputImage: null,
                    isProcessing: false
                  }
                }
              }));
              return;
            }

            // Process image based on node type
            const node = nodes.find(n => n.id === nodeId);
            if (!node || !node.data || !node.data.type) return;

            const nodeType = node.data.type;

            // Helper function to process image with canvas
            const processImage = (img: string, processor: (ctx: CanvasRenderingContext2D, imgElement: HTMLImageElement) => void): Promise<string> => {
              return new Promise((resolve, reject) => {
                const imgElement = new Image();
                imgElement.crossOrigin = "anonymous";
                imgElement.src = img;

                imgElement.onload = () => {
                  try {
                    const canvas = document.createElement('canvas');
                    canvas.width = imgElement.width;
                    canvas.height = imgElement.height;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                      reject(new Error('Could not get canvas context'));
                      return;
                    }

                    // Draw the image and apply processing
                    ctx.drawImage(imgElement, 0, 0);
                    processor(ctx, imgElement);

                    // Get the processed image data
                    resolve(canvas.toDataURL('image/png'));
                  } catch (error) {
                    reject(error);
                  }
                };

                imgElement.onerror = () => {
                  reject(new Error('Could not load image'));
                };
              });
            };

            // Process based on node type
            switch (nodeType) {
              case 'blur': {
                const radius = (params.find(p => p.name === 'radius')?.value as number) || 5;
                outputImage = await processImage(inputImage, (ctx) => {
                  // Implement blur with multiple passes for better quality
                  const blurPass = (radius: number) => {
                    if (!ctx) return;
                    const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
                    const pixels = imgData.data;

                    // Simple box blur
                    ctx.filter = `blur(${radius}px)`;
                    ctx.drawImage(ctx.canvas, 0, 0);
                    ctx.filter = 'none';
                  };

                  blurPass(radius);
                });
                break;
              }
              case 'brightness': {
                const level = (params.find(p => p.name === 'level')?.value as number) || 1;
                outputImage = await processImage(inputImage, (ctx) => {
                  if (!ctx) return;
                  ctx.filter = `brightness(${level * 100}%)`;
                  ctx.drawImage(ctx.canvas, 0, 0);
                  ctx.filter = 'none';
                });
                break;
              }
              case 'contrast': {
                const level = (params.find(p => p.name === 'level')?.value as number) || 1;
                outputImage = await processImage(inputImage, (ctx) => {
                  if (!ctx) return;
                  ctx.filter = `contrast(${level * 100}%)`;
                  ctx.drawImage(ctx.canvas, 0, 0);
                  ctx.filter = 'none';
                });
                break;
              }
              case 'grayscale': {
                const intensity = (params.find(p => p.name === 'intensity')?.value as number) ?? 1.0;
                outputImage = await processImage(inputImage, (ctx) => {
                  if (!ctx) return;
                  // Apply grayscale with the specified intensity
                  ctx.filter = `grayscale(${intensity * 100}%)`;
                  ctx.drawImage(ctx.canvas, 0, 0);
                  ctx.filter = 'none';
                });
                break;
              }
              case 'invert': {
                const enabled = (params.find(p => p.name === 'enabled')?.value as boolean) ?? true;
                outputImage = await processImage(inputImage, (ctx) => {
                  if (!ctx || !enabled) return;
                  ctx.filter = 'invert(100%)';
                  ctx.drawImage(ctx.canvas, 0, 0);
                  ctx.filter = 'none';
                });
                break;
              }
              case 'sepia': {
                const intensity = (params.find(p => p.name === 'intensity')?.value as number) || 1;
                outputImage = await processImage(inputImage, (ctx) => {
                  if (!ctx) return;
                  ctx.filter = `sepia(${intensity * 100}%)`;
                  ctx.drawImage(ctx.canvas, 0, 0);
                  ctx.filter = 'none';
                });
                break;
              }
              case 'hueRotate': {
                const degrees = (params.find(p => p.name === 'degrees')?.value as number) || 0;
                outputImage = await processImage(inputImage, (ctx) => {
                  if (!ctx) return;
                  ctx.filter = `hue-rotate(${degrees}deg)`;
                  ctx.drawImage(ctx.canvas, 0, 0);
                  ctx.filter = 'none';
                });
                break;
              }
              case 'saturation': {
                const level = (params.find(p => p.name === 'level')?.value as number) || 1;
                outputImage = await processImage(inputImage, (ctx) => {
                  if (!ctx) return;
                  ctx.filter = `saturate(${level * 100}%)`;
                  ctx.drawImage(ctx.canvas, 0, 0);
                  ctx.filter = 'none';
                });
                break;
              }
              // For input and output nodes, just pass through the image
              case 'imageInput':
              case 'imageOutput':
                outputImage = inputImage;
                break;
              default:
                outputImage = inputImage;
            }

            // Set the output image
            state.setNodeOutputImage(nodeId, outputImage);

            // Set processing state to false
            set((state) => ({
              nodeData: {
                ...state.nodeData,
                [nodeId]: {
                  ...(state.nodeData[nodeId] || {}),
                  isProcessing: false
                }
              }
            }));

          } catch (error) {
            console.error('Error processing node:', error);
            // Set processing state to false on error
            set((state) => ({
              nodeData: {
                ...state.nodeData,
                [nodeId]: {
                  ...(state.nodeData[nodeId] || {}),
                  isProcessing: false
                }
              }
            }));
          }
        };

        processAsync();
      },
      processFlow: (nodes, edges) => {
        const state = get();
        const actualNodes = nodes.length > 0 ? nodes : [];
        const actualEdges = edges.length > 0 ? edges : [];

        if (actualNodes.length === 0) return;

        // Clear processing state for all nodes first
        actualNodes.forEach(node => {
          set(state => ({
            nodeData: {
              ...state.nodeData,
              [node.id]: {
                ...(state.nodeData[node.id] || {}),
                isProcessing: true
              }
            }
          }));
        });

        // Find input nodes (nodes with no incoming edges)
        const inputNodes = actualNodes.filter(node => {
          return !actualEdges.some(edge => edge.target === node.id);
        });

        // Process each input node and follow the flow
        const processedNodes = new Set<string>();

        const processNodeAndDownstream = (nodeId: string) => {
          if (processedNodes.has(nodeId)) return;
          processedNodes.add(nodeId);


          // Process this node
          state.processNode(nodeId, actualNodes, actualEdges);

          // Find outgoing edges from this node
          const outgoingEdges = actualEdges.filter(edge => edge.source === nodeId);

          // Process downstream nodes
          for (const edge of outgoingEdges) {
            const targetNode = actualNodes.find(node => node.id === edge.target);
            if (targetNode) {
              // Set the input of the target node to the output of this node
              const outputImage = state.getNodeOutputImage(nodeId);
              if (outputImage) {
                state.setNodeInputImage(targetNode.id, outputImage);
                // Process the target node
                processNodeAndDownstream(targetNode.id);
              } else {
              }
            }
          }
        };

        // Start processing from input nodes
        for (const inputNode of inputNodes) {
          processNodeAndDownstream(inputNode.id);
        }

        // For nodes that weren't processed in the flow (disconnected nodes)
        actualNodes.forEach(node => {
          if (!processedNodes.has(node.id)) {
            // If it's an input node, process it anyway
            if (node.type === 'imageInput' || node.type === 'imageProcess') {
              state.processNode(node.id, actualNodes, actualEdges);
            }
          }
        });
      },
    }),
    {
      name: 'flow-editor-storage',
      partialize: (state) => ({
        // Only persist node parameters as they can be customized by users
        nodeParameters: state.nodeParameters,
      }),
    }
  )
);

// Export the store with selectors for easier component access
export const useFlowStore = createSelectors(useFlowStoreBase);
