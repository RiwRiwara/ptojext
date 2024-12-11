"use client";
import React, { useEffect, useRef } from "react";

export default function OutputImageComponent() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(50, 50, 300, 300);
      }
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="canvas_output"
      width="400"
      height="400"
    ></canvas>
  );
}
