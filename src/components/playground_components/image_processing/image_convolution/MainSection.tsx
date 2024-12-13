"use client";
import React, { useEffect } from "react";
import InputImageComponent from "./InputImageComponent";
import KernelImageComponent from "./KernelImageComponent";
import OutputImageComponent from "./OutputImageComponent";

export default function MainSection() {
  const [hoveredPosition, setHoveredPosition] = React.useState({ x: 0, y: 0 });

  return (
    <div className="flex flex-col md:flex-row justify-evenly items-center">
      <InputImageComponent setHoveredPosition={setHoveredPosition} />
      <KernelImageComponent />
      <OutputImageComponent hoveredPosition={hoveredPosition} />
    </div>
  );
}
