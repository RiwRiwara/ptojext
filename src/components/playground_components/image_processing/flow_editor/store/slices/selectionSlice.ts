import { StateCreator } from 'zustand';
import { FlowState, SelectionSlice } from '../types';

export const createSelectionSlice: StateCreator<
  FlowState,
  [],
  [],
  SelectionSlice
> = (set) => ({
  // Selection slice
  selectedNode: null,
  setSelectedNode: (node) => set({ selectedNode: node }),
});
