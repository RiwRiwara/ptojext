"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import UploadImage from "./enhanceImageUpload";
import { Button } from "@nextui-org/button";
import { FiUpload } from "react-icons/fi";
import { Slider } from "@nextui-org/slider";

const methods = [
  {
    key: "sharpen",
    label: "Sharpen",
    description: "Enhances edges by emphasizing pixel intensity differences.",
    formula: `G = I + \alpha (I - \text{blurred}(I))`,
    param: { label: "α", min: 0.1, max: 10.0, step: 0.1, default: 1.0 },
  },
  {
    key: "smooth",
    label: "Smooth",
    description: "Reduces noise by averaging nearby pixel values.",
    formula: `G = \frac{1}{9} \sum I(x, y)`,
    param: { label: "Kernel Size", min: 1, max: 10, step: 1, default: 3 },
  },
];

export default function SharpenSmoothTransformSection() {
  const [selected, setSelected] = useState("sharpen");
  const [param, setParam] = useState(1.0);
  const [mode, setMode] = useState<"default" | "upload">("default");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function generateBoxKernel(size: number): number[][] {
    const kernel = [];
    const value = 1 / (size * size);
    for (let i = 0; i < size; i++) {
      kernel.push(new Array(size).fill(value));
    }
    return kernel;
  }

  function renderKernelMatrix(kernel: number[][]) {
    return (
      <div className="inline-block border border-gray-400 rounded overflow-hidden">
        {kernel.map((row, i) => (
          <div key={i} className="flex">
            {row.map((val, j) => (
              <div
                key={j}
                className="w-12 h-12 flex items-center justify-center border border-gray-300 text-sm bg-white"
              >
                {val.toFixed(3)}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  function applyConvolution(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    kernel: number[][]
  ): Uint8ClampedArray {
    const output = new Uint8ClampedArray(data.length);
    const side = kernel.length;
    const half = Math.floor(side / 2);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0,
          g = 0,
          b = 0;

        for (let ky = 0; ky < side; ky++) {
          for (let kx = 0; kx < side; kx++) {
            const px = x + kx - half;
            const py = y + ky - half;

            if (px >= 0 && px < width && py >= 0 && py < height) {
              const offset = (py * width + px) * 4;
              const weight = kernel[ky][kx];
              r += data[offset] * weight;
              g += data[offset + 1] * weight;
              b += data[offset + 2] * weight;
            }
          }
        }

        const i = (y * width + x) * 4;
        output[i] = Math.min(Math.max(r, 0), 255);
        output[i + 1] = Math.min(Math.max(g, 0), 255);
        output[i + 2] = Math.min(Math.max(b, 0), 255);
        output[i + 3] = data[i + 3];
      }
    }

    return output;
  }

  const applyTransform = useCallback(
    (img: HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imgData.data;

      if (selected === "sharpen") {
        const blurred = applyConvolution(
          data,
          img.width,
          img.height,
          generateBoxKernel(3)
        );
        const output = new Uint8ClampedArray(data.length);
        const alpha = param;

        for (let i = 0; i < data.length; i += 4) {
          for (let j = 0; j < 3; j++) {
            const original = data[i + j];
            const blur = blurred[i + j];
            const value = original + alpha * (original - blur);
            output[i + j] = Math.min(Math.max(value, 0), 255);
          }
          output[i + 3] = data[i + 3];
        }

        for (let i = 0; i < data.length; i++) data[i] = output[i];
      } else if (selected === "smooth") {
        const kernel = generateBoxKernel(param as number);
        const output = applyConvolution(data, img.width, img.height, kernel);
        for (let i = 0; i < data.length; i++) data[i] = output[i];
      }

      ctx.putImageData(imgData, 0, 0);
    },
    [selected, param]
  );

  useEffect(() => {
    const img = new Image();
    img.src = uploadedImage || "/people.jpg";
    img.onload = () => applyTransform(img);
  }, [uploadedImage, applyTransform]);

  const meta = methods.find((m) => m.key === selected)!;

  return (
    <section className="flex flex-col gap-6 mx-auto p-6">
      <div className="flex items-center gap-3">
        {mode === "default" ? (
          <Button
            color="primary"
            variant="solid"
            onPress={() => {
              setMode("upload");
              setUploadedImage(null); // or setUploadedImageUrl(null)
            }}
            startContent={<FiUpload />}
          >
            Upload your image
          </Button>
        ) : (
          <Button
            color="primary"
            variant="bordered"
            onPress={() => {
              setMode("default");
              setUploadedImage(null); // or setUploadedImageUrl(null)
            }}
            startContent={<FiUpload />}
          >
            Back to default image
          </Button>
        )}
      </div>

      {mode === "upload" && !uploadedImage ? (
        <UploadImage
          title="Upload image for sharpen/smooth transform"
          onImageUpload={(src) => setUploadedImage(src)}
        />
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <h2 className="text-base md:text-xl font-semibold capitalize">
              {selected}
            </h2>
            <canvas
              ref={canvasRef}
              className="w-full rounded-xl drop-shadow-md mx-auto"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="w-full grid grid-cols-2 gap-4 mt-0 md:mt-10">
              {methods.map((m) => (
                <Button
                  key={m.key}
                  onPress={() => {
                    setSelected(m.key);
                    setParam(m.param.default);
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                    selected === m.key
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-primary hover:text-white"
                  }`}
                >
                  {m.label}
                </Button>
              ))}
            </div>

            <div className="w-full bg-gray-100 p-4 rounded-md shadow space-y-4">
              <p className="text-gray-700">{meta.description}</p>
              <label className="block mt-4 font-medium">
                {meta.param.label}: {param.toFixed(2)}
              </label>
              <Slider
                size="sm"
                step={meta.param.step}
                minValue={meta.param.min}
                maxValue={meta.param.max}
                defaultValue={param}
                value={param}
                onChange={(value) => setParam(Number(value))}
                className="w-full"
                color="primary"
                showSteps={meta.param.step >= 0.5}
                marks={[
                  { value: meta.param.min, label: meta.param.min.toString() },
                  { value: meta.param.max, label: meta.param.max.toString() },
                ]}
              />

              <div className="bg-white p-4 rounded shadow-inner">
                {selected === "sharpen" ? (
                  <div className="text-sm space-y-2 w-full text-center">
                    <BlockMath>{meta.formula}</BlockMath>
                    <div className="text-gray-600">
                      α ={" "}
                      <span className="font-semibold">{param.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-500 italic">
                      Sharpening emphasizes edges by subtracting a blurred
                      version from the original image and amplifying the
                      difference using α.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 flex flex-col items-center">
                    <div className="text-sm text-gray-700">
                      Averaging Kernel (size: {param}×{param}):
                    </div>
                    {renderKernelMatrix(generateBoxKernel(param as number))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
