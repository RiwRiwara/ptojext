"use client";
import { Button } from "@nextui-org/button"; // ensure this is imported

import { useEffect, useRef, useState, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  TooltipItem,
} from "chart.js";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

type TransformMode = "linear" | "gamma" | "log";

export default function HistogramProcessingSection() {
  const originalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const transformedCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const equalizedCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [originalHist, setOriginalHist] = useState<number[]>([]);
  const [transformedHist, setTransformedHist] = useState<number[]>([]);
  const [equalizedHist, setEqualizedHist] = useState<number[]>([]);
  const [mode, setMode] = useState<TransformMode>("linear");
  const [gammaValue, setGammaValue] = useState(1.0);
  const [logC, setLogC] = useState(30);
  const [grayOriginal, setGrayOriginal] = useState<number[]>([]);

  const processImage = useCallback((img: HTMLImageElement) => {
    if (
      !originalCanvasRef.current ||
      !transformedCanvasRef.current ||
      !equalizedCanvasRef.current
    )
      return;
    const origCtx = originalCanvasRef.current.getContext("2d");
    const transCtx = transformedCanvasRef.current.getContext("2d");
    const eqCtx = equalizedCanvasRef.current.getContext("2d");
    if (!origCtx || !transCtx || !eqCtx) return;

    originalCanvasRef.current.width =
      transformedCanvasRef.current.width =
      equalizedCanvasRef.current.width =
        img.width;
    originalCanvasRef.current.height =
      transformedCanvasRef.current.height =
      equalizedCanvasRef.current.height =
        img.height;

    origCtx.drawImage(img, 0, 0);
    transCtx.drawImage(img, 0, 0);
    eqCtx.drawImage(img, 0, 0);

    const imgData = origCtx.getImageData(0, 0, img.width, img.height);
    const data = imgData.data;

    const gray = new Array(img.width * img.height);

    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      gray[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }

    const hist = new Array(256).fill(0);
    gray.forEach((value) => hist[Math.floor(value)]++);
    setOriginalHist(hist);
    setGrayOriginal(gray);

    applyTransformation(gray);
    applyEqualization(gray);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyTransformation = useCallback(
    (gray: number[]) => {
      if (!transformedCanvasRef.current) return;
      const ctx = transformedCanvasRef.current.getContext("2d");
      if (!ctx) return;

      const width = transformedCanvasRef.current.width;
      const height = transformedCanvasRef.current.height;
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      const minGray = gray.reduce((a, b) => Math.min(a, b), Infinity);
      const maxGray = gray.reduce((a, b) => Math.max(a, b), -Infinity);

      const transformed = gray.map((val) => {
        switch (mode) {
          case "linear":
            return ((val - minGray) * 255) / (maxGray - minGray);
          case "gamma":
            return 255 * Math.pow(val / 255, gammaValue);
          case "log":
            return (logC * Math.log1p(val)) / Math.log(256);
          default:
            return val;
        }
      });

      for (let i = 0, j = 0; i < data.length; i += 4, j++) {
        const v = Math.min(255, Math.max(0, transformed[j]));
        data[i] = data[i + 1] = data[i + 2] = v;
      }

      ctx.putImageData(imgData, 0, 0);

      const hist = new Array(256).fill(0);
      transformed.forEach((v) => hist[Math.floor(v)]++);
      setTransformedHist(hist);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, gammaValue, logC]
  );

  const applyEqualization = useCallback((gray: number[]) => {
    if (!equalizedCanvasRef.current) return;
    const ctx = equalizedCanvasRef.current.getContext("2d");
    if (!ctx) return;

    const width = equalizedCanvasRef.current.width;
    const height = equalizedCanvasRef.current.height;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const hist = new Array(256).fill(0);
    gray.forEach((value) => hist[Math.floor(value)]++);

    const cdf = hist.map((_, i) =>
      hist.slice(0, i + 1).reduce((sum, v) => sum + v, 0)
    );
    const cdfMin = cdf.find((c) => c > 0) ?? 0;
    const totalPixels = gray.length;

    const equalized = gray.map((value) => {
      const val = Math.floor(value);
      return Math.round(((cdf[val] - cdfMin) / (totalPixels - cdfMin)) * 255);
    });

    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      const eq = Math.min(255, Math.max(0, equalized[j]));
      data[i] = data[i + 1] = data[i + 2] = eq;
    }

    ctx.putImageData(imgData, 0, 0);

    const eqHist = new Array(256).fill(0);
    equalized.forEach((v) => eqHist[Math.floor(v)]++);
    setEqualizedHist(eqHist);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = "/mri.jpg";
    img.onload = () => processImage(img);
  }, [processImage]);

  useEffect(() => {
    if (grayOriginal.length > 0) {
      applyTransformation(grayOriginal);
    }
  }, [mode, gammaValue, logC, grayOriginal, applyTransformation]);

  const histOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) => `Count: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Pixel Intensity (0-255)",
          color: "#4b5563",
          font: {
            size: 12,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Frequency",
          color: "#4b5563",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const createHistData = (histArray: number[]) => ({
    labels: Array.from({ length: 256 }, (_, i) => i.toString()),
    datasets: [
      {
        label: "Pixel Count",
        data: histArray,
        backgroundColor: "#6366f1",
      },
    ],
  });

  const dynamicFormula = () => {
    switch (mode) {
      case "linear":
        return "s = \\frac{r - \\min}{\\max - \\min} \\cdot 255";
      case "gamma":
        return "s = 255 \\cdot \\left(\\frac{r}{255}\\right)^\\gamma";
      case "log":
        return "s = c \\cdot \\frac{\\log(1 + r)}{\\log(256)}";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto flex flex-col gap-8 p-4 pt-8">
      {/* Select Transform */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="flex flex-wrap justify-center gap-2">
          {(
            [
              { key: "linear", label: "Linear Stretch" },
              { key: "gamma", label: "Gamma Correction" },
              { key: "log", label: "Logarithmic Transform" },
            ] as { key: TransformMode; label: string }[]
          ).map(({ key, label }) => (
            <Button
              key={key}
              onPress={() => setMode(key)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                mode === key
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-primary"
              }`}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Dynamic Sliders */}
        {mode === "gamma" && (
          <div className="flex items-center gap-2">
            <label className="text-sm">Gamma: {gammaValue.toFixed(2)}</label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={gammaValue}
              onChange={(e) => setGammaValue(parseFloat(e.target.value))}
              className="accent-primary"
            />
          </div>
        )}
        {mode === "log" && (
          <div className="flex items-center gap-2">
            <label className="text-sm">c: {logC}</label>
            <input
              type="range"
              min="1"
              max="300"
              step="1"
              value={logC}
              onChange={(e) => setLogC(parseFloat(e.target.value))}
              className="accent-primary"
            />
          </div>
        )}
      </div>

      {/* Dynamic Formula */}
      <div className="text-center text-gray-700 text-sm">
        <BlockMath>{dynamicFormula()}</BlockMath>
      </div>

      {/* Images and Histograms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Original */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-base md:text-lg font-semibold text-gray-700">
            Original Image
          </h2>
          <canvas
            ref={originalCanvasRef}
            className="border rounded-xl shadow max-w-full"
          />
          <h3 className="text-sm font-medium text-gray-600">
            Original Histogram
          </h3>
          <div className="w-full">
            <Bar
              options={histOptions}
              data={createHistData(originalHist)}
              height={150}
            />
          </div>
        </div>

        {/* Transformed */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-base md:text-lg font-semibold text-gray-700 capitalize">
            {mode} Transformed
          </h2>
          <canvas
            ref={transformedCanvasRef}
            className="border rounded-xl shadow max-w-full"
          />
          <h3 className="text-sm font-medium text-gray-600 capitalize">
            {mode} Histogram
          </h3>
          <div className="w-full">
            <Bar
              options={histOptions}
              data={createHistData(transformedHist)}
              height={150}
            />
          </div>
        </div>

        {/* Equalized */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-base md:text-lg font-semibold text-gray-700">
            Equalized Image
          </h2>
          <canvas
            ref={equalizedCanvasRef}
            className="border rounded-xl shadow max-w-full"
          />
          <h3 className="text-sm font-medium text-gray-600">
            Equalized Histogram
          </h3>
          <div className="w-full">
            <Bar
              options={histOptions}
              data={createHistData(equalizedHist)}
              height={150}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
