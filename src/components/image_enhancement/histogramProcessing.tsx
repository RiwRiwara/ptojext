"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@nextui-org/button";
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
import UploadImage from "@/components/image_enhancement/enhanceImageUpload";
import { FiUpload } from "react-icons/fi";
import { Slider } from "@nextui-org/slider";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

type TransformMode = "linear" | "gamma" | "log";

export default function HistogramProcessingSection() {
  const originalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const transformedCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const equalizedCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [originalHist, setOriginalHist] = useState<number[]>([]);
  const [transformedHist, setTransformedHist] = useState<number[]>([]);
  const [equalizedHist, setEqualizedHist] = useState<number[]>([]);
  const [grayOriginal, setGrayOriginal] = useState<number[]>([]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"default" | "upload">("default");

  const [transformMode, setTransformMode] = useState<TransformMode>("linear");
  const [gammaValue, setGammaValue] = useState(1.0);
  const [logC, setLogC] = useState(30);

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
  }, []);

  const applyTransformation = useCallback(
    (gray: number[]) => {
      if (!transformedCanvasRef.current || !gray.length) return;
      const ctx = transformedCanvasRef.current.getContext("2d");
      if (!ctx) return;

      const width = transformedCanvasRef.current.width;
      const height = transformedCanvasRef.current.height;
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      const minGray = gray.reduce((min, val) => Math.min(min, val), Infinity);
      const maxGray = gray.reduce((max, val) => Math.max(max, val), -Infinity);

      const transformed = gray.map((val) => {
        switch (transformMode) {
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
    [transformMode, gammaValue, logC]
  );

  const applyEqualization = useCallback((gray: number[]) => {
    if (!equalizedCanvasRef.current || !gray.length) return;
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
    const totalPixels = gray.length || 1;

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
    img.src = imageSrc || "/mri.jpg";
    img.onload = () => processImage(img);
  }, [imageSrc, inputMode, processImage]);

  useEffect(() => {
    if (grayOriginal.length > 0) {
      applyTransformation(grayOriginal);
    }
  }, [transformMode, gammaValue, logC, grayOriginal, applyTransformation]);

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
          font: { size: 12 },
        },
      },
      y: {
        title: {
          display: true,
          text: "Frequency",
          color: "#4b5563",
          font: { size: 12 },
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
    switch (transformMode) {
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
      <div className="flex justify-start mb-4">
        {inputMode === "default" ? (
          <Button
            color="primary"
            variant="solid"
            onPress={() => {
              setInputMode("upload");
              setImageSrc(null); // only clear when going to upload mode
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
              setInputMode("default");
              // don't clear imageSrc here
            }}
            startContent={<FiUpload />}
          >
            Back to default image
          </Button>
        )}
      </div>

      {inputMode === "upload" && !imageSrc ? (
        <UploadImage
          title="Upload image for histogram processing"
          onImageUpload={(src) => setImageSrc(src)}
        />
      ) : (
        <>
          <div className="text-center text-gray-700 text-sm">
            <BlockMath>{dynamicFormula()}</BlockMath>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="flex flex-wrap justify-center gap-2">
              {(["linear", "gamma", "log"] as TransformMode[]).map((key) => (
                <Button
                  key={key}
                  onPress={() => setTransformMode(key)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                    transformMode === key
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-primary"
                  }`}
                >
                  {key === "linear"
                    ? "Linear Stretch"
                    : key === "gamma"
                    ? "Gamma Correction"
                    : "Logarithmic Transform"}
                </Button>
              ))}
            </div>

            {transformMode === "gamma" && (
              <div className="w-full max-w-sm">
                <label className="text-sm font-medium mb-1 block">
                  Gamma:{" "}
                  <span className="font-mono">{gammaValue.toFixed(2)}</span>
                </label>
                <Slider
                  step={0.1}
                  minValue={0.1}
                  maxValue={5}
                  value={gammaValue}
                  onChange={(v) => setGammaValue(Number(v))}
                  className="w-full"
                  color="primary"
                  size="sm"
                  showSteps={false}
                  marks={[
                    { value: 0.1, label: "0.1" },
                    { value: 5, label: "5" },
                  ]}
                />
              </div>
            )}
            {transformMode === "log" && (
              <div className="flex items-center gap-2">
                <label className="text-sm">c: {logC}</label>
                <Slider
                  size="sm"
                  step={1}
                  minValue={1}
                  maxValue={300}
                  defaultValue={logC}
                  value={logC}
                  onChange={(value) => setLogC(Number(value))}
                  className="w-full"
                  color="primary"
                  showSteps={true}
                  marks={[
                    { value: 1, label: "1" },
                    { value: 300, label: "300" },
                  ]}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <Bar
                options={histOptions}
                data={createHistData(originalHist)}
                height={150}
              />
            </div>

            <div className="flex flex-col items-center gap-4">
              <h2 className="text-base md:text-lg font-semibold text-gray-700 capitalize">
                {transformMode} Transformed
              </h2>
              <canvas
                ref={transformedCanvasRef}
                className="border rounded-xl shadow max-w-full"
              />
              <h3 className="text-sm font-medium text-gray-600 capitalize">
                {transformMode} Histogram
              </h3>
              <Bar
                options={histOptions}
                data={createHistData(transformedHist)}
                height={150}
              />
            </div>

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
              <Bar
                options={histOptions}
                data={createHistData(equalizedHist)}
                height={150}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
