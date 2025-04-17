import React from "react";

export interface GamificationProps {
  points: number;
  badges: string[];
  streak: number;
}

const Gamification: React.FC<GamificationProps> = ({ points, badges, streak }) => {
  return (
    <div className="mb-4 flex flex-wrap gap-4 items-center">
      <div className="bg-yellow-100 px-3 py-1 rounded font-semibold">Points: {points}</div>
      <div className="bg-blue-100 px-3 py-1 rounded font-semibold">Streak: {streak} days</div>
      <div className="flex gap-2 items-center">
        {badges.map(badge => (
          <span key={badge} className="bg-green-200 px-2 py-1 rounded text-xs font-bold">🏅 {badge}</span>
        ))}
      </div>
    </div>
  );
};

export default Gamification;
