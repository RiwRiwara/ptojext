"use client";
import React, { useEffect, useRef, useCallback } from "react";
import { AdjustmentValues, KernelType } from "./types";

interface ImageProcessorProps {
  imageSrc: string;
  adjustmentValues: AdjustmentValues;
}

const ImageProcessor: React.FC<ImageProcessorProps> = ({
  imageSrc,
  adjustmentValues,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const processImage = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;

    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw original image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Create a copy of the original data for reference
    const originalData = new Uint8ClampedArray(data);
    
    // Apply adjustments with default values if not specified
    const effectiveAdjustments = {
      contrast: adjustmentValues.contrast ?? 1,
      brightness: adjustmentValues.brightness ?? 0,
      gamma: adjustmentValues.gamma ?? 1,
      histogramEqualization: adjustmentValues.histogramEqualization ?? false,
      kernelType: adjustmentValues.kernelType,
      kernelSize: adjustmentValues.kernelSize ?? 3,
      subtractValue: adjustmentValues.subtractValue ?? 0
    };

    // Reset the image data to original before applying adjustments
    // This prevents compounding effects when multiple adjustments are applied
    for (let i = 0; i < data.length; i++) {
      data[i] = originalData[i];
    }

    // Apply all adjustments in sequence
    applyBasicAdjustments(data, canvas.width, canvas.height, effectiveAdjustments);
    
    // 2. Histogram equalization if enabled
    if (effectiveAdjustments.histogramEqualization) {
      applyHistogramEqualization(data, canvas.width, canvas.height);
    }
    
    // 3. Kernel filters (smoothing, sharpening, edge detection)
    if (effectiveAdjustments.kernelType) {
      applyKernelFilter(data, canvas.width, canvas.height, effectiveAdjustments);
    }
    
    // 4. Subtraction
    if (effectiveAdjustments.subtractValue > 0) {
      applySubtraction(data, canvas.width, canvas.height, effectiveAdjustments);
    }

    // Put the modified image data back
    ctx.putImageData(imageData, 0, 0);
  }, [adjustmentValues]);

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      processImage();
    };
  }, [imageSrc, processImage]);

  useEffect(() => {
    if (imageRef.current) {
      processImage();
    }
  }, [adjustmentValues, processImage]);

  const applyBasicAdjustments = (data: Uint8ClampedArray, width: number, height: number, effectiveAdjustments: {
    contrast: number;
    brightness: number;
    gamma: number;
    histogramEqualization: boolean;
    kernelType?: KernelType;
    kernelSize: number;
    subtractValue: number;
  }) => {
    const { contrast, brightness, gamma } = effectiveAdjustments;

    for (let i = 0; i < data.length; i += 4) {
      // Apply contrast and brightness with improved algorithm to prevent darkening
      // For contrast: Apply contrast around middle gray (128)
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      
      // Apply contrast
      r = (r - 128) * contrast + 128;
      g = (g - 128) * contrast + 128;
      b = (b - 128) * contrast + 128;
      
      // Apply brightness (add after contrast)
      r += brightness;
      g += brightness;
      b += brightness;
      
      // Apply gamma correction if not 1
      if (gamma !== 1) {
        r = r <= 0 ? 0 : 255 * Math.pow(r / 255, 1 / gamma);
        g = g <= 0 ? 0 : 255 * Math.pow(g / 255, 1 / gamma);
        b = b <= 0 ? 0 : 255 * Math.pow(b / 255, 1 / gamma);
      }
      
      // Clamp values between 0-255
      data[i] = clamp(r);
      data[i + 1] = clamp(g);
      data[i + 2] = clamp(b);
      // Alpha channel remains unchanged
    }
  };

  const applyHistogramEqualization = (data: Uint8ClampedArray, width: number, height: number) => {
    // Calculate histogram
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < data.length; i += 4) {
      // Convert to grayscale for histogram
      const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      histogram[gray]++;
    }

    // Calculate cumulative distribution function (CDF)
    const cdf = new Array(256).fill(0);
    cdf[0] = histogram[0];
    for (let i = 1; i < 256; i++) {
      cdf[i] = cdf[i - 1] + histogram[i];
    }

    // Find first non-zero value for better contrast
    let cdfMin = 0;
    for (let i = 0; i < 256; i++) {
      if (cdf[i] > 0) {
        cdfMin = cdf[i];
        break;
      }
    }

    // Normalize CDF with improved algorithm
    const totalPixels = width * height;
    const lookupTable = new Array(256).fill(0);
    for (let i = 0; i < 256; i++) {
      // Use improved formula to avoid dark images
      lookupTable[i] = Math.round(((cdf[i] - cdfMin) / (totalPixels - cdfMin)) * 255);
    }

    // Apply equalization
    for (let i = 0; i < data.length; i += 4) {
      data[i] = lookupTable[data[i]];
      data[i + 1] = lookupTable[data[i + 1]];
      data[i + 2] = lookupTable[data[i + 2]];
    }
  };

  const applyKernelFilter = (data: Uint8ClampedArray, width: number, height: number, effectiveAdjustments: {
    kernelType?: KernelType;
    kernelSize: number;
  }) => {
    const { kernelType, kernelSize } = effectiveAdjustments;
    const size = kernelSize;
    let kernel: number[][];

    // Define kernels
    if (kernelType === "smoothing") {
      // Gaussian smoothing
      if (size === 3) {
        kernel = [
          [1/16, 2/16, 1/16],
          [2/16, 4/16, 2/16],
          [1/16, 2/16, 1/16]
        ];
      } else { // 5x5
        kernel = [
          [1/256, 4/256, 6/256, 4/256, 1/256],
          [4/256, 16/256, 24/256, 16/256, 4/256],
          [6/256, 24/256, 36/256, 24/256, 6/256],
          [4/256, 16/256, 24/256, 16/256, 4/256],
          [1/256, 4/256, 6/256, 4/256, 1/256]
        ];
      }
    } else if (kernelType === "sharpening") {
      // Sharpening with improved kernel to prevent darkening
      kernel = [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
      ];
    } else { // edge-detection
      // Edge detection (Sobel) with improved visibility
      kernel = [
        [-1, -1, -1],
        [-1, 9, -1], // Increased center weight for better visibility
        [-1, -1, -1]
      ];
    }

    // Create a copy of the image data
    const tempData = new Uint8ClampedArray(data.length);
    for (let i = 0; i < data.length; i++) {
      tempData[i] = data[i];
    }

    const kernelRadius = Math.floor(kernel.length / 2);

    // Apply convolution with improved edge handling
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;
        let sumR = 0, sumG = 0, sumB = 0;

        // Apply kernel with proper edge handling
        for (let ky = -kernelRadius; ky <= kernelRadius; ky++) {
          for (let kx = -kernelRadius; kx <= kernelRadius; kx++) {
            const kernelValue = kernel[ky + kernelRadius][kx + kernelRadius];
            
            // Use clamping for edge pixels instead of skipping them
            const sourceX = Math.max(0, Math.min(width - 1, x + kx));
            const sourceY = Math.max(0, Math.min(height - 1, y + ky));
            const idx = (sourceY * width + sourceX) * 4;
            
            sumR += tempData[idx] * kernelValue;
            sumG += tempData[idx + 1] * kernelValue;
            sumB += tempData[idx + 2] * kernelValue;
          }
        }

        // Apply brightness boost for edge detection and sharpening to prevent darkening
        if (kernelType === "edge-detection" || kernelType === "sharpening") {
          sumR += 10; // Small brightness boost
          sumG += 10;
          sumB += 10;
        }

        data[pixelIndex] = clamp(sumR);
        data[pixelIndex + 1] = clamp(sumG);
        data[pixelIndex + 2] = clamp(sumB);
        // Alpha channel remains unchanged
      }
    }
  };

  const applySubtraction = (data: Uint8ClampedArray, width: number, height: number, effectiveAdjustments: {
    subtractValue: number;
  }) => {
    const { subtractValue } = effectiveAdjustments;

    // Apply subtraction with improved algorithm to maintain image brightness
    for (let i = 0; i < data.length; i += 4) {
      // Calculate luminance before subtraction
      const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      
      // Apply subtraction with brightness compensation
      const r = data[i] - subtractValue;
      const g = data[i + 1] - subtractValue;
      const b = data[i + 2] - subtractValue;
      
      // Apply brightness compensation for very dark images
      const newLuminance = 0.299 * r + 0.587 * g + 0.114 * b;
      const compensation = Math.max(0, Math.min(50, luminance * 0.2)); // Up to 20% brightness compensation
      
      data[i] = clamp(r + (newLuminance < 30 ? compensation : 0));
      data[i + 1] = clamp(g + (newLuminance < 30 ? compensation : 0));
      data[i + 2] = clamp(b + (newLuminance < 30 ? compensation : 0));
    }
  };

  // Helper function to clamp values between 0-255
  const clamp = (value: number): number => {
    return Math.max(0, Math.min(255, value));
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-contain rounded-md"
    />
  );
};

export default ImageProcessor;
