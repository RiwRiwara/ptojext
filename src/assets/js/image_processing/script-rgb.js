// Function to apply RGB adjustments in real-time
function applyRGBAdjustments() {
    const redAdjust = parseInt(document.getElementById('redRange').value);
    const greenAdjust = parseInt(document.getElementById('greenRange').value);
    const blueAdjust = parseInt(document.getElementById('blueRange').value);
    
    const imageData = enhancedContext.getImageData(0, 0, enhancedCanvas.width, enhancedCanvas.height);
    const data = imageData.data;

    // Loop through the pixels and adjust RGB values
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(Math.max(data[i] + redAdjust, 0), 255);       // Red
        data[i + 1] = Math.min(Math.max(data[i + 1] + greenAdjust, 0), 255); // Green
        data[i + 2] = Math.min(Math.max(data[i + 2] + blueAdjust, 0), 255);  // Blue
    }

    // Apply the modified image data back to the canvas
    enhancedContext.putImageData(imageData, 0, 0);
}

// Event listeners for real-time RGB adjustments
document.getElementById('redRange').addEventListener('input', applyRGBAdjustments);
document.getElementById('greenRange').addEventListener('input', applyRGBAdjustments);
document.getElementById('blueRange').addEventListener('input', applyRGBAdjustments);
