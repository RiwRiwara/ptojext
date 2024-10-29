const originalImageSrc = '/people.jpg';
const originalCanvas = document.getElementById('originalCanvas');
const enhancedCanvas = document.getElementById('enhancedCanvas');
const brightnessSlider = document.getElementById('brightness');
const contrastSlider = document.getElementById('contrast');
const grayscaleCheckbox = document.getElementById('grayscale');

const originalContext = originalCanvas.getContext('2d');
const enhancedContext = enhancedCanvas.getContext('2d');
const image = new Image();

image.src = originalImageSrc;
image.onload = () => {
    originalCanvas.width = image.width;
    originalCanvas.height = image.height;
    enhancedCanvas.width = image.width;
    enhancedCanvas.height = image.height;
    originalContext.drawImage(image, 0, 0);
    applyEnhancements(); // Initial enhancement
};

function applyEnhancements() {
    const brightness = parseInt(brightnessSlider.value);
    const contrast = parseInt(contrastSlider.value);
    enhancedContext.drawImage(image, 0, 0);

    const imageData = enhancedContext.getImageData(0, 0, enhancedCanvas.width, enhancedCanvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        // Apply brightness
        data[i] += brightness;     // Red
        data[i + 1] += brightness; // Green
        data[i + 2] += brightness; // Blue

        // Apply contrast
        data[i] = (((data[i] - 128) * (contrast + 100) / 100) + 128);     // Red
        data[i + 1] = (((data[i + 1] - 128) * (contrast + 100) / 100) + 128); // Green
        data[i + 2] = (((data[i + 2] - 128) * (contrast + 100) / 100) + 128); // Blue
        
        // Grayscale conversion
        if (grayscaleCheckbox.checked) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;     // Red
            data[i + 1] = avg; // Green
            data[i + 2] = avg; // Blue
        }


    }

    enhancedContext.putImageData(imageData, 0, 0);
}

brightnessSlider.addEventListener('input', applyEnhancements);
contrastSlider.addEventListener('input', applyEnhancements);
grayscaleCheckbox.addEventListener('change', applyEnhancements);
