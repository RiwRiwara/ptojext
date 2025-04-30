/**
 * Utility functions for device detection and performance optimization
 */

// Extend Navigator interface to include deviceMemory
interface NavigatorExtended extends Navigator {
  deviceMemory?: number;
}

/**
 * Detects if the current device is a mobile device or has low specifications
 */
export const isMobileOrLowSpec = (): boolean => {
  if (typeof window === 'undefined') return false; // Server-side rendering check

  // Check if mobile based on user agent
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  // Check for low spec using hardware concurrency as a proxy
  const isLowSpec = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

  // Check if device has limited memory (if the API is available)
  const navigatorExtended = navigator as NavigatorExtended;
  const hasLimitedMemory =
    'deviceMemory' in navigatorExtended &&
    navigatorExtended.deviceMemory !== undefined &&
    navigatorExtended.deviceMemory <= 4;

  // Check if mobile GPU is likely to be less powerful
  const hasSlowGPU = (): boolean => {
    try {
      // Use WebGL to detect GPU capabilities
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return true; // If WebGL is not supported, consider it a slow GPU

      // Cast to WebGLRenderingContext to access proper methods
      const webGl = gl as WebGLRenderingContext;

      // Get the RENDERER string which contains GPU info
      const debugInfo = webGl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = webGl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        // List of patterns that indicate integrated/mobile GPUs
        const lowEndGPUs = [
          'intel',
          'hd graphics',
          'mali',
          'adreno',
          'apple gpu',
          'powervr',
        ];
        return lowEndGPUs.some((gpu) => renderer.toLowerCase().includes(gpu));
      }
      return false;
    } catch (e) {
      console.error('Error detecting GPU capabilities:', e);
      return false;
    }
  };

  // Execute the function to get the result
  const slowGPU = hasSlowGPU();

  return isMobile || isLowSpec || hasLimitedMemory || slowGPU;
};

/**
 * Get appropriate particle/cell count for simulations based on device capability
 */
export const getOptimalParticleCount = (): { cols: number; rows: number } => {
  const isLowPerformance = isMobileOrLowSpec();

  // Default high-performance settings
  const highPerformance = { cols: 20, rows: 20 };

  // Low-performance devices get fewer particles
  const lowPerformance = { cols: 10, rows: 10 };

  return isLowPerformance ? lowPerformance : highPerformance;
};

/**
 * Get optimal animation settings (fewer animations on low-end devices)
 */
export const getOptimalAnimationSettings = (): {
  enableParallax: boolean;
  reducedMotion: boolean;
  frameRate: number;
} => {
  const isLowPerformance = isMobileOrLowSpec();

  // Check if user has requested reduced motion in their OS settings
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return {
    enableParallax: !isLowPerformance && !prefersReducedMotion,
    reducedMotion: isLowPerformance || prefersReducedMotion,
    frameRate: isLowPerformance ? 30 : 60,
  };
};