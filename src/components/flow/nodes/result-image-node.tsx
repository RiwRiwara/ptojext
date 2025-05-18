"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { type NodeProps, Position } from '@xyflow/react';
import { Download, ExternalLink, Save, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { FiDownload, FiImage, FiCheckCircle, FiTarget, FiFlag, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';

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
    <BaseNode className="w-72 shadow-lg relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(167, 139, 250, 0.08) 4px, transparent 0)', backgroundSize: '20px 20px' }}>

      <motion.div
        className="absolute -right-3 -top-3 bg-purple-500 rounded-full p-1 shadow-md z-10"
        whileHover={{ scale: 1.1 }}
        animate={{ rotate: [0, 10, 0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <FiCheckCircle className="text-white text-sm" />
      </motion.div>

      <NodeHeader className="">
        <NodeHeaderTitle className="font-bold text-purple-700 dark:text-purple-300">
          <FiTarget className="inline-block mr-2 text-purple-500" />
          {data.title || 'Result Image'}
        </NodeHeaderTitle>
      </NodeHeader>

      <div className="my-2 p-3 flex flex-col items-center gap-3">
        {data.imageUrl ? (
          <>
            <div
              className="w-full h-40 flex items-center justify-center rounded-lg border-2 border-purple-200 dark:border-purple-800 overflow-hidden shadow-sm relative group"
              style={{ cursor: 'zoom-in' }}
            >
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-40 object-contain"
                onClick={() => setIsModalOpen(true)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center transition-all duration-200 group-hover:bg-opacity-50">
                <motion.div
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                >
                  <ExternalLink className="h-5 w-5 text-white" />
                </motion.div>
              </div>
            </div>
            <div className="w-full flex justify-between items-center mt-1">
              <Button
                onClick={handleDownload}
                variant="ghost"
                size="sm"
                className="text-purple-700 hover:bg-purple-100 dark:text-purple-300 dark:hover:bg-purple-900/30 transition-all"
                aria-label="Download output image"
              >
                <FiDownload className="h-4 w-4 mr-1" /> Download
              </Button>
              <span className="text-xs text-purple-500 font-medium">Final Result</span>
            </div>
          </>
        ) : (
          <div className="w-full h-40 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/30 flex flex-col items-center justify-center rounded-lg border-dashed border-2 border-purple-300 dark:border-purple-700">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <FiFlag className="h-8 w-8 text-purple-500 mb-2" />
            </motion.div>
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Processing output...</span>
            <span className="text-xs text-purple-500 mt-1">Connect input nodes to see results</span>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          <DialogTitle className="sr-only" key="dialog-title">{data.title || 'Result Image'}</DialogTitle>
          <div className="relative" key="dialog-content">
            <img
              key="result-image"
              src={data.imageUrl}
              alt={data.title || 'Result Image'}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <Button
              key="close-button"
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

      <footer className="bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 -m-2 rounded-b-lg border-t border-purple-200 dark:border-purple-800 relative pt-1 pb-3">
        <div className="absolute bottom-1 left-2 flex items-center justify-start">
          <FiArrowLeft className="text-purple-500 h-3 w-3 mr-" />
          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Input</span>
        </div>
        <LabeledHandle
          connection_count={1}
          title=""
          id="in"
          type="target"
          position={Position.Left}
          handleClassName="border-purple-500 bg-purple-200 hover:bg-purple-400 shadow-md m-1.5"
        />
      </footer>
    </BaseNode>
  );
}