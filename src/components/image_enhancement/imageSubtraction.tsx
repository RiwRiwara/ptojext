"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Slider } from "@heroui/react";
import Image from "next/image";
import UploadImage from "@/components/image_enhancement/enhanceImageUpload";
import { FiUpload } from "react-icons/fi";

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
  const [mode, setMode] = useState<"default" | "upload">("default");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const selected = imageSets[selectedKey];
  const [imageDataA, setImageDataA] = useState<ImageData | null>(null);
  const [imageDataB, setImageDataB] = useState<ImageData | null>(null);

  useEffect(() => {
    setImageDataA(null);
    setImageDataB(null);
    setOffset(128);
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
      if (ctx) ctx.putImageData(result, 0, 0);
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

  const handleUpload = (src: string, index: number) => {
    setUploadedImages((prev) => {
      const updated = [...prev];
      updated[index] = src;
      return updated;
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="flex justify-start w-full max-w-6xl">
        {mode === "default" ? (
          <Button
            color="primary"
            variant="solid"
            onPress={() => {
              setMode("upload");
              setUploadedImages([]);
              setImageDataA(null);
              setImageDataB(null);
            }}
            startContent={<FiUpload />}
          >
            Upload your own images
          </Button>
        ) : (
          <Button
            color="primary"
            variant="bordered"
            onPress={() => {
              setMode("default");
              setUploadedImages([]);
              setImageDataA(null);
              setImageDataB(null);
            }}
            startContent={<FiUpload />}
          >
            Back to preset images
          </Button>
        )}
      </div>

      {mode === "upload" && uploadedImages.length < 2 ? (
        <div className="flex gap-8 flex-wrap justify-center items-start">
          {[0, 1].map((index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <UploadImage
                title={`Upload Image ${index === 0 ? "A" : "B"}`}
                onImageUpload={(src) => handleUpload(src, index)}
              />
              {uploadedImages[index] && (
                <Image
                  src={uploadedImages[index]}
                  alt={`Image ${index === 0 ? "A" : "B"}`}
                  width={200}
                  height={200}
                  onLoad={(e) => handleImageLoad(e, index === 0 ? "A" : "B")}
                  className="rounded-lg border shadow"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <>
          {mode === "default" && (
            <div className="flex flex-wrap justify-center gap-4">
              {Object.entries(imageSets).map(([key, value]) => (
                <Button
                  key={key}
                  onPress={() => setSelectedKey(key as keyof typeof imageSets)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                    selectedKey === key
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-primary hover:text-white"
                  }`}
                >
                  {value.label}
                </Button>
              ))}
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center justify-center flex-wrap gap-4 overflow-x-auto w-full">
            <div className="flex flex-col items-center">
              <Image
                src={mode === "upload" ? uploadedImages[0] : selected.images[0]}
                alt="Image A"
                onLoad={(e) => handleImageLoad(e, "A")}
                className="rounded-lg shadow-md max-w-[200px] border"
                width={200}
                height={200}
              />
              <span className="mt-2 font-medium text-sm">Image A</span>
            </div>

            <span className="text-3xl font-bold text-gray-700">+</span>

            <div className="flex flex-col items-center px-4 py-2 border rounded-lg bg-gray-100 shadow-sm min-w-[80px]">
              <span className="text-sm font-medium text-gray-600">Offset</span>
              <span className="text-xl font-bold text-purple-600">
                {offset}
              </span>
            </div>

            <span className="text-3xl font-bold text-gray-700">−</span>

            <div className="flex flex-col items-center">
              <Image
                src={mode === "upload" ? uploadedImages[1] : selected.images[1]}
                alt="Image B"
                onLoad={(e) => handleImageLoad(e, "B")}
                className="rounded-lg shadow-md max-w-[200px] border"
                width={200}
                height={200}
              />
              <span className="mt-2 font-medium text-sm">Image B</span>
            </div>

            <span className="text-3xl font-bold text-gray-700">=</span>

            <div className="flex flex-col items-center">
              <canvas
                ref={canvasRef}
                className="border rounded shadow-md max-w-[200px]"
              />
              <span className="mt-2 font-medium text-sm">Result</span>
            </div>
          </div>

          <div className="w-full max-w-xl">
            <label className="block text-center font-semibold mb-2">
              Adjust Offset: <span className="text-purple-600">{offset}</span>
            </label>
            <Slider
              size="sm"
              step={1}
              minValue={0}
              maxValue={255}
              defaultValue={offset}
              value={offset}
              onChange={(value) => setOffset(Number(value))}
              className="w-full"
              color="primary"
              showSteps={true}
              marks={[
                { value: 0, label: "0" },
                { value: 255, label: "255" },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}
