import React from "react";

export interface LeaderboardEntry {
  name: string;
  points: number;
}

export interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  return (
    <div className="mb-4">
      <h4 className="font-bold mb-2">Leaderboard</h4>
      <ol className="list-decimal pl-5">
        {entries.map((entry, idx) => (
          <li key={entry.name} className="flex justify-between">
            <span>{entry.name}</span>
            <span className="font-semibold">{entry.points} pts</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
