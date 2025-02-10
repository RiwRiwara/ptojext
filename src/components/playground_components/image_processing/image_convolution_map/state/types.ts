import GridConvolutionManager from "@/classes/GridConvolutionManager";

export type GridState = {
  rows: number;
  cols: number;
  cellSize: number;
  data: number[][] | number[][][];
};

export type AppState = {
  gridConvolutionManager: GridConvolutionManager;
  gridState: GridState;
  convolutionData: number[][];
  convolutionOutput: number | number[];
  updateGridState: () => void;
  applyConvolution :(row: number, col: number) => void;
};
