import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';

// Define types for image processing data
type ImageData = string | null; // Base64 encoded image data

// Define the node parameter types
export type NodeParameter = {
  name: string;
  label: string;
  type: 'slider' | 'toggle' | 'select' | 'color';
  value: number | boolean | string;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: string }[];
  description?: string; // Help text for the parameter
  defaultValue?: number | boolean | string; // Default value for reset
};

interface NodeProcessingData {
  inputImage: ImageData;
  outputImage: ImageData;
  isProcessing: boolean;
}

export interface FlowState {
  // Node selection
  selectedNode: Node | null;
  setSelectedNode: (node: Node | null) => void;
  
  // Node parameters
  nodeParameters: Record<string, NodeParameter[]>;
  updateNodeParameter: (nodeId: string, paramName: string, value: number | boolean | string) => void;
  getNodeParameters: (nodeId: string) => NodeParameter[];
  
  // Image processing
  nodeData: Record<string, NodeProcessingData>;
  setNodeInputImage: (nodeId: string, imageData: ImageData) => void;
  setNodeOutputImage: (nodeId: string, imageData: ImageData) => void;
  getNodeInputImage: (nodeId: string) => ImageData;
  getNodeOutputImage: (nodeId: string) => ImageData;
  
  // Flow processing
  processNode: (nodeId: string, nodes: Node[], edges: Edge[]) => void;
  processFlow: (nodes: Node[], edges: Edge[]) => void;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  // Node selection
  selectedNode: null,
  setSelectedNode: (node) => set({ selectedNode: node }),
  
  // Node parameters
  nodeParameters: {
    // Default parameters for different node types
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
      { name: 'enabled', label: 'Enable Grayscale', type: 'toggle', value: true, description: 'Convert image to grayscale' },
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
    // Adding more node types for a complete set of image processing options
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
      const nodeType = nodeId.split('-')[0]; // Extract node type from ID
      const params = [...(state.nodeParameters[nodeType] || [])];
      const paramIndex = params.findIndex(p => p.name === paramName);
      
      if (paramIndex !== -1) {
        params[paramIndex] = { ...params[paramIndex], value };
        const newState = {
          nodeParameters: {
            ...state.nodeParameters,
            [nodeType]: params
          }
        };
        
        // Process the node with updated parameters
        setTimeout(() => {
          const currentState = get();
          if (currentState.selectedNode) {
            currentState.processNode(currentState.selectedNode.id, [], []);
            currentState.processFlow([], []);
          }
        }, 0);
        
        return newState;
      }
      return state;
    });
  },
  
  getNodeParameters: (nodeId) => {
    const state = get();
    const nodeType = nodeId.split('-')[0]; // Extract node type from ID
    return state.nodeParameters[nodeType] || [];
  },
  
  // Image processing data
  nodeData: {},
  
  setNodeInputImage: (nodeId, imageData) => {
    set((state) => ({
      nodeData: {
        ...state.nodeData,
        [nodeId]: {
          ...(state.nodeData[nodeId] || { isProcessing: false, outputImage: null }),
          inputImage: imageData
        }
      }
    }));
    
    // Process the node with the new input image
    setTimeout(() => {
      const state = get();
      state.processNode(nodeId, [], []);
    }, 0);
  },
  
  setNodeOutputImage: (nodeId, imageData) => {
    set((state) => ({
      nodeData: {
        ...state.nodeData,
        [nodeId]: {
          ...(state.nodeData[nodeId] || { isProcessing: false, inputImage: null }),
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
  
  // Process a single node
  processNode: (nodeId, nodes, edges) => {
    const state = get();
    const nodeType = nodeId.split('-')[0]; // Extract node type from ID
    const inputImage = state.getNodeInputImage(nodeId);
    
    if (!inputImage) return;
    
    // Set processing state
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
    let outputImage = inputImage;
    
    // Create a canvas to process the image
    const processImage = (img: string, processor: (ctx: CanvasRenderingContext2D, imgElement: HTMLImageElement) => void): Promise<string> => {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const imgElement = new Image();
        
        imgElement.onload = () => {
          canvas.width = imgElement.width;
          canvas.height = imgElement.height;
          
          if (ctx) {
            // Draw the original image
            ctx.drawImage(imgElement, 0, 0);
            
            // Apply the processing function
            processor(ctx, imgElement);
            
            // Return the processed image
            resolve(canvas.toDataURL('image/png'));
          } else {
            resolve(img); // Fallback to original if context not available
          }
        };
        
        imgElement.src = img;
      });
    };
    
    // Process based on node type
    const processAsync = async () => {
      try {
        switch (nodeType) {
          case 'blur': {
            const radius = params.find(p => p.name === 'radius')?.value as number || 5;
            outputImage = await processImage(inputImage, (ctx) => {
              if (!ctx) return;
              // Simple box blur implementation
              ctx.filter = `blur(${radius}px)`;
              const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
              ctx.putImageData(imgData, 0, 0);
            });
            break;
          }
          case 'brightness': {
            const level = params.find(p => p.name === 'level')?.value as number || 1;
            outputImage = await processImage(inputImage, (ctx) => {
              if (!ctx) return;
              ctx.filter = `brightness(${level * 100}%)`;
              const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
              ctx.putImageData(imgData, 0, 0);
            });
            break;
          }
          case 'contrast': {
            const level = params.find(p => p.name === 'level')?.value as number || 1;
            outputImage = await processImage(inputImage, (ctx) => {
              if (!ctx) return;
              ctx.filter = `contrast(${level * 100}%)`;
              const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
              ctx.putImageData(imgData, 0, 0);
            });
            break;
          }
          case 'grayscale': {
            const enabled = params.find(p => p.name === 'enabled')?.value as boolean || true;
            if (enabled) {
              outputImage = await processImage(inputImage, (ctx) => {
                if (!ctx) return;
                ctx.filter = 'grayscale(100%)';
                const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.putImageData(imgData, 0, 0);
              });
            }
            break;
          }
          case 'edgeDetection': {
            const threshold = params.find(p => p.name === 'threshold')?.value as number || 50;
            outputImage = await processImage(inputImage, (ctx) => {
              if (!ctx) return;
              // Simple edge detection using a sobel-like effect
              const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
              const data = imgData.data;
              const width = ctx.canvas.width;
              const height = ctx.canvas.height;
              
              // First convert to grayscale
              for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = data[i + 1] = data[i + 2] = avg;
              }
              
              // Apply a simple edge detection
              const tempData = new Uint8ClampedArray(data);
              for (let y = 1; y < height - 1; y++) {
                for (let x = 1; x < width - 1; x++) {
                  const idx = (y * width + x) * 4;
                  
                  // Simple gradient calculation
                  const gx = 
                    tempData[idx - 4] - tempData[idx + 4] + 
                    2 * tempData[idx - 4 + width * 4] - 2 * tempData[idx + 4 + width * 4] + 
                    tempData[idx - 4 + 2 * width * 4] - tempData[idx + 4 + 2 * width * 4];
                  
                  const gy = 
                    tempData[idx - width * 4] - tempData[idx + width * 4] + 
                    2 * tempData[idx + 4 - width * 4] - 2 * tempData[idx + 4 + width * 4] + 
                    tempData[idx + 8 - width * 4] - tempData[idx + 8 + width * 4];
                  
                  // Calculate gradient magnitude
                  const mag = Math.sqrt(gx * gx + gy * gy);
                  
                  // Apply threshold
                  const value = mag > threshold ? 255 : 0;
                  data[idx] = data[idx + 1] = data[idx + 2] = value;
                }
              }
              
              ctx.putImageData(imgData, 0, 0);
            });
            break;
          }
          case 'hueRotate': {
            const degrees = params.find(p => p.name === 'degrees')?.value as number || 0;
            outputImage = await processImage(inputImage, (ctx) => {
              if (!ctx) return;
              ctx.filter = `hue-rotate(${degrees}deg)`;
              const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
              ctx.putImageData(imgData, 0, 0);
            });
            break;
          }
          case 'invert': {
            const enabled = params.find(p => p.name === 'enabled')?.value as boolean || true;
            if (enabled) {
              outputImage = await processImage(inputImage, (ctx) => {
                if (!ctx) return;
                ctx.filter = 'invert(100%)';
                const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.putImageData(imgData, 0, 0);
              });
            }
            break;
          }
          case 'sepia': {
            const intensity = params.find(p => p.name === 'intensity')?.value as number || 1;
            outputImage = await processImage(inputImage, (ctx) => {
              if (!ctx) return;
              ctx.filter = `sepia(${intensity * 100}%)`;
              const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
              ctx.putImageData(imgData, 0, 0);
            });
            break;
          }
          case 'saturation': {
            const level = params.find(p => p.name === 'level')?.value as number || 1;
            outputImage = await processImage(inputImage, (ctx) => {
              if (!ctx) return;
              ctx.filter = `saturate(${level * 100}%)`;
              const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
              ctx.putImageData(imgData, 0, 0);
            });
            break;
          }
          // For input and output nodes, just pass through the image
          case 'imageUpload':
          case 'camera':
          case 'preview':
          case 'save':
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
  
  // Process the entire flow
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
      
      console.log(`Processing node: ${nodeId}`);
      
      // Process this node
      state.processNode(nodeId, actualNodes, actualEdges);
      
      // Find outgoing edges from this node
      const outgoingEdges = actualEdges.filter(edge => edge.source === nodeId);
      console.log(`Found ${outgoingEdges.length} outgoing edges for node ${nodeId}`);
      
      // Process downstream nodes
      for (const edge of outgoingEdges) {
        const targetNode = actualNodes.find(node => node.id === edge.target);
        if (targetNode) {
          console.log(`Setting input of ${targetNode.id} to output of ${nodeId}`);
          // Set the input of the target node to the output of this node
          const outputImage = state.getNodeOutputImage(nodeId);
          if (outputImage) {
            state.setNodeInputImage(targetNode.id, outputImage);
            // Process the target node
            processNodeAndDownstream(targetNode.id);
          } else {
            console.log(`No output image for node ${nodeId}`);
          }
        }
      }
    };
    
    // Start processing from input nodes
    console.log(`Starting processing from ${inputNodes.length} input nodes`);
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
  }
}));
