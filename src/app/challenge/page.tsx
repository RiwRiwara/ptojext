"use client";
import React, { useState } from "react";
import ChallengeCard from "@/components/challenge/ChallengeCard";
import FilterBar from "@/components/challenge/FilterBar";
import ProgressTracker from "@/components/challenge/ProgressTracker";
import Gamification from "@/components/challenge/Gamification";
import Leaderboard from "@/components/challenge/Leaderboard";
import { challenges as allChallenges, topics } from "@/utils/challengeData";
import { useRouter } from "next/navigation";
import BaseLayout from "@/components/layout/BaseLayout";

const mockLeaderboard = [
  { name: "Alice", points: 120 },
  { name: "Bob", points: 100 },
  { name: "You", points: 80 }
];

const ChallengeDashboard: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const router = useRouter();

  // Gamification mock state
  const [points] = useState(80);
  const [badges] = useState(["Sorting Novice"]);
  const [streak] = useState(3);

  const filtered = allChallenges.filter(ch =>
    (selectedTopic === "" || ch.topic === selectedTopic) &&
    (difficulty === "" || ch.difficulty === difficulty) &&
    (search === "" || ch.title.toLowerCase().includes(search.toLowerCase()))
  );

  const completedCount = allChallenges.filter(ch => ch.completed).length;

  return (
    <BaseLayout>

      <div className="max-w-3xl mx-auto p-4">
        {/* <Gamification points={points} badges={badges} streak={streak} />
        <Leaderboard entries={mockLeaderboard} />
        <ProgressTracker total={allChallenges.length} completed={completedCount} /> */}
        <FilterBar
          topics={topics}
          selectedTopic={selectedTopic}
          onTopicChange={setSelectedTopic}
          search={search}
          onSearchChange={setSearch}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              {...challenge}
              onClick={id => router.push(`/challenge/${id}`)}
            />
          ))}
          {filtered.length === 0 && <div className="text-gray-500">No challenges found.</div>}
        </div>
      </div>
    </BaseLayout>
  );
};

export default ChallengeDashboard;
