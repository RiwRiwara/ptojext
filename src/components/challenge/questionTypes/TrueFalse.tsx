import React from "react";

export interface TrueFalseProps {
  question: string;
  correct: boolean;
  onAnswer: (isCorrect: boolean) => void;
  explanation?: string;
  hint?: string;
}

const TrueFalse: React.FC<TrueFalseProps> = ({ question, correct, onAnswer, explanation, hint }) => {
  const [selected, setSelected] = React.useState<null | boolean>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [showHint, setShowHint] = React.useState(false);

  const handleSelect = (value: boolean) => {
    setSelected(value);
    setShowFeedback(true);
    onAnswer(value === correct);
  };

  return (
    <div className="mb-4">
      <div className="font-semibold mb-2">{question}</div>
      <div className="flex gap-4">
        <button
          className={`border rounded px-4 py-2 ${selected === true ? (correct ? "bg-green-100" : "bg-red-100") : "bg-white"}`}
          onClick={() => handleSelect(true)}
          disabled={selected !== null}
        >True</button>
        <button
          className={`border rounded px-4 py-2 ${selected === false ? (!correct ? "bg-green-100" : "bg-red-100") : "bg-white"}`}
          onClick={() => handleSelect(false)}
          disabled={selected !== null}
        >False</button>
      </div>
      {showFeedback && (
        <div className="mt-2">
          {selected === correct ? (
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

export default TrueFalse;
