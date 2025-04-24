"use client";

import { useState, useEffect, useRef } from "react";
import { GrayScaleTypes } from "./types";
import { Button } from "@heroui/react";

interface GrayScaleSelector {
    grayscale: GrayScaleTypes[];
    selectedGray: string;
    onGrayChange: (grayKey: string) => void;
    grayData?: GrayScaleTypes;
}

export default function GrayscaleTransformPage(
    { grayscale, selectedGray, onGrayChange, grayData }: GrayScaleSelector
) {
  const [transformType, setTransformType] = useState("linear");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const image = new Image();
    image.src = "/people.jpg";
    image.onload = () => applyTransformation(image);
  }, [transformType]);
  useEffect(() => {
    const image = new Image();
    image.src = "/people.jpg";
    image.onload = () => applyTransformation(image);
  }, []);

  const applyTransformation = (image: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element is not available.");
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get 2D context.");
      return;
    }

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      let gray = 0.299 * r + 0.587 * g + 0.114 * b;
//methods
      switch (transformType) {
        case "linear":
          // Identity / linear transformation, do nothing
          break;
        case "log":
          gray = 255 * Math.log(1 + gray) / Math.log(256);
          break;
        case "power":
          const gamma = 0.5; // adjust gamma value as needed
          gray = 255 * Math.pow(gray / 255, gamma);
          break;
      }

      data[i] = data[i + 1] = data[i + 2] = gray;
    }

    ctx.putImageData(imgData, 0, 0);
  };

  return (
    // <div className="p-4 space-y-4">
    //   <h1 className="text-xl font-bold">Grayscale Transformation</h1>

    //   <select
    //     className="border p-2 rounded"
    //     value={transformType}
    //     onChange={(e) => setTransformType(e.target.value)}
    //   >
    //     <option value="linear">Linear (Identity)</option>
    //     <option value="log">Logarithmic</option>
    //     <option value="power">Power-Law (Gamma)</option>
    //   </select>

    //   <canvas ref={canvasRef} className="border shadow rounded" />
    // </div>
    <section className="mb-8 bg-white rounded-lg shadow-sm p-6">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Select Algorithm
    </h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {grayscale.map((gray) => (
            <Button
                key={gray.key}
                onClick={() => onGrayChange(gray.key)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${selectedGray === gray.key
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
                    }`}
            >
                {gray.label}
            </Button>
        ))}
    </div>
    {grayData && (
        <div className="mt-6 bg-gray-50 p-4 rounded-md">
            <p className="text-gray-600 text-sm">{grayData.description}</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">    
            </div>
        </div>
    )}
</section>

    );
    }