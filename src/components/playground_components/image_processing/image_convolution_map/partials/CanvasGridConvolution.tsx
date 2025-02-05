import React, { useState, useEffect, useRef } from "react";
import useStore from "../state/store";
import GridManager from "@/classes/GridManager";

interface CanvasGridConvolutionProps {
  [key: string]: unknown;
}

export default function CanvasGridConvolution({
}: CanvasGridConvolutionProps) {
  const { convolutionData } = useStore();
  const [GridManagerShow, setGridManagerShow] = useState<GridManager>(
    new GridManager(
      convolutionData.length,
      convolutionData.length,
      30,
      0,
      true,
      convolutionData
    )
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);


  // Redraw the grid whenever the grids state updates
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      GridManagerShow.renderGrid(ctx);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convolutionData]);



  return (
    <div className="p-4">
      <canvas
        ref={canvasRef}
        width={convolutionData[0].length * 30}
        height={convolutionData[0].length * 30}
        style={{ border: "1px solid black" }}
      />

    </div>
  );
}
