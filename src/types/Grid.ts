/**
 * This type defines the structure of a grid object.
 *
 * @type Grid
 * @author [Awirut Phusaensaart](https://github.com/RiwRiwara)
 * @version 1.0.0
 * @date 2024-12-13
 *
 * @param {string} id - The unique identifier of the grid.
 * @param {number} x - The x-coordinate of the grid.
 * @param {number} y - The y-coordinate of the grid.
 * @param {number} rotation - The rotation angle of the grid.
 * @param {boolean} isDragging - A flag indicating whether the grid is being dragged.
 * @returns {Grid} An object representing a grid.
 *
 * @example
 * const grid = {
 *   id: "1",
 *   x: 100,
 *   y: 200,
 *   rotation: 45,
 *   isDragging: true,
 * };
 */

type Grid = {
  id: string;
  x: number;
  y: number;
  rotation: number;
  isDragging: boolean;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
};
