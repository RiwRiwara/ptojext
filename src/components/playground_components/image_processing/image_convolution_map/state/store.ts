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
  resultGrid: gridConvolutionManager.getResultGrid(), // Add resultGrid to the store

  updateGridState: () => {
    set(() => ({
      gridState: getGridState(),
      resultGrid: gridConvolutionManager.getResultGrid(), // Update resultGrid too
    }));
  },
  convolutionOutput: 0,
  applyConvolution: (row: number, col: number) => {
    set((state) => {
      state.gridConvolutionManager.updateKernel(row, col, state.convolutionData);
      const result = gridConvolutionManager.computeConvolution(row, col);
      return {
        convolutionOutput: result,
        gridState: getGridState(),
        resultGrid: gridConvolutionManager.getResultGrid(), // Update resultGrid
      };
    });
  },
}));

gridConvolutionManager.addObserver(() => {
  useStore.getState().updateGridState();
});

export default useStore;