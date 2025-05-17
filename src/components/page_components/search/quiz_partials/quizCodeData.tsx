import { QuizCodeItem, QuizCodeSettings } from "./codeTypes";

// Quiz settings in JSON format
export const quizCodeSettings: QuizCodeSettings = {
  showHintAnswer: true,          // Show hint answer when available
  enableTechnicalQuizzes: true, // Include technical quizzes
  attemptsLimit: 3,             // Maximum 3 attempts per quiz
  scoreMultiplier: 2            // Double points for correct answers
};

// Comprehensive quiz data covering all adjustment features
export const quizCodeData: QuizCodeItem[] = [
  {
    id: 1,
    title: "Linear Search",
    description: "Fill in the missing parameters (???) in the Linear Search algorithm.",
    technical: true,
    hint: "Try to think about how step you need to find the element.",
    code: `function linearSearch(array, target) {
    for (let i = 0; i < array.length; ...) {
        if (array[i] === target) {
        return i;
        }
    }
    return -1;
    }`,
    answer: "i++",
    title_en: "Linear Search easy code",
    description_en: "Fill in the missing parameters (???) in the Linear Search algorithm.",
    title_th: "Linear search code อย่างง่าย",
    description_th: "จงเติมพารามิเตอร์ที่ขาดหายไปในอัลกอริธึม Linear Search"
  },
  {
    id: 2,
    title: "Binary Search",
    description: "Fill in the missing variable (???) in the Binary search algorithm.",
    technical: true,
    hint: "Think about the variable that neccessary to specify the index of array.",
    code: `function binarySearch(array, target) {
    let left = 0;
    let right = array.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (array[mid] === target) {
        return mid;
        } else if (array[...] < target) {
        left = mid + 1;
        } else {
        right = mid - 1;
        }
    }
    
    return -1;
    }`,
    answer: "mid",
    title_en: "Binary Search easy code",
    description_en: "Fill in the missing variable (???) in the Binary Search algorithm.",
    title_th: "Binary Search code อย่างง่าย",
    description_th: "จงเติมตัวแปรที่ขาดหายไปในอัลกอริธึม Binary Search"
  },
  {
    id: 3,
    title: "Jump Search",
    description: "Fill in the missing variable (???) in the Jump Search algorithm.",
    technical: true,
    hint: "The variable that specify previous value of array index.",
    code: `function jumpSearch(array, target) {
    const n = array.length;
    
    const step = Math.floor(Math.sqrt(n));
    
    let prev = 0;
    let current = step;
    
    while (current < n && array[...] < target) {
        prev = current;
        current += step;
    }
    
    for (let i = prev; i < Math.min(current, n); i++) {
        if (array[i] === target) {
        return i;
        }
    }
    
    return -1;
    }`,
    answer: "current-1",
    title_en: "Jump Search easy code",
    description_en: "Fill in the missing variable (???) in the Jump Search algorithm.",
    title_th: "Jump Search code อย่างง่าย",
    description_th: "จงเติมตัวแปรที่ขาดหายไปในอัลกอริธึม Jump Search",
  },
  {
    id: 4,
    title: "Interpolation Search",
    description: "Fill in the missing variable (???) in the Interpolation Search algorithm.",
    technical: true,
    hint: "For subtract the value at the lower bound from the target.",
    code: `function interpolationSearch(array, target) {
    let low = 0;
    let high = array.length - 1;
    
    while (low <= high && 
            target >= array[low] && 
            target <= array[high]) {
        
        let pos = low + Math.floor(
        ((target - ...) * (high - low)) / 
        (array[high] - array[low])
        );
        
        if (array[pos] === target) {
        return pos;
        }
        
        if (array[pos] < target) {
        low = pos + 1;
        } else {
        high = pos - 1;
        }
    }
    
    return -1;
    }`,
    answer: "array[low]",
    title_en: "Interpolation Search easy code",
    description_en: "Fill in the missing variable (???) in the Interpolation Search algorithm.",
    title_th: "Interpolation Search code อย่างง่าย",
    description_th: "จงเติมตัวแปรที่ขาดหายไปในอัลกอริธึม Interpolation Search"
  }
];