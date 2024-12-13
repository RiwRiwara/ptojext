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

  fillColor = "white";
  strokeColor = "grey";
  strokeWidth = 0.5;

  constructor(rows: number, cols: number, cellSize: number) {
    this.rows = rows;
    this.cols = cols;
    this.cellSize = cellSize;
    this.grids = this.generateGrids();
  }

  // Generate initial grids
  private generateGrids(): {
    id: string;
    x: number;
    y: number;
    rotation: number;
    isDragging: boolean;
  }[] {
    const grids = [];
    for (let i = 0; i < this.rows * this.cols; i++) {
      grids.push({
        id: i.toString(),
        x: (i % this.cols) * this.cellSize,
        y: Math.floor(i / this.cols) * this.cellSize,
        rotation: Math.random() * 180,
        isDragging: false,
        fillColor: this.fillColor,
        strokeColor: this.strokeColor,
        strokeWidth: this.strokeWidth,
      } as Grid);
    }
    return grids;
  }

  // Get grids
  public getGrids(): {
    id: string;
    x: number;
    y: number;
    rotation: number;
    isDragging: boolean;
  }[] {
    return this.grids;
  }

  public gridOnclick(grid: Grid): Grid[] {
    // Toggle the grid's color
    const updatedGrids = this.grids.map((g) =>
      g.id === grid.id
        ? { ...g, fillColor: g.fillColor === "white" ? "red" : "white" }
        : g
    );
    this.grids = updatedGrids;
    return updatedGrids;
  }
}

export default GridManager;
