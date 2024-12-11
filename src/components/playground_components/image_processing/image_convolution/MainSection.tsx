"use client";
import React, { useEffect } from "react";
import InputImageComponent from "./InputImageComponent";
import KernelImageComponent from "./KernelImageComponent";
import OutputImageComponent from "./OutputImageComponent";

export default function MainSection() {
  return (
    <div className="flex flex-col md:flex-row justify-evenly items-center">
      <InputImageComponent />
      <KernelImageComponent />
      <OutputImageComponent />
    </div>
  );
}
