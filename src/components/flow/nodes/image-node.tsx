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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import type { ImageNodeData } from '@/components/flow/types';

type ImageNodeProps = NodeProps & {
  data: ImageNodeData;
};

export function ImageNode({ id, data }: ImageNodeProps) {
  const { updateNodeData, setNodes } = useReactFlow();

  const handleDelete = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  return (
    <BaseNode className="w-64">
      <NodeHeader>
        <NodeHeaderTitle>{data.title || 'Image'}</NodeHeaderTitle>
      </NodeHeader>

      <div className="my-2 p-1 flex justify-center">
        {data.imageUrl ? (
          <Image
            src={data.imageUrl}
            alt={data.title || 'Image'}
            width={256}
            height={256}
            className="max-w-full max-h-40 object-contain rounded"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded">
            <span className="text-gray-500">No image</span>
          </div>
        )}
      </div>

      <footer className="bg-gray-100 -m-2 rounded-b-md">
        <LabeledHandle title="output" type="source" position={Position.Right} />
      </footer>
    </BaseNode>
  );
}
