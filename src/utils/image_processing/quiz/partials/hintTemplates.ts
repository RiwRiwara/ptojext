import { KernelType } from './types';

// Predefined hint templates for different adjustment types
export const hintTemplates = {
    contrast: [
        'Try adjusting the contrast to make the differences between light and dark areas more pronounced.',
        'Increasing contrast can help highlight boundaries between different tissues.',
        'Decreasing contrast might help when looking for subtle variations in similar-density tissues.',
    ],
    brightness: [
        'Adjusting the brightness can reveal details in over or under-exposed areas.',
        'Increasing brightness helps when the image appears too dark to see important details.',
        'Decreasing brightness can help when bright areas are washing out important details.',
    ],
    gamma: [
        'Gamma correction can help balance the midtones without affecting the darkest and brightest parts too much.',
        'Increasing gamma can reveal details in darker regions while preserving highlights.',
        'Adjusting gamma is particularly useful for X-rays and radiographs to enhance visibility of specific structures.',
    ],
    histogramEqualization: [
        'Histogram equalization redistributes intensity values to improve overall contrast.',
        'This technique is especially useful when the image has poor contrast but contains important details.',
        'Try using histogram equalization when different tissues have similar intensity values.',
    ],
    kernelType: {
        smoothing: [
            'Smoothing filters reduce noise but may blur important details.',
            'Gaussian smoothing is effective for removing speckle noise in ultrasound images.',
            'Try different kernel sizes to find the right balance between noise reduction and detail preservation.',
        ],
        sharpening: [
            'Sharpening enhances edges and can make boundaries between structures more visible.',
            'This technique is useful for highlighting subtle details in mammograms and X-rays.',
            'Be careful not to over-sharpen as it may amplify noise.',
        ],
        'edge-detection': [
            'Edge detection highlights boundaries between different structures.',
            'This technique is useful for identifying the outline of organs or abnormalities.',
            'Edge detection works best on images with good contrast between different structures.',
        ],
    },
    subtractValue: [
        'Image subtraction can help isolate specific features by removing background intensity.',
        'This technique is particularly useful in angiograms to isolate contrast medium in blood vessels.',
        'Try different subtraction values to find the optimal visibility of the target structures.',
    ],
};

// Context templates for different medical contexts
export const contextTemplates: Record<string, string[]> = {
    anomaly: [
        'Look for areas that appear different from the surrounding tissue.',
        'Anomalies often have different density or texture compared to normal tissue.',
    ],
    fracture: [
        'Fractures typically appear as thin lines or breaks in bone structure.',
        'Look for subtle discontinuities in the bone\'s outline or density.',
    ],
    contrast: [
        'Contrast medium appears brighter than surrounding tissues in the image.',
        'Focus on enhancing the visibility of areas with contrast medium.',
    ],
    tissue: [
        'Different tissue types have different density and will appear with different intensities.',
        'Try to maximize the contrast between different tissue types.',
    ],
    edge: [
        'Edges represent boundaries between different anatomical structures.',
        'Enhancing edges can help identify the borders of organs or abnormalities.',
    ],
    noise: [
        'Reducing noise while preserving important details is a key challenge in medical imaging.',
        'Balance noise reduction with detail preservation for optimal diagnostic quality.',
    ],
};
