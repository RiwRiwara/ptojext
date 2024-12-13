"use client";
import React, { useRef, useEffect } from "react";

interface OutputImageComponentProps {
  hoveredPosition: { x: number; y: number };
}

const OutputImageComponent: React.FC<OutputImageComponentProps> = ({
  hoveredPosition,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "https://images.ctfassets.net/hrltx12pl8hq/7JnR6tVVwDyUM8Cbci3GtJ/bf74366cff2ba271471725d0b0ef418c/shutterstock_376532611-og.jpg";

    img.onload = () => {
      const targetWidth = 400;
      const targetHeight = 400;
    
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const scale = Math.max(
        targetWidth / img.width,
        targetHeight / img.height
      );
      const x_i = (targetWidth - img.width * scale) / 2;
      const y_i = (targetHeight - img.height * scale) / 2;

      ctx?.clearRect(0, 0, targetWidth, targetHeight);
      ctx?.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        x_i,
        y_i,
        img.width * scale,
        img.height * scale
      );
      

      const { x, y } = hoveredPosition;

      // Highlight the hovered region
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 1, y - 1, 3, 3); // Draw a small rectangle around the hovered point
    };
  }, [hoveredPosition]);

  return (
    <canvas ref={canvasRef} id="outputCanvas" style={{ border: "1px solid black" }} />
  );
};

export default OutputImageComponent;
