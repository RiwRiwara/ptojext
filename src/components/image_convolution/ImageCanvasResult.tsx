import { useRef, useEffect } from "react";
import people_img from "@/assets/images/people.jpg";
import { processImageConvolution } from "../image_enhancement/logic/process_image_convolution";

const originalKernel = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
];

export default function ImageCanvasResult({ kernel = originalKernel }) {
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
    await processImageConvolution(canvas, people_img.src, kernel);
  }

  useEffect(() => {
    InitCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kernel]);

  return (
    <div className=" rounded-md p-2 w-fit">
      <canvas
        className="rounded-sm shadow-md"
        ref={canvasRef}
        width={width}
        height={height}
      />
    </div>
  );
}
