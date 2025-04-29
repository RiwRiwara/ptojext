// logic/noise.ts

export const applyNoise = async (canvas: HTMLCanvasElement, noiseType: string, noiseLevel: number) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
  
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
  
    // Helper function to apply noise
    const addNoise = (x: number, y: number, noiseAmount: number) => {
      const i = (y * canvas.width + x) * 4;
      if (noiseType === "Gaussian") {
        const noise = Math.random() * noiseAmount * 2 - noiseAmount; // Gaussian noise
        data[i] += noise;
        data[i + 1] += noise;
        data[i + 2] += noise;
      } else if (noiseType === "SaltAndPepper") {
        if (Math.random() < noiseAmount) {
          const value = Math.random() < 0.5 ? 0 : 255;
          data[i] = value;
          data[i + 1] = value;
          data[i + 2] = value;
        }
      } else if (noiseType === "Speckle") {
        const noise = Math.random() * noiseAmount * 2 - noiseAmount; // Speckle noise
        data[i] += noise * data[i];
        data[i + 1] += noise * data[i + 1];
        data[i + 2] += noise * data[i + 2];
      }
    };
  
    // Apply the noise
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        addNoise(x, y, noiseLevel);
      }
    }
  
    // Put the modified image data back onto the canvas
    ctx.putImageData(imageData, 0, 0);
  };
  