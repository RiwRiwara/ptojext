"use client";
import React from "react";
import { Slider } from "@heroui/slider";
import { Input } from "@heroui/input";
import { RadioGroup, Radio } from "@heroui/radio";
import { Select, SelectItem } from "@heroui/select";
import { Divider } from "@heroui/divider";
import { KernelType, AdjustmentValues } from "./types";

interface AdjustmentControlsProps {
  adjustmentValues: AdjustmentValues;
  onValuesChange: (values: Partial<AdjustmentValues>) => void;
  showAllControls?: boolean;
}

const AdjustmentControls: React.FC<AdjustmentControlsProps> = ({
  adjustmentValues,
  onValuesChange,
  showAllControls = true
}) => {
  const {
    contrast,
    brightness,
    gamma,
    histogramEqualization,
    kernelType,
    kernelSize,
    subtractValue,
  } = adjustmentValues;

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Adjustment Controls</h3>

      <div className="space-y-6">
        {/* Basic Adjustments Section */}
        <div className="p-4 border border-gray-200 rounded-lg bg-white">
          <h4 className="text-md font-semibold mb-3">Basic Adjustments</h4>
          <div className="space-y-4">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium">
                  Contrast: {contrast.toFixed(2)}
                </label>
                <Input
                  type="number"
                  value={contrast.toString()}
                  onChange={(e) => onValuesChange({ contrast: parseFloat(e.target.value) || 1 })}
                  min={0.5}
                  max={3}
                  step={0.1}
                  className="w-20 text-right"
                  aria-label="Contrast value"
                />
              </div>
              <Slider
                size="sm"
                step={0.1}
                minValue={0.5}
                maxValue={3}
                value={contrast}
                onChange={(value) => onValuesChange({ contrast: value as number })}
                className="max-w-md"
                aria-label="Adjust contrast"
              />
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium">
                  Brightness: {brightness.toFixed(0)}
                </label>
                <Input
                  type="number"
                  value={brightness.toString()}
                  onChange={(e) => onValuesChange({ brightness: parseInt(e.target.value) || 0 })}
                  min={-50}
                  max={50}
                  step={1}
                  className="w-20 text-right"
                  aria-label="Brightness value"
                />
              </div>
              <Slider
                size="sm"
                step={1}
                minValue={-50}
                maxValue={50}
                value={brightness}
                onChange={(value) => onValuesChange({ brightness: value as number })}
                className="max-w-md"
                aria-label="Adjust brightness"
              />
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium">
                  Gamma: {gamma.toFixed(2)}
                </label>
                <Input
                  type="number"
                  value={gamma.toString()}
                  onChange={(e) => onValuesChange({ gamma: parseFloat(e.target.value) || 1 })}
                  min={0.1}
                  max={3}
                  step={0.1}
                  className="w-20 text-right"
                  aria-label="Gamma value"
                />
              </div>
              <Slider
                size="sm"
                step={0.1}
                minValue={0.1}
                maxValue={3}
                value={gamma}
                onChange={(value) => onValuesChange({ gamma: value as number })}
                className="max-w-md"
                aria-label="Adjust gamma"
              />
            </div>
          </div>
        </div>

        {/* Histogram Processing Section */}
        {showAllControls && (
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <h4 className="text-md font-semibold mb-3">Histogram Processing</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <RadioGroup
                  orientation="horizontal"
                  value={histogramEqualization ? "equalize" : "none"}
                  onValueChange={(value) => onValuesChange({ histogramEqualization: value === "equalize" })}
                  aria-label="Histogram processing options"
                >
                  <Radio value="none">No Processing</Radio>
                  <Radio value="equalize">Histogram Equalization</Radio>
                </RadioGroup>
              </div>

              <div className="mt-2 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  Histogram equalization improves contrast by redistributing intensity values across the entire range.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Smoothing & Sharpening Section */}
        {showAllControls && (
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <h4 className="text-md font-semibold mb-3">Smoothing & Sharpening</h4>
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Filter Type</label>
                <Select
                  selectedKeys={[kernelType]}
                  onChange={(e) => onValuesChange({ kernelType: e.target.value as KernelType })}
                  className="max-w-md"
                  aria-label="Filter type selection"
                >
                  <SelectItem key="smoothing">Gaussian Smoothing</SelectItem>
                  <SelectItem key="sharpening">Sharpening</SelectItem>
                  <SelectItem key="edge-detection">Edge Detection</SelectItem>
                </Select>
              </div>

              {kernelType === 'smoothing' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Kernel Size</label>
                  <RadioGroup
                    orientation="horizontal"
                    value={kernelSize.toString()}
                    onValueChange={(value) => onValuesChange({ kernelSize: parseInt(value) })}
                    aria-label="Kernel size selection"
                  >
                    <Radio value="3">3x3</Radio>
                    <Radio value="5">5x5</Radio>
                  </RadioGroup>
                </div>
              )}

              <div className="mt-2 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  {kernelType === 'smoothing' && "Gaussian smoothing reduces noise and detail in the image."}
                  {kernelType === 'sharpening' && "Sharpening enhances edges and fine details in the image."}
                  {kernelType === 'edge-detection' && "Edge detection highlights boundaries between different regions in the image."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Image Subtraction Section */}
        {showAllControls && (
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <h4 className="text-md font-semibold mb-3">Image Subtraction</h4>
            <div className="space-y-4">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium">
                    Subtraction Value: {subtractValue}
                  </label>
                  <Input
                    type="number"
                    value={subtractValue.toString()}
                    onChange={(e) => onValuesChange({ subtractValue: parseInt(e.target.value) || 0 })}
                    min={0}
                    max={255}
                    step={1}
                    className="w-20 text-right"
                    aria-label="Subtraction value"
                  />
                </div>
                <Slider
                  size="sm"
                  step={1}
                  minValue={0}
                  maxValue={255}
                  value={subtractValue}
                  onChange={(value) => onValuesChange({ subtractValue: value as number })}
                  className="max-w-md"
                  aria-label="Adjust subtraction value"
                />
              </div>

              <div className="mt-2 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  Image subtraction can help isolate specific features by removing a constant intensity value from all pixels.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdjustmentControls;
