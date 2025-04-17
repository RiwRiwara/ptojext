import React from "react";

export interface CodePuzzleProps {
  question: string;
  starterCode: string;
  onSubmit: (userCode: string) => void;
  explanation?: string;
  hint?: string;
}

const CodePuzzle: React.FC<CodePuzzleProps> = ({ question, starterCode, onSubmit, explanation, hint }) => {
  const [code, setCode] = React.useState(starterCode);
  const [submitted, setSubmitted] = React.useState(false);
  const [showHint, setShowHint] = React.useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit(code);
  };

  return (
    <div className="mb-4">
      <div className="font-semibold mb-2">{question}</div>
      <textarea
        className="w-full border rounded p-2 font-mono min-h-[120px]"
        value={code}
        onChange={e => setCode(e.target.value)}
        disabled={submitted}
        aria-label="Code editor"
      />
      <button
        className="mt-2 px-4 py-2 rounded bg-blue-600 text-white"
        onClick={handleSubmit}
        disabled={submitted}
      >Submit</button>
      {explanation && submitted && <div className="mt-2 text-sm text-gray-600">{explanation}</div>}
      {hint && !showHint && (
        <button className="mt-2 text-blue-600 underline text-sm" onClick={() => setShowHint(true)}>Show Hint</button>
      )}
      {showHint && <div className="mt-1 text-blue-700 text-sm">{hint}</div>}
    </div>
  );
};

export default CodePuzzle;
