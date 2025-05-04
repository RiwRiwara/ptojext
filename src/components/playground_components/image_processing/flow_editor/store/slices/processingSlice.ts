import { StateCreator } from 'zustand';
import { Node, Edge } from '@xyflow/react';
import { FlowState, ProcessingSlice, ImageData, NodeProcessingData } from '../types';

// Helper function to process image with canvas
const processImage = (
  img: string, 
  processor: (ctx: CanvasRenderingContext2D, imgElement: HTMLImageElement) => void
): Promise<string> => {
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

export const createProcessingSlice: StateCreator<
  FlowState,
  [],
  [],
  ProcessingSlice
> = (set, get) => ({
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
            const enabled = (params.find(p => p.name === 'enabled')?.value as boolean) ?? true;
            const intensity = (params.find(p => p.name === 'intensity')?.value as number) ?? 1.0;
            const grayLevel = (params.find(p => p.name === 'grayLevel')?.value as number) ?? 128;
            const contrastBoost = (params.find(p => p.name === 'contrast')?.value as number) ?? 0;
            const invert = (params.find(p => p.name === 'invert')?.value as boolean) ?? false;
            
            outputImage = await processImage(inputImage, (ctx) => {
              if (!ctx) return;
              
              // If grayscale is disabled, just maintain the original image
              if (!enabled) {
                ctx.drawImage(ctx.canvas, 0, 0);
                return;
              }
              
              // Apply grayscale with the specified intensity
              let filterString = `grayscale(${intensity * 100}%)`;
              
              // Add contrast if needed
              if (contrastBoost > 0) {
                // Apply contrast (1.0 is normal, higher values increase contrast)
                const contrastValue = 1.0 + contrastBoost * 2; // Scale from 0-1 to 1-3
                filterString += ` contrast(${contrastValue})`;
              }
              
              // Add invert if enabled
              if (invert) {
                filterString += ' invert(100%)';
              }
              
              // Apply all filters
              ctx.filter = filterString;
              ctx.drawImage(ctx.canvas, 0, 0);
              ctx.filter = 'none';
              
              // Apply custom gray level (0-255) if grayscale is at full intensity
              if (intensity > 0.9 && grayLevel !== 128) {
                // Get image data to manipulate it directly
                const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
                const data = imageData.data;
                
                // Iterate through pixels and adjust gray level
                for (let i = 0; i < data.length; i += 4) {
                  // Calculate current gray value
                  const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
                  
                  // Calculate adjustment factor to move toward desired gray level
                  const factor = grayLevel / 128;
                  
                  // Apply factor to each channel
                  data[i] = Math.min(255, Math.max(0, gray * factor));
                  data[i + 1] = Math.min(255, Math.max(0, gray * factor));
                  data[i + 2] = Math.min(255, Math.max(0, gray * factor));
                  // Alpha channel remains unchanged
                }
                
                // Put the modified image data back
                ctx.putImageData(imageData, 0, 0);
              }
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
    const actualNodes = Array.isArray(nodes) ? nodes : [];
    const actualEdges = Array.isArray(edges) ? edges : [];
    
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
  },
});
