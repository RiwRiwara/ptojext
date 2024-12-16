/**
 * This class manages the grids for the image convolution playground.
 * It generates the initial grids and provides methods to manipulate them.
 *
 * @class GridManager
 * @author [Awirut Phusaensaart](https://github.com/RiwRiwara)
 * @version 1.0.0
 * @date 2024-12-13
 *
 * @param {number} rows - The number of rows in the grid.
 * @param {number} cols - The number of columns in the grid.
 * @param {number} cellSize - The size of each cell in the grid.
 * @param {number} strokeWidth - The size of each cell in the grid.
 * @param {boolean} IsGridLines - Whether to display grid lines or not.
 * @param {number[] | number[][] | number[][][]} data - The initial data for the grid.
 * @param {number[] | number[][] | number[][][]} initialValues - The initial values for the grid.
 * @returns {GridManager} An instance of the GridManager class.
 *
 * @example
 * const gridManager = new GridManager(10, 10, 40);
 * const grids = gridManager.getGrids();
 * console.log(grids);
 *
 */

class GridManager {
  rows: number;
  cols: number;
  cellSize: number;
  grids: Grid[];
  data: number[][] | number[][][];

  fillColor = "white";
  strokeColor: string = "grey";
  strokeWidth: number = 0.5;
  textColor: string = "black";

  constructor(
    rows: number,
    cols: number,
    cellSize: number,
    strokeWidth: number,
    IsGridLines: boolean = true,
    data?: number[][] | number[][][]
  ) {
    this.rows = rows;
    this.cols = cols;
    this.cellSize = cellSize;
    this.strokeWidth = strokeWidth;
    this.data = data || [];

    if (!IsGridLines) {
      this.strokeColor = "transparent";
      this.strokeWidth = 0;
    }

    this.grids = this.generateGrids();
  }

  // Generate initial grids
  private generateGrids(): Grid[] {
    const grids = [];
    if (this.data.length === 0) {
      for (let i = 0; i < this.rows * this.cols; i++) {
        grids.push({
          id: i.toString(),
          x: (i % this.cols) * this.cellSize,
          y: Math.floor(i / this.cols) * this.cellSize,
          rotation: Math.random() * 180,
          fillColor: this.fillColor,
          strokeColor: this.strokeColor,
          strokeWidth: this.strokeWidth,
          text: "",
          value: [0, 0, 0],
        });
      }
      this.data = grids.map((g) => g.value);
    } else {
      for (let i = 0; i < this.rows * this.cols; i++) {
        const value =
          this.data[i % this.data.length][Math.floor(i / this.cols)];
        grids.push({
          id: i.toString(),
          x: (i % this.cols) * this.cellSize,
          y: Math.floor(i / this.cols) * this.cellSize,
          rotation: Math.random() * 180,
          fillColor: this.fillColor,
          strokeColor: this.strokeColor,
          strokeWidth: this.strokeWidth,
          value,
          text: value.toString(),
        });
      }
    }

    return grids;
  }

  // Get grids
  public getGrids(): Grid[] {
    return this.grids;
  }

  // Set grids
  public setGrids(grids: Grid[]): void {
    this.grids = grids;
  }

  // public reset grids
  public resetGrids(): Grid[] {
    // reset to initial values
    this.grids = this.generateGrids();
    return this.grids;

  }

  // Get grid by position (x, y)
  public getGridByPosition(x: number, y: number): Grid | undefined {
    const row = Math.floor(y / this.cellSize);
    const col = Math.floor(x / this.cellSize);
    const gridId = row * this.cols + col;
    return this.grids.find((g) => g.id === gridId.toString());
  }

  // Handle grid click
  public gridOnclick(grid: Grid): Grid[] {
    const updatedGrids = this.grids.map((g) =>
      g.id === grid.id
        ? { ...g, fillColor: g.fillColor === "white" ? "red" : "white" }
        : g
    );
    this.grids = updatedGrids;
    return updatedGrids;
  }

  // Draw image onto each grid
  public drawImageToGrids(image: HTMLImageElement) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (ctx) {
      canvas.width = this.cols * this.cellSize;
      canvas.height = this.rows * this.cellSize;

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      this.grids.forEach((grid, index) => {
        const row = Math.floor(index / this.cols);
        const col = index % this.cols;

        const pixelIndex =
          (row * this.cellSize * canvas.width + col * this.cellSize) * 4;

        const r = pixels[pixelIndex];
        const g = pixels[pixelIndex + 1];
        const b = pixels[pixelIndex + 2];
        const grayscale = Math.round((r + g + b) / 3);

        // Assign either RGB or grayscale value to the grid
        grid.value = [r, g, b]; // RGB
        // grid.value = grayscale; // Uncomment if you prefer grayscale

        grid.fillColor = `rgb(${r}, ${g}, ${b})`; // Update grid color
      });

      this.grids = [...this.grids];
    }
  }

  // Update grid by its position (x, y)
  public updateGridByPosition(
    x: number,
    y: number,
    newProperties: Partial<Grid>
  ): Grid[] {
    const currentGrids = this.getGridByPosition(x, y);
    const gridId = currentGrids?.id;

    this.grids = this.grids.map((grid) =>
      grid.id === gridId?.toString() ? { ...grid, ...newProperties } : grid
    );

    return this.grids;
  }

  // Update grid by its ID
  public updateGridById(gridId: string, newProperties: Partial<Grid>): Grid[] {
    this.grids = this.grids.map((grid) =>
      grid.id === gridId ? { ...grid, ...newProperties } : grid
    );
    return this.grids;
  }

  /**
   * Renders the grids onto the canvas context with precise text positioning.
   *
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   */
  public renderGrid(ctx: CanvasRenderingContext2D): void {
    this.grids.forEach((grid) => {
      // Draw the cell
      ctx.fillStyle = grid.fillColor || "white";
      ctx.strokeStyle = grid.strokeColor || "grey";
      ctx.lineWidth = grid.strokeWidth || 0.5;
      ctx.fillRect(grid.x, grid.y, this.cellSize, this.cellSize);
      ctx.strokeRect(grid.x, grid.y, this.cellSize, this.cellSize);

      // Draw the text
      if (grid.text) {
        ctx.font = grid.font || "normal 12px sans-serif";
        ctx.fillStyle = grid.textColor || "black";

        // Set text alignment to center both horizontally and vertically
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Calculate the center position of the cell
        const centerX = grid.x + this.cellSize / 2;
        const centerY = grid.y + this.cellSize / 2;

        // Render the text at the center of the cell
        ctx.fillText(grid.text, centerX, centerY);
      }
    });
  }

  // Get the value of a grid by position
  public getValueByPosition(
    x: number,
    y: number
  ): number | number[] | undefined {
    const grid = this.getGridByPosition(x, y);
    return grid?.value;
  }

  // Update the value of a grid by position
  public updateValueByPosition(
    x: number,
    y: number,
    newValue: number | number[]
  ): Grid[] {
    const grid = this.getGridByPosition(x, y);
    const gridId = grid?.id;

    this.grids = this.grids.map((g) =>
      g.id === gridId ? { ...g, value: newValue } : g
    );

    return this.grids;
  }

  // Get the value of a grid by its ID
  public getValueById(gridId: string): number | number[] | undefined {
    const grid = this.grids.find((g) => g.id === gridId);
    return grid?.value;
  }

  // Update the value of a grid by its ID
  public updateValueById(gridId: string, newValue: number | number[]): Grid[] {
    this.grids = this.grids.map((g) =>
      g.id === gridId ? { ...g, value: newValue } : g
    );
    return this.grids;
  }
}

export default GridManager;
