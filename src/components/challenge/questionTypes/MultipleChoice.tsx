import React from "react";

export interface MultipleChoiceProps {
  question: string;
  options: string[];
  correctIndex: number;
  onAnswer: (isCorrect: boolean) => void;
  explanation?: string;
  hint?: string;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({ question, options, correctIndex, onAnswer, explanation, hint }) => {
  const [selected, setSelected] = React.useState<number | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [showHint, setShowHint] = React.useState(false);

  const handleSelect = (idx: number) => {
    setSelected(idx);
    setShowFeedback(true);
    onAnswer(idx === correctIndex);
  };

  return (
    <div className="mb-4">
      <div className="font-semibold mb-2">{question}</div>
      <ul className="space-y-2">
        {options.map((opt, idx) => (
          <li key={idx}>
            <button
              className={`border rounded w-full text-left p-2 ${selected === idx ? (idx === correctIndex ? "bg-green-100" : "bg-red-100") : "bg-white"}`}
              onClick={() => handleSelect(idx)}
              disabled={selected !== null}
              aria-label={`Option ${idx + 1}`}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>
      {showFeedback && (
        <div className="mt-2">
          {selected === correctIndex ? (
            <span className="text-green-700 font-semibold">Correct!</span>
          ) : (
            <span className="text-red-700 font-semibold">Incorrect.</span>
          )}
          {explanation && <div className="mt-1 text-sm text-gray-600">{explanation}</div>}
        </div>
      )}
      {hint && !showHint && (
        <button className="mt-2 text-blue-600 underline text-sm" onClick={() => setShowHint(true)}>Show Hint</button>
      )}
      {showHint && <div className="mt-1 text-blue-700 text-sm">{hint}</div>}
    </div>
  );
};

export default MultipleChoice;
