"use client";
import React, { useCallback, useState } from 'react';
import { type NodeProps, Position, useReactFlow, Node } from '@xyflow/react';
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
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useObjectDetection } from '@/hooks/useObjectDetection';
import type { DetectNodeData } from '@/components/flow/types';

type DetectNodeProps = NodeProps & {
  data: {
    sensitivity: number;
    title?: string;
    detectedObjects?: Array<{ name: string; confidence: number }>;
  };
};

export function DetectNode({ id, data, selected }: DetectNodeProps) {
  const { setNodes, updateNodeData, getNode, getNodes } = useReactFlow();
  const { detectObjects, isProcessing } = useObjectDetection();

  const handleDelete = useCallback(() => {
    setNodes((nodes: Node[]) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  const handleSensitivityChange = useCallback(
    (value: number[]) => {
      updateNodeData(id, {
        ...data,
        sensitivity: value[0],
      });
    },
    [id, data, updateNodeData]
  );

  // Find connected input node to get its image URL
  const performObjectDetection = useCallback(async () => {
    // Find a node that has an image URL and is likely the input
    const inputNode = getNodes().find((node: Node) => {
      // Look for image nodes that might be connected
      return node.type === 'image' && node.data && typeof node.data.imageUrl === 'string';
    });

    if (!inputNode || !inputNode.data || typeof inputNode.data.imageUrl !== 'string') {
      console.log('No input image found for object detection');
      return;
    }

    // Call the API to detect objects
    const objects = await detectObjects(inputNode.data.imageUrl as string);

    // Update the node data with the detected objects
    if (objects) {
      updateNodeData(id, {
        ...data,
        detectedObjects: objects
      });
    }
  }, [id, getNodes, detectObjects, updateNodeData, data]);

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

        <div className="flex justify-between items-center mt-4">
          <Label className="text-xs">AI Detection</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={performObjectDetection}
            disabled={isProcessing}
            className="text-xs h-7"
          >
            {isProcessing ? 'Analyzing...' : 'Detect Objects'}
          </Button>
        </div>

        {data.detectedObjects && data.detectedObjects.length > 0 ? (
          <div className="mt-2 border rounded-md p-2 bg-slate-50 dark:bg-slate-900 max-h-32 overflow-y-auto">
            <p className="text-xs font-semibold mb-1">Detected Objects:</p>
            <ul className="space-y-1">
              {data.detectedObjects.map((obj, idx) => (
                <li key={idx} className="text-xs flex justify-between">
                  <span>{obj.name}</span>
                  <span className="text-slate-500">{Math.round(obj.confidence * 100)}%</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            <p>Higher sensitivity detects more objects but may include false positives.</p>
            <p className="mt-1 italic">Click Detect Objects to analyze the image</p>
          </div>
        )}
      </div>

      <footer className="bg-gray-100 -m-2 mt-2">
        <LabeledHandle
          title="in" id="in" type="target" position={Position.Left} />
      </footer>
    </BaseNode>
  );
}
