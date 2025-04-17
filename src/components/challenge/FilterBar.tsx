import React from "react";

export interface FilterBarProps {
  topics: string[];
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  difficulty: string;
  onDifficultyChange: (difficulty: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ topics, selectedTopic, onTopicChange, search, onSearchChange, difficulty, onDifficultyChange }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-4 items-center">
      <select
        value={selectedTopic}
        onChange={e => onTopicChange(e.target.value)}
        className="border rounded p-2"
        aria-label="Filter by topic"
      >
        <option value="">All Topics</option>
        {topics.map(topic => (
          <option key={topic} value={topic}>{topic}</option>
        ))}
      </select>
      <select
        value={difficulty}
        onChange={e => onDifficultyChange(e.target.value)}
        className="border rounded p-2"
        aria-label="Filter by difficulty"
      >
        <option value="">All Difficulties</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
      <input
        type="text"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        placeholder="Search challenges..."
        className="border rounded p-2 flex-1 min-w-[200px]"
        aria-label="Search challenges"
      />
    </div>
  );
};

export default FilterBar;
