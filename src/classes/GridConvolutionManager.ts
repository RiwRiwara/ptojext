import GridManager from "@/classes/GridManager";

class GridConvolutionManager extends GridManager {
  resultGrid: number[][] | number[][][]; // Store the result of the convolution
  defaultKernel: number[][] = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ];
  kernelPosition: { row: number; col: number };
  animationInterval: NodeJS.Timeout | null = null;

  constructor(
    rows: number,
    cols: number,
    cellSize: number,
    strokeWidth: number,
    IsGridLines: boolean = true,
    data?: number[][] | number[][][],
    kernelPosition: { row: number; col: number } = { row: 0, col: 0 }
  ) {
    super(rows, cols, cellSize, strokeWidth, IsGridLines, data);
    this.kernelPosition = kernelPosition;
    this.resultGrid = this.generateInitialResultGrid();
  }



  // =========== Set kernel position ===========
  public setKernelPosition = (row: number, col: number) => {
    this.kernelPosition = { row, col };
  };

  // =========== Update kernel ===========
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

          // Get the value from the grid manager
          const currentGridValue = this.getValueByPosition(x, y);

          // Update the grid using `updateGridByPosition`
          this.updateGridByPosition(x, y, {
            text: `${value}x${currentGridValue}`,
            fillColor: "rgba(0, 0, 255, 0.08)",
            font: `light ${this.cellSize / 4}px sans-serif`,
          });
        }
      }
    }
  }

  // =========== Compute the convolution ===========
  public computeConvolution(row: number, col: number, customKernel?: number[][]): number | number[] {
    const kernel = customKernel || this.defaultKernel;
    let sum: number | number[] = 0;

    const sampleValue = this.getValueByPosition(col * this.cellSize, row * this.cellSize);
    const isArray = Array.isArray(sampleValue);

    if (isArray) {
      sum = new Array((sampleValue as number[]).length).fill(0);
    }

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const gridRow = row + r;
        const gridCol = col + c;

        if (gridRow < this.rows && gridCol < this.cols) {
          const x = gridCol * this.cellSize;
          const y = gridRow * this.cellSize;
          const value = this.getValueByPosition(x, y) || (isArray ? new Array(sampleValue.length).fill(0) : 0);

          if (isArray && Array.isArray(sum) && Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
              sum[i] += value[i] * kernel[r][c];
            }
          } else if (!isArray && typeof sum === "number" && typeof value === "number") {
            sum += value * kernel[r][c];
          }
        }
      }
    }

    // Store the result in the resultGrid at the appropriate position
    const outputRow = row; // No offset needed since resultGrid is already sized correctly
    const outputCol = col;
    if (outputRow < this.resultGrid.length && outputCol < this.resultGrid[0].length) {
      if (Array.isArray(sum)) {
        this.resultGrid[outputRow][outputCol] = sum; // Storing RGB or multi-channel result
      } else {
        this.resultGrid[outputRow][outputCol] = sum; // Storing grayscale result
      }
    }

    this.notifyObservers(); // Notify observers after updating resultGrid
    return sum;
  }

  // Getter for resultGrid
  public getResultGrid(): number[][] | number[][][] {
    return this.resultGrid;
  }

  // Ensure resultGrid is initialized and updated correctly
  private generateInitialResultGrid(): number[][] {
    // Output size: rows - kernelSize + 1, cols - kernelSize + 1
    const kernelSize = 3; // Assuming 3x3 kernel
    const outputRows = this.rows - kernelSize + 1;
    const outputCols = this.cols - kernelSize + 1;
    return Array.from({ length: outputRows }, () => Array(outputCols).fill(0));
  }



}

export default GridConvolutionManager;