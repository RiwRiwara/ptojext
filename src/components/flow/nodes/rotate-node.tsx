"use client";
import React, { useCallback } from 'react';
import { type NodeProps, Position, useReactFlow } from '@xyflow/react';
import { RotateCw } from 'lucide-react';

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
import type { RotateNodeData } from '@/components/flow/types';

type RotateNodeProps = NodeProps & {
  data: RotateNodeData;
};

export function RotateNode({ id, data, selected }: RotateNodeProps) {
  const { setNodes } = useReactFlow();

  const handleDelete = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  const handleAngleChange = useCallback(
    (value: number[]) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                angle: value[0],
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
            <RotateCw className="h-4 w-4" />
            <span>{data.title || 'Rotate'}</span>
          </div>
        </NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderMenuAction label="Open node menu">
            <DropdownMenuItem onSelect={handleDelete}>Delete</DropdownMenuItem>
          </NodeHeaderMenuAction>
        </NodeHeaderActions>
      </NodeHeader>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <Label>Angle: {data.angle || 0}°</Label>
          <Slider
            min={-180}
            max={180}
            step={5}
            value={[data.angle || 0]}
            onValueChange={handleAngleChange}
          />
        </div>
        
        <div className="flex justify-center">
          <div className="relative w-20 h-20 border border-dashed border-gray-300 rounded-full flex items-center justify-center">
            <div className="absolute w-1 h-10 bg-primary/70 origin-bottom transform" style={{ transform: `rotate(${data.angle || 0}deg)` }}></div>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-100 -m-2 mt-2">
        <LabeledHandle title="in" id="in" type="target" position={Position.Left} />
        <LabeledHandle title="out" id="out" type="source" position={Position.Right} />
      </footer>
    </BaseNode>
  );
}
