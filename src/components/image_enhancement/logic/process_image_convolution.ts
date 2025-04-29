export async function processImageConvolution(
  canvas: HTMLCanvasElement,
  imageSrc: string,
  kernel: number[][] 
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const img = new Image();
  img.src = imageSrc;
  img.crossOrigin = "anonymous";

  // Wait for image to load
  await new Promise<void>((resolve) => {
    img.onload = () => resolve();
  });

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  // Kernel dimensions
  const kernelSize = kernel.length;
  const half = Math.floor(kernelSize / 2);

  // Output image data
  const output = new Uint8ClampedArray(data.length);

  // Process each pixel
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0;

      // Apply the convolution kernel
      for (let ky = -half; ky <= half; ky++) {
        for (let kx = -half; kx <= half; kx++) {
          const px = Math.min(width - 1, Math.max(0, x + kx));
          const py = Math.min(height - 1, Math.max(0, y + ky));
          const offset = (py * width + px) * 4;
          const weight = kernel[ky + half][kx + half];

          r += data[offset] * weight;
          g += data[offset + 1] * weight;
          b += data[offset + 2] * weight;
        }
      }

      

      // Set the output pixel data, ensuring values stay within 0-255
      const i = (y * width + x) * 4;
      output[i] = Math.min(255, Math.max(0, r));
      output[i + 1] = Math.min(255, Math.max(0, g));
      output[i + 2] = Math.min(255, Math.max(0, b));
      output[i + 3] = data[i + 3]; // Copy alpha channel
    }
  }

  // Set the new image data
  imageData.data.set(output);
  ctx.putImageData(imageData, 0, 0);
}
