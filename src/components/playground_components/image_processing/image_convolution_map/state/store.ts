// useStore.ts
import { create } from "zustand";
import { AppState, GridState } from "./types";
import GridConvolutionManager from "@/classes/GridConvolutionManager";

const gridConvolutionManager = new GridConvolutionManager(
  8,
  8,
  30,
  0,
  true,
  Array(64).fill(0).map(() => Array(8).fill(Math.floor(Math.random() * 8)))
);

const getGridState = (): GridState => ({
  rows: gridConvolutionManager.rows,
  cols: gridConvolutionManager.cols,
  cellSize: gridConvolutionManager.cellSize,
  data: gridConvolutionManager.data,
});

const useStore = create<AppState>((set) => ({
  gridConvolutionManager,
  gridState: getGridState(),
  convolutionData: [
    [0, 0, 0],
    [0, 5, 0],
    [0, 0, 0],
  ],
  resultGrid: gridConvolutionManager.generateInitialResultGrid([
    [0, 0, 0],
    [0, 5, 0],
    [0, 0, 0],
  ]), // Fill with full convolution result initially
  hoverPosition: null as { row: number; col: number } | null, // Track hover position

  updateGridState: () => {
    set((state) => ({
      gridState: getGridState(),
      resultGrid: gridConvolutionManager.generateInitialResultGrid(state.convolutionData), // Always recalc
    }));
  },
  convolutionOutput: 0,
  setHoverPosition: (position: { row: number; col: number } | null) => {
    set({ hoverPosition: position });
  },
  applyConvolution: (row: number, col: number) => {
    set((state) => {
      state.gridConvolutionManager.updateKernel(row, col, state.convolutionData);
      const result = gridConvolutionManager.computeConvolution(row, col, state.convolutionData);
      return {
        convolutionOutput: result,
        gridState: getGridState(),
        resultGrid: gridConvolutionManager.generateInitialResultGrid(state.convolutionData), // Always recalc full result grid
      };
    });
  },
}));

gridConvolutionManager.addObserver(() => {
  useStore.getState().updateGridState();
});

export default useStore;