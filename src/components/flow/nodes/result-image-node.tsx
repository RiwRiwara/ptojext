"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { type NodeProps, Position } from '@xyflow/react';
import { Download } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

import { BaseNode } from '@/components/flow/base-node';
import { LabeledHandle } from '@/components/flow/labeled-handle';
import {
  NodeHeader,
  NodeHeaderTitle,
} from '@/components/flow/node-header';
import { Button } from '@/components/ui/button';
import type { ResultImageNodeData } from '@/components/flow/types';
import toast from 'react-hot-toast';

type ResultImageNodeProps = NodeProps & {
  data: ResultImageNodeData;
};

export function ResultImageNode({ data }: ResultImageNodeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = useCallback(() => {
    if (!data.imageUrl) {
      toast.error('No image available for download');
      return;
    }

    try {
      const a = document.createElement('a');
      a.href = data.imageUrl;
      a.download = data.title ? `${data.title}.png` : 'processed-image.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Image downloaded successfully');
    } catch (error) {
      toast.error('Failed to download image');
      console.error('Download error:', error);
    }
  }, [data.imageUrl, data.title]);

  // Create a canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw image onto canvas when imageUrl changes
  useEffect(() => {
    if (data.imageUrl && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // Create temporary image to load the data URL
      const img = new Image();
      img.onload = () => {
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image on canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };

      // Set image source to trigger loading
      img.src = data.imageUrl;
    }
  }, [data.imageUrl]);

  return (
    <BaseNode className="w-64">
      <NodeHeader>
        <NodeHeaderTitle>{data.title || 'Result Image'}</NodeHeaderTitle>
      </NodeHeader>

      <div className="my-2 p-1 flex flex-col items-center gap-2">
        {data.imageUrl ? (
          <>
            <div className="w-full h-40 flex items-center justify-center " style={{ cursor: 'zoom-in' }}>
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-40 object-contain rounded "
                onClick={() => setIsModalOpen(true)}
              />
            </div>
            <Button
              onClick={handleDownload}
              variant="secondary"
              size="sm"
              className="mt-2"
              aria-label="Download output image"
            >
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          </>
        ) : (
          <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded">
            <span className="text-gray-500">No result image</span>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          <DialogTitle className="sr-only">{data.title || 'Result Image'}</DialogTitle>
          <div className="relative">
            <img
              src={data.imageUrl}
              alt={data.title || 'Result Image'}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 left-2"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="bg-gray-100 -m-2 rounded-b-md">
        <LabeledHandle title="in" id="in" type="target" position={Position.Left} />
      </footer>
    </BaseNode>
  );
}