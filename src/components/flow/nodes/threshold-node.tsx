"use client";
import React, { useCallback } from 'react';
import { type NodeProps, Position, useReactFlow } from '@xyflow/react';
import { Grid } from 'lucide-react';

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
import type { ThresholdNodeData } from '@/components/flow/types';
import { useImageProcessingFlow } from '@/hooks/useImageProcessingFlow';

type ThresholdNodeProps = NodeProps & {
  data: ThresholdNodeData;
};

export function ThresholdNode({ id, data, selected }: ThresholdNodeProps) {
  const { setNodes, updateNodeData } = useReactFlow();
  const { processFlow } = useImageProcessingFlow();

  const handleDelete = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  const handleThresholdChange = useCallback(
    (value: number[]) => {
      updateNodeData(id, { ...data, threshold: value[0] });
      // Process flow after data update
      setTimeout(() => processFlow(), 50);
    },
    [id, data, updateNodeData, processFlow]
  );

  const handleInvertedChange = useCallback(
    (checked: boolean) => {
      updateNodeData(id, { ...data, inverted: checked });
      // Process flow after data update
      setTimeout(() => processFlow(), 50);
    },
    [id, data, updateNodeData, processFlow]
  );

  return (
    <BaseNode selected={selected} className="w-[280px]">
      <NodeHeader>
        <NodeHeaderTitle>
          <Grid className="w-4 h-4 mr-2 text-primary" />
          {data.title || "Threshold"}
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
            <span>Threshold: {data.threshold}</span>
            <span className="text-muted-foreground">(0-255)</span>
          </Label>
          <Slider
            min={0}
            max={255}
            step={1}
            value={[data.threshold]}
            onValueChange={handleThresholdChange}
            className="w-full"
          />
          <input
            type="number"
            className="w-full h-8 px-2 text-sm border border-input rounded-md"
            value={data.threshold}
            onChange={(e) => updateNodeData(id, { ...data, threshold: Number(e.target.value) })}
            min="0"
            max="255"
            step="1"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="inverted-toggle" className="text-sm">
            Invert Threshold
          </Label>
          <Switch
            id="inverted-toggle"
            checked={data.inverted}
            onCheckedChange={handleInvertedChange}
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
