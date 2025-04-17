import React from "react";

export interface ChallengeCardProps {
  id: string;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  completed: boolean;
  onClick: (id: string) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ id, title, topic, difficulty, completed, onClick }) => {
  return (
    <div
      className={`rounded-lg border p-4 shadow-md cursor-pointer hover:bg-gray-50 transition ${completed ? "bg-green-50" : "bg-white"}`}
      onClick={() => onClick(id)}
      aria-label={`Challenge: ${title}`}
      tabIndex={0}
      onKeyPress={e => { if (e.key === "Enter") onClick(id); }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">{title}</h3>
        <span className={`text-xs px-2 py-1 rounded ${difficulty === "Easy" ? "bg-green-200" : difficulty === "Medium" ? "bg-yellow-200" : "bg-red-200"}`}>{difficulty}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">{topic}</span>
        {completed && <span className="text-green-600 font-semibold">✓ Completed</span>}
      </div>
    </div>
  );
};

export default ChallengeCard;
