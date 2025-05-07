import React, { useEffect, useRef, useState } from "react";
import { Slider } from "@nextui-org/slider";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@heroui/react";
import Image from "next/image";

const noiseTypes = [
  { label: "Gaussian Noise", value: "gaussian" },
  { label: "Salt and Pepper Noise", value: "saltpepper" },
  { label: "Speckle Noise", value: "speckle" },
];

const EnchantedFilters = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for filters
  const [grayScale, setGrayScale] = useState(0);
  const [noiseType, setNoiseType] = useState("gaussian");
  const [noiseIntensity, setNoiseIntensity] = useState(0);
  const [brightness, setBrightness] = useState(100); // 0-200%
  const [contrast, setContrast] = useState(100); // 0-200%
  const [sepia, setSepia] = useState(0); // 0-100%
  const [blurRadius, setBlurRadius] = useState(0); // 0-10px
  const [imageSrc, setImageSrc] = useState("/people.jpg");

  useEffect(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx || !image) return;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      processImage();
    };

    if (image.complete) {
      if (image.onload) image.onload(new Event("load"));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc]);

  useEffect(() => {
    processImage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grayScale, noiseType, noiseIntensity, brightness, contrast, sepia, blurRadius]);

  const processImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const image = imageRef.current;

    if (!canvas || !ctx || !image) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    // 1. Grayscale
    if (grayScale > 0) {
      const factor = grayScale / 100;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        data[i] = r * (1 - factor) + gray * factor;
        data[i + 1] = g * (1 - factor) + gray * factor;
        data[i + 2] = b * (1 - factor) + gray * factor;
      }
    }

    // 2. Brightness
    if (brightness !== 100) {
      const factor = brightness / 100;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = clamp(data[i] * factor);
        data[i + 1] = clamp(data[i + 1] * factor);
        data[i + 2] = clamp(data[i + 2] * factor);
      }
    }

    // 3. Contrast
    if (contrast !== 100) {
      const factor = (contrast / 100) * (contrast / 100);
      const intercept = 128 * (1 - factor);
      for (let i = 0; i < data.length; i += 4) {
        data[i] = clamp(data[i] * factor + intercept);
        data[i + 1] = clamp(data[i + 1] * factor + intercept);
        data[i + 2] = clamp(data[i + 2] * factor + intercept);
      }
    }

    // 4. Sepia
    if (sepia > 0) {
      const factor = sepia / 100;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const sepiaR = 0.393 * r + 0.769 * g + 0.189 * b;
        const sepiaG = 0.349 * r + 0.686 * g + 0.168 * b;
        const sepiaB = 0.272 * r + 0.534 * g + 0.131 * b;
        data[i] = clamp(r * (1 - factor) + sepiaR * factor);
        data[i + 1] = clamp(g * (1 - factor) + sepiaG * factor);
        data[i + 2] = clamp(b * (1 - factor) + sepiaB * factor);
      }
    }

    // 5. Apply Noise
    if (noiseIntensity > 0) {
      data = applyNoise(data, noiseType, noiseIntensity, canvas.width, canvas.height);
    }

    ctx.putImageData(imageData, 0, 0);

    // 6. Blur (using CSS filter for simplicity; canvas-based blur is complex)
    if (blurRadius > 0) {
      canvas.style.filter = `blur(${blurRadius}px)`;
    } else {
      canvas.style.filter = "none";
    }
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
    const newData = new Uint8ClampedArray(data);

    for (let i = 0; i < newData.length; i += 4) {
      if (type === "gaussian") {
        const noise = gaussianRandom() * 50 * level;
        newData[i] = clamp(newData[i] + noise);
        newData[i + 1] = clamp(newData[i + 1] + noise);
        newData[i + 2] = clamp(newData[i + 2] + noise);
      } else if (type === "saltpepper") {
        if (Math.random() < level * 0.05) {
          const saltOrPepper = Math.random() < 0.5 ? 0 : 255;
          newData[i] = newData[i + 1] = newData[i + 2] = saltOrPepper;
        }
      } else if (type === "speckle") {
        const noise = 1 + (Math.random() - 0.5) * level;
        newData[i] = clamp(newData[i] * noise);
        newData[i + 1] = clamp(newData[i + 1] * noise);
        newData[i + 2] = clamp(newData[i + 2] * noise);
      }
    }
    return newData;
  };

  const clamp = (value: number) => Math.max(0, Math.min(255, value));
  const gaussianRandom = () => {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetFilters = () => {
    setGrayScale(0);
    setNoiseType("gaussian");
    setNoiseIntensity(0);
    setBrightness(100);
    setContrast(100);
    setSepia(0);
    setBlurRadius(0);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "enhancement-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-6 bg-white p-6 rounded-xl">
      <h2 className="text-xl font-bold">Enhancement Image Filters</h2>

      <canvas ref={canvasRef} className="rounded-md border-2 max-w-full" />

      <Image
        ref={imageRef}
        src={imageSrc}
        alt="Selected"
        className="hidden"
        crossOrigin="anonymous"
      />

      {/* Image Upload */}
      <div className="flex flex-col gap-3 w-full max-w-[300px]">
        <label className="font-semibold">Upload Image</label>
        <Input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
      </div>

      {/* Grayscale Slider */}
      <div className="flex flex-col gap-3 w-full max-w-[300px]">
        <label className="font-semibold">Grayscale Level</label>
        <Slider
          aria-label="Grayscale"
          size="sm"
          color="secondary"
          step={1}
          minValue={0}
          maxValue={100}
          value={grayScale}
          onChange={(val) => setGrayScale(Array.isArray(val) ? val[0] : val)}
        />
      </div>

      {/* Brightness Slider */}
      <div className="flex flex-col gap-3 w-full max-w-[300px]">
        <label className="font-semibold">Brightness</label>
        <Slider
          aria-label="Brightness"
          size="sm"
          color="primary"
          step={1}
          minValue={0}
          maxValue={200}
          value={brightness}
          onChange={(val) => setBrightness(Array.isArray(val) ? val[0] : val)}
        />
      </div>

      {/* Contrast Slider */}
      <div className="flex flex-col gap-3 w-full max-w-[300px]">
        <label className="font-semibold">Contrast</label>
        <Slider
          aria-label="Contrast"
          size="sm"
          color="success"
          step={1}
          minValue={0}
          maxValue={200}
          value={contrast}
          onChange={(val) => setContrast(Array.isArray(val) ? val[0] : val)}
        />
      </div>

      {/* Sepia Slider */}
      <div className="flex flex-col gap-3 w-full max-w-[300px]">
        <label className="font-semibold">Sepia Tone</label>
        <Slider
          aria-label="Sepia"
          size="sm"
          color="warning"
          step={1}
          minValue={0}
          maxValue={100}
          value={sepia}
          onChange={(val) => setSepia(Array.isArray(val) ? val[0] : val)}
        />
      </div>

      {/* Blur Slider */}
      <div className="flex flex-col gap-3 w-full max-w-[300px]">
        <label className="font-semibold">Blur Radius</label>
        <Slider
          aria-label="Blur"
          size="sm"
          color="danger"
          step={0.1}
          minValue={0}
          maxValue={10}
          value={blurRadius}
          onChange={(val) => setBlurRadius(Array.isArray(val) ? val[0] : val)}
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

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button color="primary" onPress={resetFilters}>
          Reset Filters
        </Button>
        <Button color="secondary" onPress={downloadImage}>
          Download Image
        </Button>
      </div>
    </div>
  );
};

export default EnchantedFilters;