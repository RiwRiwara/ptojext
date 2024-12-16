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
 * @param {string} fillColor - The fill color of the grid.
 * @param {string} strokeColor - The stroke color of the grid.
 * @param {number} strokeWidth - The stroke width of the grid.
 * @param {string} text - The text to be displayed on the grid.
 * @param {string} font - The font of the text.
 * @param {string} textColor - The color of the text.
 * @returns {Grid} An object representing a grid.
 *
 * @example
 * const grid = {
 *   id: "1",
 *   x: 100,
 *   y: 200,
 *   rotation: 45,
 * };
 */

type Grid = {
  id: string;
  x: number;
  y: number;
  rotation: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  text?: string;
  font?: string;
  textColor?: string;
  value?: number | number[]; 
};
