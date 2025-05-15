"use client";
import React, { useCallback } from 'react';
import { type NodeProps, Position, useReactFlow } from '@xyflow/react';
import { Crop } from 'lucide-react';

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
import type { CropNodeData } from '@/components/flow/types';

type CropNodeProps = NodeProps & {
  data: CropNodeData;
};

export function CropNode({ id, data, selected }: CropNodeProps) {
  const { setNodes } = useReactFlow();

  const handleDelete = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  const handleCropChange = useCallback(
    (property: 'x' | 'y' | 'width' | 'height', value: number[]) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                [property]: value[0],
              },
            };
          }
          return node;
        })
      );
    },
    [id, setNodes]
  );

  return (
    <BaseNode className="w-64" selected={selected}>
      <NodeHeader>
        <NodeHeaderTitle>
          <div className="flex items-center gap-2">
            <Crop className="h-4 w-4" />
            <span>{data.title || 'Crop'}</span>
          </div>
        </NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderMenuAction label="Open node menu">
            <DropdownMenuItem onSelect={handleDelete}>Delete</DropdownMenuItem>
          </NodeHeaderMenuAction>
        </NodeHeaderActions>
      </NodeHeader>

      <div className="p-4 space-y-3">
        <div className="space-y-1.5">
          <Label>X Position: {data.x || 0}%</Label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[data.x || 0]}
            onValueChange={(value) => handleCropChange('x', value)}
          />
        </div>
        
        <div className="space-y-1.5">
          <Label>Y Position: {data.y || 0}%</Label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[data.y || 0]}
            onValueChange={(value) => handleCropChange('y', value)}
          />
        </div>
        
        <div className="space-y-1.5">
          <Label>Width: {data.width || 100}%</Label>
          <Slider
            min={10}
            max={100}
            step={1}
            value={[data.width || 100]}
            onValueChange={(value) => handleCropChange('width', value)}
          />
        </div>
        
        <div className="space-y-1.5">
          <Label>Height: {data.height || 100}%</Label>
          <Slider
            min={10}
            max={100}
            step={1}
            value={[data.height || 100]}
            onValueChange={(value) => handleCropChange('height', value)}
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
