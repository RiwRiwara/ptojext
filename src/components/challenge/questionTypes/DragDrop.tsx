import React from "react";

export interface DragDropProps {
  prompt: string;
  items: string[];
  correctOrder: string[];
  onAnswer: (isCorrect: boolean) => void;
  explanation?: string;
  hint?: string;
}

const DragDrop: React.FC<DragDropProps> = ({ prompt, items, correctOrder, onAnswer, explanation, hint }) => {
  // For simplicity, use basic up/down buttons for now
  const [order, setOrder] = React.useState(items);
  const [submitted, setSubmitted] = React.useState(false);
  const [showHint, setShowHint] = React.useState(false);

  const move = (from: number, to: number) => {
    const updated = [...order];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setOrder(updated);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onAnswer(JSON.stringify(order) === JSON.stringify(correctOrder));
  };

  return (
    <div className="mb-4">
      <div className="font-semibold mb-2">{prompt}</div>
      <ul className="mb-2">
        {order.map((item, idx) => (
          <li key={item} className="flex items-center gap-2 mb-1">
            <span className="border rounded px-2 py-1 bg-gray-50 flex-1">{item}</span>
            <button disabled={idx === 0} onClick={() => move(idx, idx - 1)} aria-label="Move up">↑</button>
            <button disabled={idx === order.length - 1} onClick={() => move(idx, idx + 1)} aria-label="Move down">↓</button>
          </li>
        ))}
      </ul>
      <button
        className="px-4 py-2 rounded bg-blue-600 text-white"
        onClick={handleSubmit}
        disabled={submitted}
      >Submit</button>
      {submitted && (
        <div className="mt-2">
          {JSON.stringify(order) === JSON.stringify(correctOrder) ? (
            <span className="text-green-700 font-semibold">Correct order!</span>
          ) : (
            <span className="text-red-700 font-semibold">Incorrect order.</span>
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

export default DragDrop;
