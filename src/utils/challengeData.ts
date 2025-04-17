export interface Challenge {
  id: string;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  completed: boolean;
}

export const challenges: Challenge[] = [
  {
    id: "sorting-1",
    title: "Bubble Sort Basics",
    topic: "Sorting",
    difficulty: "Easy",
    completed: false
  },
  {
    id: "search-1",
    title: "Binary Search Quiz",
    topic: "Search",
    difficulty: "Medium",
    completed: false
  },
  {
    id: "ai-1",
    title: "AI Fundamentals",
    topic: "AI Basics",
    difficulty: "Easy",
    completed: false
  }
];

export const topics = ["Sorting", "Search", "AI Basics"];
