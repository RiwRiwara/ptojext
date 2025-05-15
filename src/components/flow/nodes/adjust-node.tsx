"use client";
import React, { useCallback } from 'react';
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
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import type { AdjustNodeData } from '@/components/flow/types';

type AdjustNodeProps = NodeProps & {
  data: AdjustNodeData;
};

export function AdjustNode({ id, data }: AdjustNodeProps) {
  const { updateNodeData, setNodes } = useReactFlow();

  const handleDelete = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  const handleBrightnessChange = useCallback((value: number[]) => {
    updateNodeData(id, { ...data, brightness: value[0] });
  }, [id, data, updateNodeData]);

  const handleContrastChange = useCallback((value: number[]) => {
    updateNodeData(id, { ...data, contrast: value[0] });
  }, [id, data, updateNodeData]);

  const handleSaturationChange = useCallback((value: number[]) => {
    updateNodeData(id, { ...data, saturation: value[0] });
  }, [id, data, updateNodeData]);

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
          <Label htmlFor="brightness">Brightness: {data.brightness || 0}</Label>
          <Slider
            id="brightness"
            defaultValue={[data.brightness || 0]}
            min={-100}
            max={100}
            step={1}
            onValueChange={handleBrightnessChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contrast">Contrast: {data.contrast || 0}</Label>
          <Slider
            id="contrast"
            defaultValue={[data.contrast || 0]}
            min={-100}
            max={100}
            step={1}
            onValueChange={handleContrastChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="saturation">Saturation: {data.saturation || 0}</Label>
          <Slider
            id="saturation"
            defaultValue={[data.saturation || 0]}
            min={-100}
            max={100}
            step={1}
            onValueChange={handleSaturationChange}
            className="w-full"
          />
        </div>
      </div>

      <footer className="bg-gray-100 -m-5">
        <LabeledHandle title="in" id="in" type="target" position={Position.Left} />
        <LabeledHandle title="out" id="out" type="source" position={Position.Right} />
      </footer>
    </BaseNode>
  );
}
