import React, { useEffect, useRef } from "react";
import { Handle, Position, useNodesData } from "@xyflow/react";
import { applyGrayScale } from "../logic/gray_scale";
import { applyNoise } from "../logic/noise";
import { grayScaleDataType, noiseDataType, NoiseType } from "../types";
import useStore from "@/components/image_enchanted/states/store";

function ImageEnchantedNode() {
  const { setImagesEnchantedData } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const gray_scale_node = useNodesData("2");
  const noise_node = useNodesData("4");

  const grayScaleData = gray_scale_node?.data as grayScaleDataType;
  const noiseData = noise_node?.data as noiseDataType;

  useEffect(() => {
    const processImage = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.src = "/people.jpg";
      img.crossOrigin = "anonymous";

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      if (grayScaleData.isEnable) {
        await applyGrayScale(
          canvas,
          "/people.jpg",
          grayScaleData.gray_scale as number
        );
      }

      if (noiseData.isEnable) {
        await applyNoise(
          canvas,
          noiseData.noise_type as NoiseType,
          noiseData.noise_level as number
        );
      }

      const imageDataUrl = canvas.toDataURL("image/png");
      const EnchantedImageData = {
        data: imageDataUrl,
        name: "Image Enchanted",
      };
      setImagesEnchantedData(EnchantedImageData);
    };

    processImage();
  }, [grayScaleData, noiseData, setImagesEnchantedData]);

  return (
    <>
      <Handle
        style={{
          backgroundColor: "transparent",
        }}
        type="target"
        position={Position.Left}
      />
      <div className="p-1 bg-gray-50 rounded-lg shadow-inner" id="tour-result">
        <div className="flex flex-col gap-2">
          <canvas
            ref={canvasRef}
            className="rounded-md w-[400px] border-dotted border-2 border-green-300"
          ></canvas>
        </div>
      </div>
    </>
  );
}

export default React.memo(ImageEnchantedNode);
