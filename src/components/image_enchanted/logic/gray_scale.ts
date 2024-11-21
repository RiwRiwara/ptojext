export async function applyGrayScale(
    canvas: HTMLCanvasElement,
    imageSrc: string,
    grayScaleValue: number
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
    const scaleFactor = grayScaleValue / 255;
  
    // Process each pixel for grayscale
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const grayscale = (0.299 * r + 0.587 * g + 0.114 * b) * scaleFactor;
  
      data[i] = grayscale; // Red channel
      data[i + 1] = grayscale; // Green channel
      data[i + 2] = grayscale; // Blue channel
    }
  
    ctx.putImageData(imageData, 0, 0);
  }
  