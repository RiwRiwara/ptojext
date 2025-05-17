import { QuizItem, QuizSettings } from "./types";

// Quiz settings in JSON format
export const quizSettings: QuizSettings = {
  showAllControls: true, // Show all adjustment controls without tabs
  showHintAnswer: true, // Show hint answer when available
  enableTechnicalQuizzes: true, // Include technical quizzes
  attemptsLimit: 3, // Maximum 3 attempts per quiz
  scoreMultiplier: 2, // Double points for correct answers
};

// Comprehensive quiz data covering all adjustment features
export const quizData: QuizItem[] = [
  {
    id: 1,
    title: "Linear Search Time Complexity",
    description:
      "Analyze the worst-case time complexity of the Linear Search algorithm.",
    hint: "In the worst-case scenario, the algorithm must check every element in the array before finding the target or confirming it doesn't exist.",
    choice: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    answer: "O(n)",
    title_en: "Linear Search Time Complexity",
    description_en:
      "Analyze the worst-case time complexity of the Linear Search algorithm.",
    title_th: "เวลาในการทำงานของ Linear Search",
    description_th:
      "วิเคราะห์เวลาในการทำงานที่แย่ที่สุดของอัลกอริทึม Linear Search",
  },
  {
    id: 2,
    title: "Binary Search Space Complexity",
    description:
      "Determine the space complexity of the Binary Search algorithm.",
    hint: "Binary Search only requires a few extra variables if implemented iteratively.",
    choice: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    answer: "O(1)",
    title_en: "Binary Search Space Complexity",
    description_en:
      "Determine the space complexity of the Binary Search algorithm.",
    title_th: "ความซับซ้อนของพื้นที่ของ Binary Search",
    description_th: "พิจารณาความซับซ้อนของพื้นที่ของอัลกอริทึม Binary Search",
  },
  {
    id: 3,
    title: "Jump Search Best Case Time Complexity",
    description:
      "Identify the best-case time complexity of the Jump Search algorithm.",
    hint: "Best case occurs when the element is found on the first jump.",
    choice: ["O(1)", "O(log n)", "O(√n)", "O(n)"],
    answer: "O(1)",
    title_en: "Jump Search Best Case Time Complexity",
    description_en:
      "Identify the best-case time complexity of the Jump Search algorithm.",
    title_th: "เวลาในการทำงานที่ดีที่สุดของ Jump Search",
    description_th:
      "ระบุเวลาในการทำงานที่ดีที่สุดของอัลกอริทึม Jump Search",
  },
  {
    id: 4,
    title: "Interpolation Search Time Complexity",
    description:
      "Evaluate the worst-case time complexity of the Interpolation Search algorithm.",
    hint: "When elements are distributed non-uniformly, performance degrades.",
    choice: ["O(log n)", "O(n)", "O(√n)", "O(log log n)"],
    answer: "O(n)",
    title_en: "Interpolation Search Time Complexity",
    description_en:
      "Evaluate the worst-case time complexity of the Interpolation Search algorithm.",
    title_th: "เวลาในการทำงานของ Interpolation Search",
    description_th:
      "ประเมินเวลาในการทำงานที่แย่ที่สุดของอัลกอริทึม Interpolation Search",
  },
  {
    id: 5,
    title: "Linear Search Space Complexity",
    description:
      "Analyze the worst-case space complexity of the Linear Search algorithm.",
    hint: "Linear Search does not use extra space beyond a few variables.",
    choice: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    answer: "O(1)",
    title_en: "Linear Search Space Complexity",
    description_en:
      "Analyze the worst-case space complexity of the Linear Search algorithm.",
    title_th: "ความซับซ้อนของพื้นที่ของ Linear Search",
    description_th:
      "วิเคราะห์ความซับซ้อนของพื้นที่ที่แย่ที่สุดของอัลกอริทึม Linear Search",
  },
  {
    id: 6,
    title: "Binary Search Best Case Time Complexity",
    description:
      "What is the best-case time complexity of the Binary Search algorithm?",
    hint: "What if the middle element is the one you're looking for?",
    choice: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    answer: "O(1)",
    title_en: "Binary Search Best Case Time Complexity",
    description_en:
      "What is the best-case time complexity of the Binary Search algorithm?",
    title_th: "เวลาในการทำงานที่ดีที่สุดของ Binary Search",
    description_th: "เวลาในการทำงานที่ดีที่สุดของอัลกอริทึม Binary Search",
  },
  {
    id: 7,
    title: "Jump Search Time Complexity",
    description:
      "Determine the worst-case time complexity of the Jump Search algorithm.",
    hint: "It may scan √n blocks and then linearly search within the last block.",
    choice: ["O(n)", "O(√n)", "O(log n)", "O(n log n)"],
    answer: "O(√n)",
    title_en: "Jump Search Time Complexity",
    description_en:
      "Determine the worst-case time complexity of the Jump Search algorithm.",
    title_th: "เวลาในการทำงานของ Jump Search",
    description_th:
      "พิจารณาเวลาในการทำงานที่แย่ที่สุดของอัลกอริทึม Jump Search",
  },
  {
    id: 8,
    title: "Interpolation Search Space Complexity",
    description: "Analyze the space complexity of the Interpolation Search algorithm.",
    hint: "Like Binary Search, only a few variables are needed.",
    choice: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
    answer: "O(1)",
    title_en: "Interpolation Search Space Complexity",
    description_en: "Analyze the space complexity of the Interpolation Search algorithm.",
    title_th: "ความซับซ้อนของพื้นที่ของ Interpolation Search",
    description_th: "วิเคราะห์ความซับซ้อนของพื้นที่ของอัลกอริทึม Interpolation Search",
  },
  {
    id: 9,
    title: "Jump Search Worst Case Time Complexity",
    description:
      "Identify the worst-case time complexity of the Jump Search algorithm.",
    hint: "Same reasoning applies for worst-case jumps and scans.",
    choice: ["O(n)", "O(√n)", "O(log n)", "O(n log n)"],
    answer: "O(√n)",
    title_en: "Jump Search Worst Case Time Complexity",
    description_en:
      "Identify the worst-case time complexity of the Jump Search algorithm.",
    title_th: "เวลาในการทำงานที่แย่ที่สุดของ Jump Search",
    description_th: "ระบุเวลาในการทำงานที่แย่ที่สุดของอัลกอริทึม Jump Search",
  },
  {
    id: 10,
    title: "Interpolation Search Worst Case Time Complexity",
    description:
      "Determine the worst-case time complexity of the Interpolation Search algorithm.",
    hint: "Poor performance arises with unevenly distributed data.",
    choice: ["O(log n)", "O(n)", "O(√n)", "O(log log n)"],
    answer: "O(n)",
    title_en: "Interpolation Search Worst Case Time Complexity",
    description_en:
      "Determine the worst-case time complexity of the Interpolation Search algorithm.",
    title_th: "ความซับซ้อนของเวลาที่แย่ที่สุดของ Interpolation Search",
    description_th: "พิจารณาความซับซ้อนของเวลาที่แย่ที่สุดของอัลกอริทึม Interpolation Search",
  },
];
