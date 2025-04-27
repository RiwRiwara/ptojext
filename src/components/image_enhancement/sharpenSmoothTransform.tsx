"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const methods = [
  {
    key: "sharpen",
    label: "Sharpen",
    description: "Enhances edges by emphasizing pixel intensity differences.",
    formula: `G = I + α(I - blurred(I))`,
    param: { label: "α", min: 0.1, max: 10.0, step: 0.1, default: 1.0 }
  },
  {
    key: "smooth",
    label: "Smooth",
    description: "Reduces noise by averaging nearby pixel values.",
    formula: `G = 1/9 Σ I(x,y)`,
    param: { label: "Kernel Size", min: 1, max: 10, step: 1, default: 3 }
  }
];

export default function SharpenSmoothTransformSection() {
  const [selected, setSelected] = useState("sharpen");
  const [param, setParam] = useState(1.0);
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
        let r = 0, g = 0, b = 0;

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
        output[i + 3] = data[i + 3]; // copy alpha
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
          output[i + 3] = data[i + 3]; // copy alpha
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
    img.src = "/people.jpg";
    img.onload = () => applyTransform(img);
  }, [applyTransform]);

  const meta = methods.find(m => m.key === selected)!;

  return (
    <section className="mt-10 container mx-auto p-4 space-y-6">
      <h2 className="text-xl font-bold">Sharpening & Smoothing</h2>
      <canvas ref={canvasRef} className="mx-auto border rounded shadow max-w-full"
      />
      <div className="flex gap-4 flex-wrap">
        {methods.map(m => (
          <button
            key={m.key}
            className={`px-4 py-2 rounded transition ${
              selected === m.key
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-blue-100"
            }`}
            onClick={() => {
              setSelected(m.key);
              setParam(m.param.default);
            }}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="bg-gray-100 p-4 rounded shadow space-y-4">
        <p className="text-gray-700">{meta.description}</p>
        <label className="block mt-4 font-medium">
          {meta.param.label}: {param.toFixed(2)}
        </label>
        <input
          type="range"
          className="w-full"
          min={meta.param.min}
          max={meta.param.max}
          step={meta.param.step}
          value={param}
          onChange={e => setParam(parseFloat(e.target.value))}
        />
        {/* Visual Explanation */}
        <div className="bg-white p-4 rounded shadow-inner">
          {selected === "sharpen" ? (
            <div className="text-sm space-y-2">
              <div className="font-mono text-blue-700">
                G = I + α (I - blurred(I))
              </div>
              <div className="text-gray-600">
                α ={" "}
                <span className="font-semibold">{param.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500 italic">
                Sharpening emphasizes edges by subtracting a blurred version from the original image and amplifying the difference using α.
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-gray-700">
                Averaging Kernel (size: {param}×{param}):
              </div>
              {renderKernelMatrix(generateBoxKernel(param as number))}
            </div>
          )}
        </div>

       
      </div>
    </section>
  );
}
