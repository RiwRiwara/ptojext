"use client";
import React, { useCallback } from 'react';
import { type NodeProps, Position, useReactFlow } from '@xyflow/react';
import { ZapIcon } from 'lucide-react';

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
import type { EdgeDetectionNodeData } from '@/components/flow/types';
import { useImageProcessingFlow } from '@/hooks/useImageProcessingFlow';

type EdgeDetectionNodeProps = NodeProps & {
  data: EdgeDetectionNodeData;
};

export function EdgeDetectionNode({ id, data, selected }: EdgeDetectionNodeProps) {
  const { setNodes, updateNodeData } = useReactFlow();
  const { processFlow } = useImageProcessingFlow();

  const handleDelete = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  const handleAlgorithmChange = useCallback(
    (value: string) => {
      updateNodeData(id, { 
        ...data, 
        algorithm: value as EdgeDetectionNodeData['algorithm']
      });
      setTimeout(() => processFlow(), 50);
    },
    [id, data, updateNodeData, processFlow]
  );

  const handleThresholdChange = useCallback(
    (value: number[]) => {
      updateNodeData(id, { ...data, threshold: value[0] });
      setTimeout(() => processFlow(), 50);
    },
    [id, data, updateNodeData, processFlow]
  );

  const isCannyAlgorithm = data.algorithm === 'canny';

  return (
    <BaseNode selected={selected} className="w-[280px]">
      <NodeHeader>
        <NodeHeaderTitle>
          <ZapIcon className="w-4 h-4 mr-2 text-amber-500" />
          {data.title || "Edge Detection"}
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
          <Label className="text-xs">Algorithm</Label>
          <select
            className="w-full h-8 px-2 text-sm border border-input rounded-md bg-background"
            value={data.algorithm}
            onChange={(e) => handleAlgorithmChange(e.target.value)}
          >
            <option value="sobel">Sobel</option>
            <option value="canny">Canny</option>
            <option value="prewitt">Prewitt</option>
            <option value="roberts">Roberts</option>
          </select>
        </div>

        {isCannyAlgorithm && (
          <div className="space-y-2">
            <Label className="text-xs flex justify-between">
              <span>Threshold: {data.threshold}</span>
              <span className="text-muted-foreground">(sensitivity)</span>
            </Label>
            <Slider
              min={10}
              max={255}
              step={5}
              value={[data.threshold || 50]}
              onValueChange={handleThresholdChange}
              className="w-full"
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
