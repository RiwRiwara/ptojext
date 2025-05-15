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
    title: "Bubble Sort",
    description: "Fill in the missing parameters (???) in the Bubble Sort algorithm.",
    technical: true,
    hint: "Parameter is used to limit the number of comparisons.",
    code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, ...):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`,
    answer: "n-i-1",
    title_en: "Bubble Sort easy code",
    description_en: "Fill in the missing parameters (???) in the Bubble Sort algorithm.",
    title_th: "Bubble sort code อย่างง่าย",
    description_th: "จงเติมพารามิเตอร์ที่ขาดหายไปในอัลกอริธึม Bubble Sort."
  },
  {
    id: 2,
    title: "Selection Sort",
    description: "Fill in the missing variable (???) in the Selection sort algorithm.",
    technical: true,
    hint: "Variable is used to track the index of the minimum element.",
    code: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[...]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
    answer: "min_idx",
    title_en: "Selection Sort easy code",
    description_en: "Fill in the missing variable (???) in the Selection sort algorithm.",
    title_th: "Selection sort code อย่างง่าย",
    description_th: "จงเติมตัวแปรที่ขาดหายไปในอัลกอริธึม Selection Sort."
  },
  {
    id: 3,
    title: "Insertion Sort",
    description: "Fill in the missing variable (???) in the Insertion sort algorithm.",
    technical: true,
    hint: "Variable is used to compare the key with the sorted part of the array.",
    code: `def insertion_sort(arr):
      for i in range(1, len(arr)):
          key = arr[i]
          j = i - 1
          while j >= 0 and arr[...] > key:
              arr[j + 1] = arr[j]
              j -= 1
          arr[j + 1] = key
      return arr`,
    answer: "j",
    title_en: "Insertion Sort easy code",
    description_en: "Fill in the missing variable (???) in the Insertion sort algorithm.",
    title_th: "Insertion sort code อย่างง่าย",
    description_th: "จงเติมตัวแปรที่ขาดหายไปในอัลกอริธึม Insertion Sort.",
  },
  {
    id: 4,
    title: "Merge Sort",
    description: "Fill in the missing variable (???) in the Merge Sort algorithm.",
    technical: true,
    hint: "Function is used to merge two sorted arrays.",
    code: `def merge_sort(arr):
      if len(arr) > 1:
          mid = len(arr) // 2
          L = arr[:mid]
          R = arr[mid:]
          merge_sort(L)
          merge_sort(R)

          i = j = k = 0
          while i < len(L) and j < len(R):
              if L[i] <= R[j]:
                  arr[k] = L[i]
                  i += 1
              else:
                  arr[k] = R[j]
                  j += 1
              ... += 1

          while i < len(L):
              arr[k] = L[i]
              i += 1
              k += 1

          while j < len(R):
              arr[k] = R[j]
              j += 1
              k += 1
      return arr`,
    answer: "k",
    title_en: "Merge Sort easy code",
    description_en: "Fill in the missing variable (???) in the Merge Sort algorithm.",
    title_th: "Merge sort code อย่างง่าย",
    description_th: "จงเติมตัวแปรที่ขาดหายไปในอัลกอริธึม Merge Sort."
  },
  {
    id: 5,
    title: "Quick Sort",
    description: "Fill in the missing function (???) in the Quick Sort algorithm.",
    technical: true,
    hint: "Function is used to partition the array.",
    code: `def quick_sort(arr):
      if len(arr) <= 1:
          return arr
      else:
          pivot = ...
          less = [x for x in arr[1:] if x <= pivot]
          greater = [x for x in arr[1:] if x > pivot]
          return quick_sort(less) + [pivot] + quick_sort(greater)`,
    answer: "arr[0]",
    title_en: "Quick Sort easy code",
    description_en: "Fill in the missing value (???) in the Quick Sort algorithm.",
    title_th: "Quick sort code อย่างง่าย",
    description_th: "จงเติมค่าที่ขาดหายไปในอัลกอริธึม Quick Sort."
  },
];