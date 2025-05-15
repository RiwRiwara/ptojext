/**
 * Image processing utilities for the image processing flow editor
 */

// Helper function to clamp values between 0-255
export const clamp = (value: number): number => {
  return Math.max(0, Math.min(255, value));
};

// Apply brightness and contrast
export const applyBrightnessContrast = (
  imageData: ImageData,
  brightness: number,
  contrast: number
): ImageData => {
  const data = imageData.data;
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(factor * (data[i] - 128) + 128 + brightness);
    data[i + 1] = clamp(factor * (data[i + 1] - 128) + 128 + brightness);
    data[i + 2] = clamp(factor * (data[i + 2] - 128) + 128 + brightness);
  }

  return imageData;
};

// Apply saturation adjustment
export const applySaturation = (
  imageData: ImageData,
  saturation: number
): ImageData => {
  const data = imageData.data;
  const factor = saturation / 100 + 1; // Convert to a multiplier

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Calculate luminance (grayscale value)
    const gray = 0.3 * r + 0.59 * g + 0.11 * b;

    // Adjust saturation
    data[i] = clamp(gray + factor * (r - gray));
    data[i + 1] = clamp(gray + factor * (g - gray));
    data[i + 2] = clamp(gray + factor * (b - gray));
  }

  return imageData;
};

// Apply blur filter
export const applyBlur = (
  imageData: ImageData,
  intensity: number
): ImageData => {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  const size = Math.max(3, Math.round(intensity / 10)); // Kernel size based on intensity
  const sigma = intensity / 50 + 1; // Sigma value for Gaussian blur

  // Create Gaussian kernel
  const kernel = createGaussianKernel(size, sigma);
  
  // Apply convolution
  applyConvolution(imageData, data, width, height, kernel);
  
  return imageData;
};

// Apply sharpen filter
export const applySharpen = (
  imageData: ImageData,
  intensity: number
): ImageData => {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  
  // Create sharpening kernel with adjustable intensity
  const center = 1 + 4 * (intensity / 50);
  const side = -(intensity / 50);
  const kernel = [
    [0, side, 0],
    [side, center, side],
    [0, side, 0]
  ];
  
  // Apply convolution
  applyConvolution(imageData, data, width, height, kernel);
  
  return imageData;
};

// Apply grayscale filter
export const applyGrayscale = (
  imageData: ImageData
): ImageData => {
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }
  
  return imageData;
};

// Apply sepia filter
export const applySepia = (
  imageData: ImageData,
  intensity: number = 100
): ImageData => {
  const data = imageData.data;
  const factor = intensity / 100;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    const newR = (r * (1 - 0.607 * factor)) + ((r * 0.769 + g * 0.686 + b * 0.534) * factor);
    const newG = (g * (1 - 0.602 * factor)) + ((r * 0.349 + g * 0.686 + b * 0.168) * factor);
    const newB = (b * (1 - 0.635 * factor)) + ((r * 0.272 + g * 0.534 + b * 0.131) * factor);
    
    data[i] = clamp(newR);
    data[i + 1] = clamp(newG);
    data[i + 2] = clamp(newB);
  }
  
  return imageData;
};

// Apply inversion filter
export const applyInvert = (
  imageData: ImageData
): ImageData => {
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
  
  return imageData;
};

// Apply rotation
export const applyRotate = (
  imageData: ImageData,
  angle: number
): ImageData => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Convert angle to radians
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  
  // Calculate new dimensions to ensure the entire image is visible
  const srcWidth = imageData.width;
  const srcHeight = imageData.height;
  
  const boundWidth = Math.ceil(Math.abs(srcWidth * cos) + Math.abs(srcHeight * sin));
  const boundHeight = Math.ceil(Math.abs(srcWidth * sin) + Math.abs(srcHeight * cos));
  
  canvas.width = boundWidth;
  canvas.height = boundHeight;
  
  // Move to the center of the canvas
  ctx.translate(boundWidth / 2, boundHeight / 2);
  ctx.rotate(radians);
  
  // Create a temporary canvas to hold the original image
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = srcWidth;
  tempCanvas.height = srcHeight;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.putImageData(imageData, 0, 0);
  
  // Draw the rotated image
  ctx.drawImage(tempCanvas, -srcWidth / 2, -srcHeight / 2);
  
  // Get the new image data
  return ctx.getImageData(0, 0, boundWidth, boundHeight);
};

// Apply crop
export const applyCrop = (
  imageData: ImageData,
  x: number,
  y: number,
  width: number,
  height: number
): ImageData => {
  // Convert percentage values to pixels
  const pixelX = Math.floor((x / 100) * imageData.width);
  const pixelY = Math.floor((y / 100) * imageData.height);
  const pixelWidth = Math.floor((width / 100) * imageData.width);
  const pixelHeight = Math.floor((height / 100) * imageData.height);
  
  // Create a canvas for the cropped image
  const canvas = document.createElement('canvas');
  canvas.width = pixelWidth;
  canvas.height = pixelHeight;
  const ctx = canvas.getContext('2d')!;
  
  // Create a temporary canvas for the original image
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = imageData.width;
  tempCanvas.height = imageData.height;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.putImageData(imageData, 0, 0);
  
  // Draw the cropped portion
  ctx.drawImage(
    tempCanvas, 
    pixelX, pixelY, pixelWidth, pixelHeight,
    0, 0, pixelWidth, pixelHeight
  );
  
  return ctx.getImageData(0, 0, pixelWidth, pixelHeight);
};

// Split channels
export const splitChannels = (
  imageData: ImageData,
  channel: 'red' | 'green' | 'blue'
): ImageData => {
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    if (channel === 'red') {
      data[i + 1] = 0; // Remove green
      data[i + 2] = 0; // Remove blue
    } else if (channel === 'green') {
      data[i] = 0;     // Remove red
      data[i + 2] = 0; // Remove blue
    } else if (channel === 'blue') {
      data[i] = 0;     // Remove red
      data[i + 1] = 0; // Remove green
    }
  }
  
  return imageData;
};

// Object detection (simplified mock version - optimized)
export const detectObjects = (
  imageData: ImageData,
  sensitivity: number
): { imageData: ImageData, detections: Array<{ x: number, y: number, width: number, height: number, label: string }> } => {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  
  // This is a simplified mock implementation
  // In a real application, you would use a proper CV library or ML model
  
  const detections: Array<{ x: number, y: number, width: number, height: number, label: string }> = [];
  
  // Limit detections based on sensitivity
  const maxDetections = Math.min(15, Math.ceil(sensitivity / 10)); // Cap at 15 objects
  
  // Use an increased step size to reduce processing
  const step = Math.max(20, Math.floor((100 - sensitivity))); // Bigger steps = fewer checks
  
  // Pre-compute some values for faster lookup
  const variationThreshold = 200 - sensitivity * 1.5;
  const detectChance = sensitivity / 300; // Reduced chance of detection
  
  // Scan the image in blocks to look for "objects" - optimized scan pattern
  for (let y = step; y < height - step * 2 && detections.length < maxDetections; y += step * 3) {
    for (let x = step; x < width - step * 2 && detections.length < maxDetections; x += step * 3) {
      // Get the color at this position
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      
      // Calculate color intensity
      const intensity = (r + g + b) / 3;
      
      // Sample fewer surrounding pixels (only if intensity is interesting)
      if (intensity < 30 || intensity > 220) continue; // Skip very dark or very bright areas
      
      // Check only horizontal and vertical neighbors for efficiency
      const idxUp = ((y - step) * width + x) * 4;
      const idxDown = ((y + step) * width + x) * 4;
      
      const avgUp = (data[idxUp] + data[idxUp + 1] + data[idxUp + 2]) / 3;
      const avgDown = (data[idxDown] + data[idxDown + 1] + data[idxDown + 2]) / 3;
      
      // Simpler variation check
      const variation = Math.abs(intensity - avgUp) + Math.abs(intensity - avgDown);
      
      // If there's enough variation, consider it an "object"
      if (variation > variationThreshold && Math.random() < detectChance) {
        // Fixed sizes for better performance
        const boxWidth = 40;
        const boxHeight = 40;
        
        // Simplified label detection
        let label;
        if (r > Math.max(g, b) + 50) {
          label = "Red object";
        } else if (g > Math.max(r, b) + 50) {
          label = "Green object";
        } else if (b > Math.max(r, g) + 50) {
          label = "Blue object";
        } else {
          label = "Object";
        }
        
        detections.push({
          x: x - boxWidth / 2,
          y: y - boxHeight / 2,
          width: boxWidth,
          height: boxHeight,
          label
        });
      }
    }
  }
  
  // Draw bounding boxes on the image - use offscreen buffer
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false })!; // Use non-alpha for speed
  
  // Use drawImage which is faster than putImageData
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d', { alpha: false })!;
  tempCtx.putImageData(imageData, 0, 0);
  ctx.drawImage(tempCanvas, 0, 0);
  
  // Batch drawing operations
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
  ctx.lineWidth = 2;
  ctx.font = '10px Arial'; // Smaller font for better performance
  ctx.fillStyle = 'red';
  
  ctx.beginPath(); // Begin a single path for all rectangles
  detections.forEach(det => {
    ctx.rect(det.x, det.y, det.width, det.height);
  });
  ctx.stroke(); // Single stroke call for all rectangles
  
  // Now add the text
  detections.forEach(det => {
    ctx.fillText(det.label, det.x, det.y - 3);
  });
  
  return { 
    imageData: ctx.getImageData(0, 0, width, height),
    detections
  };
};

// Helper function to create a Gaussian kernel
function createGaussianKernel(size: number, sigma: number): number[][] {
  const kernel: number[][] = [];
  const center = Math.floor(size / 2);
  let sum = 0;
  
  // Generate kernel values
  for (let y = 0; y < size; y++) {
    kernel[y] = [];
    for (let x = 0; x < size; x++) {
      const dx = x - center;
      const dy = y - center;
      const value = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma)) / (2 * Math.PI * sigma * sigma);
      kernel[y][x] = value;
      sum += value;
    }
  }
  
  // Normalize kernel
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      kernel[y][x] /= sum;
    }
  }
  
  return kernel;
}

// Helper function to apply a convolution (optimized)
function applyConvolution(
  imageData: ImageData,
  originalData: Uint8ClampedArray,
  width: number,
  height: number,
  kernel: number[][]
): void {
  const data = imageData.data;
  const kernelSize = kernel.length;
  const kernelRadius = Math.floor(kernelSize / 2);
  
  // Pre-compute kernel indices for better performance
  const kernelIndices: Array<[number, number, number]> = [];
  for (let ky = 0; ky < kernelSize; ky++) {
    for (let kx = 0; kx < kernelSize; kx++) {
      const kernelValue = kernel[ky][kx];
      if (kernelValue !== 0) { // Skip zero values
        kernelIndices.push([kx - kernelRadius, ky - kernelRadius, kernelValue]);
      }
    }
  }
  
  // Process the image in chunks to avoid blocking the UI
  const chunkSize = Math.ceil(height / 4); // Process in 4 horizontal chunks
  
  // Process one row at a time for better cache locality
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = (y * width + x) * 4;
      let sumR = 0, sumG = 0, sumB = 0;
      
      // Apply only non-zero kernel values (optimized loop)
      for (let i = 0; i < kernelIndices.length; i++) {
        const [offsetX, offsetY, kernelValue] = kernelIndices[i];
        
        const sourceX = Math.max(0, Math.min(width - 1, x + offsetX));
        const sourceY = Math.max(0, Math.min(height - 1, y + offsetY));
        const sourceIndex = (sourceY * width + sourceX) * 4;
        
        sumR += originalData[sourceIndex] * kernelValue;
        sumG += originalData[sourceIndex + 1] * kernelValue;
        sumB += originalData[sourceIndex + 2] * kernelValue;
      }
      
      // Inline the clamp function for better performance
      data[pixelIndex] = sumR < 0 ? 0 : sumR > 255 ? 255 : sumR;
      data[pixelIndex + 1] = sumG < 0 ? 0 : sumG > 255 ? 255 : sumG;
      data[pixelIndex + 2] = sumB < 0 ? 0 : sumB > 255 ? 255 : sumB;
      // Alpha channel remains unchanged
    }
  }
}

// Global image cache to prevent reloading the same images
const imageCache: Record<string, ImageData> = {};

// Load an image from URL and return as ImageData (optimized with caching)
export const loadImage = async (url: string): Promise<ImageData> => {
  // Check cache first
  if (imageCache[url]) {
    return imageCache[url];
  }
  
  // If image is very large (like from an unsplash URL), we'll limit its size
  const isSizeConstrained = url.includes('unsplash.com');
  
  return new Promise((resolve, reject) => {
    // Use a timeout to prevent blocking the UI
    setTimeout(() => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // Constrain large images to a reasonable size
        let targetWidth = img.width;
        let targetHeight = img.height;
        
        if (isSizeConstrained && (img.width > 1000 || img.height > 1000)) {
          const aspectRatio = img.width / img.height;
          if (img.width > img.height) {
            targetWidth = Math.min(800, img.width);
            targetHeight = targetWidth / aspectRatio;
          } else {
            targetHeight = Math.min(800, img.height);
            targetWidth = targetHeight * aspectRatio;
          }
        }
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // Use high-performance drawing context options
        const ctx = canvas.getContext('2d', {
          alpha: false,  // No alpha channel needed for images
          willReadFrequently: true // Optimize for getImageData calls
        })!;
        
        // Use better image scaling quality for small images, faster option for large ones
        if (isSizeConstrained) {
          ctx.imageSmoothingQuality = 'medium';
        } else {
          ctx.imageSmoothingQuality = 'high';
        }
        
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        
        // Cache the result
        imageCache[url] = imageData;
        
        resolve(imageData);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      
      // Set src last to ensure handlers are attached
      img.src = url;
    }, 0);
  });
};

// URL cache for previously generated data URLs
const urlCache = new Map<ImageData, string>();

// Convert ImageData to URL (optimized with caching)
export const imageDataToUrl = (imageData: ImageData): string => {
  // Check if we already have this exact ImageData converted
  if (urlCache.has(imageData)) {
    return urlCache.get(imageData)!;
  }
  
  // Create a new canvas with high-performance context options
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d', { alpha: true })!;
  
  // Put the image data
  ctx.putImageData(imageData, 0, 0);
  
  // Use jpeg for better performance when possible (smaller file size)
  // Only use PNG if we need transparency
  let needsTransparency = false;
  
  // Quickly check a sample of pixels for transparency
  const data = imageData.data;
  const pixelCount = data.length / 4;
  const sampleSize = Math.min(pixelCount, 1000);
  const sampleStep = Math.max(1, Math.floor(pixelCount / sampleSize));
  
  for (let i = 3; i < data.length; i += 4 * sampleStep) {
    if (data[i] !== 255) { // Alpha channel is not fully opaque
      needsTransparency = true;
      break;
    }
  }
  
  // Generate data URL with appropriate format
  const dataUrl = needsTransparency 
    ? canvas.toDataURL('image/png', 0.9) 
    : canvas.toDataURL('image/jpeg', 0.9); // Use JPEG for better performance
  
  // Cache for future reuse
  urlCache.set(imageData, dataUrl);
  
  // Limit cache size to prevent memory issues
  if (urlCache.size > 50) {
    // Remove oldest entry
    const firstKey = urlCache.keys().next().value;
    if (firstKey) urlCache.delete(firstKey);
  }
  
  return dataUrl;
};
