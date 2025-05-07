"use client";
import React from "react";
import { Slider } from "@heroui/slider";
import { Input } from "@heroui/input";
import { RadioGroup, Radio } from "@heroui/radio";
import { Select, SelectItem } from "@heroui/select";
import { Divider } from "@heroui/divider";
import { Switch } from "@heroui/switch";
import { Tabs, Tab } from "@heroui/tabs";
import { motion } from "framer-motion";
import { FiSliders, FiImage, FiFilter, FiMinus } from "react-icons/fi";
import { KernelType, AdjustmentValues, HistogramMethod } from "./types";

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
    histogramMethod,
    histogramEqualization,
    logTransformConstant,
    gammaValue,
    kernelType,
    kernelSize,
    kernelIntensity,
    subtractValue,
  } = adjustmentValues;
  
  // Active tab state
  const [activeTab, setActiveTab] = React.useState<string>("basic");

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FiSliders className="mr-2" /> 
        <span>Image Enhancement Controls</span>
      </h3>
      
      <Tabs 
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        color="default"
        variant="underlined"
        classNames={{
          tab: "text-gray-600 hover:text-primary-500",
          tabList: "border-b border-gray-200",
          cursor: "bg-primary-300",
          base: "text-primary font-semibold"
        }}
        className="mb-4">
        <Tab key="basic" title={<div className="flex items-center"><FiSliders className="mr-2" />Basic</div>} />
        {showAllControls && (
          <Tab key="histogram" title={<div className="flex items-center"><FiImage className="mr-2" />Histogram</div>} />
        )}
        {showAllControls && (
          <Tab key="filters" title={<div className="flex items-center"><FiFilter className="mr-2" />Filters</div>} />
        )}
        {showAllControls && (
          <Tab key="subtraction" title={<div className="flex items-center"><FiMinus className="mr-2" />Subtraction</div>} />
        )}
      </Tabs>

      <div className="space-y-6">
        {/* Basic Adjustments Section */}
        {activeTab === "basic" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
          >
            <h4 className="text-md font-semibold mb-3 flex items-center">
              <FiSliders className="mr-2 text-blue-500" />
              <span>Basic Adjustments</span>
            </h4>
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
            <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
              <p className="text-sm text-blue-800">
                Adjust contrast, brightness and gamma to enhance the visibility of features in the image.
              </p>
            </div>
          </motion.div>
        )}

        {/* Histogram Processing Section */}
        {showAllControls && activeTab === "histogram" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
          >
            <h4 className="text-md font-semibold mb-3 flex items-center">
              <FiImage className="mr-2 text-indigo-500" />
              <span>Histogram Processing</span>
            </h4>
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Histogram Method</label>
                <Select
                  selectedKeys={[histogramMethod]}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as HistogramMethod;
                    onValuesChange({ histogramMethod: selectedKey });
                  }}
                  className="max-w-md"
                  aria-label="Histogram method selection"
                >
                  <SelectItem key="equalization">Histogram Equalization</SelectItem>
                  <SelectItem key="gamma">Gamma Transform</SelectItem>
                  <SelectItem key="log">Log Transform</SelectItem>
                </Select>
              </div>
              
              {histogramMethod === 'equalization' && (
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Switch
                      isSelected={histogramEqualization}
                      onValueChange={(isSelected) => onValuesChange({ histogramEqualization: isSelected })}
                      size="sm"
                    />
                    <span className="text-sm font-medium">
                      {histogramEqualization ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Toggle histogram equalization on or off
                  </p>
                </div>
              )}
              
              {histogramMethod === 'gamma' && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium">
                      Gamma Value: {gammaValue.toFixed(2)}
                    </label>
                    <Input
                      type="number"
                      value={gammaValue.toString()}
                      onChange={(e) => onValuesChange({ gammaValue: parseFloat(e.target.value) || 1 })}
                      min={0.1}
                      max={5}
                      step={0.1}
                      className="w-20 text-right"
                      aria-label="Gamma value"
                    />
                  </div>
                  <Slider
                    size="sm"
                    step={0.1}
                    minValue={0.1}
                    maxValue={5}
                    value={gammaValue}
                    onChange={(value) => onValuesChange({ gammaValue: value as number })}
                    className="max-w-md"
                    aria-label="Adjust gamma value"
                  />
                </div>
              )}
              
              {histogramMethod === 'log' && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium">
                      Log Constant: {logTransformConstant.toFixed(1)}
                    </label>
                    <Input
                      type="number"
                      value={logTransformConstant.toString()}
                      onChange={(e) => onValuesChange({ logTransformConstant: parseFloat(e.target.value) || 1 })}
                      min={1}
                      max={20}
                      step={0.5}
                      className="w-20 text-right"
                      aria-label="Log constant"
                    />
                  </div>
                  <Slider
                    size="sm"
                    step={0.5}
                    minValue={1}
                    maxValue={20}
                    value={logTransformConstant}
                    onChange={(value) => onValuesChange({ logTransformConstant: value as number })}
                    className="max-w-md"
                    aria-label="Adjust log constant"
                  />
                </div>
              )}

              <div className="mt-2 p-3 bg-indigo-50 rounded-md border border-indigo-100">
                <p className="text-sm text-indigo-800">
                  {histogramMethod === 'equalization' && 
                    "Histogram equalization enhances the contrast of images by spreading out the most frequent intensity values."}
                  {histogramMethod === 'gamma' && 
                    "Gamma transforms adjust the brightness and contrast of an image by applying a non-linear mapping. Values < 1 lighten the image, values > 1 darken it."}
                  {histogramMethod === 'log' && 
                    "Log transformation compresses the dynamic range of an image, making details in dark regions more visible. Higher constant values create stronger effects."}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Smoothing & Sharpening Section */}
        {showAllControls && activeTab === "filters" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
          >
            <h4 className="text-md font-semibold mb-3 flex items-center">
              <FiFilter className="mr-2 text-green-500" />
              <span>Smoothing & Sharpening</span>
            </h4>
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Filter Type</label>
                <Select
                  selectedKeys={[kernelType]}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as KernelType;
                    onValuesChange({ kernelType: selectedKey });
                  }}
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
                    <Radio value="7">7x7</Radio>
                  </RadioGroup>
                </div>
              )}
              
              {(kernelType === 'sharpening' || kernelType === 'edge-detection') && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium">
                      Intensity: {kernelIntensity.toFixed(1)}
                    </label>
                    <Input
                      type="number"
                      value={kernelIntensity.toString()}
                      onChange={(e) => onValuesChange({ kernelIntensity: parseFloat(e.target.value) || 1 })}
                      min={0.5}
                      max={5}
                      step={0.1}
                      className="w-20 text-right"
                      aria-label="Filter intensity"
                    />
                  </div>
                  <Slider
                    size="sm"
                    step={0.1}
                    minValue={0.5}
                    maxValue={5}
                    value={kernelIntensity}
                    onChange={(value) => onValuesChange({ kernelIntensity: value as number })}
                    className="max-w-md"
                    aria-label="Adjust filter intensity"
                  />
                </div>
              )}

              <div className="mt-2 p-3 bg-green-50 rounded-md border border-green-100">
                <p className="text-sm text-green-800">
                  {kernelType === 'smoothing' && "Gaussian smoothing reduces noise and detail in the image. Larger kernel sizes produce more blurring."}
                  {kernelType === 'sharpening' && "Sharpening enhances edges and fine details in the image. Higher intensity values create stronger sharpening effects."}
                  {kernelType === 'edge-detection' && "Edge detection highlights boundaries between different regions in the image. Adjust the intensity to control the strength of edge detection."}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Image Subtraction Section */}
        {showAllControls && activeTab === "subtraction" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
          >
            <h4 className="text-md font-semibold mb-3 flex items-center">
              <FiMinus className="mr-2 text-purple-500" />
              <span>Image Subtraction</span>
            </h4>
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

              <div className="mt-2 p-3 bg-purple-50 rounded-md border border-purple-100">
                <p className="text-sm text-purple-800">
                  Image subtraction can help isolate specific features by removing a constant intensity value from all pixels. This is useful for highlighting features in medical images.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdjustmentControls;
