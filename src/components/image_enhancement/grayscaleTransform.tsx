"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Button } from "@heroui/react";
import { GrayScaleTypes } from "@/components/image_enhancement/types";

type GrayKey = "linear" | "log" | "power-law";

const grayscaleTypes: GrayScaleTypes[] = [
  {
    key: "linear",
    label: "Linear (Identity)",
    description: "Keeps pixel intensity unchanged.",
    formula: "G = 0.299R + 0.587G + 0.114B",
  },
  {
    key: "log",
    label: "Logarithmic",
    description: "Expands dark tones, compresses highlights.",
    param: { label: "c", min: 10, max: 200, step: 1, default: 70 },
    formula: "G = c · log(1 + I)",
  },
  {
    key: "power-law",
    label: "Power‑Law (Gamma)",
    description: "Classic gamma correction for displays.",
    param: { label: "γ", min: 0.05, max: 3, step: 0.05, default: 0.5 },
    formula: "G = 255 · (I / 255)^γ",
  },
];

export default function GrayscaleTransformSection() {
  const [selected, setSelected] = useState<GrayKey>("linear");
  const [param, setParam] = useState<number | undefined>(
    grayscaleTypes.find((g) => g.key === selected)?.param?.default
  );

  useEffect(() => {
    setParam(grayscaleTypes.find((t) => t.key === selected)?.param?.default);
  }, [selected]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
        let gray = 0.299 * r + 0.587 * g + 0.114 * b;

        switch (selected) {
          case "log": {
            const c = param ?? 10;
            gray = (c * Math.log1p(gray)) / Math.log(256);
            gray = Math.min(255, gray);
            break;
          }
          case "power-law": {
            const gamma = param ?? 0.5;
            gray = 255 * Math.pow(gray / 255, gamma);
            break;
          }
        }

        data[i] = data[i + 1] = data[i + 2] = gray;
      }

      ctx.putImageData(imgData, 0, 0);
    },
    [selected, param]
  );

  useEffect(() => {
    const img = new Image();
    img.src = "/mri.jpg";
    img.onload = () => applyTransform(img);
  }, [applyTransform]);

  const meta = grayscaleTypes.find((t) => t.key === selected)!;

  return (
    <div className="container mx-auto flex flex-col gap-4 p-6">
      <h1 className="text-base md:text-xl font-semibold ml-1 md:ml-2">
        {meta.label}
      </h1>

      <div className="flex flex-col md:flex-row justify-center gap-6">
        <canvas
          ref={canvasRef}
          className="mx-auto border rounded-xl shadow max-w-full"
        />

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
            {grayscaleTypes.map((t) => (
              <Button
                key={t.key}
                onClick={() => setSelected(t.key)}
                className={`px-20 py-2 text-sm font-medium rounded-md transition ${
                  selected === t.key
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
                }`}
              >
                {t.label}
              </Button>
            ))}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg space-y-4 drop-shadow-sm">
            <p className="text-sm text-gray-700">{meta.description}</p>

            <code className="block bg-gray-100 text-gray-800 rounded-md p-3 border">
              {meta.param
                ? meta.formula.replace(
                    meta.param.label,
                    `${meta.param.label}`
                    // `${meta.param.label}=${(
                    //   param ?? meta.param.default
                    // ).toFixed(2)}`
                  )
                : meta.formula}
            </code>

            {meta.param && (
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  {meta.param.label}&nbsp;=&nbsp;
                  <span className="font-mono">{param?.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  className="w-full accent-indigo-600"
                  min={meta.param.min}
                  max={meta.param.max}
                  step={meta.param.step}
                  value={param}
                  onChange={(e) => setParam(parseFloat(e.target.value))}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
