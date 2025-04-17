import { useEffect, useState, useRef } from 'react';

/**
 * A custom hook that observes an element and reports its size changes
 * @param {RefObject<Element>} target - The element to observe
 * @returns {ResizeObserverEntry | null} - The resize observer entry or null if not available
 */
const useResizeObserver = (target: React.RefObject<Element>) => {
  const [size, setSize] = useState<DOMRectReadOnly | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  
  useEffect(() => {
    if (!target.current) return;
    
    // Cleanup any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Create new observer
    observerRef.current = new ResizeObserver(([entry]) => {
      if (entry && entry.contentRect) {
        setSize(entry.contentRect);
      }
    });
    
    // Start observing
    observerRef.current.observe(target.current);
    
    // Cleanup on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [target]);
  
  return size;
};

export default useResizeObserver;
