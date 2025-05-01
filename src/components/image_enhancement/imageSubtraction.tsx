"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@heroui/react";
const imageSets = {
  scanFix: {
    label: "Document Scan Fix",
    images: ["/subtract1_1.jpg", "/subtract1_2.jpg"],
  },
  findImposter: {
    label: "Who moved?  Find the imposter!",
    images: ["/subtract2_1.jpg", "/subtract2_2.jpg"],
  },
};

export default function ImageComparisonSection() {
  const [selectedKey, setSelectedKey] =
    useState<keyof typeof imageSets>("scanFix");
  const [offset, setOffset] = useState(128);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const selected = imageSets[selectedKey];
  const [imageDataA, setImageDataA] = useState<ImageData | null>(null);
  const [imageDataB, setImageDataB] = useState<ImageData | null>(null);

  useEffect(() => {
    setImageDataA(null);
    setImageDataB(null);
    setOffset(128); // Reset offset on image set change
  }, [selectedKey]);

  useEffect(() => {
    if (imageDataA && imageDataB && canvasRef.current) {
      const width = imageDataA.width;
      const height = imageDataA.height;
      const result = new ImageData(width, height);

      for (let i = 0; i < imageDataA.data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
          result.data[i + j] = Math.min(
            255,
            Math.max(
              0,
              imageDataA.data[i + j] + offset - imageDataB.data[i + j]
            )
          );
        }
        result.data[i + 3] = 255;
      }

      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.putImageData(result, 0, 0);
      }
    }
  }, [imageDataA, imageDataB, offset]);

  const handleImageLoad = (
    e: React.SyntheticEvent<HTMLImageElement>,
    which: "A" | "B"
  ) => {
    const img = e.currentTarget;
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      if (which === "A") setImageDataA(data);
      else setImageDataB(data);
    }

    if (canvasRef.current) {
      canvasRef.current.width = img.naturalWidth;
      canvasRef.current.height = img.naturalHeight;
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 px-4">
      {/* Image Set Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        {Object.entries(imageSets).map(([key, value]) => (
          <Button
            key={key}
            onClick={() => setSelectedKey(key as keyof typeof imageSets)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${
              selectedKey === key
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
            }`}
          >
            {value.label}
          </Button>
        ))}
      </div>

      {/* Horizontal A + offset - B = Result layout */}
      <div className="flex items-center justify-center flex-wrap gap-4 overflow-x-auto w-full">
        {/* Image A */}
        <div className="flex flex-col items-center">
          <img
            src={selected.images[0]}
            alt="Image A"
            onLoad={(e) => handleImageLoad(e, "A")}
            className="rounded-lg shadow-md max-w-[200px] border"
          />
          <span className="mt-2 font-medium text-sm">Image A</span>
        </div>

        <span className="text-3xl font-bold text-gray-700">+</span>

        {/* Offset display */}
        <div className="flex flex-col items-center px-4 py-2 border rounded-lg bg-gray-100 shadow-sm min-w-[80px]">
          <span className="text-sm font-medium text-gray-600">Offset</span>
          <span className="text-xl font-bold text-blue-600">{offset}</span>
        </div>

        <span className="text-3xl font-bold text-gray-700">−</span>

        {/* Image B */}
        <div className="flex flex-col items-center">
          <img
            src={selected.images[1]}
            alt="Image B"
            onLoad={(e) => handleImageLoad(e, "B")}
            className="rounded-lg shadow-md max-w-[200px] border"
          />
          <span className="mt-2 font-medium text-sm">Image B</span>
        </div>

        <span className="text-3xl font-bold text-gray-700">=</span>

        {/* Result Canvas */}
        <div className="flex flex-col items-center">
          <canvas
            ref={canvasRef}
            className="border rounded shadow-md max-w-[200px]"
          />
          <span className="mt-2 font-medium text-sm">Result</span>
        </div>
      </div>

      {/* Offset slider */}
      <div className="w-full max-w-md">
        <label className="block text-center font-semibold mb-2">
          Adjust Offset: <span className="text-blue-600">{offset}</span>
        </label>
        <input
          type="range"
          min={0}
          max={255}
          value={offset}
          onChange={(e) => setOffset(parseInt(e.target.value))}
          className="w-full accent-blue-600"
        />
      </div>
    </div>
  );
}
