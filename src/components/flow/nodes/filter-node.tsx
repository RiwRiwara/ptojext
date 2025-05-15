"use client";
import React, { useCallback } from 'react';
import { type NodeProps, Position, useReactFlow } from '@xyflow/react';
import { Filter, LayoutTemplate, Sliders } from 'lucide-react';

import { BaseNode } from '@/components/flow/base-node';
import { LabeledHandle } from '@/components/flow/labeled-handle';
import {
  NodeHeader,
  NodeHeaderTitle,
  NodeHeaderActions,
  NodeHeaderMenuAction,
} from '@/components/flow/node-header';
import { DropdownMenuItem } from '@/components//ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import type { FilterNodeData } from '@/components/flow/types';
import type { BlurAlgorithm } from '@/types/imageProcessingTypes';
import { useImageProcessingFlow } from '@/hooks/useImageProcessingFlow';

type FilterNodeProps = NodeProps & {
  data: FilterNodeData;
};

export function FilterNode({ id, data, selected }: FilterNodeProps) {
  // Access the processFlow function from our custom hook
  const { setNodes, updateNodeData } = useReactFlow();

  // Import custom hooks
  const { processFlow } = useImageProcessingFlow();

  const handleDelete = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  const handleTypeChange = useCallback(
    (value: string) => {
      // Set default values based on filter type
      const updates: Partial<FilterNodeData> = {
        type: value as FilterNodeData['type'],
      };

      if (value === 'blur' && !data.blurAlgorithm) {
        updates.blurAlgorithm = 'gaussian';
        updates.kernelSize = 3;
        updates.sigma = 2;
      }
      if (value === 'grayscale' && !data.grayscaleAlgorithm) {
        updates.grayscaleAlgorithm = 'luminosity';
      }

      updateNodeData(id, { ...data, ...updates });

      // Process flow after data update
      setTimeout(() => processFlow(), 50);
    },
    [id, data, updateNodeData, processFlow]
  );

  const handleBlurAlgorithmChange = useCallback(
    (value: string) => {
      updateNodeData(id, { ...data, blurAlgorithm: value as BlurAlgorithm });
      // Process flow after data update
      setTimeout(() => processFlow(), 50);
    },
    [id, data, updateNodeData, processFlow]
  );


  const handleIntensityChange = useCallback(
    (value: number[]) => {
      updateNodeData(id, { ...data, intensity: value[0] });
      // Process flow after data update
      setTimeout(() => processFlow(), 50);
    },
    [id, data, updateNodeData, processFlow]
  );

  const handleKernelSizeChange = useCallback(
    (value: number[]) => {
      // Ensure kernel size is always odd
      const size = value[0] % 2 === 0 ? value[0] + 1 : value[0];
      updateNodeData(id, { ...data, kernelSize: size });
      // Process flow after data update
      setTimeout(() => processFlow(), 50);
    },
    [id, data, updateNodeData, processFlow]
  );

  const handleSigmaChange = useCallback(
    (value: number[]) => {
      updateNodeData(id, { ...data, sigma: value[0] });
      // Process flow after data update
      setTimeout(() => processFlow(), 50);
    },
    [id, data, updateNodeData, processFlow]
  );

  const handleAngleChange = useCallback(
    (value: number[]) => {
      updateNodeData(id, { ...data, angle: value[0] });
      // Process flow after data update
      setTimeout(() => processFlow(), 50);
    },
    [id, data, updateNodeData, processFlow]
  );

  const handleStrengthChange = useCallback(
    (value: number[]) => {
      updateNodeData(id, { ...data, strength: value[0] });
      // Process flow after data update
      setTimeout(() => processFlow(), 50);
    },
    [id, data, updateNodeData, processFlow]
  );

  const handleOpacityChange = useCallback(
    (value: number[]) => {
      updateNodeData(id, { ...data, opacity: value[0] });
      // Process flow after data update
      setTimeout(() => processFlow(), 50);
    },
    [id, data, updateNodeData, processFlow]
  );

  const handleCustomInputChange = useCallback(
    (key: keyof FilterNodeData, value: string) => {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        if (key === 'kernelSize') {
          updateNodeData(id, { ...data, kernelSize: Math.max(numValue, 1) });
        } else if (key === 'strength') {
          updateNodeData(id, { ...data, strength: Math.max(numValue, 0.1) });
        } else if (key === 'sigma') {
          updateNodeData(id, { ...data, sigma: numValue });
        } else if (key === 'intensity') {
          updateNodeData(id, { ...data, intensity: numValue });
        } else if (key === 'opacity') {
          updateNodeData(id, { ...data, opacity: numValue });
        } else if (key === 'angle') {
          updateNodeData(id, { ...data, angle: numValue });
        }

        // Process flow after data update
        setTimeout(() => processFlow(), 50);
      }
    },
    [id, data, updateNodeData, processFlow]
  );

  // Whether we need to show blur-specific controls
  const isBlurFilter = data.type === 'blur';
  const isSharpenFilter = data.type === 'sharpen';
  const isGrayscaleFilter = data.type === 'grayscale';
  const isSepiaFilter = data.type === 'sepia';
  const isInvertFilter = data.type === 'invert';
  // Ensure we have a valid blur algorithm with fallback
  const currentBlurAlgorithm = data.blurAlgorithm && ['gaussian', 'box', 'stack', 'motion'].includes(data.blurAlgorithm)
    ? data.blurAlgorithm
    : 'gaussian';

  return (
    <BaseNode className="w-72" selected={selected}>
      <NodeHeader>
        <NodeHeaderTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>{data.title || 'Filter'}</span>
          </div>
        </NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderMenuAction label="Open node menu">
            <DropdownMenuItem onSelect={handleDelete}>Delete</DropdownMenuItem>
          </NodeHeaderMenuAction>
        </NodeHeaderActions>
      </NodeHeader>

      <div className="p-3 space-y-4">
        {/* Filter Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="filter-type" className="flex items-center gap-1.5">
            <LayoutTemplate className="h-3.5 w-3.5" />
            Filter Type
          </Label>
          <select
            id="filter-type"
            className="w-full h-9 px-3 py-2 text-sm bg-transparent border border-input rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            value={data.type ?? 'blur'}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option value="blur">Blur</option>
            <option value="sharpen">Sharpen</option>
            <option value="grayscale">Grayscale</option>
            <option value="sepia">Sepia</option>
            <option value="invert">Invert</option>
          </select>
        </div>

        {/* Blur-specific controls */}
        {isBlurFilter && (
          <div className="">
            <div className=" space-y-3">
              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" opacity="0.2" />
                    <circle cx="12" cy="12" r="6" opacity="0.6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                  Blur Algorithm
                </Label>
                <select
                  className="w-full h-9 px-3 py-2 text-sm bg-transparent border border-input rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  value={currentBlurAlgorithm}
                  onChange={(e) => handleBlurAlgorithmChange(e.target.value)}
                >
                  <option value="gaussian">Gaussian Blur</option>
                  <option value="box">Box Blur</option>
                  <option value="stack">Stack Blur</option>
                  <option value="motion">Motion Blur</option>
                </select>
              </div>

              {/* Parameters based on blur algorithm */}
              {currentBlurAlgorithm === 'gaussian' && (
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs flex justify-between">
                      <span>Radius: {data.kernelSize || 3}</span>
                      <span className="text-muted-foreground">(pixels)</span>
                    </Label>
                    <Slider
                      min={3}
                      max={21}
                      step={2} // Only odd numbers
                      value={[data.kernelSize as number || 3]}
                      onValueChange={handleKernelSizeChange}
                      className="w-full"
                    />
                    <input
                      type="number"
                      className="w-full h-8 px-2 text-sm border border-input rounded-md"
                      value={data.kernelSize as number || 3}
                      onChange={(e) => handleCustomInputChange('kernelSize', e.target.value)}
                      min={1}
                      max={21}
                      step={2}
                    />
                  </div>

                  <div>
                    <Label className="text-xs flex justify-between">
                      <span>Sigma: {data.sigma || 2}</span>
                      <span className="text-muted-foreground">(strength)</span>
                    </Label>
                    <Slider
                      min={0.5}
                      max={10}
                      step={0.5}
                      value={[data.sigma as number || 2]}
                      onValueChange={handleSigmaChange}
                      className="w-full"
                    />
                    <input
                      type="number"
                      className="w-full h-8 px-2 text-sm border border-input rounded-md"
                      value={data.sigma as number || 2}
                      onChange={(e) => handleCustomInputChange('sigma', e.target.value)}
                      min={0.5}
                      max={10}
                      step={0.5}
                    />
                  </div>
                </div>
              )}

              {currentBlurAlgorithm === 'box' && (
                <div>
                  <Label className="text-xs flex justify-between">
                    <span>Radius: {data.kernelSize || 3}</span>
                    <span className="text-muted-foreground">(pixels)</span>
                  </Label>
                  <Slider
                    min={1}
                    max={20}
                    step={1}
                    value={[data.kernelSize as number || 3]}
                    onValueChange={handleKernelSizeChange}
                    className="w-full"
                  />
                  <input
                    type="number"
                    className="w-full h-8 px-2 text-sm border border-input rounded-md"
                    value={data.kernelSize as number || 3}
                    onChange={(e) => handleCustomInputChange('kernelSize', e.target.value)}
                    min={1}
                    max={20}
                    step={1}
                  />
                </div>
              )}

              {currentBlurAlgorithm === 'stack' && (
                <div>
                  <Label className="text-xs flex justify-between">
                    <span>Radius: {data.kernelSize || 5}</span>
                    <span className="text-muted-foreground">(pixels)</span>
                  </Label>
                  <Slider
                    min={1}
                    max={40}
                    step={1}
                    value={[data.kernelSize as number || 5]}
                    onValueChange={handleKernelSizeChange}
                    className="w-full"
                  />
                  <input
                    type="number"
                    className="w-full h-8 px-2 text-sm border border-input rounded-md"
                    value={data.kernelSize as number || 5}
                    onChange={(e) => handleCustomInputChange('kernelSize', e.target.value)}
                    min={1}
                    max={40}
                    step={1}
                  />
                </div>
              )}

              {currentBlurAlgorithm === 'motion' && (
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs flex justify-between">
                      <span>Length: {data.kernelSize || 9}</span>
                      <span className="text-muted-foreground">(pixels)</span>
                    </Label>
                    <Slider
                      min={3}
                      max={30}
                      step={2}
                      value={[data.kernelSize as number || 9]}
                      onValueChange={handleKernelSizeChange}
                      className="w-full"
                    />
                    <input
                      type="number"
                      className="w-full h-8 px-2 text-sm border border-input rounded-md"
                      value={data.kernelSize as number || 9}
                      onChange={(e) => handleCustomInputChange('kernelSize', e.target.value)}
                      min={3}
                      max={30}
                      step={2}
                    />
                  </div>

                  <div>
                    <Label className="text-xs flex justify-between">
                      <span>Angle: {data.angle || 0}°</span>
                      <span className="text-muted-foreground">(degrees)</span>
                    </Label>
                    <Slider
                      min={0}
                      max={360}
                      step={15}
                      value={[data.angle as number || 0]}
                      onValueChange={handleAngleChange}
                      className="w-full"
                    />
                    <input
                      type="number"
                      className="w-full h-8 px-2 text-sm border border-input rounded-md"
                      value={data.angle as number || 0}
                      onChange={(e) => handleCustomInputChange('angle', e.target.value)}
                      min={0}
                      max={360}
                      step={15}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sharpen-specific controls */}
        {isSharpenFilter && (
          <div className="">
            <div className="space-y-2">
              <Label className="text-xs flex justify-between">
                <span>Strength: {typeof data.strength === 'number' ? data.strength : 1}</span>
                <span className="text-muted-foreground">(intensity)</span>
              </Label>
              <Slider
                min={0.1}
                max={5}
                step={0.1}
                value={[data.strength as number || 1]}
                onValueChange={handleStrengthChange}
                className="w-full"
              />
              <input
                type="number"
                className="w-full h-8 px-2 text-sm border border-input rounded-md"
                value={data.strength as number || 1}
                onChange={(e) => handleCustomInputChange('strength', e.target.value)}
                min="0.1"
                max="5"
                step="0.1"
              />
            </div>
          </div>
        )}

        {/* Grayscale-specific controls */}
        {isGrayscaleFilter && (
          <div className="">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 7v10M2 7v10" opacity="0.5" />
                  </svg>
                  Grayscale Method
                </Label>
                <select
                  className="w-full h-8 px-2 text-sm border border-input rounded-md"
                  value={data.grayscaleAlgorithm as string || 'luminosity'}
                  onChange={(e) => updateNodeData(id, { ...data, grayscaleAlgorithm: e.target.value })}
                >
                  <option value="average">Average</option>
                  <option value="luminosity">Luminosity</option>
                  <option value="lightness">Lightness</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs flex justify-between">
                  <span>Intensity: {data.intensity || 100}%</span>
                  <span className="text-muted-foreground">(effect)</span>
                </Label>
                <Slider
                  min={0}
                  max={100}
                  step={10}
                  value={[data.intensity as number || 100]}
                  onValueChange={handleIntensityChange}
                  className="w-full"
                />
                <input
                  type="number"
                  className="w-full h-8 px-2 text-sm border border-input rounded-md"
                  value={data.intensity as number || 100}
                  onChange={(e) => handleCustomInputChange('intensity', e.target.value)}
                  min="0"
                  max="100"
                  step="10"
                />
              </div>
            </div>
          </div>
        )}

        {/* Sepia-specific controls */}
        {isSepiaFilter && (
          <div className="">
            <div className="space-y-2">
              <Label className="text-xs flex justify-between">
                <span>Intensity: {data.intensity || 100}%</span>
                <span className="text-muted-foreground">(effect)</span>
              </Label>
              <Slider
                min={0}
                max={100}
                step={10}
                value={[data.intensity as number || 100]}
                onValueChange={handleIntensityChange}
                className="w-full"
              />
              <input
                type="number"
                className="w-full h-8 px-2 text-sm border border-input rounded-md"
                value={data.intensity as number || 100}
                onChange={(e) => handleCustomInputChange('intensity', e.target.value)}
                min="0"
                max="100"
                step="10"
              />
            </div>
          </div>
        )}

        {/* Invert-specific controls */}
        {isInvertFilter && (
          <div className="">
            <div className="space-y-2">
              <Label className="text-xs flex justify-between">
                <span>Opacity: {typeof data.opacity === 'number' ? data.opacity : 100}%</span>
                <span className="text-muted-foreground">(effect)</span>
              </Label>
              <Slider
                min={0}
                max={100}
                step={10}
                value={[data.opacity as number || 100]}
                onValueChange={handleOpacityChange}
                className="w-full"
              />
              <input
                type="number"
                className="w-full h-8 px-2 text-sm border border-input rounded-md"
                value={data.opacity as number || 100}
                onChange={(e) => handleCustomInputChange('opacity', e.target.value)}
                min="0"
                max="100"
                step="10"
              />
            </div>
          </div>
        )}

      </div>

      <footer className="bg-gray-100 -m-2 mt-2">
        <LabeledHandle
          title="in"
          id="in"
          type="target"
          position={Position.Left}
        />
        <LabeledHandle
          title="out"
          id="out"
          type="source"
          position={Position.Right}
        />
      </footer>
    </BaseNode>
  );
}
