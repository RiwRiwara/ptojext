import { StateCreator } from 'zustand';
import { FlowState, ParametersSlice, NodeParameter } from '../types';

// Default parameters for different node types
const defaultNodeParameters: Record<string, NodeParameter[]> = {
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
    { name: 'enabled', label: 'Enable Grayscale', type: 'toggle', value: true, description: 'Toggle grayscale effect on/off' },
    { name: 'intensity', label: 'Grayscale Intensity', type: 'slider', value: 1.0, min: 0, max: 1, step: 0.01, description: 'Controls the intensity of the grayscale effect' },
    { name: 'grayLevel', label: 'Gray Level', type: 'slider', value: 128, min: 0, max: 255, step: 1, description: 'Set the gray level (0=black, 255=white)' },
    { name: 'contrast', label: 'Contrast Boost', type: 'slider', value: 0, min: 0, max: 1, step: 0.01, description: 'Adds contrast to the grayscale image' },
    { name: 'invert', label: 'Invert', type: 'toggle', value: false, description: 'Invert the grayscale colors' },
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
};

export const createParametersSlice: StateCreator<
  FlowState,
  [],
  [],
  ParametersSlice
> = (set, get) => ({
  // Parameters slice
  nodeParameters: defaultNodeParameters,

  updateNodeParameter: (nodeId, paramName, value) => {
    set((state) => {
      // Get the node type from its ID to find the correct parameters
      const node = state.nodes.find(n => n.id === nodeId);
      if (!node || !node.data || !node.data.type) return state;

      const nodeType = node.data.type;
      const params = { ...state.nodeParameters };

      // Find and update the parameter
      if (params[nodeType as keyof typeof params]) {
        params[nodeType as keyof typeof params] = params[nodeType as keyof typeof params].map((param: NodeParameter) =>
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

    const nodeType = node.data.type;
    return state.nodeParameters[nodeType as keyof typeof state.nodeParameters] || [];
  },
});
