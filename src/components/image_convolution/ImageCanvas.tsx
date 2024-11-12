import { useRef, useEffect } from "react";
import people_img from "@/assets/images/people.jpg";
import { processImageConvolution } from "../image_enchanted/logic/process_image_convolution";

const originalKernel = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
];

export default function ImageCanvas({
  gridSize = 20,
  kernel = originalKernel,
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = people_img.width;
  const height = people_img.height;

  async function InitCanvas() {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    context.fillStyle = "#fff";
    context.fillRect(0, 0, width, height);

    // Draw image
    await processImageConvolution(canvas, people_img.src, originalKernel);
    drawGrid(context);
  }

  function drawGrid(context: CanvasRenderingContext2D) {
    context.strokeStyle = "#000";
    context.lineWidth = 0.5;

    for (let x = 0; x <= width; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }

    for (let y = 0; y <= height; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
  }

  useEffect(() => {
    InitCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridSize]);

  return (
    <div className="rounded-md p-2 w-fit">
      <canvas className="rounded-sm shadow-md" ref={canvasRef} width={width} height={height} />
    </div>
  );
}
