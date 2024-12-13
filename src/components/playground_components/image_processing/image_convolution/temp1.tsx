

"use client";
import React, { useRef, useEffect, useState } from "react";
import useMeasure from "react-use-measure";

const InputImageComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoveredColorRef = useRef<HTMLDivElement>(null);
  const selectedColorRef = useRef<HTMLDivElement>(null);
  const [gridDivisions, setGridDivisions] = useState(100);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  const [ref, bounds] = useMeasure();

  useEffect(() => {
    const canvas = canvasRef.current;
    const hoveredColor = hoveredColorRef.current;
    const selectedColor = selectedColorRef.current;
    const overlay = overlayRef.current;

    if (!canvas || !hoveredColor || !selectedColor || !overlay) return;

    const ctx = canvas.getContext("2d");
    const overlayCtx = overlay.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "https://firstdraw.blob.core.windows.net/cardimgs/60187739.jpg";

    img.addEventListener("load", () => {
      canvas.width = img.width;
      canvas.height = img.height;
      overlay.width = gridDivisions / 2;
      overlay.height = gridDivisions / 2;
      ctx?.drawImage(img, 0, 0);
    });

    function pick(
      event: React.MouseEvent<HTMLCanvasElement>,
      destination: HTMLDivElement
    ) {
      if (!ctx) return;
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const pixel = ctx?.getImageData(x, y, 1, 1);
      const data = pixel?.data ?? [];

      const rgbColor = `rgb(${data[0]} ${data[1]} ${data[2]} / ${
        data[3] / 255
      })`;
      destination.style.background = rgbColor;
      destination.textContent = rgbColor;
    }

    const drawGrid = () => {
      if (!overlayCtx) return;

      overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
      const cellSize = overlay.width / 3;
      overlayCtx.strokeStyle = "white";
      overlayCtx.lineWidth = 1;

      // Draw vertical lines
      for (let i = 1; i < 3; i++) {
        const x = i * cellSize;
        overlayCtx.beginPath();
        overlayCtx.moveTo(x, 0);
        overlayCtx.lineTo(x, overlay.height);
        overlayCtx.stroke();
      }

      // Draw horizontal lines
      for (let i = 1; i < 3; i++) {
        const y = i * cellSize;
        overlayCtx.beginPath();
        overlayCtx.moveTo(0, y);
        overlayCtx.lineTo(overlay.width, y);
        overlayCtx.stroke();
      }
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
      pick(event, hoveredColor);

      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;

      if (overlay) {
        overlay.style.left = `${x - overlay.width / 2}px`;
        overlay.style.top = `${y - overlay.height / 2}px`;
        overlay.style.display = "block";

        drawGrid();
      }
    };

    const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) =>
      pick(event, selectedColor);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvas.addEventListener("mousemove", handleMouseMove as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvas.addEventListener("click", handleClick as any);
    
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      canvas.removeEventListener("mousemove", handleMouseMove as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      canvas.removeEventListener("click", handleClick as any);
    };
  }, [gridDivisions, bounds]); // Dependency on bounds for accurate positioning

  return (
    <div ref={ref} style={{ position: "relative" }} className="cursor-none">
      <canvas
        ref={canvasRef}
        id="canvas"
        style={{ border: "1px solid black" }}
      />
      <div
        id="hovered-color"
        ref={hoveredColorRef}
        style={{ marginTop: "10px", height: "20px", textAlign: "center" }}
      >
        Hovered Color
      </div>
      <div
        id="selected-color"
        ref={selectedColorRef}
        style={{ marginTop: "10px", height: "20px", textAlign: "center" }}
      >
        Selected Color
      </div>

      {/* Overlay for mouse position */}
      <canvas
        ref={overlayRef}
        style={{
          position: "absolute",
          background: "rgba(0,0,0,0.5)",
          pointerEvents: "none",
          display: "none",
        }}
      />
    </div>
  );
};

export default InputImageComponent;
