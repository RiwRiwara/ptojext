import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSelectors } from '../utils';
import { FlowState } from './types';

// Import slices
import { createNodesSlice } from './slices/nodesSlice';
import { createEdgesSlice } from './slices/edgesSlice';
import { createSelectionSlice } from './slices/selectionSlice';
import { createParametersSlice } from './slices/parametersSlice';
import { createProcessingSlice } from './slices/processingSlice';

// Create the store with all slices combined
const useFlowStoreBase = create<FlowState>()(
  persist(
    (set, get, store) => ({
      ...createNodesSlice(set, get, store),
      ...createEdgesSlice(set, get, store),
      ...createSelectionSlice(set, get, store),
      ...createParametersSlice(set, get, store),
      ...createProcessingSlice(set, get, store),
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

// Export types
export * from './types';
