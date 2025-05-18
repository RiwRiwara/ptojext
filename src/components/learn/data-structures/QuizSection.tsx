"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { FiCheckCircle, FiXCircle, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export const QuizSection = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizType, setQuizType] = useState<'linear' | 'nonlinear' | 'all'>('all');
  
  const linearQuestions: Question[] = [
    {
      id: 1,
      text: "Which of the following is NOT a linear data structure?",
      options: ["Array", "Linked List", "Stack", "Tree"],
      correctAnswer: 3,
      explanation: "Trees are non-linear data structures that have a hierarchical relationship between elements."
    },
    {
      id: 2,
      text: "What is the time complexity for accessing an element at a given index in an array?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correctAnswer: 0,
      explanation: "Arrays provide constant time O(1) access to elements because they use direct indexing."
    },
    {
      id: 3,
      text: "In a queue data structure, elements are removed from which end?",
      options: ["Front", "Back", "Middle", "Any end"],
      correctAnswer: 0,
      explanation: "Queues follow FIFO (First In First Out) principle, so elements are removed from the front."
    },
    {
      id: 4,
      text: "What principle does a stack data structure follow?",
      options: ["FIFO", "LIFO", "Round Robin", "Priority based"],
      correctAnswer: 1,
      explanation: "Stacks follow LIFO (Last In First Out) principle, where the last element added is the first one to be removed."
    },
    {
      id: 5,
      text: "Which operation is NOT typically performed on a linked list?",
      options: ["Insertion at beginning", "Deletion at end", "Random access by index", "Traversal"],
      correctAnswer: 2,
      explanation: "Linked lists do not support efficient random access by index (unlike arrays). Accessing an element requires traversing from the head."
    }
  ];
  
  const nonlinearQuestions: Question[] = [
    {
      id: 6,
      text: "Which of the following is a balanced binary search tree?",
      options: ["Linked List", "AVL Tree", "Queue", "Heap"],
      correctAnswer: 1,
      explanation: "AVL Tree is a self-balancing binary search tree where the heights of the two child subtrees differ by at most one."
    },
    {
      id: 7,
      text: "What is the time complexity for searching an element in a binary search tree in the worst case?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correctAnswer: 2,
      explanation: "In the worst case (skewed tree), searching in a binary search tree takes O(n) time."
    },
    {
      id: 8,
      text: "Which traversal visits the root node between its left and right subtrees?",
      options: ["Preorder", "Inorder", "Postorder", "Level order"],
      correctAnswer: 1,
      explanation: "Inorder traversal visits the left subtree, then the root node, and finally the right subtree."
    },
    {
      id: 9,
      text: "What data structure would you use to implement a priority queue?",
      options: ["Array", "Linked List", "Heap", "Stack"],
      correctAnswer: 2,
      explanation: "Heaps are efficient for implementing priority queues as they provide O(log n) insertion and O(1) access to the highest/lowest priority element."
    },
    {
      id: 10,
      text: "Which algorithm is used to find the shortest path in a weighted graph?",
      options: ["BFS", "DFS", "Dijkstra's Algorithm", "Preorder Traversal"],
      correctAnswer: 2,
      explanation: "Dijkstra's Algorithm is used to find the shortest path from a source node to all other nodes in a weighted graph with non-negative weights."
    }
  ];
  
  const allQuestions = [...linearQuestions, ...nonlinearQuestions];
  
  const [questions, setQuestions] = useState<Question[]>(allQuestions);
  
  useEffect(() => {
    // Update questions based on selected quiz type
    if (quizType === 'linear') {
      setQuestions(linearQuestions);
    } else if (quizType === 'nonlinear') {
      setQuestions(nonlinearQuestions);
    } else {
      setQuestions(allQuestions);
    }
    
    // Reset quiz state when changing quiz type
    resetQuiz();
  }, [quizType]);
  
  const handleOptionSelect = (optionIndex: number) => {
    if (!isAnswered) {
      setSelectedOption(optionIndex);
    }
  };
  
  const handleSubmitAnswer = () => {
    if (selectedOption === null) {
      toast.error('Please select an option');
      return;
    }
    
    setIsAnswered(true);
    
    if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
      toast.success('Correct answer!');
    } else {
      toast.error('Incorrect answer!');
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };
  
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Structure Test</CardTitle>
          <CardDescription>Answer questions to test your understanding of data structures</CardDescription>
        </CardHeader>
        <CardContent>
          {!quizCompleted ? (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <Button 
                  variant={quizType === 'all' ? 'default' : 'outline'} 
                  onClick={() => setQuizType('all')}
                >
                  All Questions
                </Button>
                <Button 
                  variant={quizType === 'linear' ? 'default' : 'outline'} 
                  onClick={() => setQuizType('linear')}
                >
                  Linear Structures
                </Button>
                <Button 
                  variant={quizType === 'nonlinear' ? 'default' : 'outline'} 
                  onClick={() => setQuizType('nonlinear')}
                >
                  Non-Linear Structures
                </Button>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span className="text-sm font-medium">Score: {score}/{currentQuestionIndex + (isAnswered ? 1 : 0)}</span>
              </div>
              
              <Progress value={progressPercentage} className="h-2 mb-6" />
              
              <div className="p-4 bg-muted/50 rounded-md mb-6">
                <h3 className="text-lg font-medium mb-4">{currentQuestion.text}</h3>
                
                <RadioGroup value={selectedOption?.toString()} className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className={`flex items-center space-x-2 p-3 rounded-md border ${
                      isAnswered 
                        ? index === currentQuestion.correctAnswer 
                          ? 'border-green-500 bg-green-50' 
                          : index === selectedOption 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-transparent'
                        : 'hover:bg-muted cursor-pointer'
                    }`}
                    onClick={() => handleOptionSelect(index)}
                    >
                      <RadioGroupItem 
                        value={index.toString()} 
                        id={`option-${index}`} 
                        disabled={isAnswered}
                      />
                      <Label 
                        htmlFor={`option-${index}`}
                        className={`flex-1 cursor-pointer ${
                          isAnswered && index === currentQuestion.correctAnswer ? 'font-medium' : ''
                        }`}
                      >
                        {option}
                      </Label>
                      {isAnswered && index === currentQuestion.correctAnswer && (
                        <FiCheckCircle className="text-green-500 ml-2" />
                      )}
                      {isAnswered && index === selectedOption && index !== currentQuestion.correctAnswer && (
                        <FiXCircle className="text-red-500 ml-2" />
                      )}
                    </div>
                  ))}
                </RadioGroup>
                
                {isAnswered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md"
                  >
                    <p className="text-sm font-medium">Explanation:</p>
                    <p className="text-sm">{currentQuestion.explanation}</p>
                  </motion.div>
                )}
              </div>
              
              <div className="flex justify-between">
                {!isAnswered ? (
                  <Button onClick={handleSubmitAnswer}>Submit Answer</Button>
                ) : (
                  <Button onClick={handleNextQuestion} className="flex items-center gap-2">
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                    <FiArrowRight />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <FiCheckCircle className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
                <p className="text-muted-foreground">
                  You scored {score} out of {questions.length} questions correctly.
                </p>
              </div>
              
              <div className="mb-8">
                <div className="w-full max-w-md mx-auto h-8 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary flex items-center justify-center text-xs text-white font-medium"
                    style={{ width: `${(score / questions.length) * 100}%` }}
                  >
                    {Math.round((score / questions.length) * 100)}%
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button onClick={resetQuiz} className="flex items-center gap-2">
                  <FiRefreshCw className="h-4 w-4" />
                  Restart Quiz
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
