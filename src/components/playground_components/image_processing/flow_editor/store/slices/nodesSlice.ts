import { StateCreator } from 'zustand';
import { Node } from '@xyflow/react';
import { FlowState, NodesSlice } from '../types';

export const createNodesSlice: StateCreator<
  FlowState,
  [],
  [],
  NodesSlice
> = (set) => ({
  // Nodes slice - ensure proper array initialization
  nodes: [] as Node[],
  
  setNodes: (nodes) => set({ 
    nodes: Array.isArray(nodes) ? nodes : [] 
  }),
  
  addNode: (node) => set((state) => ({ 
    nodes: Array.isArray(state.nodes) ? [...state.nodes, node] : [node] 
  })),
  
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
});
