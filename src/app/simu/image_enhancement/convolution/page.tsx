"use client";
import ImageCanvas from "@/components/image_convolution/ImageCanvas";
import ImageCanvasResult from "@/components/image_convolution/ImageCanvasResult";
import { Link } from "@nextui-org/link";
import { FaInfoCircle } from "react-icons/fa";
import { IoCaretBack } from "react-icons/io5";
import React, { useState, useEffect } from "react";


function ConvolutionPage() {
  const [kernel, setKernel] = useState<number[][]>([
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ]);
  const [gridSize, setGridSize] = useState(3); // Default kernel size is 3x3

  const handleGridSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(2, Math.min(5, Number(event.target.value))); // Ensures the value is between 2 and 5
    setGridSize(value);
  };

  // Update the kernel matrix based on grid size
  useEffect(() => {
    const newKernel = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => 0)
    );
    // Optionally, set the center to 1 (for the default behavior)
    if (gridSize % 2 !== 0) {
      newKernel[Math.floor(gridSize / 2)][Math.floor(gridSize / 2)] = 1;
    }
    setKernel(newKernel);
  }, [gridSize]);

  const handleInputChange = (
    row: number,
    col: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newKernel = [...kernel]; // Create a copy of the current kernel state
    newKernel[row][col] = Number(event.target.value); // Update the specific value
    setKernel(newKernel); // Set the updated kernel matrix
  };

  return (
    <>
      {/* Header section */}
      <div className="p-2 bg-white shadow-md rounded-md mb-4 flex justify-between items-center " >
        <div className="flex flex-row gap-2 items-center test-tour">
          <Link href={"/"}>
            <IoCaretBack size={30} className="text-gray-800" />
          </Link>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <FaInfoCircle
            size={25}
            className="hover:scale-110 duration-300 text-blue-900 cursor-pointer"
          />
          <h1 className="font-semibold text-2xl uppercase text-blue-900">
            Image Convolution
          </h1>
        </div>
      </div >

      {/* Image and Grid Canvas */}
      <div className="shadow-md rounded-md bg-white  min-h-svh w-100 m-auto " >
        <div className="p-2 px-4 flex flex-row justify-between">
          <div>
            <ImageCanvas kernel={kernel} />
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="p-4">
              {/* Input to adjust the grid size */}
              <label className="block text-lg mb-2">Kernel Size</label>
              <input
                type="number"
                min={2}
                max={5}
                value={gridSize}
                onChange={handleGridSizeChange}
                className="p-2 bg-white rounded-md text-center border-1 shadow-md"
              />
            </div>
            <div
              className="p-2 grid "
              style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
            >
              {/* Map over each row and column to render the kernel matrix */}
              {kernel.map((row, rowIndex) =>
                row.map((value, colIndex) => (
                  <input
                    key={`${rowIndex}-${colIndex}`}
                    type="number"
                    value={value}
                    step={0.1}
                    onChange={(e) => handleInputChange(rowIndex, colIndex, e)}
                    className="p-2 bg-white rounded-md text-center border-1 shadow-md w-12 h-12"
                  />
                ))
              )}
            </div>
          </div>
          <div>
            <ImageCanvasResult kernel={kernel} />
          </div>
        </div>
      </div >
    </>
  );
}

export default ConvolutionPage;
