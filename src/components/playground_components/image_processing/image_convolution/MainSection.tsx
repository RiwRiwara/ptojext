"use client";
import React, { useState } from "react";
import InputImageComponent from "./InputImageComponent";
import KernelImageComponent from "./KernelImageComponent";
import OutputImageComponent from "./OutputImageComponent";

export default function MainSection() {
  const [hoveredPosition, setHoveredPosition] = useState({ x: 0, y: 0 });
  const [kernel, setKernel] = useState<number[][]>([[1]]);

  return (
    <div className="flex flex-col md:flex-row justify-evenly items-start">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold mb-2">Input Image</h2>
        <InputImageComponent
          setHoveredPosition={setHoveredPosition}
        />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold mb-2">Kernel Matrix</h2>
        <KernelImageComponent setKernel={setKernel} />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold mb-2">Output Image</h2>
        <OutputImageComponent
          hoveredPosition={hoveredPosition}
          kernel={kernel}
        />
      </div>
    </div>
  );
}
