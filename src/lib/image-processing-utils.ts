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

// Apply threshold filter
export const applyThreshold = (
  imageData: ImageData,
  threshold: number,
  inverted: boolean = false
): ImageData => {
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    // Calculate pixel brightness
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    
    // Apply threshold
    let value = brightness >= threshold ? 255 : 0;
    
    // Apply inversion if needed
    if (inverted) value = 255 - value;
    
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
  }
  
  return imageData;
};

// Apply edge detection
export const applyEdgeDetection = (
  imageData: ImageData,
  algorithm: 'sobel' | 'canny' | 'prewitt' | 'roberts' = 'sobel',
  threshold: number = 50
): ImageData => {
  // First convert to grayscale for edge detection
  const grayscale = applyGrayscale(new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  ));
  
  const data = new Uint8ClampedArray(grayscale.data);
  const width = imageData.width;
  const height = imageData.height;
  const resultData = imageData.data;
  
  // Different kernels for different edge detection algorithms
  let kernelX: number[][] = [];
  let kernelY: number[][] = [];
  
  switch (algorithm) {
    case 'sobel':
      kernelX = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
      ];
      kernelY = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
      ];
      break;
      
    case 'prewitt':
      kernelX = [
        [-1, 0, 1],
        [-1, 0, 1],
        [-1, 0, 1]
      ];
      kernelY = [
        [-1, -1, -1],
        [0, 0, 0],
        [1, 1, 1]
      ];
      break;
      
    case 'roberts':
      kernelX = [
        [1, 0],
        [0, -1]
      ];
      kernelY = [
        [0, 1],
        [-1, 0]
      ];
      break;
      
    case 'canny':
      // For Canny, we'll use a simplified implementation with a Sobel operator and thresholding
      kernelX = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
      ];
      kernelY = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
      ];
      // In full implementation, Canny also does non-maximum suppression and hysteresis thresholding
      break;
  }
  
  // Apply edge detection
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pixelIndex = (y * width + x) * 4;
      
      // Apply convolution for X and Y directions
      let pixelX = 0;
      let pixelY = 0;
      
      const kernelSize = kernelX.length;
      const kernelOffset = Math.floor(kernelSize / 2);
      
      for (let ky = 0; ky < kernelSize; ky++) {
        for (let kx = 0; kx < kernelSize; kx++) {
          if (algorithm === 'roberts' && (kx >= 2 || ky >= 2)) continue;
          
          const pixelPosX = x + kx - kernelOffset;
          const pixelPosY = y + ky - kernelOffset;
          
          if (pixelPosX >= 0 && pixelPosX < width && pixelPosY >= 0 && pixelPosY < height) {
            const kernelPixelIndex = (pixelPosY * width + pixelPosX) * 4;
            const value = data[kernelPixelIndex];
            
            pixelX += value * kernelX[ky][kx];
            pixelY += value * kernelY[ky][kx];
          }
        }
      }
      
      // Calculate magnitude
      let magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
      
      // Apply threshold adjustment for Canny
      if (algorithm === 'canny') {
        magnitude = magnitude > threshold ? 255 : 0;
      } else {
        // Normalize the magnitude
        magnitude = Math.min(255, magnitude);
      }
      
      // Set pixel values
      resultData[pixelIndex] = magnitude;
      resultData[pixelIndex + 1] = magnitude;
      resultData[pixelIndex + 2] = magnitude;
    }
  }
  
  return imageData;
};

// Apply noise reduction
export const applyNoiseReduction = (
  imageData: ImageData,
  algorithm: 'median' | 'gaussian' | 'bilateral' = 'gaussian',
  intensity: number = 50
): ImageData => {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  
  switch (algorithm) {
    case 'gaussian':
      // Reuse our existing Gaussian blur with intensity control
      return applyBlur(imageData, intensity);
      
    case 'median':
      // Apply median filter with kernel size based on intensity
      const kernelSize = Math.max(3, Math.min(7, Math.floor(intensity / 20) * 2 + 3));
      const kernelOffset = Math.floor(kernelSize / 2);
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const pixelIndex = (y * width + x) * 4;
          
          const rValues: number[] = [];
          const gValues: number[] = [];
          const bValues: number[] = [];
          
          // Gather pixel values in the kernel area
          for (let ky = -kernelOffset; ky <= kernelOffset; ky++) {
            for (let kx = -kernelOffset; kx <= kernelOffset; kx++) {
              const pixelPosX = Math.min(width - 1, Math.max(0, x + kx));
              const pixelPosY = Math.min(height - 1, Math.max(0, y + ky));
              
              const neighborIndex = (pixelPosY * width + pixelPosX) * 4;
              
              rValues.push(data[neighborIndex]);
              gValues.push(data[neighborIndex + 1]);
              bValues.push(data[neighborIndex + 2]);
            }
          }
          
          // Sort values and get median
          rValues.sort((a, b) => a - b);
          gValues.sort((a, b) => a - b);
          bValues.sort((a, b) => a - b);
          
          const medianIndex = Math.floor(rValues.length / 2);
          
          // Apply median values
          imageData.data[pixelIndex] = rValues[medianIndex];
          imageData.data[pixelIndex + 1] = gValues[medianIndex];
          imageData.data[pixelIndex + 2] = bValues[medianIndex];
        }
      }
      return imageData;
      
    case 'bilateral':
      // Simplified bilateral filter (computationally expensive)
      // Combines spatial closeness and color similarity
      const spatialSigma = intensity / 10;
      const colorSigma = intensity / 5;
      const radius = Math.ceil(spatialSigma * 2);
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const pixelIndex = (y * width + x) * 4;
          
          let sumR = 0, sumG = 0, sumB = 0;
          let totalWeight = 0;
          
          // Center pixel values
          const centerR = data[pixelIndex];
          const centerG = data[pixelIndex + 1];
          const centerB = data[pixelIndex + 2];
          
          // Process pixels in the radius
          for (let ky = -radius; ky <= radius; ky++) {
            for (let kx = -radius; kx <= radius; kx++) {
              const pixelPosX = Math.min(width - 1, Math.max(0, x + kx));
              const pixelPosY = Math.min(height - 1, Math.max(0, y + ky));
              
              const neighborIndex = (pixelPosY * width + pixelPosX) * 4;
              
              // Compute spatial weight
              const spatialDistance = Math.sqrt(kx * kx + ky * ky);
              const spatialWeight = Math.exp(-(spatialDistance * spatialDistance) / (2 * spatialSigma * spatialSigma));
              
              // Compute color weight
              const neighborR = data[neighborIndex];
              const neighborG = data[neighborIndex + 1];
              const neighborB = data[neighborIndex + 2];
              
              const colorDistance = Math.sqrt(
                (centerR - neighborR) * (centerR - neighborR) +
                (centerG - neighborG) * (centerG - neighborG) +
                (centerB - neighborB) * (centerB - neighborB)
              );
              
              const colorWeight = Math.exp(-(colorDistance * colorDistance) / (2 * colorSigma * colorSigma));
              
              // Combined weight
              const weight = spatialWeight * colorWeight;
              
              // Accumulate weighted values
              sumR += neighborR * weight;
              sumG += neighborG * weight;
              sumB += neighborB * weight;
              totalWeight += weight;
            }
          }
          
          // Apply weighted average
          imageData.data[pixelIndex] = sumR / totalWeight;
          imageData.data[pixelIndex + 1] = sumG / totalWeight;
          imageData.data[pixelIndex + 2] = sumB / totalWeight;
        }
      }
      return imageData;
  }
  
  return imageData;
};

// Apply histogram equalization
export const applyHistogramEqualization = (
  imageData: ImageData,
  mode: 'global' | 'adaptive' = 'global',
  clipLimit: number = 2.0
): ImageData => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  if (mode === 'global') {
    // Global histogram equalization
    // 1. Calculate histogram and cumulative distribution
    const histogram = new Array(256).fill(0);
    const totalPixels = width * height;
    
    // Build histogram
    for (let i = 0; i < data.length; i += 4) {
      const brightness = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
      histogram[brightness]++;
    }
    
    // Calculate cumulative distribution function
    const cdf = new Array(256).fill(0);
    cdf[0] = histogram[0];
    for (let i = 1; i < 256; i++) {
      cdf[i] = cdf[i - 1] + histogram[i];
    }
    
    // Normalize CDF
    const cdfMin = cdf.find(x => x > 0) || 0;
    const lookupTable = new Array(256).fill(0);
    for (let i = 0; i < 256; i++) {
      lookupTable[i] = Math.round(((cdf[i] - cdfMin) / (totalPixels - cdfMin)) * 255);
    }
    
    // Apply lookup table to the image
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Calculate new values using the lookup table
      data[i] = lookupTable[r];
      data[i + 1] = lookupTable[g];
      data[i + 2] = lookupTable[b];
    }
  } else if (mode === 'adaptive') {
    // Adaptive histogram equalization (simplified CLAHE)
    // This is a simplified version - full CLAHE is more complex
    
    // Convert to grayscale first
    const grayData = new Uint8ClampedArray(width * height);
    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      grayData[j] = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
    }
    
    // Divide image into tiles (8x8 grid)
    const tileSize = Math.floor(Math.min(width, height) / 8);
    const numTilesX = Math.ceil(width / tileSize);
    const numTilesY = Math.ceil(height / tileSize);
    
    // Process each tile
    for (let tileY = 0; tileY < numTilesY; tileY++) {
      for (let tileX = 0; tileX < numTilesX; tileX++) {
        const startX = tileX * tileSize;
        const startY = tileY * tileSize;
        const endX = Math.min(startX + tileSize, width);
        const endY = Math.min(startY + tileSize, height);
        
        // Calculate histogram for this tile
        const histogram = new Array(256).fill(0);
        let tilePixels = 0;
        
        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const idx = y * width + x;
            histogram[grayData[idx]]++;
            tilePixels++;
          }
        }
        
        // Apply clipping if needed
        if (clipLimit > 0) {
          const clipThreshold = Math.max(1, (clipLimit * tilePixels) / 256);
          let clippedSum = 0;
          
          // Clip histogram and count clipped pixels
          for (let i = 0; i < 256; i++) {
            if (histogram[i] > clipThreshold) {
              clippedSum += histogram[i] - clipThreshold;
              histogram[i] = clipThreshold;
            }
          }
          
          // Redistribute clipped pixels
          const redistributeAmount = Math.floor(clippedSum / 256);
          for (let i = 0; i < 256; i++) {
            histogram[i] += redistributeAmount;
          }
        }
        
        // Calculate cumulative distribution function
        const cdf = new Array(256).fill(0);
        cdf[0] = histogram[0];
        for (let i = 1; i < 256; i++) {
          cdf[i] = cdf[i - 1] + histogram[i];
        }
        
        // Normalize CDF
        const cdfMin = cdf.find(x => x > 0) || 0;
        const lookupTable = new Array(256).fill(0);
        for (let i = 0; i < 256; i++) {
          lookupTable[i] = Math.round(((cdf[i] - cdfMin) / (tilePixels - cdfMin)) * 255);
        }
        
        // Apply lookup table to the tile
        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const pixelIndex = (y * width + x) * 4;
            const grayValue = grayData[y * width + x];
            const newValue = lookupTable[grayValue];
            
            // Calculate the ratio of change to apply to RGB channels
            const ratio = grayValue === 0 ? 1 : newValue / grayValue;
            
            // Apply ratio to original colors to maintain color relationships
            data[pixelIndex] = Math.min(255, Math.max(0, data[pixelIndex] * ratio));
            data[pixelIndex + 1] = Math.min(255, Math.max(0, data[pixelIndex + 1] * ratio));
            data[pixelIndex + 2] = Math.min(255, Math.max(0, data[pixelIndex + 2] * ratio));
          }
        }
      }
    }
  }
  
  return imageData;
};

// Apply color quantization (reducing number of colors)
export const applyColorQuantization = (
  imageData: ImageData,
  colors: number = 8,
  dithering: boolean = true
): ImageData => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  // Clamp colors to valid range
  colors = Math.max(2, Math.min(256, colors));
  
  // Create color palette (simplified technique - uniform quantization)
  // More advanced methods use median cut, octree, or k-means
  const levels = Math.ceil(Math.pow(colors, 1/3));
  const step = 256 / levels;
  
  // Create quantization function
  const quantize = (value: number) => {
    return Math.floor(value / step) * step;
  };
  
  // Apply quantization
  if (dithering) {
    // Floyd-Steinberg dithering
    const tempData = new Uint8ClampedArray(data.length);
    for (let i = 0; i < data.length; i++) {
      tempData[i] = data[i];
    }
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        
        // Get original pixel values
        const oldR = tempData[idx];
        const oldG = tempData[idx + 1];
        const oldB = tempData[idx + 2];
        
        // Quantize
        const newR = quantize(oldR);
        const newG = quantize(oldG);
        const newB = quantize(oldB);
        
        // Set new values
        data[idx] = newR;
        data[idx + 1] = newG;
        data[idx + 2] = newB;
        
        // Calculate quantization error
        const errR = oldR - newR;
        const errG = oldG - newG;
        const errB = oldB - newB;
        
        // Distribute error to neighboring pixels
        // Right pixel
        if (x < width - 1) {
          tempData[(y * width + x + 1) * 4] += errR * 7 / 16;
          tempData[(y * width + x + 1) * 4 + 1] += errG * 7 / 16;
          tempData[(y * width + x + 1) * 4 + 2] += errB * 7 / 16;
        }
        
        // Bottom-left pixel
        if (y < height - 1 && x > 0) {
          tempData[((y + 1) * width + x - 1) * 4] += errR * 3 / 16;
          tempData[((y + 1) * width + x - 1) * 4 + 1] += errG * 3 / 16;
          tempData[((y + 1) * width + x - 1) * 4 + 2] += errB * 3 / 16;
        }
        
        // Bottom pixel
        if (y < height - 1) {
          tempData[((y + 1) * width + x) * 4] += errR * 5 / 16;
          tempData[((y + 1) * width + x) * 4 + 1] += errG * 5 / 16;
          tempData[((y + 1) * width + x) * 4 + 2] += errB * 5 / 16;
        }
        
        // Bottom-right pixel
        if (y < height - 1 && x < width - 1) {
          tempData[((y + 1) * width + x + 1) * 4] += errR * 1 / 16;
          tempData[((y + 1) * width + x + 1) * 4 + 1] += errG * 1 / 16;
          tempData[((y + 1) * width + x + 1) * 4 + 2] += errB * 1 / 16;
        }
      }
    }
  } else {
    // Simple quantization without dithering
    for (let i = 0; i < data.length; i += 4) {
      data[i] = quantize(data[i]);
      data[i + 1] = quantize(data[i + 1]);
      data[i + 2] = quantize(data[i + 2]);
    }
  }
  
  return imageData;
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
