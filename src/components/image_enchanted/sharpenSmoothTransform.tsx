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
    param: { label: "Kernel Size", min: 1, max: 500, step: 2, default: 3 }
  }
];

export default function SharpenSmoothTransformSection() {
  const [selected, setSelected] = useState("sharpen");
  const [param, setParam] = useState(1.0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const kernels: Record<string, { kernel: number[][] }> = {
    sharpen: {
      kernel: [
        [ 0, -1,  0],
        [-1,  5, -1],
        [ 0, -1,  0]
      ]
    },
    smooth: {
      kernel: [
        [1/9, 1/9, 1/9],
        [1/9, 1/9, 1/9],
        [1/9, 1/9, 1/9]
      ]
    }
  };
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
    

  const applyTransform = useCallback((img: HTMLImageElement) => {
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
      // Apply blur first
      const blurred = applyConvolution(data, img.width, img.height, kernels.smooth.kernel);
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
    }
  
    else if (selected === "smooth") {
      const output = applyConvolution(data, img.width, img.height, kernels.smooth.kernel);
      for (let i = 0; i < data.length; i++) data[i] = output[i];
    }
  
    ctx.putImageData(imgData, 0, 0);
  }, [selected, param]);
  

  useEffect(() => {
    const img = new Image();
    img.src = "/people.jpg";
    img.onload = () => applyTransform(img);
  }, [applyTransform]);

  const meta = methods.find(m => m.key === selected)!;

  return (
    <section className="mt-10 container mx-auto p-4 space-y-6">
      <h2 className="text-xl font-bold">Sharpening & Smoothing</h2>

      <div className="flex gap-4 flex-wrap">
        {methods.map(m => (
          <button
            key={m.key}
            className={`px-4 py-2 rounded ${
              selected === m.key ? "bg-blue-600 text-white" : "bg-gray-200"
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

      <div className="bg-gray-100 p-4 rounded shadow">
        <p>{meta.description}</p>
        <code className="block bg-white p-2 mt-2 rounded text-blue-700">
          {meta.formula.replace(
            meta.param.label,
            `${meta.param.label}=${param.toFixed(2)}`
          )}
        </code>
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
      </div>

      <canvas ref={canvasRef} className="rounded border shadow max-w-full" />
    </section>
  );
}
