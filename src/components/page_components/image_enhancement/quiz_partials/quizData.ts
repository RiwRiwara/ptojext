import { QuizItem, QuizSettings } from './types';

// Quiz settings in JSON format
export const quizSettings: QuizSettings = {
  showAllControls: true,        // Show all adjustment controls without tabs
  showHintImage: true,          // Show hint images when available
  enableTechnicalQuizzes: true, // Include technical quizzes
  attemptsLimit: 5,             // Maximum 5 attempts per quiz
  scoreMultiplier: 2            // Double points for correct answers
};

// Comprehensive quiz data covering all adjustment features
export const quizData: QuizItem[] = [
  {
    id: 1,
    title: "Identify Anomaly in Brain MRI",
    description: "A doctor needs to identify an anomaly in this brain MRI image. Adjust the contrast and brightness to make the anomaly visible.",
    image: "/mri.jpg",
    targetValues: { contrast: 1.8, brightness: 20 },
    tolerance: { contrast: 0.3, brightness: 10 },
    hint: "Look for unusual bright spots in the frontal lobe region."
  },
  {
    id: 2,
    title: "Detect Bone Fracture",
    description: "Adjust the image to clearly identify the hairline fracture in this X-ray.",
    image: "/xray.jpg", 
    targetValues: { contrast: 2.2, brightness: -15 },
    tolerance: { contrast: 0.4, brightness: 10 },
    hint: "Focus on the middle section of the bone where there might be a subtle line."
  },
  {
    id: 3,
    title: "Enhance Tissue Contrast in CT Scan",
    description: "Use histogram equalization to improve the visibility of different tissue types in this CT scan.",
    image: "/ct_scan.jpg",
    technical: true,
    targetValues: { histogramEqualization: true },
    tolerance: {},
    hint: "Histogram equalization can help distinguish between tissues with similar densities."
  },
  {
    id: 4,
    title: "Gamma Correction for Underexposed Radiograph",
    description: "Apply gamma correction to reveal details in this underexposed radiograph.",
    image: "/radiograph.jpg",
    technical: true,
    targetValues: { gamma: 1.8 },
    tolerance: { gamma: 0.3 },
    hint: "Increasing gamma can help reveal details in darker regions of the image."
  },
  {
    id: 5,
    title: "Remove Noise from Ultrasound Image",
    description: "Apply Gaussian smoothing to reduce speckle noise in this ultrasound image while preserving important features.",
    image: "/ultrasound.jpg",
    technical: true,
    targetValues: { kernelType: 'smoothing', kernelSize: 5 },
    tolerance: {},
    hint: "A larger kernel size will provide more smoothing but may blur important details."
  },
  {
    id: 6,
    title: "Enhance Edges in Mammogram",
    description: "Use sharpening to enhance the edges and subtle details in this mammogram image.",
    image: "/mammogram.jpg",
    technical: true,
    targetValues: { kernelType: 'sharpening' },
    tolerance: {},
    hint: "Edge enhancement can help identify subtle tissue boundaries."
  },
  {
    id: 7,
    title: "Detect Boundaries in Retinal Scan",
    description: "Use edge detection to highlight the boundaries between different structures in this retinal scan.",
    image: "/retinal_scan.jpg",
    technical: true,
    targetValues: { kernelType: 'edge-detection' },
    tolerance: {},
    hint: "Edge detection can help identify the boundaries between different structures in the retina."
  },
  {
    id: 8,
    title: "Isolate Contrast Medium in Angiogram",
    description: "Use image subtraction to isolate the contrast medium in this angiogram.",
    image: "/angiogram.jpg",
    technical: true,
    targetValues: { subtractValue: 75 },
    tolerance: { subtractValue: 15 },
    hint: "Adjust the subtraction value until only the blood vessels with contrast medium are visible."
  },
  {
    id: 9,
    title: "Combination Enhancement for Chest X-ray",
    description: "Apply a combination of contrast, brightness, and gamma adjustments to enhance this chest X-ray for better diagnosis.",
    image: "/chest_xray.jpg",
    targetValues: { contrast: 1.5, brightness: 10, gamma: 1.2 },
    tolerance: { contrast: 0.2, brightness: 5, gamma: 0.2 },
    hint: "A combination of adjustments can reveal both bone structure and soft tissue details."
  }
];
