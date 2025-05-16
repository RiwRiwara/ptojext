"use client";
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { type NodeProps, Position, useReactFlow } from '@xyflow/react';

import { BaseNode } from '@/components/flow/base-node';
import { LabeledHandle } from '@/components/flow/labeled-handle';
import {
  NodeHeader,
  NodeHeaderTitle,
  NodeHeaderActions,
  NodeHeaderMenuAction,
} from '@/components/flow/node-header';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image as ImageIcon, Upload, ImagePlus, Settings, ImageDown, FileInput, Camera } from 'lucide-react';
import { FiImage, FiUpload, FiDownload, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { ImageNodeData } from '@/components/flow/types';
import { toast } from 'react-hot-toast';

type ImageNodeProps = NodeProps & {
  data: ImageNodeData;
};

// Sample preset images with categories
const presetImages = {
  nature: [
    { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e', name: 'Sunset Mountains' },
    { url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9', name: 'Green Forest' },
    { url: 'https://images.unsplash.com/photo-1418489098061-ce87b5dc3aee', name: 'Winter Lake' },
  ],
  medical: [
    { url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118', name: 'X-Ray' },
    { url: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8', name: 'Brain Scan' },
    { url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557', name: 'Ultrasound' },
  ],
  abstract: [
    { url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab', name: 'Colorful Abstract' },
    { url: 'https://images.unsplash.com/photo-1507908708918-778587c9e563', name: 'Fluid Shapes' },
    { url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809', name: 'Gradient' },
  ],
  urban: [
    { url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785', name: 'City Night' },
    { url: 'https://images.unsplash.com/photo-1496588152823-86ff7695e68f', name: 'Urban Street' },
    { url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df', name: 'Skyscrapers' },
  ],
  default: [
    { url: 'https://images.unsplash.com/photo-1622737133809-d95047b9e673', name: 'Default Landscape' },
    { url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956', name: 'Default Portrait' },
    { url: 'https://images.unsplash.com/photo-1557800636-894a64c1696f', name: 'Default Nature' },
  ]
};

export function ImageNode({ id, data }: ImageNodeProps) {
  const { updateNodeData, setNodes } = useReactFlow();
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('preset');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [prevImageUrl, setPrevImageUrl] = useState(data.imageUrl);

  const handleDelete = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  const handleImageSelect = useCallback((imageUrl: string, title?: string) => {
    setImageLoading(true);
    // Save the previous URL to keep showing until new image loads
    setPrevImageUrl(data.imageUrl);
    // Create a new object reference to ensure React detects the change
    updateNodeData(id, { ...data, imageUrl, title: title || data.title });
    setImageDialogOpen(false);
  }, [id, data, updateNodeData]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setImageLoading(true);
      setPrevImageUrl(data.imageUrl);

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          updateNodeData(id, { ...data, imageUrl: result, title: file.name || data.title });
          setImageDialogOpen(false);
          toast.success('Image uploaded successfully');
        }
      };
      reader.onerror = () => {
        toast.error('Error reading file');
        setImageLoading(false);
      };
      reader.readAsDataURL(file);
    }
  }, [id, data, updateNodeData]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);


  // Effect to handle image loading state
  useEffect(() => {
    // Check if the image URL has changed
    if (data.imageUrl !== prevImageUrl) {
      setImageLoading(true);
    }
  }, [data.imageUrl, prevImageUrl]);

  return (
    <BaseNode className="w-72 shadow-lg relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(94, 234, 212, 0.08) 4px, transparent 0)', backgroundSize: '20px 20px' }}>


      <NodeHeader className="">
        <NodeHeaderTitle className="font-bold text-teal-700 ">
          <FiImage className="inline-block mr-2 text-teal-500" />
          {data.title || 'Source Image'}
        </NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderMenuAction label="Image options">
            <DropdownMenuItem onSelect={() => setImageDialogOpen(true)} className="cursor-pointer">
              <ImagePlus className="mr-2 h-4 w-4" /> Change Image
            </DropdownMenuItem>
            {!data.isFixed && (
              <DropdownMenuItem onSelect={handleDelete} className="text-destructive cursor-pointer">
                Delete
              </DropdownMenuItem>
            )}
          </NodeHeaderMenuAction>
        </NodeHeaderActions>
      </NodeHeader>

      <div className="p-3 space-y-3">
        <div
          className="relative group cursor-pointer border-2 border-gray-200 dark:border-teal-800 rounded-lg overflow-hidden shadow-sm"
          onClick={() => setImageDialogOpen(true)}
        >
          {data.imageUrl ? (
            <>
              <div className="relative w-full h-40">
                {/* Show previous image until new one loads (prevents blinking) */}
                {imageLoading && prevImageUrl && (
                  <Image
                    key={`prev-${prevImageUrl}`}
                    src={prevImageUrl}
                    alt="Previous image"
                    width={256}
                    height={256}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity"
                  />
                )}
                <Image
                  key={`${data.imageUrl}-${data.title}`}
                  src={data.imageUrl}
                  alt={data.title || 'Image'}
                  width={256}
                  height={256}
                  className={`w-full h-full object-cover rounded-lg transition-all duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center transition-all duration-200 group-hover:bg-opacity-50">
                <Button
                  variant="outline"
                  size="sm"
                  className="opacity-0 bg-white group-hover:opacity-100 transition-opacity"
                >
                  <ImageIcon className="h-4 w-4 mr-1" /> Change Image
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full h-40 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/30 flex flex-col items-center justify-center rounded-lg border-dashed border-2 border-teal-300 dark:border-teal-700">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <FiUpload className="h-8 w-8 text-teal-500 mb-2" />
              </motion.div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to select an image</span>
              <span className="text-xs text-gray-500 mt-1">Input source for pipeline</span>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 -m-2 mt-2 rounded-b-lg border-t border-gray-200 dark:border-teal-800 relative pt-1 pb-3">
        <div className="absolute bottom-1 right-2 flex items-center justify-end">
          <span className="text-xs text-gray-600 dark:text-gray-400 mr-1 font-medium">Output</span>
          <FiArrowRight className="text-gray-500 h-3 w-3" />
        </div>
        <LabeledHandle
          title=""
          type="source"
          position={Position.Right}
          handleClassName="border-teal-500 bg-gray-200 hover:bg-teal-400 shadow-md m-1"
        />
      </footer>

      {/* Image Selection Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Image</DialogTitle>
            <DialogDescription>Choose an image from presets or upload your own image for processing.</DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preset">Preset Images</TabsTrigger>
              <TabsTrigger value="upload">Upload Image</TabsTrigger>
            </TabsList>

            <TabsContent value="preset" className="mt-4">
              <div className="space-y-4 overflow-y-auto max-h-[50vh]">
                {Object.entries(presetImages).map(([category, images]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="text-sm font-medium capitalize">{category}</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className="cursor-pointer rounded-md overflow-hidden border hover:border-primary transition-colors"
                          onClick={() => handleImageSelect(image.url, image.name)}
                        >
                          <div className="relative aspect-square">
                            <Image
                              src={image.url}
                              alt={image.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-1 text-xs truncate text-center">{image.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upload" className="mt-4">
              <div className="flex flex-col items-center justify-center gap-4">
                <div
                  onClick={triggerFileInput}
                  className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors p-4"
                >
                  <Upload className="h-10 w-10 text-slate-400 mb-2" />
                  <p className="text-sm text-center text-slate-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </BaseNode>
  );
}
