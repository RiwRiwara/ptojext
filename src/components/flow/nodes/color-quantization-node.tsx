"use client";
import React, { useCallback } from 'react';
import { type NodeProps, Position, useReactFlow } from '@xyflow/react';
import { Palette } from 'lucide-react';

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
import { Switch } from '@/components/ui/switch';
import type { ColorQuantizationNodeData } from '@/components/flow/types';
import { useImageProcessingFlow } from '@/hooks/useImageProcessingFlow';

type ColorQuantizationNodeProps = NodeProps & {
  data: ColorQuantizationNodeData;
};

export function ColorQuantizationNode({ id, data, selected }: ColorQuantizationNodeProps) {
  const { setNodes, updateNodeData } = useReactFlow();
  const { processFlow } = useImageProcessingFlow();

  const handleDelete = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  const handleColorsChange = useCallback(
    (value: number[]) => {
      updateNodeData(id, { ...data, colors: value[0] });
      setTimeout(() => processFlow(), 50);
    },
    [id, data, updateNodeData, processFlow]
  );

  const handleDitheringChange = useCallback(
    (checked: boolean) => {
      updateNodeData(id, { ...data, dithering: checked });
      setTimeout(() => processFlow(), 50);
    },
    [id, data, updateNodeData, processFlow]
  );

  return (
    <BaseNode selected={selected} className="w-[280px]">
      <NodeHeader>
        <NodeHeaderTitle>
          <Palette className="w-4 h-4 mr-2 text-pink-500" />
          {data.title || "Color Quantization"}
        </NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderMenuAction label="Open node menu">
            <DropdownMenuItem onSelect={handleDelete} className="text-destructive">
              Delete
            </DropdownMenuItem>
          </NodeHeaderMenuAction>
        </NodeHeaderActions>
      </NodeHeader>

      <div className="p-5 flex flex-col gap-4">
        <div className="space-y-2">
          <Label className="text-xs flex justify-between">
            <span>Colors: {data.colors}</span>
            <span className="text-muted-foreground">(2-256)</span>
          </Label>
          <Slider
            min={2}
            max={64}
            step={1}
            value={[data.colors]}
            onValueChange={handleColorsChange}
            className="w-full"
          />
          <input
            type="number"
            className="w-full h-8 px-2 text-sm border border-input rounded-md"
            value={data.colors}
            onChange={(e) => updateNodeData(id, { ...data, colors: Number(e.target.value) })}
            min="2"
            max="256"
            step="1"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="dithering-toggle" className="text-sm">
            Apply Dithering
          </Label>
          <Switch
            id="dithering-toggle"
            checked={data.dithering}
            onCheckedChange={handleDitheringChange}
          />
        </div>
      </div>

      <footer className="bg-slate-100 dark:bg-slate-800 -m-2 mt-2 rounded-b-lg">
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
