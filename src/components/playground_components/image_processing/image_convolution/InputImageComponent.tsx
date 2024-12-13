"use client";
import React, { useRef, useEffect } from "react";
import useMeasure from "react-use-measure";

interface InputImageComponentProps {
  setHoveredPosition: (position: { x: number; y: number }) => void;
}

const targetWidth = 400;
const targetHeight = 400;

const InputImageComponent: React.FC<InputImageComponentProps> = ({
  setHoveredPosition,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ref, bounds] = useMeasure();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src =
      "https://images.ctfassets.net/hrltx12pl8hq/7JnR6tVVwDyUM8Cbci3GtJ/bf74366cff2ba271471725d0b0ef418c/shutterstock_376532611-og.jpg";

    img.onload = () => {
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const scale = Math.max(
        targetWidth / img.width,
        targetHeight / img.height
      );
      const x = (targetWidth - img.width * scale) / 2;
      const y = (targetHeight - img.height * scale) / 2;

      ctx?.clearRect(0, 0, targetWidth, targetHeight);
      ctx?.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        x,
        y,
        img.width * scale,
        img.height * scale
      );
    };

    const handleMouseMove = (event: MouseEvent) => {
      const x = Math.floor(event.clientX - bounds.left);
      const y = Math.floor(event.clientY - bounds.top);

      if (!ctx) return;

      // Redraw the image to clear the previous hover highlight
      const scale = Math.max(
        targetWidth / img.width,
        targetHeight / img.height
      );
      const offsetX = (targetWidth - img.width * scale) / 2;
      const offsetY = (targetHeight - img.height * scale) / 2;

      ctx.clearRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        offsetX,
        offsetY,
        img.width * scale,
        img.height * scale
      );

      // Highlight a 3x3 pixel matrix
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 1, y - 1, 3, 3);

      setHoveredPosition({ x, y });
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [bounds, setHoveredPosition]);

  return (
    <div ref={ref}>
      <canvas
        ref={canvasRef}
        id="canvas"
        style={{ border: "1px solid black" }}
      />
    </div>
  );
};

export default InputImageComponent;
