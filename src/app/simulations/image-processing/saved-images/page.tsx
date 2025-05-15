"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ArrowLeft, Download } from 'lucide-react';
import { getAllImages, deleteImage, StoredImage } from '@/lib/indexedDB';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function SavedImagesPage() {
  const [savedImages, setSavedImages] = useState<StoredImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved images on component mount
  useEffect(() => {
    const loadImages = async () => {
      try {
        const images = await getAllImages();
        setSavedImages(images);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load saved images:', error);
        toast.error('Failed to load saved images');
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  // Handle image deletion
  const handleDeleteImage = async (id: number) => {
    try {
      await deleteImage(id);
      setSavedImages(prevImages => prevImages.filter(img => img.id !== id));
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast.error('Failed to delete image');
    }
  };

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle image download
  const handleDownloadImage = (image: StoredImage) => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image download started');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center">
          <Link href="/simulations/image-processing" className="mr-4">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Image Processing
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Saved Images</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : savedImages.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-medium text-gray-600">No saved images yet</h2>
            <p className="mt-2 text-gray-500">
              Upload images in the Image Processing application to see them here.
            </p>
            <Link href="/simulations/image-processing">
              <Button className="mt-4">Go to Image Processing</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedImages.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden h-full flex flex-col">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium truncate" title={image.name}>
                      {image.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-grow">
                    <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                      <Image
                        src={image.url}
                        alt={image.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-2 flex flex-col space-y-2">
                    <div className="w-full text-xs text-gray-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium">{image.type.split('/')[1]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span className="font-medium">{formatFileSize(image.size)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium">{formatDate(image.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2 w-full">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDownloadImage(image)}
                      >
                        <Download className="h-4 w-4 mr-1" /> Save
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDeleteImage(image.id as number)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
