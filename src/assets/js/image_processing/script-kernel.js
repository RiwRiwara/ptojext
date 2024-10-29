function applyKernel() {
    const kernelInputs = document.querySelectorAll('.kernel-input');
    const kernel = Array.from(kernelInputs).map(input => parseFloat(input.value));

    const imageData = enhancedContext.getImageData(0, 0, enhancedCanvas.width, enhancedCanvas.height);
    const data = imageData.data;
    const width = enhancedCanvas.width;
    const height = enhancedCanvas.height;

    const outputData = new Uint8ClampedArray(data.length);

    // Convolution
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let r = 0, g = 0, b = 0;

            // Apply the kernel to the 3x3 neighborhood
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const pixelIndex = ((y + ky) * width + (x + kx)) * 4;
                    const kernelValue = kernel[(ky + 1) * 3 + (kx + 1)];

                    r += data[pixelIndex] * kernelValue;       // Red
                    g += data[pixelIndex + 1] * kernelValue;   // Green
                    b += data[pixelIndex + 2] * kernelValue;   // Blue
                }
            }

            const outputIndex = (y * width + x) * 4;
            outputData[outputIndex] = Math.min(Math.max(r, 0), 255);     // Red
            outputData[outputIndex + 1] = Math.min(Math.max(g, 0), 255); // Green
            outputData[outputIndex + 2] = Math.min(Math.max(b, 0), 255); // Blue
            outputData[outputIndex + 3] = 255;  // Alpha
        }
    }

    // Set the output data to the enhanced context
    const outputImageData = new ImageData(outputData, width, height);
    enhancedContext.putImageData(outputImageData, 0, 0);
}

// Function to reset kernel values and clear the canvas
function resetKernel() {
    const kernelInputs = document.querySelectorAll('.kernel-input');
    kernelInputs.forEach((input, index) => {
        // Set all kernel inputs to 0, except the center value which should be 1
        input.value = (index === 4) ? 1 : 0;
    });

    // Redraw the original image on the enhanced canvas
    enhancedContext.clearRect(0, 0, enhancedCanvas.width, enhancedCanvas.height);
    enhancedContext.drawImage(image, 0, 0);
}

// Add event listener to kernel inputs for real-time updates
document.querySelectorAll('.kernel-input').forEach(input => {
    input.addEventListener('input', applyKernel);
});

// Add event listener for the reset button
document.getElementById('resetKernel').addEventListener('click', resetKernel);
