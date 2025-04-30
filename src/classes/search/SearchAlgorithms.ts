/**
 * Type definition for search algorithm steps
 */
export type SearchStepType = 
  | 'init' 
  | 'compare' 
  | 'found' 
  | 'not-found' 
  | 'update' 
  | 'interpolate'
  | 'mid'
  | 'jump-init'
  | 'compare-block'
  | 'jump'
  | 'linear-start'
  | 'pos';

/**
 * Interface for search algorithm steps
 */
export interface SearchStep {
  type: SearchStepType;
  indices?: number[];
  message: string;
  value?: number;
  leftBound?: number;
  rightBound?: number;
  lowBound?: number;
  highBound?: number;
  step?: number;
}

/**
 * SearchAlgorithms class containing implementations of various search algorithms
 */
export default class SearchAlgorithms {
  /**
   * Linear Search algorithm
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   */
  static linearSearch(array: number[], target: number): { steps: SearchStep[], result: number } {
    const steps: SearchStep[] = [];
    
    for (let i = 0; i < array.length; i++) {
      // Record the current element being checked
      steps.push({
        type: 'compare',
        indices: [i],
        message: `Comparing ${array[i]} with target ${target}`
      });
      
      if (array[i] === target) {
        // Found the target
        steps.push({
          type: 'found',
          indices: [i],
          message: `Found target ${target} at index ${i}`
        });
        return { steps, result: i };
      }
    }
    
    // Target not found
    steps.push({
      type: 'not-found',
      indices: [],
      message: `Target ${target} not found in the array`
    });
    
    return { steps, result: -1 };
  }
  
  /**
   * Binary Search algorithm (requires sorted array)
   * Time Complexity: O(log n)
   * Space Complexity: O(1)
   */
  static binarySearch(array: number[], target: number): { steps: SearchStep[], result: number } {
    const steps: SearchStep[] = [];
    
    let left = 0;
    let right = array.length - 1;
    
    steps.push({
      type: 'init',
      indices: [left, right],
      message: `Initializing binary search with left=${left}, right=${right}`
    });
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push({
        type: 'mid',
        indices: [mid],
        leftBound: left,
        rightBound: right,
        message: `Calculating mid point: ${mid}`
      });
      
      steps.push({
        type: 'compare',
        indices: [mid],
        message: `Comparing ${array[mid]} with target ${target}`
      });
      
      if (array[mid] === target) {
        // Found the target
        steps.push({
          type: 'found',
          indices: [mid],
          message: `Found target ${target} at index ${mid}`
        });
        return { steps, result: mid };
      } else if (array[mid] < target) {
        // Target is in the right half
        left = mid + 1;
        steps.push({
          type: 'update',
          leftBound: left,
          rightBound: right,
          message: `Target is greater, moving left bound to ${left}`
        });
      } else {
        // Target is in the left half
        right = mid - 1;
        steps.push({
          type: 'update',
          leftBound: left,
          rightBound: right,
          message: `Target is smaller, moving right bound to ${right}`
        });
      }
    }
    
    // Target not found
    steps.push({
      type: 'not-found',
      indices: [],
      message: `Target ${target} not found in the array`
    });
    
    return { steps, result: -1 };
  }
  
  /**
   * Jump Search algorithm (requires sorted array)
   * Time Complexity: O(√n)
   * Space Complexity: O(1)
   */
  static jumpSearch(array: number[], target: number): { steps: SearchStep[], result: number } {
    const steps: SearchStep[] = [];
    const n = array.length;
    
    // Finding block size to be jumped
    const step = Math.floor(Math.sqrt(n));
    
    steps.push({
      type: 'init',
      step: step,
      message: `Initializing jump search with step size=${step}`
    });
    
    // Finding the block where element is present (if it is present)
    let prev = 0;
    let current = step;
    
    steps.push({
      type: 'jump-init',
      indices: [prev, Math.min(current, n) - 1],
      message: `Starting with block from index ${prev} to ${Math.min(current, n) - 1}`
    });
    
    // Finding the block where element may be present
    while (current < n && array[Math.min(current, n) - 1] < target) {
      steps.push({
        type: 'compare-block',
        indices: [Math.min(current, n) - 1],
        message: `Comparing last element in block ${array[Math.min(current, n) - 1]} with target ${target}`
      });
      
      prev = current;
      current += step;
      
      steps.push({
        type: 'jump',
        indices: [prev, Math.min(current, n) - 1],
        message: `Jumping to next block from index ${prev} to ${Math.min(current, n) - 1}`
      });
    }
    
    // Linear search in the identified block
    steps.push({
      type: 'linear-start',
      indices: [prev],
      message: `Starting linear search from index ${prev}`
    });
    
    for (let i = prev; i < Math.min(current, n); i++) {
      steps.push({
        type: 'compare',
        indices: [i],
        message: `Comparing ${array[i]} with target ${target}`
      });
      
      if (array[i] === target) {
        // Found the target
        steps.push({
          type: 'found',
          indices: [i],
          message: `Found target ${target} at index ${i}`
        });
        return { steps, result: i };
      }
    }
    
    // Target not found
    steps.push({
      type: 'not-found',
      indices: [],
      message: `Target ${target} not found in the array`
    });
    
    return { steps, result: -1 };
  }
  
  /**
   * Interpolation Search algorithm (requires sorted array)
   * Time Complexity: O(log log n) average case, O(n) worst case
   * Space Complexity: O(1)
   */
  static interpolationSearch(array: number[], target: number): { steps: SearchStep[], result: number } {
    const steps: SearchStep[] = [];
    let low = 0;
    let high = array.length - 1;
    
    steps.push({
      type: 'init',
      indices: [low, high],
      message: `Initializing interpolation search with low=${low}, high=${high}`
    });
    
    while (low <= high && target >= array[low] && target <= array[high]) {
      // Formula for interpolation search
      // pos = low + ((target - array[low]) * (high - low)) / (array[high] - array[low])
      const pos = low + Math.floor(
        ((target - array[low]) * (high - low)) / (array[high] - array[low])
      );
      
      steps.push({
        type: 'pos',
        indices: [pos],
        lowBound: low,
        highBound: high,
        message: `Calculated position: ${pos} using interpolation formula`
      });
      
      steps.push({
        type: 'compare',
        indices: [pos],
        message: `Comparing ${array[pos]} with target ${target}`
      });
      
      if (array[pos] === target) {
        // Found the target
        steps.push({
          type: 'found',
          indices: [pos],
          message: `Found target ${target} at index ${pos}`
        });
        return { steps, result: pos };
      }
      
      if (array[pos] < target) {
        // Target is in the right subarray
        low = pos + 1;
        steps.push({
          type: 'update',
          lowBound: low,
          highBound: high,
          message: `Target is greater, moving low bound to ${low}`
        });
      } else {
        // Target is in the left subarray
        high = pos - 1;
        steps.push({
          type: 'update',
          lowBound: low,
          highBound: high,
          message: `Target is smaller, moving high bound to ${high}`
        });
      }
    }
    
    // Target not found
    steps.push({
      type: 'not-found',
      indices: [],
      message: `Target ${target} not found in the array`
    });
    
    return { steps, result: -1 };
  }
}
