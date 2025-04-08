import React, { useState, useRef, useEffect } from "react";
import { FiUpload, FiRefreshCw } from "react-icons/fi";
import { BiImage } from "react-icons/bi";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import useStore from "../state/store";
import { motion } from "framer-motion";

interface ImageUploaderProps {
  onImageUpload?: (imageUrl: string) => void;
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [expanded, setExpanded] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  // Handle file selection for image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image size exceeds 5MB limit.");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file.");
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setOriginalImage(imageUrl);
      setUserImage(imageUrl);
      
      // Get image dimensions for proper sizing
      const img = new Image();
      img.onload = () => {
        // Calculate proper dimensions while maintaining aspect ratio
        const maxWidth = 400;
        const maxHeight = 300;
        let newWidth = img.width;
        let newHeight = img.height;
        
        if (img.width > maxWidth) {
          newWidth = maxWidth;
          newHeight = (img.height * maxWidth) / img.width;
        }
        
        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = (img.width * maxHeight) / img.height;
        }
        
        setImageSize({ width: newWidth, height: newHeight });
        if (onImageUpload) {
          onImageUpload(imageUrl);
        }
        setShowPreview(true);
        setIsProcessing(false);
      };
      img.src = imageUrl;
    };
    reader.onerror = () => {
      setImageError("Error reading file. Please try again.");
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  // Apply convolution to the uploaded image
  const applyConvolutionToImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !userImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsProcessing(true);
    const img = new Image();
    img.onload = () => {
      // Resize canvas to match our fixed dimensions while maintaining aspect ratio
      canvas.width = imageSize.width;
      canvas.height = imageSize.height;
      
      // Clear canvas and draw original image with proper sizing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Get image data for processing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;
      
      // Get current convolution kernel from store
      const { convolutionData } = useStore.getState();
      
      // Apply convolution (basic implementation - can be optimized)
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;
      
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
      const tempData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      
      const kernelSize = convolutionData.length;
      const kernelRadius = Math.floor(kernelSize / 2);
      
      // Process each pixel (excluding borders for simplicity)
      for (let y = kernelRadius; y < canvas.height - kernelRadius; y++) {
        for (let x = kernelRadius; x < canvas.width - kernelRadius; x++) {
          let r = 0, g = 0, b = 0;
          
          // Apply the kernel to this pixel
          for (let ky = 0; ky < kernelSize; ky++) {
            for (let kx = 0; kx < kernelSize; kx++) {
              const pixelX = x + (kx - kernelRadius);
              const pixelY = y + (ky - kernelRadius);
              const pixelIndex = (pixelY * canvas.width + pixelX) * 4;
              const weight = convolutionData[ky][kx];
              
              r += tempData.data[pixelIndex] * weight;
              g += tempData.data[pixelIndex + 1] * weight;
              b += tempData.data[pixelIndex + 2] * weight;
            }
          }
          
          // Set the pixel value
          const idx = (y * canvas.width + x) * 4;
          data[idx] = Math.min(255, Math.max(0, r));
          data[idx + 1] = Math.min(255, Math.max(0, g));
          data[idx + 2] = Math.min(255, Math.max(0, b));
          // Alpha channel remains unchanged
        }
      }
      
      // Put the processed image data back
      ctx.putImageData(imageData, 0, 0);
      setIsProcessing(false);
    };
    img.src = userImage;
  };
  
  // Toggle between original and processed image
  const toggleOriginal = () => {
    if (!canvasRef.current || !originalImage || !userImage) return;
    
    if (showOriginal) {
      setShowOriginal(false);
      applyConvolutionToImage();
    } else {
      setShowOriginal(true);
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
          ctx.drawImage(img, 0, 0, imageSize.width, imageSize.height);
        };
        img.src = originalImage;
      }
    }
  };
  
  // Toggle expanded view
  const toggleExpanded = () => {
    setExpanded(!expanded);
    if (!expanded) {
      // If expanding, recalculate size to be larger
      const img = new Image();
      img.onload = () => {
        const maxWidth = 800;
        const maxHeight = 600;
        let newWidth = img.width;
        let newHeight = img.height;
        
        if (img.width > maxWidth) {
          newWidth = maxWidth;
          newHeight = (img.height * maxWidth) / img.width;
        }
        
        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = (img.width * maxHeight) / img.height;
        }
        
        setImageSize({ width: newWidth, height: newHeight });
        // Re-apply convolution with new size
        setTimeout(() => {
          if (showOriginal) {
            const ctx = canvasRef.current?.getContext("2d");
            if (ctx && canvasRef.current) {
              const img = new Image();
              img.onload = () => {
                ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
              };
              img.src = originalImage!;
            }
          } else {
            applyConvolutionToImage();
          }
        }, 0);
      };
      img.src = originalImage || userImage!;
    } else {
      // If collapsing, go back to smaller size
      const img = new Image();
      img.onload = () => {
        const maxWidth = 400;
        const maxHeight = 300;
        let newWidth = img.width;
        let newHeight = img.height;
        
        if (img.width > maxWidth) {
          newWidth = maxWidth;
          newHeight = (img.height * maxWidth) / img.width;
        }
        
        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = (img.width * maxHeight) / img.height;
        }
        
        setImageSize({ width: newWidth, height: newHeight });
        // Re-apply convolution with new size
        setTimeout(() => {
          if (showOriginal) {
            const ctx = canvasRef.current?.getContext("2d");
            if (ctx && canvasRef.current) {
              const img = new Image();
              img.onload = () => {
                ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
              };
              img.src = originalImage!;
            }
          } else {
            applyConvolutionToImage();
          }
        }, 0);
      };
      img.src = originalImage || userImage!;
    }
  };

  // Re-apply convolution when kernel changes
  useEffect(() => {
    if (userImage && showPreview) {
      applyConvolutionToImage();
    }
  }, [useStore.getState().convolutionData]);

  return (
    <div className="w-full p-4 rounded-lg bg-gray-50 shadow-sm">
      <h2 className="text-lg font-medium mb-4 text-center">Apply Convolution to Your Image</h2>
      
      <div className="flex flex-col items-center gap-4">
        {/* Upload button and controls */}
        <div className="w-full flex justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="bg-slate-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            disabled={isProcessing}
          >
            <FiUpload size={18} />
            {isProcessing ? "Processing..." : "Upload Image"}
          </motion.button>
          {userImage && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleOriginal}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md flex items-center gap-1 transition-colors text-sm"
              disabled={isProcessing}
            >
              <FiRefreshCw size={16} className={showOriginal ? "text-green-500" : ""} />
              {showOriginal ? "Show Effect" : "Show Original"}
            </motion.button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        
        {/* Error message */}
        {imageError && (
          <div className="text-red-500 text-sm text-center">{imageError}</div>
        )}
        
        {/* Image preview */}
        {userImage && showPreview ? (
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center justify-between w-full max-w-4xl mb-2">
              <h3 className="text-md font-medium">{showOriginal ? "Original Image" : "Convolution Result"}</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleExpanded}
                className="text-gray-600 hover:text-gray-800"
                aria-label={expanded ? "Collapse" : "Expand"}
              >
                {expanded ? <MdFullscreenExit size={20} /> : <MdFullscreen size={20} />}
              </motion.button>
            </div>
            
            <motion.div 
              className={`relative border border-gray-300 rounded ${isProcessing ? 'opacity-70' : ''}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ width: imageSize.width, height: imageSize.height }}
            >
              <canvas
                ref={canvasRef}
                width={imageSize.width}
                height={imageSize.height}
                className="max-w-full h-auto"
              />
              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <FiRefreshCw size={30} className="text-white" />
                  </motion.div>
                </div>
              )}
            </motion.div>
            
            <p className="text-sm text-gray-600 mt-2 text-center max-w-lg">
              {showOriginal ? 
                "Showing original image. Click 'Show Effect' to see the convolution result." :
                "The convolution is applied using the kernel values above. Change the kernel values to see different effects."}
            </p>
          </div>
        ) : (
          <motion.div 
            className="w-full p-12 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BiImage size={64} className="text-gray-400" />
            <p className="mt-3 text-center">
              Upload an image to apply convolution<br />
              <span className="text-sm text-gray-400">Supported formats: JPG, PNG, GIF</span>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
