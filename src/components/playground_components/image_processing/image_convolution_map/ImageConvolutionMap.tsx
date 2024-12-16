"use client";
import React from "react";
import CanvasGridRenderer from "./partials/CanvasGridRenderer";
import CanvasGridRendererAnimate from "./partials/CanvasGridRendererAnimate";

const convolutionData = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
];

export default function ImageConvolutionMap() {
  return (
    <div className="w-full flex justify-center max-w-[1000px] mx-auto flex-col gap-6 p-4">
      {/* Section 1 */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        <div className="max-w-[500px] flex flex-row gap-10 justify-center">
          <CanvasGridRenderer
            rows={160}
            cols={120}
            cellSize={1}
            image="https://firstdraw.blob.core.windows.net/cardimgs/67748760.jpg"
            isGridLine={false}
          />
        </div>
        <div>
          <h1 className="text-2xl font-semibold mb-2">
            What Image Convolution
          </h1>
          <p className="text-lg">
            Image convolution is a mathematical operation that is used to
            manipulate images by applying a mathematical kernel to each pixel of
            the image. It is a fundamental operation in image processing and
            computer vision.
          </p>
        </div>
      </div>
      {/* Section 1 */}

      {/* Section 2 */}
      <div>
        <p className="text-lg">
          Convolution of an image is the process of viewing an image as a matrix
          of pixels arranged in a row. For example, we might have 1s for black
          and 0s for white. Then we would use something called a filter (a
          yellow square, which is a 3x3 matrix of filter values) to convolution
          the image, and the result would be a red matrix.
        </p>
      </div>
      {/* Section 2 */}

      <div className="flex flex-row gap-6 items-center">
        <div>
          <CanvasGridRendererAnimate
            rows={10}
            cols={10}
            cellSize={30}
            data={Array(100).fill(0).map(() => Array(10).fill(
              Math.floor(Math.random() * 10)
            ))}
          />
        </div>
        <div>
          <CanvasGridRendererAnimate
            rows={convolutionData.length}
            cols={convolutionData[0].length}
            cellSize={30}
            data={convolutionData}
            isNotInteractive={true}
          />
        </div>
      </div>
    </div>
  );
}
