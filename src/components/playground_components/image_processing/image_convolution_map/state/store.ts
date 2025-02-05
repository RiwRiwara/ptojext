import { create } from "zustand";
import { AppState, GridState } from "./types";
import GridConvolutionManager from "@/classes/GridConvolutionManager";

const gridConvolutionManager = new GridConvolutionManager(
  8,
  8,
  30,
  0,
  true,
  Array(64)
    .fill(0)
    .map(() => Array(8).fill(Math.floor(Math.random() * 8)))
);

// Function to extract grid state from GridConvolutionManager
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

  updateGridState: () => {
    set(() => ({
      gridState: getGridState(),
    }));
  },

  applyConvolution: (row: number, col: number) => {
    set((state) => {
      state.gridConvolutionManager.updateKernel(row, col, state.convolutionData);
      return { gridState: getGridState() };
    });
  },

}));

// Ensure the store updates when the grid changes
gridConvolutionManager.addObserver(() => {
  useStore.getState().updateGridState();
});

export default useStore;
