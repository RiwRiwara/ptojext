"use client";
import React, { useCallback } from 'react';
import { type NodeProps, Position, useReactFlow } from '@xyflow/react';
import { ScanFace } from 'lucide-react';

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
import type { DetectNodeData } from '@/components/flow/types';

type DetectNodeProps = NodeProps & {
  data: DetectNodeData;
};

export function DetectNode({ id, data, selected }: DetectNodeProps) {
  const { setNodes } = useReactFlow();

  const handleDelete = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  const handleSensitivityChange = useCallback(
    (value: number[]) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                sensitivity: value[0],
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
            <ScanFace className="h-4 w-4" />
            <span>{data.title || 'Object Detection'}</span>
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
          <Label>Sensitivity: {data.sensitivity || 50}%</Label>
          <Slider
            min={10}
            max={100}
            step={5}
            value={[data.sensitivity || 50]}
            onValueChange={handleSensitivityChange}
          />
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>Higher sensitivity detects more objects but may include false positives.</p>
        </div>
      </div>

      <footer className="bg-gray-100 -m-2 mt-2">
        <LabeledHandle title="in" id="in" type="target" position={Position.Left} />
        <LabeledHandle title="out" id="out" type="source" position={Position.Right} />
      </footer>
    </BaseNode>
  );
}
