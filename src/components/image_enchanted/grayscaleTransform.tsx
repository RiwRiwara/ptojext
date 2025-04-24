"use client";

import { useState, useEffect, useRef } from "react";
import { GrayScaleTypes } from "./types";
import { Button } from "@heroui/react";
interface SelectorProps {
  grayscale: GrayScaleTypes[];
  selectedGray: string;
  onGrayChange: (key: GrayScaleTypes["key"]) => void;
  grayData?: GrayScaleTypes;
  param?: number;
  onParamChange: (v: number | undefined) => void;
}

export default function GrayscaleTransformSelector({
  grayscale, selectedGray, onGrayChange,
  grayData, param, onParamChange
}: SelectorProps) {
  return (
    <section className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      {/* ── buttons ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {grayscale.map(g => (
          <Button
            key={g.key}
            onClick={() => onGrayChange(g.key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${
              selectedGray === g.key
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
            }`}
          >
            {g.label}
          </Button>
        ))}
      </div>

      {/* ── info panel ─────────────────────────────────── */}
      {grayData && (
        <div className="bg-gray-50 p-4 rounded-md space-y-4">
          <p className="text-sm text-gray-600">{grayData.description}</p>

          {/* formula */}
          <code className="block bg-white border p-2 rounded text-indigo-700">
            {grayData.formula.replace(
              grayData.param?.label || "",
              `${grayData.param?.label || ""}`
            )}
          </code>

          {/* slider (if parameterised) */}
          {grayData.param && (
            <div className="space-y-1">
              <label className="font-medium text-sm">
                {grayData.param.label}&nbsp;=&nbsp;
                <span className="font-mono">{param?.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min={grayData.param.min}
                max={grayData.param.max}
                step={grayData.param.step}
                value={param}
                onChange={e => onParamChange(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
