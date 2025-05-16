"use client";
import React, { useCallback } from 'react';
import { type NodeProps, Position, useReactFlow } from '@xyflow/react';
import { Waves } from 'lucide-react';

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
import type { NoiseReductionNodeData } from '@/components/flow/types';
import { useImageProcessingFlow } from '@/hooks/useImageProcessingFlow';

type NoiseReductionNodeProps = NodeProps & {
  data: NoiseReductionNodeData;
};

export function NoiseReductionNode({ id, data, selected }: NoiseReductionNodeProps) {
  const { setNodes, updateNodeData } = useReactFlow();
  const { processFlow } = useImageProcessingFlow();

  const handleDelete = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  const handleAlgorithmChange = useCallback(
    (value: string) => {
      updateNodeData(id, { 
        ...data, 
        algorithm: value as NoiseReductionNodeData['algorithm']
      });
      setTimeout(() => processFlow(), 50);
    },
    [id, data, updateNodeData, processFlow]
  );

  const handleIntensityChange = useCallback(
    (value: number[]) => {
      updateNodeData(id, { ...data, intensity: value[0] });
      setTimeout(() => processFlow(), 50);
    },
    [id, data, updateNodeData, processFlow]
  );

  return (
    <BaseNode selected={selected} className="w-[280px]">
      <NodeHeader>
        <NodeHeaderTitle>
          <Waves className="w-4 h-4 mr-2 text-blue-500" />
          {data.title || "Noise Reduction"}
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
          <Label className="text-xs">Reduction Method</Label>
          <select
            className="w-full h-8 px-2 text-sm border border-input rounded-md bg-background"
            value={data.algorithm}
            onChange={(e) => handleAlgorithmChange(e.target.value)}
          >
            <option value="median">Median Filter</option>
            <option value="gaussian">Gaussian Filter</option>
            <option value="bilateral">Bilateral Filter</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs flex justify-between">
            <span>Intensity: {data.intensity}%</span>
            <span className="text-muted-foreground">(strength)</span>
          </Label>
          <Slider
            min={0}
            max={100}
            step={5}
            value={[data.intensity]}
            onValueChange={handleIntensityChange}
            className="w-full"
          />
          <input
            type="number"
            className="w-full h-8 px-2 text-sm border border-input rounded-md"
            value={data.intensity}
            onChange={(e) => updateNodeData(id, { ...data, intensity: Number(e.target.value) })}
            min="0"
            max="100"
            step="5"
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
