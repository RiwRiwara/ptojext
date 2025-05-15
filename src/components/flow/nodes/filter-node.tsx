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
import { DropdownMenuItem } from '@/components//ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FilterNodeData } from '@/components/flow/types';

type FilterNodeProps = NodeProps & {
  data: FilterNodeData;
};

export function FilterNode({ id, data }: FilterNodeProps) {
  const { updateNodeData, setNodes } = useReactFlow();

  const handleDelete = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  const handleTypeChange = useCallback((value: string) => {
    updateNodeData(id, {
      ...data,
      type: value as FilterNodeData['type']
    });
  }, [id, data, updateNodeData]);

  const handleIntensityChange = useCallback((value: number[]) => {
    updateNodeData(id, { ...data, intensity: value[0] });
  }, [id, data, updateNodeData]);

  return (
    <BaseNode className="w-64">
      <NodeHeader>
        <NodeHeaderTitle>Filter</NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderMenuAction label="Open node menu">
            <DropdownMenuItem onSelect={handleDelete}>Delete</DropdownMenuItem>
          </NodeHeaderMenuAction>
        </NodeHeaderActions>
      </NodeHeader>

      <div className="p-2 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="filter-type">Filter Type</Label>
          <Select
            value={data.type || 'blur'}
            onValueChange={handleTypeChange}
          >
            <SelectTrigger id="filter-type">
              <SelectValue placeholder="Select filter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blur">Blur</SelectItem>
              <SelectItem value="sharpen">Sharpen</SelectItem>
              <SelectItem value="grayscale">Grayscale</SelectItem>
              <SelectItem value="sepia">Sepia</SelectItem>
              <SelectItem value="invert">Invert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="intensity">Intensity: {data.intensity || 0}</Label>
          <Slider
            id="intensity"
            defaultValue={[data.intensity || 0]}
            max={100}
            step={1}
            onValueChange={handleIntensityChange}
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
