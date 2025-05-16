"use client";
import React, { useCallback } from 'react';
import { type NodeProps, Position, useReactFlow } from '@xyflow/react';
import { BarChart3 } from 'lucide-react';

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
import type { HistogramEqualizationNodeData } from '@/components/flow/types';
import { useImageProcessingFlow } from '@/hooks/useImageProcessingFlow';

type HistogramEqualizationNodeProps = NodeProps & {
  data: HistogramEqualizationNodeData;
};

export function HistogramEqualizationNode({ id, data, selected }: HistogramEqualizationNodeProps) {
  const { setNodes, updateNodeData } = useReactFlow();
  const { processFlow } = useImageProcessingFlow();

  const handleDelete = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  const handleModeChange = useCallback(
    (value: string) => {
      updateNodeData(id, { 
        ...data, 
        mode: value as HistogramEqualizationNodeData['mode']
      });
      setTimeout(() => processFlow(), 50);
    },
    [id, data, updateNodeData, processFlow]
  );

  const handleClipLimitChange = useCallback(
    (value: number[]) => {
      updateNodeData(id, { ...data, clipLimit: value[0] });
      setTimeout(() => processFlow(), 50);
    },
    [id, data, updateNodeData, processFlow]
  );

  const isAdaptiveMode = data.mode === 'adaptive';

  return (
    <BaseNode selected={selected} className="w-[280px]">
      <NodeHeader>
        <NodeHeaderTitle>
          <BarChart3 className="w-4 h-4 mr-2 text-indigo-500" />
          {data.title || "Histogram Equalization"}
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
          <Label className="text-xs">Equalization Mode</Label>
          <select
            className="w-full h-8 px-2 text-sm border border-input rounded-md bg-background"
            value={data.mode}
            onChange={(e) => handleModeChange(e.target.value)}
          >
            <option value="global">Global</option>
            <option value="adaptive">Adaptive (CLAHE)</option>
          </select>
        </div>

        {isAdaptiveMode && (
          <div className="space-y-2">
            <Label className="text-xs flex justify-between">
              <span>Clip Limit: {data.clipLimit?.toFixed(1) || 2.0}</span>
              <span className="text-muted-foreground">(contrast limit)</span>
            </Label>
            <Slider
              min={0.5}
              max={8}
              step={0.5}
              value={[data.clipLimit || 2.0]}
              onValueChange={handleClipLimitChange}
              className="w-full"
            />
            <input
              type="number"
              className="w-full h-8 px-2 text-sm border border-input rounded-md"
              value={data.clipLimit || 2.0}
              onChange={(e) => updateNodeData(id, { ...data, clipLimit: Number(e.target.value) })}
              min="0.5"
              max="8"
              step="0.5"
            />
          </div>
        )}
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
