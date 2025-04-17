import React from "react";

export interface ProgressTrackerProps {
  total: number;
  completed: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ total, completed }) => {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span>Progress</span>
        <span>{completed} / {total} completed</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressTracker;
