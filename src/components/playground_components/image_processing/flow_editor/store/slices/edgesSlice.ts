import { StateCreator } from 'zustand';
import { Edge } from '@xyflow/react';
import { EdgesSlice, FlowState } from '../types';

export const createEdgesSlice: StateCreator<
  FlowState,
  [],
  [],
  EdgesSlice
> = (set, get) => ({
  // Edges slice - ensure proper array initialization
  edges: [] as Edge[],
  
  setEdges: (edges) => set({ 
    edges: Array.isArray(edges) ? edges : [] 
  }),
  
  addEdge: (connection) => {
    set((state) => {
      if (!Array.isArray(state.edges)) {
        state.edges = [];
      }
      
      const newEdge = { id: `e-${connection.source}-${connection.target}`, ...connection };
      const newEdges = [...state.edges, newEdge];
      
      // Process the flow after a new connection is made
      setTimeout(() => {
        console.log('Connection made, processing flow...');
        const { setNodeInputImage, getNodeOutputImage, processFlow, nodes } = get();
        
        // First, directly set the input of the target node to the output of the source node
        if (connection.source && connection.target) {
          const sourceOutput = getNodeOutputImage(connection.source);
          if (sourceOutput) {
            console.log(`Setting input of ${connection.target} to output of ${connection.source}`);
            setNodeInputImage(connection.target, sourceOutput);
          }
        }
        
        // Then process the entire flow
        processFlow(get().nodes, newEdges);
      }, 100);
      
      return { edges: newEdges };
    });
  },
  
  updateEdge: (id, data) => set((state) => {
    if (!Array.isArray(state.edges)) return { edges: [] as Edge[] };
    return {
      edges: state.edges.map(edge => 
        edge.id === id ? { ...edge, ...data } : edge
      )
    };
  }),
  
  removeEdge: (id) => set((state) => {
    if (!Array.isArray(state.edges)) return { edges: [] as Edge[] };
    return {
      edges: state.edges.filter(edge => edge.id !== id)
    };
  }),
});
