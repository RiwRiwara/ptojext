"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import {
  Button,
  Slider,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@heroui/react";
import { FiImage, FiSliders, FiUpload, FiRepeat } from "react-icons/fi";
import { BlockMath } from "react-katex";
import { GrayScaleTypes } from "@/components/image_enhancement/types";
import UploadImage from "@/components/image_enhancement/enhanceImageUpload";

type GrayKey = "linear" | "log" | "power-law";
type Mode = "default" | "upload";

const grayscaleTypes: GrayScaleTypes[] = [
  {
    key: "linear",
    label: "Linear (Identity)",
    description: "Keeps pixel intensity unchanged.",
    formula: "G = 0.299R + 0.587G + 0.114B",
  },
  {
    key: "log",
    label: "Logarithmic",
    description: "Expands dark tones, compresses highlights.",
    param: { label: "c", min: 10, max: 200, step: 1, default: 70 },
    formula: "G = c \\cdot \\log(1 + I)",
  },
  {
    key: "power-law",
    label: "Power Law (Gamma)",
    description: "Classic gamma correction for displays.",
    param: { label: "\\gamma", min: 0.05, max: 3, step: 0.05, default: 0.5 },
    formula: "G = 255 \\cdot \\left(\\frac{I}{255}\\right)^{\\gamma}",
  },
];

export default function GrayscaleTransformSection() {
  const [selected, setSelected] = useState<GrayKey>("linear");
  const [param, setParam] = useState<number>(
    grayscaleTypes.find((g) => g.key === "linear")?.param?.default || 0
  );
  const [mode, setMode] = useState<Mode>("default");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const defaultValue =
      grayscaleTypes.find((t) => t.key === selected)?.param?.default || 0;
    setParam(defaultValue);
  }, [selected]);

  const applyTransform = useCallback(
    (img: HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
        let gray = 0.299 * r + 0.587 * g + 0.114 * b;

        switch (selected) {
          case "log":
            gray = (param * Math.log1p(gray)) / Math.log(256);
            gray = Math.min(255, gray);
            break;
          case "power-law":
            gray = 255 * Math.pow(gray / 255, param);
            break;
        }

        data[i] = data[i + 1] = data[i + 2] = gray;
      }

      ctx.putImageData(imgData, 0, 0);
    },
    [selected, param]
  );

  useEffect(() => {
    const img = new Image();
    if (mode === "default") {
      img.src = "/mri.jpg";
    } else if (uploadedImageUrl) {
      img.src = uploadedImageUrl;
    } else {
      return;
    }
    img.onload = () => applyTransform(img);
  }, [param, selected, uploadedImageUrl, mode, applyTransform]);

  const meta = grayscaleTypes.find((t) => t.key === selected)!;

  return (
    <div className="container mx-auto flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        {mode === "default" ? (
          <Button
            color="primary"
            variant="solid"
            onPress={() => {
              setMode("upload");
              setUploadedImageUrl(null);
            }}
            startContent={<FiUpload />}
          >
            Upload your image
          </Button>
        ) : (
          <Button
            color="primary"
            variant="bordered"
            onPress={() => {
              setMode("default");
              setUploadedImageUrl(null);
            }}
            startContent={<FiRepeat />}
          >
            Back to default image
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <FiImage className="text-primary" />
        <h1 className="text-xl font-semibold">{meta.label} Transform</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-6">
        {mode === "upload" && !uploadedImageUrl ? (
          <div className="w-full md:w-1/2">
            <UploadImage
              title="Upload image for grayscale transformation"
              onImageUpload={(src) => setUploadedImageUrl(src)}
            />
          </div>
        ) : (
          <Card className="w-full md:w-1/2 shadow-md">
            <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
              <h4 className="text-sm font-medium text-gray-600">Preview</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-4">
              <canvas
                ref={canvasRef}
                className="mx-auto rounded-lg max-w-full"
              />
            </CardBody>
          </Card>
        )}

        <div className="flex flex-col gap-6 w-full md:w-1/2">
          <Card className="shadow-md">
            <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
              <h4 className="text-sm font-medium text-gray-600">
                Transform Type
              </h4>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {grayscaleTypes.map((t) => (
                  <Button
                    key={t.key}
                    onPress={() => setSelected(t.key)}
                    color={selected === t.key ? "primary" : "default"}
                    variant={selected === t.key ? "solid" : "bordered"}
                    className="w-full"
                  >
                    {t.label}
                  </Button>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
              <h4 className="text-sm font-medium text-gray-600">
                Transform Details
              </h4>
            </CardHeader>
            <CardBody className="space-y-4 pb-8">
              <p className="text-sm text-gray-700">{meta.description}</p>

              <Divider className="my-2" />

              <div className="flex items-center gap-2">
                <FiSliders className="text-primary" />
                <h3 className="text-sm font-medium">Formula</h3>
              </div>
              <BlockMath>{meta.formula}</BlockMath>

              {meta.param && (
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <span>{meta.param.label.replace(/\\/, "")}</span>
                    </label>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {param.toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    size="sm"
                    step={meta.param.step}
                    minValue={meta.param.min}
                    maxValue={meta.param.max}
                    defaultValue={param}
                    value={param}
                    onChange={(value) => setParam(Number(value))}
                    className="max-w-md"
                    color="primary"
                    showSteps={meta.param.step >= 0.5}
                    marks={[
                      {
                        value: meta.param.min,
                        label: meta.param.min.toString(),
                      },
                      {
                        value: meta.param.max,
                        label: meta.param.max.toString(),
                      },
                    ]}
                  />
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
