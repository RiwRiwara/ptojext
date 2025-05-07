import { QuizItem, QuizSettings, HistogramMethod } from './types';

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
    hint: "Look for unusual bright spots in the frontal lobe region.",
    title_en: "Identify Anomaly in Brain MRI",
    description_en: "A doctor needs to identify an anomaly in this brain MRI image. Adjust the contrast and brightness to make the anomaly visible.",
    title_th: "ระบุความผิดปกติในภาพ MRI สมอง",
    description_th: "แพทย์ต้องการระบุความผิดปกติในภาพ MRI สมองนี้ ปรับค่าความเข้มและความสว่างเพื่อให้เห็นความผิดปกติได้ชัดเจน"
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
    targetValues: { histogramMethod: 'equalization' as HistogramMethod, histogramEqualization: true },
    tolerance: {},
    hint: "Histogram equalization can help distinguish between tissues with similar densities.",
    title_en: "Enhance Tissue Contrast in CT Scan",
    description_en: "Use histogram equalization to improve the visibility of different tissue types in this CT scan.",
    title_th: "เพิ่มความคมชัดของเนื้อเยื่อในภาพ CT Scan",
    description_th: "ใช้การปรับเท่าฮิสโตแกรมเพื่อปรับปรุงการมองเห็นของเนื้อเยื่อประเภทต่างๆในภาพ CT Scan นี้"
  },
  {
    id: 4,
    title: "Gamma Correction for Underexposed Radiograph",
    description: "Apply gamma correction to reveal details in this underexposed radiograph.",
    image: "/radiograph.jpg",
    technical: true,
    targetValues: { histogramMethod: 'gamma' as HistogramMethod, gammaValue: 1.8 },
    tolerance: { gammaValue: 0.3 },
    hint: "Increasing gamma can help reveal details in darker regions of the image.",
    title_en: "Gamma Correction for Underexposed Radiograph",
    description_en: "Apply gamma correction to reveal details in this underexposed radiograph.",
    title_th: "การแก้ไขแกมมาสำหรับภาพรังสีที่มีแสงน้อยเกินไป",
    description_th: "ใช้การแก้ไขแกมมาเพื่อเปิดเผยรายละเอียดในภาพรังสีที่มีแสงน้อยเกินไปนี้"
  },
  {
    id: 5,
    title: "Remove Noise from Ultrasound Image",
    description: "Apply Gaussian smoothing to reduce speckle noise in this ultrasound image while preserving important features.",
    image: "/ultrasound.jpg",
    technical: true,
    targetValues: { kernelType: 'smoothing', kernelSize: 5 },
    tolerance: { kernelSize: 2 },
    hint: "A larger kernel size will provide more smoothing but may blur important details.",
    title_en: "Remove Noise from Ultrasound Image",
    description_en: "Apply Gaussian smoothing to reduce speckle noise in this ultrasound image while preserving important features.",
    title_th: "ลบสัญญาณรบกวนจากภาพอัลตราซาวด์",
    description_th: "ใช้การปรับเรียบแบบเกาส์เซียนเพื่อลดสัญญาณรบกวนแบบจุดในภาพอัลตราซาวด์นี้ โดยรักษารายละเอียดสำคัญไว้"
  },
  {
    id: 6,
    title: "Enhance Edges in Mammogram",
    description: "Use sharpening to enhance the edges and subtle details in this mammogram image.",
    image: "/mammogram.jpg",
    technical: true,
    targetValues: { kernelType: 'sharpening', kernelIntensity: 2.5 },
    tolerance: { kernelIntensity: 0.5 },
    hint: "Edge enhancement can help identify subtle tissue boundaries. Adjust the intensity for optimal results.",
    title_en: "Enhance Edges in Mammogram",
    description_en: "Use sharpening to enhance the edges and subtle details in this mammogram image.",
    title_th: "เพิ่มความคมชัดของขอบในภาพแมมโมแกรม",
    description_th: "ใช้การเพิ่มความคมชัดเพื่อเน้นขอบและรายละเอียดในภาพแมมโมแกรมนี้"
  },
  {
    id: 7,
    title: "Detect Boundaries in Retinal Scan",
    description: "Use edge detection to highlight the boundaries between different structures in this retinal scan.",
    image: "/retinal_scan.jpg",
    technical: true,
    targetValues: { kernelType: 'edge-detection', kernelIntensity: 3.0 },
    tolerance: { kernelIntensity: 0.8 },
    hint: "Edge detection can help identify the boundaries between different structures in the retina. Try different intensity values for optimal results.",
    title_en: "Detect Boundaries in Retinal Scan",
    description_en: "Use edge detection to highlight the boundaries between different structures in this retinal scan.",
    title_th: "ตรวจจับขอบในภาพสแกนจอประสาทตา",
    description_th: "ใช้การตรวจจับขอบเพื่อเน้นขอบเขตระหว่างโครงสร้างต่างๆในภาพสแกนจอประสาทตานี้"
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
    hint: "A combination of adjustments can reveal both bone structure and soft tissue details.",
    title_en: "Combination Enhancement for Chest X-ray",
    description_en: "Apply a combination of contrast, brightness, and gamma adjustments to enhance this chest X-ray for better diagnosis.",
    title_th: "การปรับแต่งแบบผสมผสานสำหรับภาพเอกซเรย์ทรวงอก",
    description_th: "ใช้การปรับแต่งความเข้ม ความสว่าง และแกมมาร่วมกันเพื่อปรับปรุงภาพเอกซเรย์ทรวงอกนี้ให้ดีขึ้นสำหรับการวินิจฉัย"
  },
  {
    id: 10,
    title: "Log Transform for Dynamic Range Compression",
    description: "Apply log transform to compress the dynamic range of this angiography image and reveal details in dark regions.",
    image: "/angiography.jpg",
    technical: true,
    targetValues: { histogramMethod: 'log' as HistogramMethod, logTransformConstant: 12.5 },
    tolerance: { logTransformConstant: 2.5 },
    hint: "Log transformation is excellent for visualizing details in dark regions. Try adjusting the constant value to optimize the result.",
    title_en: "Log Transform for Dynamic Range Compression",
    description_en: "Apply log transform to compress the dynamic range of this angiography image and reveal details in dark regions.",
    title_th: "การแปลงล็อกสำหรับการบีบอัดช่วงพลวัต",
    description_th: "ใช้การแปลงล็อกเพื่อบีบอัดช่วงพลวัตของภาพแองจิโอกราฟีนี้และเปิดเผยรายละเอียดในบริเวณที่มืด"
  },
  {
    id: 11,
    title: "Advanced Gamma Correction for PET Scan",
    description: "Fine-tune the gamma transformation to enhance visibility of metabolic activity in this PET scan.",
    image: "/pet_scan.jpg",
    technical: true,
    targetValues: { histogramMethod: 'gamma' as HistogramMethod, gammaValue: 0.7 },
    tolerance: { gammaValue: 0.2 },
    hint: "Gamma values less than 1 lighten the image, which can help visualize subtle metabolic activity in PET scans.",
    title_en: "Advanced Gamma Correction for PET Scan",
    description_en: "Fine-tune the gamma transformation to enhance visibility of metabolic activity in this PET scan.",
    title_th: "การแก้ไขแกมมาขั้นสูงสำหรับภาพ PET Scan",
    description_th: "ปรับแต่งการแปลงแกมมาอย่างละเอียดเพื่อเพิ่มการมองเห็นของกิจกรรมเมตาบอลิซึมในภาพ PET Scan นี้"
  }
];
