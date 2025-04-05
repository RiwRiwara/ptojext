
import React, { useEffect, useRef, useState } from "react";
import { Slider } from "@nextui-org/slider";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";

const noiseTypes = [
  { label: "Gaussian Noise", value: "gaussian" },
  { label: "Salt and Pepper Noise", value: "saltpepper" },
  { label: "Speckle Noise", value: "speckle" },
];

const EnchantedFilters = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [grayScale, setGrayScale] = useState(150);
  const [noiseType, setNoiseType] = useState("gaussian");
  const [noiseIntensity, setNoiseIntensity] = useState(20); // 0-100

  useEffect(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx || !image) return;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      processImage();
    };

    if (image.complete) {
      image.onload?.(null as any);
    }
  }, []);

  useEffect(() => {
    processImage();
  }, [grayScale, noiseType, noiseIntensity]);

  const processImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const image = imageRef.current;

    if (!canvas || !ctx || !image) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    const factor = grayScale / 255;

    // 1. Grayscale
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const gray = 0.299 * r + 0.587 * g + 0.114 * b;

      data[i]     = r * (1 - factor) + gray * factor;
      data[i + 1] = g * (1 - factor) + gray * factor;
      data[i + 2] = b * (1 - factor) + gray * factor;
    }

    // 2. Apply Noise
    applyNoise(data, noiseType, noiseIntensity, canvas.width, canvas.height);

    ctx.putImageData(imageData, 0, 0);
  };

  const applyNoise = (
    data: Uint8ClampedArray,
    type: string,
    intensity: number,
    width: number,
    height: number
  ) => {
    const pixelCount = width * height;
    const level = intensity / 100;

    for (let i = 0; i < data.length; i += 4) {
      if (type === "gaussian") {
        const noise = gaussianRandom() * 50 * level;
        data[i]     = clamp(data[i] + noise);
        data[i + 1] = clamp(data[i + 1] + noise);
        data[i + 2] = clamp(data[i + 2] + noise);
      } else if (type === "saltpepper") {
        if (Math.random() < level * 0.05) {
          const saltOrPepper = Math.random() < 0.5 ? 0 : 255;
          data[i] = data[i + 1] = data[i + 2] = saltOrPepper;
        }
      } else if (type === "speckle") {
        const noise = 1 + (Math.random() - 0.5) * level;
        data[i]     = clamp(data[i] * noise);
        data[i + 1] = clamp(data[i + 1] * noise);
        data[i + 2] = clamp(data[i + 2] * noise);
      }
    }
  };

  const clamp = (value: number) => Math.max(0, Math.min(255, value));
  const gaussianRandom = () => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };

  return (
    <div className="flex flex-col items-center gap-6 bg-white p-6 rounded-xl">
      <h2 className="text-xl font-bold">Grayscale & Noise Filter</h2>


      <canvas ref={canvasRef} className="rounded-md border-2" />

      <img
        ref={imageRef}
        src="/people.jpg"
        alt="People"
        className="hidden"
        crossOrigin="anonymous"
      />

      {/* Grayscale Slider */}
      <div className="flex flex-col gap-3 w-full max-w-[300px]">
        <label className="font-semibold">Grayscale Level</label>
        <Slider
          aria-label="Grayscale"
          size="sm"
          color="secondary"
          step={1}
          minValue={0}
          maxValue={255}
          value={grayScale}
          onChange={(val) => setGrayScale(Array.isArray(val) ? val[0] : val)}
          startContent={
            <Button
              size="sm"
              isIconOnly
              radius="full"
              variant="light"
              onPress={() => setGrayScale((v) => Math.max(0, v - 1))}
            >
              -
            </Button>
          }
          endContent={
            <Button
              size="sm"
              isIconOnly
              radius="full"
              variant="light"
              onPress={() => setGrayScale((v) => Math.min(255, v + 1))}
            >
              +
            </Button>
          }
        />
      </div>

      {/* Noise Section */}
      <div className="flex flex-col gap-4 w-full max-w-[300px]">
        <label className="font-semibold">Noise Type</label>
        <Select
          selectedKeys={[noiseType]}
          onSelectionChange={(keys) => setNoiseType(Array.from(keys)[0] as string)}
        >
          {noiseTypes.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </Select>

        <label className="font-semibold">Noise Intensity</label>
        <Slider
          aria-label="Noise Intensity"
          size="sm"
          color="warning"
          step={1}
          minValue={0}
          maxValue={100}
          value={noiseIntensity}
          onChange={(val) =>
            setNoiseIntensity(Array.isArray(val) ? val[0] : val)
          }
        />
      </div>
    </div>
  );
};

export default EnchantedFilters;
