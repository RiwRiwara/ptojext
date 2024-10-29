// Function to apply noise
function applyNoise() {
    const noiseLevel = parseInt(document.getElementById('noiseLevel').value);
    
    const imageData = enhancedContext.getImageData(0, 0, enhancedCanvas.width, enhancedCanvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        // Apply noise by modifying the RGB values randomly
        data[i] += Math.random() * noiseLevel - (noiseLevel / 2);      // Red
        data[i + 1] += Math.random() * noiseLevel - (noiseLevel / 2);  // Green
        data[i + 2] += Math.random() * noiseLevel - (noiseLevel / 2);  // Blue
    }

    // Put the noisy data back onto the canvas
    enhancedContext.putImageData(imageData, 0, 0);
}

// Function to reset noise (reset to original image)
function resetNoise() {
    // Clear the canvas and redraw the original image
    enhancedContext.clearRect(0, 0, enhancedCanvas.width, enhancedCanvas.height);
    enhancedContext.drawImage(image, 0, 0);
}

// Event listener for applying noise
document.getElementById('applyNoise').addEventListener('click', applyNoise);

// Event listener for resetting noise
document.getElementById('resetNoise').addEventListener('click', resetNoise);
