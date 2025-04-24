"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { Button } from "@heroui/react";

/* ────────────────────────────────────────────────────────────────────────── */
/*  1.  Data model                                                           */
/* ────────────────────────────────────────────────────────────────────────── */
type GrayKey = "linear" | "log" | "power-law";

interface TransformParam {
  label: string;            // visible name, e.g. “γ”
  min: number;
  max: number;
  step: number;
  default: number;
}

interface GrayTransform {
  key: GrayKey;
  label: string;
  description: string;
  formula: string;          // plain‑text math string
  param?: TransformParam;
}

const TRANSFORMS: GrayTransform[] = [
  {
    key: "linear",
    label: "Linear (Identity)",
    description: "Direct luminance mapping.",
    formula: "G = 0.299R + 0.587G + 0.114B"
  },
  {
    key: "log",
    label: "Logarithmic",
    description: "Expands shadows, compresses highlights.",
    formula: "G = c · log(1 + I)",
    param: { label: "c", min: 10, max: 100, step: 1, default: 10 }
  },
  {
    key: "power-law",
    label: "Power‑Law (Gamma)",
    description: "Classic gamma correction.",
    formula: "G = 255 · (I / 255)^γ",
    param: { label: "γ", min: 0.1, max: 3, step: 0.05, default: 0.5 }
  }
];

/* ────────────────────────────────────────────────────────────────────────── */
/*  2.  Page component                                                       */
/* ────────────────────────────────────────────────────────────────────────── */
export default function GrayscaleTransformPage() {
  const [selected, setSelected] = useState<GrayKey>("linear");
  const [param, setParam] = useState<number | undefined>(
    TRANSFORMS.find(t => t.key === "linear")?.param?.default
  );

  // reset parameter when transform changes
  useEffect(() => {
    setParam(TRANSFORMS.find(t => t.key === selected)?.param?.default);
  }, [selected]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /* ----- transformation logic ------------------------------------------- */
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
            break;
          }
          case "power-law": {
            const gamma = param ?? 0.5;
            gray = 255 * Math.pow(gray / 255, gamma);
            break;
          }
          // linear ⇒ no change
        }

        data[i] = data[i + 1] = data[i + 2] = gray;
      }
      ctx.putImageData(imgData, 0, 0);
    },
    [selected, param]
  );

  // draw whenever transform or parameter changes
  useEffect(() => {
    const img = new Image();
    img.src = "/people.jpg";          // static file in /public
    img.onload = () => applyTransform(img);
  }, [applyTransform]);

  /* ---------------------------------------------------------------------- */
  const meta = TRANSFORMS.find(t => t.key === selected)!;

  return (
    <BaseLayout>
      <div className="container mx-auto flex flex-col gap-8 p-4 pt-8">
        <h1 className="text-2xl font-bold">Gray‑Level Transformations</h1>

        {/* ── selector buttons ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {TRANSFORMS.map(t => (
            <Button
              key={t.key}
              onClick={() => setSelected(t.key)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                selected === t.key
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
              }`}
            >
              {t.label}
            </Button>
          ))}
        </div>

        {/* ── info / slider panel ──────────────────────────────────────── */}
        <div className="bg-gray-50 p-6 rounded-md space-y-4 shadow-sm">
          <p className="text-sm text-gray-700">{meta.description}</p>

          {/* formula string */}
          <code className="block bg-white border p-3 rounded text-indigo-700">
            {meta.param
              ? meta.formula.replace(
                  meta.param.label,
                  `${meta.param.label}=${(param ?? meta.param.default).toFixed(2)}`
                )
              : meta.formula}
          </code>

          {/* slider (only if param exists) */}
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
                onChange={e => setParam(parseFloat(e.target.value))}
              />
            </div>
          )}
        </div>

        {/* ── canvas preview ───────────────────────────────────────────── */}
        <canvas
          ref={canvasRef}
          className="mx-auto border rounded shadow max-w-full"
        />
      </div>
    </BaseLayout>
  );
}
