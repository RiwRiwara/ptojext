"use client";
import React, { useCallback } from 'react';
import { type NodeProps, Position, useReactFlow } from '@xyflow/react';
import { Layers } from 'lucide-react';

import { BaseNode } from '@/components/flow/base-node';
import { LabeledHandle } from '@/components/flow/labeled-handle';
import {
  NodeHeader,
  NodeHeaderTitle,
  NodeHeaderActions,
  NodeHeaderMenuAction,
} from '@/components/flow/node-header';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { SplitNodeData } from '@/components/flow/types';

type SplitNodeProps = NodeProps & {
  data: SplitNodeData;
};

export function SplitNode({ id, data, selected }: SplitNodeProps) {
  const { setNodes } = useReactFlow();

  const handleDelete = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  const handleChannelChange = useCallback(
    (channel: string) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                channel: channel as 'red' | 'green' | 'blue',
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
            <Layers className="h-4 w-4" />
            <span>{data.title || 'Channel Split'}</span>
          </div>
        </NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderMenuAction label="Open node menu">
            <DropdownMenuItem onSelect={handleDelete}>Delete</DropdownMenuItem>
          </NodeHeaderMenuAction>
        </NodeHeaderActions>
      </NodeHeader>

      <div className="p-4">
        <RadioGroup
          value={data.channel || 'red'}
          onValueChange={handleChannelChange}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="red" id="red" />
            <Label htmlFor="red" className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
              Red Channel
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="green" id="green" />
            <Label htmlFor="green" className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              Green Channel
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="blue" id="blue" />
            <Label htmlFor="blue" className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              Blue Channel
            </Label>
          </div>
        </RadioGroup>
      </div>

      <footer className="bg-gray-100 -m-2 mt-2">
        <LabeledHandle title="in" id="in" type="target" position={Position.Left} />
        <LabeledHandle title="out" id="out" type="source" position={Position.Right} />
      </footer>
    </BaseNode>
  );
}
