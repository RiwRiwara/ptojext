"use client";
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { type NodeProps, Position, useReactFlow } from '@xyflow/react';

import { BaseNode } from '@/components/flow/base-node';
import { LabeledHandle } from '@/components/flow/labeled-handle';
import {
  NodeHeader,
  NodeHeaderTitle,
  NodeHeaderActions,
  NodeHeaderMenuAction,
} from '@/components/flow/node-header';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

import type { AdjustNodeData } from '@/components/flow/types';

type AdjustNodeProps = NodeProps & {
  data: AdjustNodeData;
};

export function AdjustNode({ id, data }: AdjustNodeProps) {
  const { updateNodeData, setNodes } = useReactFlow();
  const [localBrightness, setLocalBrightness] = useState(data.brightness || 0);
  const [localContrast, setLocalContrast] = useState(data.contrast || 0);
  const [localSaturation, setLocalSaturation] = useState(data.saturation || 0);
  
  // Track if we're currently adjusting a slider
  const isAdjusting = useRef(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local state with node data if it changes externally
  useEffect(() => {
    if (!isAdjusting.current) {
      setLocalBrightness(data.brightness || 0);
      setLocalContrast(data.contrast || 0);
      setLocalSaturation(data.saturation || 0);
    }
  }, [data]);

  const handleDelete = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  // Debounced update function that only updates the actual node data
  // when slider interaction stops
  const debouncedUpdate = useCallback(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      isAdjusting.current = false;
      updateNodeData(id, { 
        ...data, 
        brightness: localBrightness,
        contrast: localContrast,
        saturation: localSaturation 
      });
    }, 300); // 300ms debounce
  }, [id, data, updateNodeData, localBrightness, localContrast, localSaturation]);

  // Handle slider changes by updating local state without triggering immediate node updates
  const handleBrightnessChange = useCallback((value: number[]) => {
    isAdjusting.current = true;
    setLocalBrightness(value[0]);
    debouncedUpdate();
  }, [debouncedUpdate]);

  const handleContrastChange = useCallback((value: number[]) => {
    isAdjusting.current = true;
    setLocalContrast(value[0]);
    debouncedUpdate();
  }, [debouncedUpdate]);

  const handleSaturationChange = useCallback((value: number[]) => {
    isAdjusting.current = true;
    setLocalSaturation(value[0]);
    debouncedUpdate();
  }, [debouncedUpdate]);

  return (
    <BaseNode className="w-64">
      <NodeHeader>
        <NodeHeaderTitle>Color Adjust</NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderMenuAction label="Open node menu">
            <DropdownMenuItem onSelect={handleDelete}>Delete</DropdownMenuItem>
          </NodeHeaderMenuAction>
        </NodeHeaderActions>
      </NodeHeader>

      <div className="p-2 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="brightness">Brightness: {localBrightness}</Label>
          <Slider
            id="brightness"
            value={[localBrightness]}
            min={-100}
            max={100}
            step={1}
            onValueChange={handleBrightnessChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contrast">Contrast: {localContrast}</Label>
          <Slider
            id="contrast"
            value={[localContrast]}
            min={-100}
            max={100}
            step={1}
            onValueChange={handleContrastChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="saturation">Saturation: {localSaturation}</Label>
          <Slider
            id="saturation"
            value={[localSaturation]}
            min={-100}
            max={100}
            step={1}
            onValueChange={handleSaturationChange}
            className="w-full"
          />
        </div>
      </div>

      <footer className="bg-gray-100 -m-2 mt-2">
        <LabeledHandle title="in" id="in" type="target" position={Position.Left} />
        <LabeledHandle title="out" id="out" type="source" position={Position.Right} />
      </footer>
    </BaseNode>
  );
}
