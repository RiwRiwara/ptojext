"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@heroui/react";

export default function HistogramProcessingSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<"original" | "equalized">("original");

  const applyHistogramProcessing = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imgData.data;

    if (mode === "equalized") {
      const gray = new Array(img.width * img.height);

      for (let i = 0, j = 0; i < data.length; i += 4, j++) {
        gray[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      }

      const hist = new Array(256).fill(0);
      gray.forEach(value => hist[Math.floor(value)]++);

      const cdf = hist.map((_, i) =>
        hist.slice(0, i + 1).reduce((sum, v) => sum + v, 0)
      );
      const cdfMin = cdf.find(c => c > 0) ?? 0;
      const totalPixels = gray.length;

      const equalized = gray.map(value => {
        const val = Math.floor(value);
        return Math.round(
          ((cdf[val] - cdfMin) / (totalPixels - cdfMin)) * 255
        );
      });

      for (let i = 0, j = 0; i < data.length; i += 4, j++) {
        const eq = equalized[j];
        data[i] = data[i + 1] = data[i + 2] = eq;
      }

      ctx.putImageData(imgData, 0, 0);
    }
  }, [mode]);

  useEffect(() => {
    const img = new Image();
    img.src = "/mri.jpg";
    img.onload = () => applyHistogramProcessing(img);
  }, [applyHistogramProcessing]);

  return (
    <div className="container mx-auto flex flex-col gap-8 p-4 pt-8">
      <h1 className="text-2xl font-bold">
        Histogram Processing:{" "}
        <span className="text-indigo-600 capitalize">{mode}</span>
      </h1>

      {/* ── canvas image ─ */}
      <canvas
        ref={canvasRef}
        className="mx-auto border rounded shadow max-w-full"
      />

      {/* ── button selector ─ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <Button
          onClick={() => setMode("original")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition ${
            mode === "original"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
          }`}
        >
          Original
        </Button>
        <Button
          onClick={() => setMode("equalized")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition ${
            mode === "equalized"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
          }`}
        >
          Equalized
        </Button>
      </div>

      {/* ── explanation box ─ */}
      <div className="bg-gray-50 p-6 rounded-md space-y-4 shadow-sm text-sm text-gray-700">
        {mode === "original" ? (
          <p>Original image without histogram modification.</p>
        ) : (
          <>
            <p>Histogram Equalization enhances contrast by redistributing pixel intensities.</p>
            <code className="block bg-gray-100 text-gray-800 font-mono p-3 rounded border">
              S = (CDF(r) - CDF<sub>min</sub>) / (N - CDF<sub>min</sub>) × 255
            </code>
          </>
        )}
      </div>
    </div>
  );
}
