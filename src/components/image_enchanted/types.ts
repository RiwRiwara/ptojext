// ========== Node data type ========
export interface grayScaleDataType {
  label?: string;
  isEnable?: boolean;
  gray_scale?: number;
}
export interface noiseDataType {
  label?: string;
  isEnable?: boolean;
  noise_level?: number;
  noise_type?: string;
}

export interface sharpeningDataType {
  label?: string;
  isEnable?: boolean;
  sharpening_amount?: number; // Controls the intensity of sharpening
  radius?: number; // Determines the area around edges to sharpen
  threshold?: number; // Sets the threshold for edge detection
}

export interface blurringDataType {
  label?: string;
  isEnable?: boolean;
  blur_radius?: number; // Controls the intensity of blurring
  blur_type?: string; // E.g., "Gaussian", "Box", "Motion"
}

export interface noiseReductionDataType {
  label?: string;
  isEnable?: boolean;
  reduction_level?: number; // Controls the strength of noise reduction
  method?: string; // E.g., "median", "bilateral", "Gaussian"
}

export interface edgeDetectionDataType {
  label?: string;
  isEnable?: boolean;
  method?: string; // E.g., "Sobel", "Canny", "Laplacian"
  threshold1?: number; // First threshold for edge detection (for certain methods)
  threshold2?: number; // Second threshold (optional, for advanced control)
}

// ========== Type ========
export enum NoiseType {
  Gaussian = "Gaussian",
  SaltAndPepper = "SaltAndPepper",
  Speckle = "Speckle",
}

// types.ts
export interface GrayScaleTypes {
  key: "linear" | "log" | "power-law";
  label: string;
  description: string;
  /** optional parameter controlled by slider */
  param?: {
    label: string;      // e.g. "γ"
    min: number;
    max: number;
    step: number;
    default: number;
  };
  /** formula written in plain‑text math */
  formula: string;      // e.g. "G = 255 * (I / 255)^γ"
}


  