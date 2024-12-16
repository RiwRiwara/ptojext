"use client";
import React, { useRef, useEffect } from "react";

interface OutputImageComponentProps {
  hoveredPosition: { x: number; y: number };
  kernel: number[][];
}

const OutputImageComponent: React.FC<OutputImageComponentProps> = ({
  hoveredPosition,
  kernel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const applyConvolution = (
    imgData: ImageData,
    kernel: number[][]
  ): ImageData => {
    const { width, height, data } = imgData;
    const kernelSize = kernel.length;
    const half = Math.floor(kernelSize / 2);
    const outputData = new Uint8ClampedArray(data);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const offset = (y * width + x) * 4;

        // Initialize RGB values
        let r = 0,
          g = 0,
          b = 0;

        // Apply the kernel
        for (let ky = -half; ky <= half; ky++) {
          for (let kx = -half; kx <= half; kx++) {
            const pixelX = Math.min(Math.max(x + kx, 0), width - 1);
            const pixelY = Math.min(Math.max(y + ky, 0), height - 1);
            const pixelOffset = (pixelY * width + pixelX) * 4;
            const weight = kernel[ky + half]?.[kx + half] || 0;

            r += data[pixelOffset] * weight;
            g += data[pixelOffset + 1] * weight;
            b += data[pixelOffset + 2] * weight;
          }
        }

        // Write the convolved pixel back
        outputData[offset] = Math.min(Math.max(r, 0), 255);
        outputData[offset + 1] = Math.min(Math.max(g, 0), 255);
        outputData[offset + 2] = Math.min(Math.max(b, 0), 255);
        outputData[offset + 3] = data[offset + 3]; // Preserve alpha
      }
    }

    return new ImageData(outputData, width, height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src =
      "https://images.ctfassets.net/hrltx12pl8hq/7JnR6tVVwDyUM8Cbci3GtJ/bf74366cff2ba271471725d0b0ef418c/shutterstock_376532611-og.jpg";

    img.onload = () => {
      const targetWidth = 400;
      const targetHeight = 400;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const scale = Math.max(
        targetWidth / img.width,
        targetHeight / img.height
      );
      const x_i = (targetWidth - img.width * scale) / 2;
      const y_i = (targetHeight - img.height * scale) / 2;

      ctx.clearRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        x_i,
        y_i,
        img.width * scale,
        img.height * scale
      );

      const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
      const convolvedData = applyConvolution(imgData, kernel);
      ctx.putImageData(convolvedData, 0, 0);

      const { x, y } = hoveredPosition;
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 1, y - 1, 3, 3);
    };
  }, [hoveredPosition, kernel]); 

  return (
    <canvas
      ref={canvasRef}
      id="outputCanvas"
      style={{ border: "1px solid black" }}
    />
  );
};

export default OutputImageComponent;
