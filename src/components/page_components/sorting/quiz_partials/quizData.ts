import { QuizItem, QuizSettings } from './types';

// Quiz settings in JSON format
export const quizSettings: QuizSettings = {
  showAllControls: true,        // Show all adjustment controls without tabs
  showHintAnswer: true,          // Show hint answer when available
  enableTechnicalQuizzes: true, // Include technical quizzes
  attemptsLimit: 3,             // Maximum 3 attempts per quiz
  scoreMultiplier: 2            // Double points for correct answers
};

// Comprehensive quiz data covering all adjustment features
export const quizData: QuizItem[] = [
  {
    id: 1,
    title: "Bubble Sort Time Complexity",
    description: "Analyze the worst-case time complexity of the Bubble Sort algorithm.",
    hint: "Consider the number of comparisons for each pair of elements.",
    choice: ["O(n)", "O(n^2)", "O(log n)", "O(n log n)"],
    answer: "O(n^2)",
    title_en: "Bubble Sort Time Complexity",
    description_en: "Analyze the worst-case time complexity of the Bubble Sort algorithm.",
    title_th: "เวลาในการทำงานของ Bubble Sort",
    description_th: "วิเคราะห์เวลาในการทำงานที่แย่ที่สุดของอัลกอริทึม Bubble Sort."
  },
  {
    id: 2,
    title: "Selection Sort Space Complexity",
    description: "Determine the space complexity of the Selection Sort algorithm.",
    hint: "Focus on the amount of additional space used during the sorting process.",
    choice: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    answer: "O(1)",
    title_en: "Selection Sort Space Complexity",
    description_en: "Determine the space complexity of the Selection Sort algorithm.",
    title_th: "ความซับซ้อนของพื้นที่ของ Selection Sort",
    description_th: "พิจารณาความซับซ้อนของพื้นที่ของอัลกอริทึม Selection Sort."
  },
  {
    id: 3,
    title: "Insertion Sort Best Case Time Complexity",
    description: "Identify the best-case time complexity of the Insertion Sort algorithm.",
    hint: "What happens when the array is already sorted?",
    choice: ["O(n)", "O(n^2)", "O(log n)", "O(n log n)"],
    answer: "O(n)",
    title_en: "Insertion Sort Best Case Time Complexity",
    description_en: "Identify the best-case time complexity of the Insertion Sort algorithm.",
    title_th: "เวลาในการทำงานที่ดีที่สุดของ Insertion Sort",
    description_th: "ระบุเวลาในการทำงานที่ดีที่สุดของอัลกอริทึม Insertion Sort."
  },
  {
    id: 4,
    title: "Merge Sort Time Complexity",
    description: "Evaluate the worst-case time complexity of the Merge Sort algorithm.",
    hint: "Consider the divide and conquer approach of Merge Sort.",
    choice: ["O(n)", "O(n^2)", "O(log n)", "O(n log n)"],
    answer: "O(n log n)",
    title_en: "Merge Sort Time Complexity",
    description_en: "Evaluate the worst-case time complexity of the Merge Sort algorithm.",
    title_th: "เวลาในการทำงานของ Merge Sort",
    description_th: "ประเมินเวลาในการทำงานที่แย่ที่สุดของอัลกอริทึม Merge Sort."
  },
  {
    id: 5,
    title: "Quick Sort Space Complexity",
    description: "Analyze the worst-case space complexity of the Quick Sort algorithm.",
    hint: "What is the impact of using recursion?",
    choice: ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
    answer: "O(n)",
    title_en: "Quick Sort Space Complexity",
    description_en: "Analyze the worst-case space complexity of the Quick Sort algorithm.",
    title_th: "ความซับซ้อนของพื้นที่ของ Quick Sort",
    description_th: "วิเคราะห์ความซับซ้อนของพื้นที่ที่แย่ที่สุดของอัลกอริทึม Quick Sort."
  },
  {
    id: 6,
    title: "Bubble Sort Best Case Time Complexity",
    description: "What is the best-case time complexity of the Bubble Sort algorithm?",
    hint: "When is the array already sorted?",
    choice: ["O(n)", "O(n^2)", "O(log n)", "O(n log n)"],
    answer: "O(n)",
    title_en: "Bubble Sort Best Case Time Complexity",
    description_en: "What is the best-case time complexity of the Bubble Sort algorithm?",
    title_th: "เวลาในการทำงานที่ดีที่สุดของ Bubble Sort",
    description_th: "เวลาในการทำงานที่ดีที่สุดของอัลกอริทึม Bubble Sort."
  },
  {
    id: 7,
    title: "Selection Sort Time Complexity",
    description: "Determine the worst-case time complexity of the Selection Sort algorithm.",
    hint: "How many comparisons are made in each pass?",
    choice: ["O(n)", "O(n^2)", "O(log n)", "O(n log n)"],
    answer: "O(n^2)",
    title_en: "Selection Sort Time Complexity",
    description_en: "Determine the worst-case time complexity of the Selection Sort algorithm.",
    title_th: "เวลาในการทำงานของ Selection Sort",
    description_th: "พิจารณาเวลาในการทำงานที่แย่ที่สุดของอัลกอริทึม Selection Sort."
  },
  {
    id: 8,
    title: "Merge Sort Space Complexity",
    description: "Analyze the space complexity of the Merge Sort algorithm.",
    hint: "Consider the additional array used for merging.",
    choice: ["O(n)", "O(log n)", "O(1)", "O(n^2)"],
    answer: "O(n)",
    title_en: "Merge Sort Space Complexity",
    description_en: "Analyze the space complexity of the Merge Sort algorithm.",
    title_th: "ความซับซ้อนของพื้นที่ของ Merge Sort",
    description_th: "วิเคราะห์ความซับซ้อนของพื้นที่ของอัลกอริทึม Merge Sort."
  },
  {
    id: 9,
    title: "Quick Sort Best Case Time Complexity",
    description: "Identify the best-case time complexity of the Quick Sort algorithm.",
    hint: "What happens when the pivot always divides the array evenly?",
    choice: ["O(n)", "O(n^2)", "O(log n)", "O(n log n)"],
    answer: "O(n log n)",
    title_en: "Quick Sort Best Case Time Complexity",
    description_en: "Identify the best-case time complexity of the Quick Sort algorithm.",
    title_th: "เวลาในการทำงานที่ดีที่สุดของ Quick Sort",
    description_th: "ระบุเวลาในการทำงานที่ดีที่สุดของอัลกอริทึม Quick Sort."
  },
  {
    id: 10,
    title: "Insertion Sort Space Complexity",
    description: "Determine the space complexity of the Insertion Sort algorithm.",
    hint: "Focus on the additional space used during the sorting process.",
    choice: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    answer: "O(1)",
    title_en: "Insertion Sort Space Complexity",
    description_en: "Determine the space complexity of the Insertion Sort algorithm.",
    title_th: "ความซับซ้อนของพื้นที่ของ Insertion Sort",
    description_th: "พิจารณาความซับซ้อนของพื้นที่ของอัลกอริทึม Insertion Sort."
  }
];