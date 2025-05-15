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
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import Image from 'next/image';
import type { OutputNodeData } from '@/components/flow/types';

type OutputNodeProps = NodeProps & {
  data: OutputNodeData;
};

export function OutputNode({ id, data }: OutputNodeProps) {
  const { setNodes } = useReactFlow();

  const handleDelete = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  const handleDownload = useCallback(() => {
    if (data.imageUrl) {
      const a = document.createElement('a');
      a.href = data.imageUrl;
      a.download = 'processed-image.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [data.imageUrl]);

  return (
    <BaseNode className="w-64">
      <NodeHeader>
        <NodeHeaderTitle>Output</NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderMenuAction label="Open node menu">
            <DropdownMenuItem onSelect={handleDelete}>Delete</DropdownMenuItem>
          </NodeHeaderMenuAction>
        </NodeHeaderActions>
      </NodeHeader>

      <div className="my-2 p-1 flex flex-col items-center gap-2">
        {data.imageUrl ? (
          <>
            <Image
              src={data.imageUrl}
              alt="Processed Output"
              width={256}
              height={256}
              className="max-w-full max-h-40 object-contain rounded"
            />
            <Button 
              onClick={handleDownload} 
              variant="secondary" 
              size="sm" 
              className="mt-2"
            >
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          </>
        ) : (
          <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded">
            <span className="text-gray-500">No output image</span>
          </div>
        )}
      </div>

      <footer className="bg-gray-100 -m-5">
        <LabeledHandle title="in" id="in" type="target" position={Position.Left} />
      </footer>
    </BaseNode>
  );
}
