import GridManager from "@/classes/GridManager";

// extend GridManager
class GridConvolutionManager extends GridManager {
  // convolution state variables
  defaultKernel: number[][] = [];
  kernelPosition: { row: number; col: number };

  constructor(
    rows: number,
    cols: number,
    cellSize: number,
    strokeWidth: number,
    IsGridLines: boolean = true,
    data?: number[][] | number[][][]
  ) {
    super(rows, cols, cellSize, strokeWidth, IsGridLines, data);

    this.defaultKernel = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ];

    this.kernelPosition = { row: 0, col: 0 };
  }

  public setKernelPosition = (row: number, col: number) => {
    this.kernelPosition = { row, col };
  };

  public updateKernel(row: number, col: number, customKernel: number[][]) {
    // Clear the previous kernel
    this.resetGrids();

    // Highlight and update the 3×3 kernel
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const gridRow = row + r;
        const gridCol = col + c;

        if (gridRow < this.rows && gridCol < this.cols) {
          const x = gridCol * this.cellSize;
          const y = gridRow * this.cellSize;
          const value = customKernel[r][c]; // Get the kernel value

          // get the value from the grid manager
          const currentGridValue = this.getValueByPosition(x, y);

          // Update the grid using `updateGridByPosition`
          this.updateGridByPosition(x, y, {
            text: `${value}x${currentGridValue}`,
            fillColor: "rgba(0, 0, 255, 0.2)",
            font: `light ${this.cellSize / 4}px sans-serif`,
          });
        }
      }
    }
    
  }
}
export default GridConvolutionManager;
